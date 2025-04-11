import React, { useContext } from 'react';
import App from './App.jsx';
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';

import { setContext } from 'apollo-link-context';
import { AuthProvider, AuthContext } from './context/auth';

const GRAPHQL_ADDRESS = process.env.GRAPHQL_ADDRESS;
const URI = process.env.NODE_ENV == 'development' ?
  'http://localhost:3000/graphql' :
  GRAPHQL_ADDRESS;

const httpLink = createHttpLink({
  uri: URI,
  credentials: 'include'
});

const ApolloAuthProvider = ({ children }) => {
  const { accessToken } = useContext(AuthContext);

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
}

const Providers = () => {
  return (
    <AuthProvider>
      <ApolloAuthProvider>
        <App />
      </ApolloAuthProvider>
    </AuthProvider>
  )
};

export default Providers;
