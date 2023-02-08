const { AuthenticationError, UserInputError } = require('apollo-server');

const Season = require('../../db/models/Season');
const Stat = require('../../db/models/Stat');
const Operation = require('../../db/models/Operation');
const League = require('../../db/models/League');
const Game = require('../../db/models/Game');
const authenticate = require('../../util/authenticate');
const userResolvers = require('./users');

module.exports = {
  Mutation: {
    async createStat(_, { name, operation, seasonID }, context) {
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
        throw new Error('Season unexpectedly null. Stat not created.');
      }

      const stat = new Stat({
        name,
        operation
      });
      const createdStat = await stat.save();
      season.stats.push(createdStat.id);
      season.save();
      return await createdStat;
    }
  },
  Query: {
    async getStats(_, {seasonID}) {
      if (seasonID != null) {
        const season = await Season.findById(seasonID).populate('stats');
        return season?.stats ?? [];
      }

      return await Season.find();
    }
  }
}