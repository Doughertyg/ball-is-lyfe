import React, { useContext, useEffect, useMemo } from 'react';
import { useState } from 'react';
import { NavLink, useRouteMatch, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { AuthContext } from '../context/auth';
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
    <Wrapper>
      <FlexContainer backgroundColor="rgba(239, 239, 239, 1)" width={'100%'}>
        {user ?
          (<>
            <ButtonContainer active={active === 'home'}>
              <NavLink onClick={() => setActive('home')} exact to="/home">
                Home
              </NavLink>
            </ButtonContainer>
            <FlexComponent>
              <FlexContainer alignItems="center" height="43px" overFlow="hidden">
                {innerWidth > 600 && (
                  <>
                    <Offset />
                    <NavLink to="/">
                      <img referrerPolicy="no-referrer" height={310} src="./logo.jpeg" />
                    </NavLink>
                  </>)}
              </FlexContainer>
            </FlexComponent>
            <FlexContainer>
              <ButtonContainer>
                <NavLink onClick={logout} exact to="/login">
                  Logout
                </NavLink>
              </ButtonContainer>
              <ButtonContainer active={active === 'profile'} padding="none">
                <NavLink onClick={() => setActive('profile')} exact to="/profile">
                  <FlexContainer alignItems="center">
                    {user.name?.split(' ')[0] ?? user.username}
                    <ProfilePictureThumb referrerPolicy="no-referrer" src={user.profilePicture} />
                  </FlexContainer>
                </NavLink>
              </ButtonContainer>
            </FlexContainer>
          </>
          ) : (
            <>
              <ButtonContainer active={active === 'home'}>
                <NavLink onClick={() => setActive("home")} exact to="/">
                  Home
                </NavLink>
              </ButtonContainer>
              <FlexComponent>
                <FlexContainer alignItems="center" height="43px" overFlow="hidden">
                  <Offset />
                  <NavLink to="/">
                    <img referrerPolicy="no-referrer" height={310} src="./logo.jpeg" />
                  </NavLink>
                </FlexContainer>
              </FlexComponent>
              <FlexContainer>
                <ButtonContainer active={active === "login"}>
                  <NavLink onClick={() => setActive('login')} exact to="/login">
                    Login
                  </NavLink>
                </ButtonContainer>
                <ButtonContainer active={active === "register"}>
                  <NavLink onClick={() => setActive("register")} exact to="/register">
                    Register
                  </NavLink>
                </ButtonContainer>
              </FlexContainer>
            </>
          )
        }
      </FlexContainer>
    </Wrapper>
  )
}

export default MenuBar;
