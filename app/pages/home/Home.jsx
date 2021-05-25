import React from 'react';
import styled from 'styled-components';

const CenteredContainer = styled.div`
  margin: 0 auto;
  text-align: center;
  vertical-align: middle;
`;

function Home() {
  
  return (
    <CenteredContainer>
      <div>
        <h1>HOME</h1>
      </div>
    </CenteredContainer>
  )
};

export default Home;
