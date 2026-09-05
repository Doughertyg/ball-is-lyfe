const { UserInputError, AuthenticationError } = require('apollo-server');
const { PossibleTypeExtensionsRule } = require('graphql');

const Post = require('../../db/models/Post');
const userResolvers = require('./users');

module.exports = {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      userResolvers.requireAuth(context);
      const { username } = context.user;

      if (body.trim() === "") {
        throw new UserInputError('Empty Comment', {
          errors: {
            body: 'Comment body must not be empty'
          }
        })
      }

      const post = await Post.findById(postId);

      if (post) {
        post.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString()
        });

        await post.save();
        return post;
      } else {
        throw new UserInputError('Post not found');
      }
    },
    async deleteComment(_, { postId, commentId}, context) {
      userResolvers.requireAuth(context);
      const { username } = context.user;

      const post = await Post.findById(postId);

      if (post) {
        const commentIndex = post.comments.findIndex(comment => comment.id === commentId);

        if (post.comments[commentIndex].username === username) {
          post.comments.splice(commentIndex, 1);
          await post.save();
          return post;
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } else {
        throw new UserInputError('Post not found');
      }
    }
  }
}
