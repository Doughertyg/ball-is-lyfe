const { gql } = require('graphql-tag');

module.exports = gql`
  type Query {
    getAllPlayers: [User]
    getCaptains(seasonID: ID!): [User]
    getPosts: [Post]
    getPost(postId: ID!): Post
    getLeagues: [League]
    getLeaguesByUser(userID: ID!): [League]
    getLeagueByID(leagueID: ID!, userID: ID!): GetLeagueByIDReturnType
    getPlayersInLeague(leagueID: ID, seasonID: ID): [User]
    getPlayersNotInLeague(leagueID: ID): [User]
    getSeasonsByUser(userID: ID!): [Season]
    getSeasonByID(seasonID: ID!, userID: ID!): GetSeasonByIDReturnType
    getUserContext(token: String!): User
    getTeam(teamID: ID!): Team
    getTeams(seasonIDToExclude: ID): [Team]
    getTeamsByUser(userID: ID!): [Team]
  }
  type GetLeagueByIDReturnType {
    league: League
    isAdmin: Boolean
    isLeagueMember: Boolean
  }
  type GetSeasonByIDReturnType {
    season: Season
    isLeagueAdmin: Boolean
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
    captains: [User]!
    createdAt: String!
    games: [Game]
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
    bannerPicture: String
    createdAt: String!
    description: String
    admin: [User]!
    players: [User]!
    profilePicture: String
    name: String!
    sport: String
    seasonPlayers: [User]
  }
  type TeamInstance {
    id: ID!
    createdAt: String!
    players: [User]!
    captain: User
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
    profilePicture: String
    bannerPicture: String!
    phoneNumber: Int!
    height: String!
    weight: Int!
    location: String!
    name: String
    email: String!
    token: String!
    username: String
    createdAt: String!
  }
  type CreateTeamMutationReturnType {
    team: Team,
    teamInstance: TeamInstance
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
    description: String!
    seasonEnd: String!
    league: ID!
    players: [ID]!
    seasonStart: String!
  }
  type Mutation {
    addPlayersToLeague(leagueID: ID!, playersToAdd: [ID!]): League!
    addCaptainsToSeason(seasonID: ID!, captains: [ID!]): Season!
    addPlayersToSeason(seasonID: ID!, players: [ID!]): Season!
    addTeamsToSeason(teamIDs: [ID], seasonID: ID!): Season!
    register(registerInput: RegisterInput): User!
    registerUser(token: String!): User!
    login(username: String!, password: String!): User!
    loginUser(token: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: String!): String!
    createComment(postId: ID!, body: String!): Post!
    createLeague(leagueInput: CreateLeagueInput): League!
    createSeason(seasonInput: CreateSeasonInput): Season!
    createTeam(
      bannerPicture: String,
      captain: ID!,
      description: String,
      name: String!,
      players: [ID]!,
      profilePicture: String,
      seasonID: ID,
      sport: String
    ): CreateTeamMutationReturnType
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
  }
  type Subscription {
    newPost: Post!
  }
`;
