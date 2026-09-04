import React, {createContext, useState, useCallback } from 'react';
import jwtDecode from 'jwt-decode';
import { LOGIN_WITH_GOOGLE_MUTATION, LOGOUT_MUTATION, REFRESH_TOKEN_MUTATION } from '../../graphql/mutations/userMutations';
import clientConfig from '../config';

const AuthContext = createContext({
  user: null,
  accessToken: null,
  checkAndRefreshToken: () => {},
  errors: {},
  loading: false,
  login: () => {},  
  logout: () => {},
  setErrors: () => {}
})

const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

const ENDPOINT = clientConfig.graphqlUri;

const postGraphQL = async (query) => {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  const contentType = response.headers.get('content-type') || '';
  const responseText = await response.text();
  let json;

  if (!contentType.includes('application/json')) {
    throw new Error(
      `GraphQL endpoint returned HTML instead of JSON (HTTP ${response.status}). ` +
      `Check GRAPHQL_ADDRESS: ${ENDPOINT}`
    );
  }

  try {
    json = JSON.parse(responseText);
  } catch (_err) {
    throw new Error(`GraphQL endpoint returned invalid JSON (HTTP ${response.status})`);
  }

  if (!response.ok || json.errors?.length) {
    throw new Error(json.errors?.[0]?.message || `GraphQL request failed (HTTP ${response.status})`);
  }

  return json;
};

/**
 * 
 * Auth Provider to encapsulate all auth logic
 * - store user info and accessToken
 * - refresh accessToken if null or expired
 * - logout
 */
function AuthProvider({ children }) {
  const [user, setUser] = useState();
  const [accessToken, setAccessToken] = useState();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const login = useCallback(async (payload) => {
    setLoading(true);

    try {
      const isGoogleLogin = typeof payload === 'string';

      if (isGoogleLogin) {
        const json = await postGraphQL(LOGIN_WITH_GOOGLE_MUTATION(payload));
        const token = json?.data?.loginUserWithGoogle?.token;
        const user = json?.data?.loginUserWithGoogle?.user;

        if (!token) {
          console.error('Login failed: No token received');
          throw new Error('Login failed: No token received');
        }

        setAccessToken(token);
        setUser(user);
        return {
          token,
          user
        }
      }

      const token = payload?.token;
      const user = payload?.user ?? payload;

      if (!token) {
        throw new Error('Login failed: No token received');
      }

      setAccessToken(token);
      setUser(user);
      return {
        token,
        user
      }
    } catch (err) {
      console.log('Error in the onGoogleAuthError callback: ', err);
      const graphQLErrors = err.message ? {err: err.message} : err?.graphQLErrors[0]?.extensions?.exception?.errors ?? {'graphQLError': 'Server error has ocurred, please try again'};
      setErrors(errors => ({...errors, ...graphQLErrors}));
      setAccessToken(null);
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setErrors, setUser, setAccessToken]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await postGraphQL(LOGOUT_MUTATION);
    } catch (err) {
      console.log('Error calling logout mutation: ', err);
    } finally {
      setAccessToken(null);
      setUser(null);
      setLoading(false);
    }
  }, [setAccessToken, setUser]);

  const refreshAccessToken = useCallback(async () => {
    setLoading(true);

    try {
      const json = await postGraphQL(REFRESH_TOKEN_MUTATION);
      const token = json?.data?.refreshToken?.token;
      const user = json?.data?.refreshToken?.user;

      if (!token) {
        console.log('Error refreshing user token: No token received');
        throw new Error('Error refreshing user token: No token received');
      }

      setAccessToken(token);
      setUser(user);
      return {
        token,
        user
      }
    } catch (err) {
      console.error('Token refresh failed:', err);
      const graphQLErrors = err.message ? {err: err.message} : err?.graphQLErrors[0]?.extensions?.exception?.errors ?? {'graphQLError': 'Server error has ocurred, please try again'};
      setErrors(errors => ({...errors, ...graphQLErrors}));
      setAccessToken(null);
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setAccessToken, setUser]);

  const checkAndRefreshToken = useCallback(async () => {
    if (!accessToken || isTokenExpired(accessToken)) {
      await refreshAccessToken();
    }
  }, [accessToken, refreshAccessToken]);

  return (
    <AuthContext.Provider value={{user, accessToken, checkAndRefreshToken, errors, loading, login, logout, setErrors }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
