const { ApolloServer, PubSub } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');

const {MONGODB, PORT} = require('../.env');
const resolvers = require('../graphql/resolvers');
const typeDefs = require('../graphql/typeDefs');
const User = require('../db/models/User');

const pubSub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubSub }) 
});

mongoose.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    return server.listen({ port: PORT});
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
});
