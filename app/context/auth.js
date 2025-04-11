import React, {createContext, useState, useCallback } from 'react';
import jwtDecode from 'jwt-decode';
import { LOGIN_WITH_GOOGLE_MUTATION, LOGOUT_MUTATION, REFRESH_TOKEN_MUTATION } from '../../graphql/mutations/userMutations';

const AuthContext = createContext({
  user: null,
  accessToken: null,
  checkAndRefreshToken: () => {},
  errors: {},
  loadingUser: false,
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
  const [loadingUser, setLoadingUser] = useState(false);
  const [errors, setErrors] = useState({});

  const login = useCallback(async (googleToken) => {
    setLoadingUser(true);

    try {
      const res = await fetch('/graphql', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: LOGIN_WITH_GOOGLE_MUTATION(googleToken) })
      });

      const json = await res.json();
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
    } catch (err) {
      console.log('Error in the onGoogleAuthError callback: ', err);
      const graphQLErrors = err.message ? {err: err.message} : err?.graphQLErrors[0]?.extensions?.exception?.errors ?? {'graphQLError': 'Server error has ocurred, please try again'};
      setErrors(errors => ({...errors, ...graphQLErrors}));
      setAccessToken(null);
      setUser(null);
      throw err;
    }

    setLoadingUser(false);
  }, [setErrors, setUser, setAccessToken]);

  const logout = useCallback(async () => {
    try {
      await fetch('/graphql', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: LOGOUT_MUTATION })
      });
    } catch (err) {
      console.log('Error calling logout mutation: ', err);
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }, [setAccessToken, setUser]);

  const refreshAccessToken = useCallback(async () => {
    setLoadingUser(true);

    try {
      const res = await fetch('/graphql', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: REFRESH_TOKEN_MUTATION })
      });
      const json = await res.json();
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
    }

    setLoadingUser(false);
  }, [setAccessToken, setUser]);

  const checkAndRefreshToken = useCallback(async () => {
    if (!accessToken || isTokenExpired(accessToken)) {
      await refreshAccessToken();
    }
  }, [accessToken, refreshAccessToken]);

  return (
    <AuthContext.Provider value={{user, accessToken, checkAndRefreshToken, errors, login, logout, setErrors }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
