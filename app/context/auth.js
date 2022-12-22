import React, {createContext, useEffect, useReducer } from 'react';
import jwtDecode from 'jwt-decode';
import gql from 'graphql-tag';
import { useLazyQuery } from '@apollo/react-hooks';

const initialState = {
  user: null
}

if (localStorage.getItem('jwtToken')) {
  const decodedToken = jwtDecode(localStorage.getItem('jwtToken'));

  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem('jwtToken');
  } else {
    initialState.user = decodedToken;
  }
}

const AuthContext = createContext({
  user: null,
  checkIsTokenValid: () => {},
  login: (data) => {},  
  logout: () => {}
})

const USER_QUERY = gql`
  query($token: String!) {
    getUserContext(token: $token) {
      id
      name
      profilePicture
      email
      username
    }
  }
`;

function authReducer(state, action) {
  switch(action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.value
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null
      }
    default: 
      return state;
  }
}

function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const [loadUserData, { called }] = useLazyQuery(
    USER_QUERY
  )

  const login = (data) => {
    localStorage.setItem('jwtToken', data.token);

    dispatch({
      type: 'LOGIN',
      value: data
    })
  }

  const logout = () => {
    localStorage.removeItem('jwtToken');
    dispatch({
      type: 'LOGOUT'
    })
  }

  const checkIsTokenValid = () => {
    if (localStorage.getItem('jwtToken')) {
      const decodedToken = jwtDecode(localStorage.getItem('jwtToken'));
    
      // is token expired?
      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem('jwtToken');
        dispatch({
          type: 'LOGOUT'
        })
      }
    }
  }

  /**
   * if the page is refreshed with a valid token in storage
   * but the user object in state is null or does not include userID
   * refresh/rehydrate the user object from the backend
   */
  useEffect(() => {
    if (localStorage.getItem('jwtToken') && (state?.user == null || state?.user?.id == null) && !called) {
      loadUserData({ variables: { token: localStorage.getItem('jwtToken') }}).then(res => {
        dispatch({
          type: 'LOGIN',
          value: {...res.data.getUserContext}
        })
      })
    }
  }, [state.user, called]);

  useEffect(() => {
    console.log('IN USE EFFECT');
    checkIsTokenValid();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user: state.user, checkIsTokenValid, login, logout}}
      {...props}
    />
  )
}

export { AuthContext, AuthProvider }
