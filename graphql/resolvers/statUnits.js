const { AuthenticationError, UserInputError } = require('apollo-server');

const Season = require('../../db/models/Season');
const StatUnit = require('../../db/models/StatUnit');
const League = require('../../db/models/League');
const Game = require('../../db/models/Game');
const authenticate = require('../../util/authenticate');
const userResolvers = require('./users');

module.exports = {
  Mutation: {
    async createStatUnit(_, { name, seasonID, value }, context) {
      const authHeader = context.req.headers.authorization;
      if (authHeader == null) {
        throw new AuthenticationError('Authentication header not provided. User not authenticated.');
      }
      const token = authHeader.split('Bearer ')[1];
      const user = await userResolvers.authenticateExistingUser(token);

      if (user == null) {
        throw new AuthenticationError('User not authenticated');
      }

      const newStatUnit = new StatUnit({
        name,
        value
      });

      return await newStatUnit.save();
      // TODO: add statUnit to sport
      // if (seasonID != null) {
      //   const season = await Season.findById(seasonID).populate('league').populate('statUnits');
      //   console.log('season: ', season);
      //   const league = season.league;
      //   console.log('league: ', league);
      //   league.sport
      // }
    }
  },
  Query: {
    async getStatUnits(_, {seasonID}) {
      let statUnits = [];
      if (seasonID != null) {
        const season = await Season.findById(seasonID).populate('league');
        // statUnits = season?.statUnits ?? [];
        // for now just return all statUnits. in the future, filter by sport
        return await StatUnit.find();
      }

      if (statUnits.length > 0) {
        return statUnits;
      }
      // filter by sport?
      return await StatUnit.find();
    }
  }
}