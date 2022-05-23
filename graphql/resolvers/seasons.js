const { AuthenticationError, UserInputError } = require('apollo-server');

const Season = require('../../db/models/Season');
const League = require('../../db/models/League');
const authenticate = require('../../util/authenticate');

module.exports = {
  Query: {
    async getSeasonsByUser(_, {userID}) {
      try {
        const seasons = await Season.find(season =>
          season != null &&
          season.players != null &&
          season.players.includes(userID) ||
          season != null &&
          season.admins != null &&
          season.admins.includes(userID)
        ).sort({createdAt: -1}).exec();
        return seasons;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getSeasonByID(_, { seasonID }) {
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
    async createSeason(_, { seasonInput }, context) {
      console.log('season input:::::::::::: ', seasonInput);
      const user = authenticate(context);

      const newSeason = new Season({
        ...seasonInput,
        createdAt: new Date().toISOString(),
        admins: [user.id]
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
      console.log('updated league:  ', league);
      return season;
    }
  },
  Subscription: {
    newSeason: {
      subscribe: (_, __, { pubSub }) => pubSub.asyncIterator('NEW_SEASON')
    }
  }
}
