import React from 'react';
import InputField from '../../components/InputField.jsx';
import {useState} from 'react';
import useNewLeagueFormHook from '../../hooks/useNewLeagueFormHook';
import {useHistory} from 'react-router';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import {
  BodyText,
  CardText,
  DetailsText,
  Divider,
  FlexContainer,
  PageHeader,
  SectionHeadingText,
  ScrollableContainer
} from '../../styled-components/common';
import Button from '../../components/Button.jsx';
import AddPlayerSection from '../../components/AddPlayerSection.jsx';
import PlayerSearchField from '../../components/PlayerSearchField.jsx';
import styled from 'styled-components';

const RowWrapper = styled.div`
  padding: 8px;
`;

const CREATE_LEAGUE = gql`
  mutation createLeague(
    $name: String!
    $description: String!
    $location: String!
    $sport: String!
    $profilePicture: String!
    $players: [ID]
    $bannerPicture: String!
  ) {
    createLeague(
      leagueInput: {
        name: $name
        description: $description
        location: $location
        sport: $sport
        players: $players
        profilePicture: $profilePicture
        bannerPicture: $bannerPicture
      }
    ) {
      _id
      name
      description
      sport
      createdAt
    }
  }
`;

/**
 * Create league page for creating a new league
 * 
 *     ,~-----------------------------------~,
 *     | New League                          |
 *     |                                     |
 *     | Name :```````````````````````````:  |
 *     | Bio  :```````````````````````````:  |
 *     | Sport :``````````````````````````:  |
 *     |        ``````````````````````````   |
 *     | Location :```````````````````````:  |
 *     |           ```````````````````````   |
 *     | Photo :``````````````````````````:  |
 *     |        ``````````````````````````   |
 *     | Banner Photo: :```````````````````: |
 *     |                ```````````````````  |
 *     | Players (+)                         |
 *     | :'`````````': :'`````````': :'``````|
 *     | |   ,---,   | |           | |       |
 *     | |  | *  *|  | |           | |       |
 *     | |   \   /   | |           | |       |
 *     | |   Player  | |  Player   | |  Playe|
 *     | `;_________;` `;_________;` `;______|
 *     |                                     |
 *     |                                     |
 *     |                                     |
 *      `-----------------------------------"
 */
export default function LeagueNewPage() {
  const [errors, setErrors] = useState({});
  const history = useHistory();

  const {inputs, setters, validate} = useNewLeagueFormHook();
  const { players } = inputs;
  const { setPlayers } = setters;

  const [createLeague, { loading }] = useMutation(CREATE_LEAGUE, {
    onCompleted: (res) => {
      history.push(`/home`);
    },
    onError: (error) => {
      console.log('stringified error on mutation:  ', JSON.stringify(error, null, 2));
      const graphQLErrors = error.message ? {error: error.message} : error?.graphQLErrors[0]?.extensions?.exception?.errors ?? {'graphQLError': 'Server error has ocurred, please try again'};
      setErrors({...errors, ...graphQLErrors});
    },
    update(proxy, { data: { newLeague: userData }}) {
      console.log('results: ', userData);
    }
  })

  const onSubmit = () => {
    const errors = validate();
    setErrors(errors);
    

    if (Object.keys(errors).length === 0) {
      const input = {
        variables: {
          name: inputs.name,
          description: inputs.description,
          location: inputs.location,
          sport: inputs.sport,
          players: Object.keys(players) ?? [],
          profilePicture: inputs.profilePicture ?? '',
          bannerPicture: inputs.bannerPicture ?? '',
        }
      };
      createLeague(input);
    }
  }

  const onSelectPlayer = (player) => {
    if (!players[player.id]) {
      const newPlayersMap = {...players};
      newPlayersMap[player.id] = player;
      setPlayers(newPlayersMap);
    } else {
      const newPlayersMap = {...players};
      delete newPlayersMap[player.id];      
      setPlayers(newPlayersMap);
    }
  }
  
  return (
    <FlexContainer direction="column" height="100%" justify="flex-start" margin="0 auto" maxWidth="800px" padding="0 12px" width="100%">
      <PageHeader margin="20px auto">New League</PageHeader>
      <Divider />
      <FlexContainer direction="column" height="100%" justify="flex-start" padding="0 8px">
        <SectionHeadingText margin="24px 0 8px 0">Name</SectionHeadingText>
        <InputField errors={errors.name ?? null} onChange={setters.setName} width="100%" value={inputs.name} />
        <SectionHeadingText margin="24px 0 8px 0">Description</SectionHeadingText>
        <InputField errors={errors.description ?? null} onChange={setters.setDescription} width="100%" value={inputs.description} />
        <SectionHeadingText margin="24px 0 8px 0">Sport</SectionHeadingText>
        <InputField errors={errors.sport ?? null} onChange={setters.setSport} width="100%" value={inputs.sport} />
        <SectionHeadingText margin="24px 0 8px 0">Location</SectionHeadingText>
        <InputField errors={errors.location ?? null} onChange={setters.setLocation} width="100%" value={inputs.location} />
        <SectionHeadingText margin="24px 0 8px 0">Players</SectionHeadingText>
        <AddPlayerSection
          isSubmitting={loading}
          onClose={() => setPlayers({})}
          onSelectPlayer={onSelectPlayer}
          selectedPlayers={players}/>
        <Divider marginTop="32px" width="100%" />
        <FlexContainer shrink="0" marginTop="32px">
          <Button label="Cancel" marginTop="4px" onClick={() => {history.goBack()}} />
          <Button label="Create League" marginTop="4px" onClick={onSubmit} />
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  )
}
