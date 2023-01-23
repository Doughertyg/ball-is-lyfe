const { AuthenticationError, UserInputError } = require('apollo-server');
const Season = require('../../db/models/Season');

const Team = require('../../db/models/Team');
const TeamInstance = require('../../db/models/TeamInstance');
const authenticate = require('../../util/authenticate');
const userResolvers = require('./users');

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
    async getTeams() {
      try {
        const teams = await Team.find().populate('captain').populate('players').exec();
        return teams ?? [];
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
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

      const newTeam = new Team({
        bannerPicture,
        description,
        name,
        players,
        profilePicture,
        sport,
        createdAt: new Date().toISOString(),
        createdBy: user.id,
        admins: [captain]
      });

      const team = await newTeam.save();
      let teamInstance = null;

      if (seasonID != null) {
        const newTeamInstance = new TeamInstance({
          captain,
          players,
          season: seasonID,
          team: team.id
        });
        teamInstance = await newTeamInstance.save();
        if (teamInstance == null) {
          throw new Error('Team instance failed to save.');
        }

        await teamInstance.populate(['captain', 'players', 'team']).execPopulate();

        const season = await Season.findById(seasonID);
        if (season == null) {
          throw new Error('season is unexpectedly null.');
        }

        const newSeasonTeams = [...season.teams];
        newSeasonTeams.push(teamInstance);
        season.teams = newSeasonTeams;
        await season.save();
      }

      return {team, teamInstance};
    }
  },
  Subscription: {
    newTeam: {
      subscribe: (_, __, { pubSub }) => pubSub.asyncIterator('NEW_TEAM')
    }
  }
}
