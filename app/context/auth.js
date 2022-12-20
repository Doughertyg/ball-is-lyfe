import React, {createContext, useEffect, useReducer } from 'react';
import jwtDecode from 'jwt-decode';

const initialState = {
  user: null
}

if (localStorage.getItem('jwtToken')) {
  const decodedToken = jwtDecode(localStorage.getItem('jwtToken'));

  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem('jwtToken');
  } else {
    initialState.user = decodedToken;
    console.log('initial state user created from decoded token: ', initialState.user);
  }
}

const AuthContext = createContext({
  user: null,
  checkIsTokenValid: () => {},
  login: (data) => {},  
  logout: () => {}
})

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
    console.log('checkIsTokenValid RUN');
    if (localStorage.getItem('jwtToken')) {
      const decodedToken = jwtDecode(localStorage.getItem('jwtToken'));
    
      // is token expired?
      if (decodedToken.exp * 1000 < Date.now()) {
        console.log('token expired, logout user');
        localStorage.removeItem('jwtToken');
        dispatch({
          type: 'LOGOUT'
        })
      }
    }
  }

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
