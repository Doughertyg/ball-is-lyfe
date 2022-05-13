import React from 'react';
import { BrowserRouter as Routes, Route, Switch, Redirect } from 'react-router-dom';
import styled from 'styled-components';

import { AuthProvider } from './context/auth';
import Home from './pages/home/Home.jsx';
import Login from './pages/login/Login.jsx';
import Register from './pages/register/Register.jsx';
import MenuBar from './components/MenuBar.jsx';
import AuthRoute from './pages/authRoute/AuthRoute.jsx';
import Post from './pages/Post/Post.jsx';
import Season from './pages/season/Season.jsx';
import LeagueNewPage from './pages/league/LeagueNewPage.jsx';

import {CommonPageLayout} from './styled-components/common';
import League from './pages/league/LeaguePage.jsx';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <CommonPageLayout>
          <MenuBar />
          <Switch>
            <Route exact path='/' component={Home} />
            <AuthRoute exact path='/login' component={Login} />
            <AuthRoute exact path='/register' component={Register} />
            <Route exact path="/posts/:postId" component={Post} />
            <Route exact path="/season/:seasonID" component={Season} />
            <Route exact path="/league/new" component={LeagueNewPage} />
            <Route exact path="/league/:leagueID" component={League} />
            <Route exact render={() => <Redirect to="/" />} />
          </Switch>
        </CommonPageLayout>
      </Routes>
    </AuthProvider>   
  )
}

export default App;
