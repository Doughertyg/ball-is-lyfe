import React from 'react';
import { useState } from 'react';
import { NavLink, useRouteMatch, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
  border-bottom: 1px solid lightgrey;
`;

const FlexContainer = styled.div`
  align: center;
  display: flex;
  flex-direction: row;
  width: ${props => props.width ?? 'auto'};
`;

const FlexComponent = styled.div`
  flex-grow: 1;
`;

const ButtonContainer = styled.div`
  && {
    color: ${props => props.active ? 'teal' : 'black'};
    text-decoration: none;
    padding: 12px 8px;
    border-bottom: ${props => props.active ? '3px solid teal' : 'none'};
    box-sizing: border-box;
  }
  
`;

function MenuBar({ match }) {
  const path = useLocation()?.pathname;
  const [ active, setActive ] = useState(path === '/' ? 'home' : path.split('/')[1]);

  return (
    <Wrapper>
      <FlexContainer width={'100%'}>
          <ButtonContainer active={active === "home"}>
            <NavLink onClick={() => setActive("home")} exact to="/">
              Home
            </NavLink>
          </ButtonContainer>
          <FlexComponent />
          <FlexContainer>
            <ButtonContainer active={active === "login"}>
              <NavLink onClick={() => setActive("login")} exact exact to="/login">
                Login
              </NavLink>
            </ButtonContainer>
            <ButtonContainer active={active === "register"}>
              <NavLink onClick={() => setActive("register")} exact exact to="/register">
                Register
              </NavLink>
            </ButtonContainer>
          </FlexContainer>
      </FlexContainer>
    </Wrapper>
  )
}

export default MenuBar;
