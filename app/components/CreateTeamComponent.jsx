import gql from 'graphql-tag';
import React, {useContext, useState} from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import styled from 'styled-components';
import { DetailsText, Divider, FlexContainer, PageHeader, SectionHeadingText } from '../styled-components/common';
import InputField from './InputField.jsx';
import PlayerSearchField from './PlayerSearchField.jsx';
import SearchField from './SearchField.jsx';
import CompactPlayerCard from './CompactPlayerCard.jsx';
import { AuthContext } from '../context/auth';
import Button from './Button.jsx';

const Wrapper = styled.div`
  border-radius: 8px;
  background-color: rgba(139, 139, 139, 0.2);
  box-sizing: border-box;
  padding: 20px;
  width: 100%;
`;

const PLAYER_CAPTAIN_QUERY = gql`
  query($seasonID: ID!, $userID: ID!) {
    getCaptains(seasonID: $seasonID) {
      name
      profilePicture
      id
    }
    getSeasonByID(seasonID: $seasonID, userID: $userID) {
      season {
        players {
          email
          id
          name
          username
          profilePicture
        }
      }
    }
  }
`;

const CREATE_TEAM_MUTATION = gql`
  mutation createTeam(
    $bannerPicture: String,
    $captain: ID!,
    $description: String,
    $name: String!,
    $players: [ID]!,
    $profilePicture: String,
    $seasonID: ID,
    $sport: String
  ) {
    createTeam(
      bannerPicture: $bannerPicture,
      captain: $captain,
      description: $description,
      name: $name,
      players: $players,
      profilePicture: $profilePicture,
      seasonID: $seasonID,
      sport: $sport
    ) {
      teamInstance {
        id
        captain {
          email
          name
          profilePicture
          username
        }
        players {
          email
          name
          profilePicture
          username
        }
        team {
          name
        }
      }
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
const CreatetTeamComponent = ({ onCancel, onComplete, seasonID }) => {
  const [name, setName] = useState("");
  const [players, setPlayers] = useState({});
  const [captain, setCaptain] = useState(null);
  const { user } = useContext(AuthContext);

  const [createTeam, { isSubmitting }] = useMutation(CREATE_TEAM_MUTATION, {
    onCompleted: (res) => {
      onComplete?.(res);
    },
    onError: (error) => {
      console.log('error creating team: ', JSON.stringify(error, null, 2));
    },
  })

  const { loading, data, error } = useQuery(PLAYER_CAPTAIN_QUERY, {
    variables: {seasonID, userID: user.id}
  });

  const filterCaptainResults = (entry, input) => {
    return entry?.name?.includes(input);
  };

  const filterPlayerResults = (entry, input) => {
    return entry?.name?.includes(input)
      || entry?.username?.includes(input)
      || entry?.email?.includes(input);
  }

  const addRemovePlayers = (player) => {
    const newPlayers = {...players};
    if (!newPlayers[player.id]) {
      newPlayers[player.id] = player;
    } else {
      delete newPlayers[player.id];
    }
    setPlayers(newPlayers);
  }

  const onSubmit = () => {
    createTeam({
      variables: {
        name,
        players: Object.keys(players) ?? [],
        captain: captain?.id,
        seasonID
      }
    });
  }

  return (
    <Wrapper>
      <FlexContainer direction="column" height="100%" justify="flex-start" overflow="visible" padding="0 8px" width="100%">
        <PageHeader margin="0px">Create team</PageHeader>
        <Divider width="100%" />
        <SectionHeadingText margin="8px 0 8px 0">Name</SectionHeadingText>
        <InputField errors={name === "" ? 'Name cannot be blank.' : null} loading={isSubmitting} name="name" onChange={(input) => setName(input)} placeholder="Create sick team name..." width="100%" value={name} />
        <SectionHeadingText margin="8px 0 8px 0">Captain</SectionHeadingText>
        <DetailsText marginBottom="4px">Please select a captain (they will also be added as a player) </DetailsText>
        <SearchField filterResults={filterCaptainResults} label="Select a captain..." loading={loading || isSubmitting} onClick={(player) => setCaptain(player)} source={data?.getCaptains ?? []} />
        {captain != null && (
          <CompactPlayerCard
            name={captain.name}
            onClick={() => setCaptain(null)}
            picture={captain.profilePicture}
            subLabel={captain.email}
          />
        )}
        <SectionHeadingText margin="8px 0 8px 0">Players</SectionHeadingText>
        <SearchField filterResults={filterPlayerResults} label="Search players..." loading={loading || isSubmitting} onClick={addRemovePlayers} selected={players} source={data?.getSeasonByID?.season?.players ?? []} />
        <FlexContainer flexWrap="wrap" justify="flex-start">
          {Object.values(players).map((player, idx) => (
            <CompactPlayerCard
              key={`players-${player.id}-${idx}`}
              name={player?.name ?? player?.username}
              onClick={addRemovePlayers}
              picture={player.profilePicture}
              subLabel={player.email}
            />
          ))}
        </FlexContainer>
        <FlexContainer justify="center" marginTop="12px">
          <Button isDisabled={false} label="Cancel" loading={isSubmitting} onClick={onCancel} />
          <Button isLoading={false} label="Create Team" loading={isSubmitting} onClick={onSubmit} />
        </FlexContainer>
      </FlexContainer>
    </Wrapper>
  )
}

export default CreatetTeamComponent;
