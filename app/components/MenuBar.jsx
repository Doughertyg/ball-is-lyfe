import React, { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { AuthContext } from '../context/auth';
import Navbar from './Navbar.jsx';

function MenuBar() {
  const path = useLocation()?.pathname || '/';
  const { user, logout } = useContext(AuthContext);

  const authLink = path === '/register'
    ? { to: '/login', label: 'LOGIN' }
    : path === '/login'
      ? { to: '/register', label: 'REGISTER' }
      : null;

  return (
    <div className='shadow-lg z-10 h-16 shrink-0 w-full flex items-center justify-between px-1'>
      <NavLink className='flex items-center mx-3' to={user ? '/home' : '/'}>
        <span className='text-indigo-500 font-extrabold font-sans text-5xl tracking-wide italic'>RLN</span>
      </NavLink>
      {user ? (
        <Navbar user={user} logoutCallback={logout} />
      ) : (
        <div className='flex items-center h-full px-3 gap-4 font-bold font-sans text-slate-700'>
          {authLink ? (
            <NavLink className='hover:text-indigo-500 uppercase' exact to={authLink.to}>
              {authLink.label}
            </NavLink>
          ) : (
            <>
              <NavLink className='hover:text-indigo-500' exact to='/login'>
                Login
              </NavLink>
              <NavLink className='hover:text-indigo-500' exact to='/register'>
                Register
              </NavLink>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default MenuBar;
