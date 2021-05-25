import React from 'react';
import styled from 'styled-components';

const CenteredContainer = styled.div`
  margin: 0 auto;
  text-align: center;
  vertical-align: middle;
`;

function Login() {
  
  return (
    <CenteredContainer>
      <div>
        <h1>
          LOGIN
        </h1>
      </div>
    </CenteredContainer>
  )
};

export default Login;
