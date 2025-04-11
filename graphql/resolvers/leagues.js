const { AuthenticationError, ForbiddenError } = require('apollo-server');

const League = require('../../db/models/League');
const authenticate = require('../../util/authenticate');
const userResolvers = require('./users');

module.exports = {
  Query: {
    async getLeagues() {
      return await League.find();
    },
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
          await League.findById(leagueID).exec();
        const isAdmin = league.admins.includes(userID);
        const isLeagueMember = league.players.includes(userID);
        await league.populate('seasons').execPopulate();
        await league.populate('players').execPopulate();
        return {league, isAdmin, isLeagueMember};
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async addPlayersToLeague(_, { leagueID, playersToAdd }, context) {
      userResolvers.requireAuth(context);

      const league = await League.findById(leagueID).exec();
      const isAdmin = league.admins.includes(context.user?.id);

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
          }
        });

        await league.save();
      } catch (err) {
        throw new Error(err);
      }
      
      return league;
    },
    async createLeague(_, { leagueInput }, context) {
      userResolvers.requireAuth(context);

      const players = leagueInput?.players ?? [];

      if (!players.includes((context.user?.id).toString())) {
        players.push(context.user?.id);
      }

      const newLeague = new League({
        ...leagueInput,
        createdAt: new Date().toDateString(),
        admins: [context.user?.id],
        players,
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

