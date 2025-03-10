import React from 'react';
import App from './App.jsx';
import { ApolloClient, InMemoryCache, createHttpLink, } from '@apollo/client';
import { ApolloProvider } from '@apollo/react-hooks';
import { setContext } from 'apollo-link-context';

const GRAPHQL_ADDRESS = process.env.GRAPHQL_ADDRESS;
const URI = process.env.NODE_ENV == 'development' ?
  'http://localhost:5000/' :
  GRAPHQL_ADDRESS;

const httpLink = createHttpLink({
  uri: URI
});

const authLink = setContext(() => {
  const token = localStorage.getItem('jwtToken');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  }
})

// const cache = new InMemoryCache({
//   typePolicies: {
//     Team: {
//       fields: {
//         seasonPlayers: {
//           read(_, { args, readField }) {
//             const players = readField('players');
//             if (args && args.seasonID != null) {
//               return players.filter(player => )
//             }
//           }
//         }
//       }
//     }
//   }
// });

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
