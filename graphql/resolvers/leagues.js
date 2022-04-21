const { AuthenticationError, UserInputError } = require('apollo-server');

const League = require('../../db/models/League');
const authenticate = require('../../util/authenticate');

module.exports = {
  Query: {
    async getLeaguesByUser(_, { userID }) {
      try {
        const leagues = League.find(league => league.players?.includes(userID))
          .sort({ createdAt: -1 });
        return leagues ?? [];
      } catch (err) {
        throw new Error(err);
      }
    },
    Mutation: {
      async createLeague(_, { data }, context) {
        const user = authenticate(context);

        const newLeague = new League({
          ...data,
          createdAt: new Date().toDateString(),
          createdBy: user.id,
          admins: [user.id]
        });

        const league = await newLeague.save();
        context.pubSub.publish('NEW_LEAGUE', {
          newLeague: league
        });
        return league;
      }
    },
    Subscription: {
      newLeague: {
        subscribe: (_, __, { pubSub }) => pubSub.asyncIterator('NEW_LEAGUE')
      }
    }
  }
}

