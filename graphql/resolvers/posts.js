const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../../db/models/Post');
const authenticate = require('../../util/authenticate');

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error('Post not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async createPost(_, { body }, context) {
      const user = authenticate(context);

      if (body.trim() === "") {
        throw new Error("Post body must not be empty");
      }

      const newPost = new Post({ 
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
      });

      const post = await newPost.save();
      context.pubSub.publish('NEW_POST', {
        newPost: post
      });
      return post;
    },
    async deletePost(_, { postId }, context) {
      const user = authenticate(context);

      try {
        const post = await Post.findById(postId);

        if (user.username === post.username) {
          await post.delete();
          return 'Post deleted successfully';
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async likePost(_, { postId }, context) {
      const { username } = authenticate(context);

      const post = await Post.findById(postId);
      if (post) {
        if (post.likes.find(like => like.username === username)) {
          // already liked
          post.likes = post.likes.filter(like => like.username !== username);
        } else {
          // not like, like
          post.likes.push({
            username, createdAt: new Date().toISOString()
          });
        }

        await post.save();
        return post;
      } else {
          throw new UserInputError('Post not found');
      }
    }
  },
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubSub }) => pubSub.asyncIterator('NEW_POST')
    }
  }
}
