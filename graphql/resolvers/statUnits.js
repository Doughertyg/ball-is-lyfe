const { AuthenticationError, UserInputError } = require('apollo-server');

const Season = require('../../db/models/Season');
const StatUnit = require('../../db/models/StatUnit');
const League = require('../../db/models/League');
const Game = require('../../db/models/Game');
const authenticate = require('../../util/authenticate');
const userResolvers = require('./users');

module.exports = {
  Mutation: {
    async createStatUnit(_, { abbreviation, name, seasonID, value }, context) {
      userResolvers.requireAuth(context);

      const newStatUnit = new StatUnit({
        abbreviation,
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