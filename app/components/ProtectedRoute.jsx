import React, { useContext, useEffect } from 'react';
import { Route } from 'react-router-dom';
import { useHistory } from 'react-router';

import { AuthContext } from '../context/auth';

function ProtectedRoute({ component, fallback, ...rest }) {
  const { loadingUser, checkAndRefreshToken } = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    console.log('useffect in protected route');
    checkAndRefreshToken()
    .catch((err) => {
      history.push('/');
    });
  }, [])

  return (
    <Route
      {...rest}
      component={fallback && loadingUser ? fallback : component}
    />
  )
}

export default ProtectedRoute;
