const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');

const {MONGODB, PORT} = require('../.env');

const typeDefs = gql`
  type Query {
    sayHi: String!
  }
`;

const resolvers = {
  Query: {
    sayHi: () => 'Hello World!'
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

mongoose.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    return server.listen({ port: PORT});
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
});
