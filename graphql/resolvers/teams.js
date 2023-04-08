const { AuthenticationError, UserInputError } = require('apollo-server');
const Season = require('../../db/models/Season');

const Team = require('../../db/models/Team');
const TeamInstance = require('../../db/models/TeamInstance');
const authenticate = require('../../util/authenticate');
const userResolvers = require('./users');

const dedupePlayers = (playerIDs) => {
  return [...new Set(playerIDs)];
}

module.exports = {
  Query: {
    async getTeamsByUser(_, { userID }) {
      try {
        const teams = Team.find(team => team.players?.includes(userID))
         .sort({ createdAt: -1 });
        return teams ?? [];
      } catch (err) {
        throw new Error(err);
      }
    },
    async getTeam(_, { teamID }) {
      try {
        const team = Team.findById(teamID);
        if (team) {
          return team;
        } else {
          throw new Error('Team not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async getTeams(_, { seasonIDToExclude }) {
      try {
        const teams = await Team.find().populate('captain').populate('players').exec();
        if (seasonIDToExclude != null) {
          const season = await Season.findById(seasonIDToExclude).populate('teams');
          const seasonTeams = season.teams.map(seasonTeam => seasonTeam.team);
          const filtered = teams.filter(team => !seasonTeams.includes(team.id));
          return filtered.map(team => {
            team.seasonPlayers = team?.players?.filter(player => season?.players?.includes(player.id));
            return team;
          })
        }
        return teams ?? [];
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async addTeamsToSeason(_, { teamIDs, seasonID }, context) {
      const authHeader = context.req.headers.authorization;
      if (authHeader == null) {
        throw new AuthenticationError('Authentication header not provided. User not authenticated.');
      }
      const token = authHeader.split('Bearer ')[1];
      const user = await userResolvers.authenticateExistingUser(token);

      if (user == null) {
        throw new AuthenticationError('User not authenticated');
      }

      const season = await Season.findById(seasonID);
      const seasonTeams = [...season.teams];

      for (const teamID of teamIDs) {
        const team = await Team.findById(teamID);
        const players = team.players.filter(player => season.players.includes(player));
        const newTeamInstance = new TeamInstance({
          captain: null,
          createdAt: new Date().toISOString(),
          players,
          season: season.id,
          team: team.id
        });
        const teamInstance = await newTeamInstance.save();
        seasonTeams.push(teamInstance);
      };

      season.teams = seasonTeams;
      return await season.save().then(szn => szn.populate({
        path: 'teams',
        populate: [{
          path: 'captain'
        }, {
          path: 'players'
        }, {
          path: 'team'
        }]
      }).execPopulate());
    },
    async createTeam(_, { bannerPicture, captain, description, name, players, profilePicture, seasonID, sport }, context) {
      const authHeader = context.req.headers.authorization;
      if (authHeader == null) {
        throw new AuthenticationError('Authentication header not provided. User not authenticated.');
      }
      const token = authHeader.split('Bearer ')[1];
      const user = await userResolvers.authenticateExistingUser(token);

      if (user == null) {
        throw new AuthenticationError('User not authenticated');
      }

      const playersToAdd = [...players];
      if (captain != null) {
        playersToAdd.push(captain);
      }

      const newTeam = new Team({
        bannerPicture,
        description,
        name,
        players: dedupePlayers(playersToAdd),
        profilePicture,
        sport,
        createdAt: new Date().toISOString(),
        createdBy: user.id,
        admins: [captain]
      }); 

      if (seasonID != null) {
        const season = await Season.findById(seasonID).populate('teams');

        if (season == null) {
          throw new Error('season is unexpectedly null.');
        }

        const isAlreadyCaptain = season?.teams?.reduce((acc, team) => {
          return team.captain?.toString() === user.id?.toString() ? true : acc;
        }, false);

        if (isAlreadyCaptain) {
          throw new Error('Captain is already assigned to a different team. Captains can only captain one team.');
        }
      }

      const team = await newTeam.save();
      let teamInstance = null;

      if (seasonID != null) {
        const newTeamInstance = new TeamInstance({
          captain,
          players,
          season: seasonID,
          team: team.id
        });

        try {
          teamInstance = await newTeamInstance.save();
        } catch (error) {
          throw new Error(`Failed to save team instance. Team created: ${team.id ?? team._id}`)
        }

        await teamInstance.populate(['captain', 'players', 'team']).execPopulate();
        const newSeasonTeams = [...season.teams];
        newSeasonTeams.push(teamInstance);
        season.teams = newSeasonTeams;
        
        try {
          await season.save();
        } catch (error) {
          throw new Error(`failed to save teamInstance to season. TeamInstance: ${teamInstance._id}`);
        }
      }

      return {team, teamInstance};
    },
    async editTeam(_, { teamInput: {captain, name, players, seasonID, teamID} }, context) {
      const authHeader = context.req?.headers?.authorization;
      if (authHeader == null) {
        throw new AuthenticationError('Authentication header not provided. User not authenticated.');
      }
      const token = authHeader.split('Bearer ')[1];
      const user = await userResolvers.authenticateExistingUser(token);

      if (user == null) {
        throw new AuthenticationError('User not authenticated');
      }

      const team = await TeamInstance.findById(teamID);
      if (team == null) {
        throw new Error('Error editing team: team unexpectedly null. Please try again.');
      }

      const parentTeam = await Team.findById(team.team);
      if (parentTeam == null) {
        throw new Error('Error populating parent team, please try again.');
      }

      /**
       * Validate that the captain being set is not already a captain on a different team
       */
      if (seasonID != null) {
        const season = await Season.findById(seasonID).populate('teams');

        if (season == null) {
          throw new Error('Error editing team: season is unexpectedly null.');
        }

        const isAlreadyCaptain = season?.teams?.reduce((acc, team) => {
          return (team.captain?.toString() === captain && team.id !== teamID) ? true : acc;
        }, false);

        if (isAlreadyCaptain) {
          throw new Error('Captain is already assigned to a different team. Captains can only captain one team.');
        }
      }

      /**
       *  -* Validation *-
       * user can remove/add players from the team
       *   - if add ensure that the players aren't already on the team (no dupes)
       *   - if remove, ensure that the captain isn't removed
       * user can update team name
       *   - update master team name
       * user can update captain
       *   - remove from players?
       *   - add new captain as player if not already
       *   - cannot already be a captain for another team
       */
      const playersToAdd = [...players];
      if (captain != null) {
        playersToAdd.push(captain);
      }
      //deduplicate players array
      team.players = dedupePlayers(playersToAdd);
      team.captain = captain;
      parentTeam.name = name;
      await parentTeam.save();
      return await team.save().then(teamIns => teamIns.populate(['team', 'captain', 'players']).execPopulate());
    }
  },
  Subscription: {
    newTeam: {
      subscribe: (_, __, { pubSub }) => pubSub.asyncIterator('NEW_TEAM')
    }
  }
}
