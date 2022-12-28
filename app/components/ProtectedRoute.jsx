import React, { useContext, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useHistory } from 'react-router';

import { AuthContext } from '../context/auth';

function ProtectedRoute({ component, ...rest }) {
  const { user, checkIsTokenValid } = useContext(AuthContext);
  const history = useHistory();

  if (user == null) {
    history.push('/');
    return null;
  }

  useEffect(() => {
    console.log('useffect in protected route');
    checkIsTokenValid();
  }, [])

  return (
    <Route
      {...rest}
      component={component}
    />
  )
}

export default ProtectedRoute;
