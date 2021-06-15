import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import styled from 'styled-components';

import { AuthProvider } from './context/auth';
import Home from './pages/home/Home.jsx';
import Login from './pages/login/Login.jsx';
import Register from './pages/register/Register.jsx';
import MenuBar from './components/MenuBar.jsx';
import AuthRoute from './pages/authRoute/AuthRoute.jsx';
import Post from './pages/Post/Post.jsx';

import {CommonPageLayout} from './styled-components/common';

function App() {
  return (
    <AuthProvider>
      <Router>
        <CommonPageLayout>
          <MenuBar />
          <Route exact path='/' component={Home} />
          <AuthRoute exact path='/login' component={Login} />
          <AuthRoute exact path='/register' component={Register} />
          <Route exact path="/posts/:postId" component={Post} />
        </CommonPageLayout>
      </Router>
    </AuthProvider>   
  )
}

export default App;
