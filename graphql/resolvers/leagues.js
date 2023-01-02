const { AuthenticationError, ForbiddenError } = require('apollo-server');

const League = require('../../db/models/League');
const authenticate = require('../../util/authenticate');
const userResolvers = require('./users');

module.exports = {
  Query: {
    async getLeaguesByUser(_, { userID }) {
      try {
        const leagues = await League.find({
          $or: [
            { players: {$in: [userID]} },
            { admins: {$in: [userID]} }
          ]})
          .sort({ createdAt: -1 })
          .populate('admins')
          .exec();
        return leagues;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getLeagueByID(_, { leagueID, userID }) {
      try {
        const league =
          await League.findById(leagueID)
            .populate('seasons')
            .populate('players')
            .exec();
        const isAdmin = league.admins.includes(userID);
        return {league, isAdmin};
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async addPlayersToLeague(_, { leagueID, playersToAdd }, context) {
      const authHeader = context.req.headers.authorization;
      if (authHeader == null) {
        throw new AuthenticationError('Authentication header not provided. User not authenticated.');
      }
      const token = authHeader.split('Bearer ')[1];
      const user = await userResolvers.authenticateExistingUser(token);

      if (user == null) {
        throw new AuthenticationError('User not authenticated');
      }

      const league = await League.findById(leagueID).exec();
      const isAdmin = league.admins.includes(user.id);

      if (!isAdmin) {
        throw new ForbiddenError('Only league admins can add players to the league');
      }

      try {
        playersToAdd.forEach(playerID => {
          if (
            league.players != null &&
            league.players.includes(playerID)
          ) {
            throw new Error('Cannot add a player that is already in the league');
          }

          if (league.players != null) {
            league.players.push(playerID);
            league.save();
          }
        })
      } catch (err) {
        throw new Error(err);
      }
      
      return league;
    },
    async createLeague(_, { leagueInput }, context) {
      const authHeader = context.req.headers.authorization;
      if (authHeader == null) {
        throw new AuthenticationError('Authentication header not provided. User not authenticated.');
      }
      const token = authHeader.split('Bearer ')[1]
      const user = await userResolvers.authenticateExistingUser(token);

      if (user == null) {
        throw new AuthenticationError('User not authenticated');
      }

      const newLeague = new League({
        ...leagueInput,
        createdAt: new Date().toDateString(),
        admins: [user.id],
        players: [user.id],
        seasons: []
      });

      const league = await newLeague.save();
      
      return league;
    }
  },
  Subscription: {
    newLeague: {
      subscribe: (_, __, { pubSub }) => pubSub.asyncIterator('NEW_LEAGUE')
    }
  }
}

