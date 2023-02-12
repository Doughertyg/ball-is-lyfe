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
    async createStatOperation(_, { input: {name, operation, seasonID, term1, term1Scalar, term2, term2Scalar} }, context) {
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
        throw new Error('Season unexpectedly null. Mutation not complete,');
      }

      // terms can be either StatUnits or Operations
      const term1StatUnit = await StatUnit.findById(term1);
      const term1Operation = await Operation.findById(term1);
      const term2StatUnit = await StatUnit.findById(term2);
      const term2Operation = await Operation.findById(term2);

      if (term1Operation == null && term1StatUnit == null && term1Scalar == null) {
        throw new Error('No stat metric, operation, or constant given for term 1.');
      }

      if (term2Operation == null && term2StatUnit == null && term2Scalar == null) {
        throw new Error('No stat metric, operation, or constant given for term 2.');
      }

      if (term1 != null && term1Scalar != null) {
        throw new Error('Unexpectedly recieved both term1 and a constant value');
      }

      if (term2 != null && term2Scalar != null) {
        throw new Error('Unexpectedly recieved both term2 and a constant value');
      }

      if (term1StatUnit != null && !season?.statUnits?.includes(term1StatUnit.id)) {
        season.statUnits = [...season.statUnits, term1StatUnit.id];
      } else if (term1Operation != null) {
        // traverse down operation tree and add statUnits to season
      }

      if (term2StatUnit != null && !season?.statUnits?.includes(term2StatUnit.id)) {
        season.statUnits = [...season.statUnits, term2StatUnit.id];
      } else if (term2Operation != null) {
        // traverse down operation tree and add statUnits to season
      }

      await season.save();
      const newOperation = new Operation({
        name,
        operation,
        metricA: term1,
        metricAModel: term1StatUnit ? 'StatUnit' : 'Operation',
        metricB: term2,
        metricBModel: term2StatUnit ? 'StatUnit' : 'Operation',
        termAScalar: term1Scalar,
        termBScalar: term2Scalar,
      });
      const createdOperation = await newOperation.save();
      return await Operation.findById(createdOperation.id).populate(['metricA', 'metricB']);
    }
  },
  Query: {
    async getStatOperations(_, {seasonID}) {
      if (seasonID != null) {
        const season = await Season.findById(seasonID);
        // query operations relating to statUnits or stats in season
      }

      return await Operation.find().populate(['metricA', 'metricB']);
    }
  }
}