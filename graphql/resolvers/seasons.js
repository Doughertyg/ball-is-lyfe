const { ApolloError, AuthenticationError } = require('apollo-server');

const Season = require('../../db/models/Season');
const League = require('../../db/models/League');
const Stat = require('../../db/models/Stat');
const Game = require('../../db/models/Game');
const authenticate = require('../../util/authenticate');
const userResolvers = require('./users');
const dayjs = require('dayjs');

const SeasonStatus = {
  CONFIGURATION: 'CONFIGURATION',
  CONFIRMED: 'CONFIRMED',
  INACTIVE: 'INACTIVE',
  ACTIVE: 'ACTIVE',
}

module.exports = {
  Query: {
    async getCaptains(_, {seasonID}) {
      try {
        const season = await Season.findById(seasonID).populate('captains');
        return season.captains ?? [];
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },
    async getSeasonsByUser(_, {userID}) {
      try {
        const adminLeagues = await League.find({
          admins: {$in: [userID]}
        }).exec();
        const seasons = await Season.find({ $or: [
          { players: {$in: [userID]} },
          { league: {$in: adminLeagues} }
        ]})
        .populate('league')
        .sort({createdAt: -1})
        .exec();
        return seasons;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getSeasonByID(_, { seasonID, userID }) {
      try {
        const season = await Season.findById(seasonID)
          .populate('league')
          .populate('players')
          .populate('captains')
          .populate('gameConfiguration.scoreStat')
          .populate({
            path: 'games',
            populate: [{
              path: 'awayTeam',
              populate: 'team'
            }, {
              path: 'homeTeam',
              populate: 'team'
            }]
          })
          .populate({
            path: 'teams',
            populate: [{
              path: 'captain'
            }, {
              path: 'players'
            }, {
              path: 'team'
            }]
          });
        const isLeagueAdmin = season?.league?.admins?.includes(userID) ?? false;
        const isCaptain = season?.captains?.reduce((acc, val) => {
          return val._id?.toString() === userID ? true : acc; 
        }, false);
        if (season) {
          return { season, isCaptain, isLeagueAdmin };
        } else {
          throw new Error('Season not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async getSeasonStats(_, { seasonID }) {
      try {
        const season = await Season.findById(seasonID).populate('stats');
        return season.stats;
      } catch (e) {
        throw new Error(e);
      }
    }
  },
  Mutation: {
    async addCaptainsToSeason(_, { seasonID, captains }, context) {
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
      if (season.status !== SeasonStatus.CONFIGURATION) {
        throw new ApolloError('Cannot add captains to a season that is not currently being configured');
      }
      const players = [...season.players];
      const newCaptains = season.captains.concat(captains.filter(player => !season.captains.includes(player)));
      captains.forEach(captain => {
        if (!players.includes(captain)) {
          players.push(captain);
        }
      });
      season.captains = newCaptains;
      season.players = players;
      return await season.save();
    },
    async addGamesToSeason(_, { seasonID, gamesToAdd }, context) {
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
      if (season == null) {
        throw new Error('Season unexpectedly null.');
      }

      if (season.status === SeasonStatus.INACTIVE) {
        throw new ApolloError('Cannot add games to inactive season');
      }

      const games = [...season.games];
      const newGames = gamesToAdd.map(async ({
        awayScore,
        awayTeam,
        date,
        homeTeam,
        homeScore
      }) => {
        const game = new Game({
          awayScore,
          awayTeam,
          date,
          homeScore,
          homeTeam,
          season: season.id,
        });

        return await game.save();
      });

      for await (let game of newGames) {
        games.push(game);
      }

      season.games = games;
      await season.save();

      const szn = await Season.findById(seasonID)
        .populate({
          path: 'games',
          populate: [{
            path: 'awayTeam',
            populate: 'team'
          }, {
            path: 'homeTeam',
            populate: 'team'
          }]
        });
      return szn;
    },
    async addPlayersToSeason(_, { seasonID, players }, context) {
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

      if (season.status === SeasonStatus.INACTIVE) {
        throw new ApolloError('Cannot add players to inactive season');
      }

      const newPlayers = season.players.concat(players.filter(player => !season.players.includes(player)));
      season.players = newPlayers;
      return await season.save();
    },
    async createSeason(_, { seasonInput }, context) {
      const authHeader = context.req.headers.authorization;
      if (authHeader == null) {
        throw new AuthenticationError('Authentication header not provided. User not authenticated.');
      }
      const token = authHeader.split('Bearer ')[1];
      const user = await userResolvers.authenticateExistingUser(token);

      if (user == null) {
        throw new AuthenticationError('User not authenticated');
      }

      const newSeason = new Season({
        ...seasonInput,
        createdAt: new Date().toISOString(),
        admins: [user.id],
        status: SeasonStatus.CONFIGURATION
      });

      const season = await newSeason.save();
      // handle if season save fails
      const league = await League.findByIdAndUpdate(
        seasonInput.league,
        {
          $push: {"seasons": season.id}
        }
      );
      // handle error
      return season;
    },
    async configureSeason(_, { input: { seasonID, periods, periodLength, scoreStat, winCondition }}, context) {
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
      if (season == null) {
        throw new ApolloError('Season is unexpectedly null');
      }
      if (season.status === SeasonStatus.ACTIVE) {
        throw new ApolloError('Cannot configure an active season.');
      }
      if (season.status !== SeasonStatus.CONFIGURATION) {
        throw new ApolloError('Cannot configure a season that is not in the configuration stage.');
      }

      season.gameConfiguration = {
        periods,
        periodLength,
        scoreStat,
        winCondition,
      }

      return await season.save().then(szn => szn.populate('gameConfiguration.scoreStat').execPopulate());
    },
    async confirmSeason(_, { seasonID }, context) {
      const authHeader = context.req.headers.authorization;
      if (authHeader == null) {
        throw new AuthenticationError('Authentication header not provided. User not authenticated.');
      }
      const token = authHeader.split('Bearer ')[1];
      const user = await userResolvers.authenticateExistingUser(token);

      if (user == null) {
        throw new AuthenticationError('User not authenticated');
      }

      const season = await Season.findById(seasonID).populate('league');
      const isLeagueAdmin = season?.league?.admins?.includes(user.id) ?? false;
      if (!isLeagueAdmin) {
        throw new ApolloError('User is not authorized to confirm the season. Only admins can confirm seasons');
      }
      if (season.status === SeasonStatus.CONFIRMED) {
        throw new ApolloError('Season already confirmed');
      }
      if (season.status === SeasonStatus.INACTIVE) {
        throw new ApolloError('Cannot confirm an inactive season');
      }

      season.status = SeasonStatus.CONFIRMED;
      return await season.save();
    },
    async launchSeason(_, { seasonID }, context) {
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
      if (season == null) {
        throw new Error('Error launching season, season unexpectedly null. Please try again.');
      }

      if (season.status != SeasonStatus.CONFIRMED) {
        throw new Error('Error launching season, cannot launch a season that is not confirmed.');
      }

      const start = dayjs(season?.seasonStart).format('MMM YYYY');
      const end = dayjs(season?.seasonEnd).format('MMM YYYY');

      if (dayjs().isAfter(end) || dayjs().isBefore(start)) {
        throw new Error('Error launching season, cannot launch a season that has not started.');
      }

      season.status = SeasonStatus.ACTIVE;
      return await season.save();
    }
  },
  Subscription: {
    newSeason: {
      subscribe: (_, __, { pubSub }) => pubSub.asyncIterator('NEW_SEASON')
    }
  }
}
