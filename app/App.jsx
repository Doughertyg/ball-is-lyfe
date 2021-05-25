import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import styled from 'styled-components';

import Home from './pages/home/Home.jsx';
import Login from './pages/login/Login.jsx';
import Register from './pages/register/Register.jsx';
import MenuBar from './components/MenuBar.jsx';

const CommonPageLayout = styled.div`
  color: black !important;
  font-family: Arial !important;
  max-width: 1000px;
  margin: 0 auto;
`;

function App() {
  return (
    <Router>
      <CommonPageLayout>
        <MenuBar />
        <Route exact path='/' component={Home} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register} />
      </CommonPageLayout>
    </Router>
  )
}

export default App;
