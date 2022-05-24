const { gql } = require('graphql-tag');

module.exports = gql`
  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
    getLeaguesByUser(userID: ID!): [League]
    getLeagueByID(leagueID: ID!): League
    getPlayersInLeague(leagueID: ID!): [User]
    getSeasonsByUser(userID: ID!): [Season]
    getSeasonByID(seasonID: ID!): Season
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
    _id: ID!
    createdAt: String!
    name: String!
    description: String!
    location: String!
    sport: String!
    players: [User]!
    admins: [User]!
    seasons: [Season]!
    profilePicture: String!
    bannerPicture: String!
  }
  type Season {
    id: ID!
    admin: [User]!
    createdAt: String!
    name: String!
    description: String!
    seasonStart: String!
    seasonEnd: String!
    league: League!
    players: [User]!
    teams: [TeamInstance]!
  }
  type Team {
    id: ID!
    bannerPicture: String!
    createdAt: String!
    description: String!
    admin: [User]!
    players: [User]!
    profilePicture: String!
    name: String!
    sport: String!
  }
  type TeamInstance {
    id: ID!
    createdAt: String!
    players: [User]!
    captain: User!
    team: Team!
    season: Season!
  }
  type PlayerInstance {
    id: ID!
    season: Season!
    playerNumber: Int! 
    position: String!
    user: User!
  }
  type Game {
    id: ID!
    season: Season!
    date: String!
    awayTeam: TeamInstance!
    awayScore: Int!
    homeTime: TeamInstance!
    homeScore: Int!
  }
  type StatUnit {
    name: String!
    value: Int!
  }
  type Stat {
    id: ID!
    name: String!
    operations: [String]!
    statUnits: [StatUnit]!
  }
  type PlayerStatUnits {
    id: ID!
    player: PlayerInstance!
    statUnit: StatUnit!
    game: Game!
  }
  type PlayerGameStats {
    id: ID!
    player: PlayerInstance!
    game: Game!
    stat: Stat!
    value: Int!
  }
  type PlayerSeasonStats {
    id: ID!
    player: PlayerInstance!
    season: Season!
    stat: Stat!
    value: Int!
  }
  type PlayerLeagueStats {
    id: ID!
    player: User!
    league: League!
    stat: Stat!
    value: Int!
  }
  type TeamGameStats {
    id: ID!
    team: TeamInstance!
    game: Game!
    stat: Stat!
    value: Int!
  }
  type TeamSeasonStats {
    id: ID!
    team: TeamInstance!
    season: Season!
    stat: Stat!
    value: Int!
  }
  type TeamLeagueStats {
    id: ID!
    team: Team!
    league: League!
    stat: Stat!
    value: Int!
  }
  type Like {
    id: ID!
    createdAt: String!
    username: String!
  }
  type User {
    id: ID!
    bio: String!
    profilePicture: String!
    bannerPicture: String!
    phoneNumber: Int!
    height: String!
    weight: Int!
    location: String!
    name: String!
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
  input CreateSeasonInput {
    name: String!
    description: String!
    seasonEnd: String!
    league: ID!
    players: [ID]!
    seasonStart: String!
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: String!): String!
    createComment(postId: ID!, body: String!): Post!
    createLeague(leagueInput: CreateLeagueInput): League!
    createSeason(seasonInput: CreateSeasonInput): Season!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
  }
  type Subscription {
    newPost: Post!
  }
`;
