const { ApolloServer, PubSub } = require('apollo-server');
const mongoose = require('mongoose');


const resolvers = require('../graphql/resolvers');
const typeDefs = require('../graphql/typeDefs');

const pubSub = new PubSub();

const PORT = process.env.PORT || 5000;
const {MONGODB} = process.env.MONGODB;

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
  })
  .catch((err) => {
    console.log('error connecting to the db! err: ', err);
});
