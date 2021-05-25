import React from 'react';
import App from './App.jsx';
import { ApolloClient, InMemoryCache, createHttpLink, } from '@apollo/client';
import { ApolloProvider } from '@apollo/react-hooks';
import { GRAPHQL_ADDRESS } from '../.env';

const httpLink = createHttpLink({
  uri: GRAPHQL_ADDRESS
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);