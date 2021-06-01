import React, {createContext, useReducer } from 'react';
import jwtDecode from 'jwt-decode';

const initialState = {
  user: null
}

if (localStorage.getItem('jwtToken')) {
  const decodedToken = jwtDecode(localStorage.getItem('jwtToken'));
  console.log('decodedToken: ', decodedToken);

  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem('jwtToken');
  } else {
    initialState.user = decodedToken;
  }
}

const AuthContext = createContext({
  user: null,
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
    console.log('data: ', data);
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

  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout}}
      {...props}
    />
  )
}

export { AuthContext, AuthProvider }
