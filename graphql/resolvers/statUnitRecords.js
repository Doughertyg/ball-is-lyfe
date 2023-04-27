const { AuthenticationError } = require('apollo-server');

const StatUnitRecord = require('../../db/models/StatUnitRecord');
const Game = require('../../db/models/Game');
const userResolvers = require('./users');

module.exports = {
  Mutation: {
    async addStatUnitRecord(_, { seasonID, gameID, playerID, timeCode }, context) {
      const authHeader = context.req.headers.authorization;
      if (authHeader == null) {
        throw new AuthenticationError('Authentication header not provided. User not authenticated.');
      }
      const token = authHeader.split('Bearer ')[1];
      const user = await userResolvers.authenticateExistingUser(token);

      if (user == null) {
        throw new AuthenticationError('User not authenticated');
      }

      const statUnitRecord = new StatUnitRecord({
        seasonID,
        gameID,
        playerID,
        timeCode
      });

      await statUnitRecord.save();
      return await Game.findById(gameID);
    }
  },
  Query: {
    async getStatUnitRecords(_, { seasonID, userID }) {
      if (seasonID != null) {
        return await StatUnitRecord.find({
          season: seasonID
        }) ?? [];
      }

      if (userID != null) {
        return await StatUnitRecord.find({
          player: userID
        }) ?? [];
      }

      return await StatUnitRecord.find();
    }
  },
}