import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';


import ProfileCircle from '../icons/profilecircle.svg';
import Icon from './Icon.jsx';
import Logout from '../icons/logout.svg';

/**
 * Navbar menu component
 * - collapsible
 * - shows just the user picture circle when collapsed
 * - shows picture and name when expanded
 * - has links for Home, Leagues, Seasons, Teams, Schedule, Settings, Logout
 */
const Navbar = ({ user, logoutCallback }) => {
  const [expanded, setExpanded] = useState(false);
  const getProfilePicture = user => (
    user.profilePicture ? (
      <img className='h-10 w-10 m-1 rounded-full mr-3' referrerPolicy="no-referrer" src={user.profilePicture} />
    ) : (
      <ProfileCircle className='w-12 h-12' />
    )
  )

  return (
    <>
      <div className={`w-screen absolute top-0 left-0 bg-slate-700 z-0 transition-opacity duration-500 h-screen ${expanded ? 'opacity-40' : 'opacity-0 pointer-events-none'}`} onClick={() => setExpanded(false)} />
      <div className={`z-50 bg-white flex flex-col fixed right-0 top-0 transition-[height_delay-1000,width] duration-500 ease-in-out p-2 overflow-hidden ${expanded ? 'w-96 h-full shadow-md' : 'w-16 h-16'}`}>
        <div className='flex flex-row'>
          {
            expanded ? (
              <div className='flex w-full justify-between items-center'>
                <NavLink className='flex items-center cursor-pointer' to={'/profile'}>
                  {getProfilePicture(user)}
                  <span className='text-slate-700 font-bold'>{user.name ?? user.username ?? 'Missing User Name'}</span>
                </NavLink>
                <Icon icon='close' onClick={() => setExpanded(false)} />
              </div>
            ) : (
              <div className='cursor-pointer' onClick={() => setExpanded(true)}>
                {getProfilePicture(user)}
              </div>
            )
          }
        </div>
        {
          expanded && 
          (
            <div className='flex flex-col justify-between h-full p-3 pb-0'>
              <dfiv className='flex flex-col'>
                <NavLink className='flex items-center p-1 h-10 cursor-pointer' to='/home'>
                  <span className='text-slate-700 font-bold font-sans hover:text-indigo-500'>Home</span>
                </NavLink>
                <NavLink className='flex items-center p-1 h-10 cursor-pointer' to='/leagues'>
                  <span className='text-slate-700 font-bold font-sans hover:text-indigo-500'>Leagues</span>
                </NavLink>
                <NavLink className='flex items-center p-1 h-10 cursor-pointer' to='/seasons'>
                  <span className='text-slate-700 font-bold font-sans hover:text-indigo-500'>Seasons</span>
                </NavLink>
                <NavLink className='flex items-center p-1 h-10 cursor-pointer' to='/teams'>
                  <span className='text-slate-700 font-bold font-sans hover:text-indigo-500'>Teams</span>
                </NavLink>
                <NavLink className='flex items-center p-1 h-10 cursor-pointer' to='/schedule'>
                  <span className='text-slate-700 font-bold font-sans hover:text-indigo-500'>Schedule</span>
                </NavLink>
              </dfiv>
              <NavLink onClick={logoutCallback} to='/login'>
                <div className='hover:text-red-500 flex'>
                  <Logout />
                  <span className='ml-2'>Logout</span>
                </div>
              </NavLink>
            </div>
          )
        }
      </div>
    </>
  )
}

export default Navbar;
