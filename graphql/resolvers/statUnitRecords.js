const { AuthenticationError } = require('apollo-server');

const StatUnitRecord = require('../../db/models/StatUnitRecord');
const Game = require('../../db/models/Game');
const userResolvers = require('./users');

module.exports = {
  Mutation: {
    async addStatUnitRecord(_, { seasonID, statUnitID, gameID, playerID, timeCode }, context) {
      userResolvers.requireAuth(context);

      const statUnitRecord = new StatUnitRecord({
        season: seasonID,
        statUnit: statUnitID,
        game: gameID,
        player: playerID,
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