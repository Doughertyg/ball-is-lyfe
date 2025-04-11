const { AuthenticationError, UserInputError } = require('apollo-server');

const StatRecord = require('../../db/models/StatRecord');
const League = require('../../db/models/League');
const Game = require('../../db/models/Game');
const authenticate = require('../../util/authenticate');
const userResolvers = require('./users');

module.exports = {
  Mutation: {
    async addStatRecord(_, { seasonID, gameID, playerID, statID, timeCode}, context) {
      userResolvers.requireAuth(context);

      const statRecord = new StatRecord({
        stat: statID,
        game: gameID,
        player: playerID,
        season: seasonID,
        timeCode
      });
      await statRecord.save();

      return await StatRecord.find({
        season: seasonID,
      })
    }
  },
  Query: {
    async getStatRecords(_, { seasonID, gameID, playerID, statID}) {
      if (seasonID != null) {
        return await StatRecord.find({
          season: seasonID
        });
      }

      if (gameID != null) {
        return await StatRecord.find({
          game: gameID
        })
      }

      if (playerID != null && seasonID != null && gameID != null) {
        return await StatRecord.find({
          season: seasonID,
          game: gameID,
          player
        })
      }

      if (playerID != null && seasonID != null) {
        return await StatRecord.find({
          season: seasonID,
          player: playerID
        });
      }

      if (playerID != null) {
        return await StatRecord.find({
          player: playerID
        });
      }

      return await StatRecord.find();
    }
  }
}
