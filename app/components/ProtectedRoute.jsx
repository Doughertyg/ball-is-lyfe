import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useHistory } from 'react-router';

import { AuthContext } from '../context/auth';

function ProtectedRoute({ component, ...rest }) {
  const { user } = useContext(AuthContext);
  const history = useHistory();

  if (user == null) {
    console.log('user is null');
    history.push('/');
    return null;
  }

  return (
    <Route
      {...rest}
      component={component}
    />
  )
}

export default ProtectedRoute;
