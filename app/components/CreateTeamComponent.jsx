import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  border-radius: 8px;
  background-color: rgba(155, 140, 140, 0.2);
  box-sizing: border-box;
  padding: 20px;
  width: 100%;
`;

/**
 * Component for creating a team
 * Can create a team attached to a season
 * The current user is made the team captain if not otherwise set
 * 
 *  ___________________________________________________________
 *  ,---------------------------------------------------------,
 *  |   ,--------------------------.                          |
 *  |  |     Name...                |   Captain: __________   |
 *  |   `--------------------------`                          |
 *  |   ,----------------------------.                        |
 *  |  |   Add Player...              |                       |
 *  |   '----------------------------'                        |
 *  |   .-------------------,                                 |
 *  |  |  Graham D.       X  |                                |
 *  |   `-------------------`                                 |
 *  |                                                         |
 *  |                                                         |
 *  |              ( Cancel )    ( Create Team )              |
 *  `---------------------------------------------------------`
 * 
 */
const CreatetTeamComponent = () => {

  return (
    <Wrapper>
      Create Team component
    </Wrapper>
  )
}

export default CreatetTeamComponent;
