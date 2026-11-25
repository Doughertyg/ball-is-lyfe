import React, { useContext } from 'react';
import App from './App.jsx';
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from 'apollo-link-context';
import { AuthProvider, AuthContext } from './context/auth';
import clientConfig from './config';

const URI = clientConfig.graphqlUri;

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
