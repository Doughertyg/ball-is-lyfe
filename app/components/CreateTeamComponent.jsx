import gql from 'graphql-tag';
import React, {useState} from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import styled from 'styled-components';
import { DetailsText, Divider, FlexContainer, PageHeader, SectionHeadingText } from '../styled-components/common';
import InputField from './InputField.jsx';
import PlayerSearchField from './PlayerSearchField.jsx';
import SearchField from './SearchField.jsx';

const Wrapper = styled.div`
  border-radius: 8px;
  background-color: rgba(139, 139, 139, 0.2);
  box-sizing: border-box;
  padding: 20px;
  width: 100%;
`;

const PLAYER_CAPTAIN_QUERY = gql`
  query($seasonID: ID!) {
    getCaptains(seasonID: $seasonID) {
      name
      profilePicture
      id
    }
  }
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
const CreatetTeamComponent = ({ seasonID }) => {
  const [name, setName] = useState("");
  const [players, setPlayers] = useState([]);
  const [captain, setCaptain] = useState("");

  const { loading: loadingCaptains, data: captains, error } = useQuery(PLAYER_CAPTAIN_QUERY, {
    variables: {seasonID}
  });
  console.log(loadingCaptains, captains, error);

  const filterCaptainResults = (entry, input) => {
    return entry?.name?.includes(input);
  };

  return (
    <Wrapper>
      <FlexContainer direction="column" height="100%" justify="flex-start" padding="0 8px" width="100%">
        <PageHeader margin="0px">Create team</PageHeader>
        <Divider width="100%" />
        <SectionHeadingText margin="8px 0 8px 0">Name</SectionHeadingText>
        <InputField errors={name == null ? 'Name cannot be blank.' : null} name="name" onChange={(input) => setName(input)} placeholder="Create sick team name..." width="100%" value={name} />
        <SectionHeadingText margin="8px 0 8px 0">Captain</SectionHeadingText>
        <DetailsText marginBottom="4px">Please select a captain (they will also be added as a player) </DetailsText>
        <SearchField filterResults={filterCaptainResults} label="Select a captain..." loading={loadingCaptains} onClick={(player) => setCaptain(player)} source={captains?.getCaptains ?? []} />
      </FlexContainer>
    </Wrapper>
  )
}

export default CreatetTeamComponent;
