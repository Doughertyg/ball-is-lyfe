const { AuthenticationError, UserInputError } = require('apollo-server');

const Season = require('../../db/models/Season');
const authenticate = require('../../util/authenticate');

module.exports = {
  Query: {
    async getSeasonsByUser(_, {userID}) {
      try {
        const seasons = Season.find(season => season.players?.includes(userID))
          .sort({ createdAt: -1 });
        return seasons ?? [];
      } catch (err) {
        throw new Error(err);
      }
    },
    async getSeason(_, { seasonID }) {
      try {
        const season = Season.findById(seasonID);
        if (season) {
          return season;
        } else {
          throw new Error('Season not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async createSeason(_, { data }, context) {
      const user = authenticate(context);

      const newSeason = new Season({
        ...data,
        createAt: new Date().toISOString(),
        createdBy: user.id,
        admins: [userID]
      });

      const season = await newSeason.save();
      context.pubSub.publish('NEW_SEASON', {
        newSeason: season
      });
      return season;
    }
  },
  Subscription: {
    newSeason: {
      subscribe: (_, __, { pubSub }) => pubSub.asyncIterator('NEW_SEASON')
    }
  }
}
