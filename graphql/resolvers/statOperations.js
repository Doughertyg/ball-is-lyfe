const { AuthenticationError, UserInputError } = require('apollo-server');

const Season = require('../../db/models/Season');
const StatUnit = require('../../db/models/StatUnit');
const Operation = require('../../db/models/Operation');
const League = require('../../db/models/League');
const Game = require('../../db/models/Game');
const authenticate = require('../../util/authenticate');
const userResolvers = require('./users');

module.exports = {
  Mutation: {
    async createStatOperation(_, { name, operation, seasonID, term1, term2 }, context) {
      const authHeader = context.req.headers.authorization;
      if (authHeader == null) {
        throw new AuthenticationError('Authentication header not provided. User not authenticated.');
      }
      const token = authHeader.split('Bearer ')[1];
      const user = await userResolvers.authenticateExistingUser(token);

      if (user == null) {
        throw new AuthenticationError('User not authenticated');
      }

      // create stat operation
      // attach to season
    }
  },
  Query: {
    async getStatOperations(_, {seasonID}) {
      if (seasonID != null) {
        const season = await Season.findById(seasonID);
        // query operations relating to statUnits or stats in season
      }

      return await this.Operation.find() ?? [];
    }
  }
}