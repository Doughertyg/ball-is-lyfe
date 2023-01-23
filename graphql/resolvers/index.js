const postResolvers = require('./posts');
const userResolvers = require('./users');
const commentResolvers = require('./comments');
const leagueResolvers = require('./leagues');
const seasonResolvers = require('./seasons');
const teamResolvers = require('./teams');

module.exports = {
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
    ...userResolvers.Query,
    ...teamResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentResolvers.Mutation,
    ...leagueResolvers.Mutation,
    ...seasonResolvers.Mutation,
    ...teamResolvers.Mutation,
  },
  Subscription: {
    ...postResolvers.Subscription
  }
}