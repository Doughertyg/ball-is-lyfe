import React from 'react';
import App from './App.jsx';
import { ApolloClient, InMemoryCache, createHttpLink, } from '@apollo/client';
import { ApolloProvider } from '@apollo/react-hooks';
import { GRAPHQL_ADDRESS } from '../.env';
import { setContext } from 'apollo-link-context';

const httpLink = createHttpLink({
  uri: GRAPHQL_ADDRESS
});

const authLink = setContext(() => {
  const token = localStorage.getItem('jwtToken');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);