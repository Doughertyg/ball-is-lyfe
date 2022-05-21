import React, {useContext} from 'react';
import {useHistory} from 'react-router';
import { AuthContext } from '../../context/auth';

/**
 * Page for creating a new season
 * 
 * 
 */
const SeasonNewPage = ({match}) => {
  const { user } = useContext(AuthContext);
  const history = useHistory();

  if (user == null) {
    history.push('/login');
  }

  return (<>New Season Page</>)
}

export default SeasonNewPage;
