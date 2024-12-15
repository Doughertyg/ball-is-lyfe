import React, { useContext, useEffect, useMemo } from 'react';
import { useState } from 'react';
import { NavLink, useRouteMatch, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { AuthContext } from '../context/auth';
import Navbar from './Navbar.jsx';
import {ButtonContainer, FlexContainer, ProfilePictureThumb} from '../styled-components/common';

const Wrapper = styled.div`
  border-bottom: 1px solid lightgrey;
`;

const FlexComponent = styled.div`
  flex-grow: 1;
`;

const Offset = styled.div`
  width: 72px;
`;

function MenuBar({ match }) {
  const path = useLocation()?.pathname;
  const [ active, setActive ] = useState(path === '/' ? 'home' : path.split('/')[1]);
  const { user, logout } = useContext(AuthContext);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => {
      setInnerWidth(window.innerWidth);
    }

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className='shadow-md h-16 shrink-0 w-full flex items-center justify-between px-1'>
      <NavLink className='flex items-center mx-3' to={user ? '/home' : '/'}>
        <span className='text-indigo-500 font-extrabold font-sans text-5xl tracking-wide italic'>RLN</span>
      </NavLink>
      {user ?
        (
          <Navbar user={user} logoutCallback={logout} />
        ) : (
          <div className='text-slate-700 flex items-center px-1 h-full font-bold font-sans px-3 hover:text-indigo-500'>
            <NavLink  onClick={() => setActive('login')} exact to="/login">
              Login
            </NavLink>
          </div>
        )
      }
    </div>
  )
}

export default MenuBar;
