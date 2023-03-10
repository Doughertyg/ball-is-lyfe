const postResolvers = require('./posts');
const userResolvers = require('./users');
const commentResolvers = require('./comments');
const leagueResolvers = require('./leagues');
const seasonResolvers = require('./seasons');
const teamResolvers = require('./teams');
const statUnitResolvers = require('./statUnits');
const statResolvers = require('./stats');
const statOperationsResolvers = require('./statOperations');

/**
 * Util function for recursively calculating the expression
 * string of an operation. Operations can be made up of multiple
 * child operations, stat units/metrics, or scalars (float numbers)
 * Example output: "FGB / (FGM + FMISS)"
 * @param {statUnit or statOperation} unitOrOperation 
 * @param {Number scalar for term} scalar 
 * @returns a string representing the expression
 */
function generateOperationExpression(operation) {
  // input is a stat operation which has two terms
  // the terms may be an operation, a stat unit/metric, or a scalar
  let term1 = '';
  let term2 = '';
  if (operation.termAScalar) {
    term1 = operation.termAScalar;
  } else {
    // TODO: handle cases where metric is not populated and not an object (query object)
    term1 = operation.metricA?.operation ? `(${generateOperationExpression(operation.metricA)})` : operation.metricA?.abbreviation;
  }

  if (operation.termBScalar) {
    term2 = operation.termAScalar;
  } else {
    // TODO: handle cases where metric is not populated and not an object (query object)
    term2 = operation.metricB?.operation ? `(${generateOperationExpression(operation.metricB)})` : operation.metricB?.abbreviation;
  }

  return term1 + ' ' + operation.operation + ' ' + term2;
}

module.exports = {
  OperationTermUnion: {
    __resolveType(obj, _contextValue, _info) {
      if (obj.operation) {
        return 'Operation';
      }

      if (obj.value) {
        return 'StatUnit';
      }
    }
  },
  Post: {
    likeCount (parent) {
      return parent.likes.length;
    },
    commentCount: (parent) => parent.comments.length
  },
  Operation: {
    expression: parent => {
      // calculate the expression from data objects
      console.log('calculate field. parent: ', parent);
      return generateOperationExpression(parent);
    }
  },
  Query: {
    ...postResolvers.Query,
    ...leagueResolvers.Query,
    ...seasonResolvers.Query,
    ...statOperationsResolvers.Query,
    ...statResolvers.Query,
    ...statUnitResolvers.Query,
    ...userResolvers.Query,
    ...teamResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentResolvers.Mutation,
    ...leagueResolvers.Mutation,
    ...seasonResolvers.Mutation,
    ...statOperationsResolvers.Mutation,
    ...statResolvers.Mutation,
    ...statUnitResolvers.Mutation,
    ...teamResolvers.Mutation,
  },
  Subscription: {
    ...postResolvers.Subscription
  }
}