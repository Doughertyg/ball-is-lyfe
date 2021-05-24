const { UserInputError, AuthenticationError } = require('apollo-server');
const { PossibleTypeExtensionsRule } = require('graphql');

const Post = require('../../db/models/Post');
const authenticate = require('../../util/authenticate');

module.exports = {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const { username } = authenticate(context);

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
      const { username } = authenticate(context);

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
