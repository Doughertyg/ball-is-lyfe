import React, {useEffect} from 'react';
import { BrowserRouter as Routes, Route, Switch, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import {gapi} from 'gapi-script';

import { AuthProvider } from './context/auth';
import Home from './pages/home/Home.jsx';
import Login from './pages/login/Login.jsx';
import Register from './pages/register/Register.jsx';
import MenuBar from './components/MenuBar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AuthRoute from './pages/authRoute/AuthRoute.jsx';
import Post from './pages/Post/Post.jsx';
import Season from './pages/season/Season.jsx';
import LeagueNewPage from './pages/league/LeagueNewPage.jsx';
import SeasonNewPage from './pages/season/SeasonNewPage.jsx';
import SplashPage from './pages/splashPage/SplashPage.jsx';

import {CommonPageLayout, FlexContainer} from './styled-components/common';
import League from './pages/league/LeaguePage.jsx';

import './input.css';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const Wrapper = styled.div`
  background-color: white;
  height: 100%;
  width: 100vw;
`;

const ScrollContainer = styled.div`
  height: calc(100vh - 44px);
  max-width: 1000px;
  overflow: scroll;
  width: ${props => props.width ?? 'auto'};
  ::-webkit-scrollbar {
    display: none;
  }
`;

function App() {
  useEffect(() => {
    const initClient = () => {
          gapi.client.init({
          clientId: CLIENT_ID,
          scope: 'profile'
        });
     };
     gapi.load('client:auth2', initClient);
 }, []);

  return (
    <AuthProvider>
      <Routes>
        <div className="flex flex-col w-full h-screen">
          <MenuBar />
          <div className='w-full h-full no-scrollbar overflow-y-scroll'>
            <Switch>
              <ProtectedRoute exact path='/home' component={Home} />
              <AuthRoute exact path='/login' component={Login} />
              <AuthRoute exact path='/register' component={Register} />
              <ProtectedRoute exact path="/posts/:postId" component={Post} />
              <ProtectedRoute exact path="/season/:seasonID" component={Season} />
              <ProtectedRoute exact path="/league/new" component={LeagueNewPage} />
              <ProtectedRoute exact path="/league/:leagueID" component={League} />
              <ProtectedRoute exact path="/league/:leagueID/season/new" component={SeasonNewPage} />
              <Route exact path='/' component={SplashPage} />
              <Route exact render={() => <Redirect to="/" />} />
            </Switch>
          </div>
        </div>
      </Routes>
    </AuthProvider>   
  )
}

export default App;
