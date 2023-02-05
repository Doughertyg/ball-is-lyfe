const postResolvers = require('./posts');
const userResolvers = require('./users');
const commentResolvers = require('./comments');
const leagueResolvers = require('./leagues');
const seasonResolvers = require('./seasons');
const teamResolvers = require('./teams');
const statUnitResolvers = require('./statUnits');
const statResolvers = require('./stats');
const statOperationsResolvers = require('./statOperations');

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