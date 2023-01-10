const { AuthenticationError, UserInputError } = require('apollo-server');

const Season = require('../../db/models/Season');
const League = require('../../db/models/League');
const authenticate = require('../../util/authenticate');
const userResolvers = require('./users');

module.exports = {
  Query: {
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
      console.log('in getSeasonByID query!!!!!!!!!');
      try {
        const season = await Season.findById(seasonID).populate('league');
        const isLeagueAdmin = season?.league?.admins?.includes(userID) ?? false;
        if (season) {
          return { season, isLeagueAdmin };
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
