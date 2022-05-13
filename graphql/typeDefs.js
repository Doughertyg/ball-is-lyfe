const { gql } = require('graphql-tag');

module.exports = gql`
  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
    getLeaguesByUser(userID: ID!): [League]
  }
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }
  type Comment {
    id: ID!
    createdAt: String!
    username: String!
    body: String!
  }
  type League {
    id: ID!
    createdAt: String!
    name: String!
    description: String!
    location: String!
    sport: String!
    players: [ID]!
    admin: [ID]!
    seasons: [ID]!
    profilePicture: String!
    bannerPicture: String!
  }
  type Like {
    id: ID!
    createdAt: String!
    username: String!
  }
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  input CreateLeagueInput {
    name: String!
    description: String!
    location: String!
    sport: String!
    profilePicture: String!
    bannerPicture: String!
    players: [ID]
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: String!): String!
    createComment(postId: ID!, body: String!): Post!
    createLeague(leagueInput: CreateLeagueInput): League!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
  }
  type Subscription {
    newPost: Post!
  }
`;
