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
    $bannerPicture: String!
  ) {
    createLeague(
      leagueInput: {
        name: $name
        description: $description
        location: $location
        sport: $sport
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
  const [players, setPlayers] = useState({});
  const history = useHistory();

  const {inputs, setters, validate} = useNewLeagueFormHook();

  const [createLeague, { loading }] = useMutation(CREATE_LEAGUE, {
    onCompleted: (res) => {
      console.log('onCompleted mutation: res:  ', res);
      onMutationCompleted?.();
      history.push(`/`);
    },
    onError: (error) => {
      console.log('stringified error on mutation:  ', JSON.stringify(error, null, 2));
    },
    update(proxy, { data: { newLeague: userData }}) {
      console.log('results: ', userData);
    },
    variables: {
      name: inputs.name,
      description: inputs.description,
      location: inputs.location,
      sport: inputs.sport,
      players: inputs.players ?? [],
      profilePicture: inputs.profilePicture ?? '',
      bannerPicture: inputs.bannerPicture ?? '',
    }
  })

  const onSubmit = () => {
    const errors = validate();
    setErrors(errors);
    

    if (Object.keys(errors).length === 0) {
      console.log('no errors! mutation submitted');
      createLeague();
    }
  }

  const onSelectPlayer = (player) => {
    const idxOfPlayer = inputs.players.indexOf(player.id);
    console.log('selected player: ', player);

    if (idxOfPlayer === -1) {
      // set values in input and in obj map
      const newPlayersArray = [...inputs.players];
      newPlayersArray.push(player.id);
      const newPlayersMap = {...players};
      newPlayersMap[player.id] = player;
      console.log('new stuff: ', newPlayersArray, ' map: ', newPlayersMap);
      setPlayers(newPlayersMap);
      setters.setPlayers(newPlayersArray);
    } else {
      const newPlayersArray = [...inputs.players];
      newPlayersArray.splice(idxOfPlayer, 1);
      const newPlayersMap = {...players};
      delete newPlayersMap[player.id];
      
      setPlayers(newPlayersMap);
      setters.setPlayers(newPlayersArray);
    }
  }
  
  return (
    <FlexContainer alignItems="center" direction="column" height="100%" justify="flex-start" width="100%">
      <PageHeader>New League</PageHeader>
      <Divider />
      <FlexContainer direction="column" height="100%" justify="flex-start">
        <SectionHeadingText margin="8px 0">Name</SectionHeadingText>
        <InputField errors={errors.name ?? null} onChange={setters.setName} width="700px" value={inputs.name} />
        <SectionHeadingText margin="8px 0">Description</SectionHeadingText>
        <InputField errors={errors.description ?? null} onChange={setters.setDescription} width="700px" value={inputs.description} />
        <SectionHeadingText margin="8px 0">Sport</SectionHeadingText>
        <InputField errors={errors.sport ?? null} onChange={setters.setSport} width="700px" value={inputs.sport} />
        <SectionHeadingText margin="8px 0">Location</SectionHeadingText>
        <InputField errors={errors.location ?? null} onChange={setters.setLocation} width="700px" value={inputs.location} />
        <SectionHeadingText margin="8px 0">Players</SectionHeadingText>
        <PlayerSearchField onClick={onSelectPlayer} />
        {Object.keys(players).length > 0 && (
            <ScrollableContainer>
              {Object.values(players).map((player, idx) => (
                <div key={player.id}>
                  {idx !== 0 && <Divider marginTop="0" />}
                  <RowWrapper >
                    <FlexContainer alignItems="center" justify="space-between">
                      <BodyText>
                        {player.username}
                      </BodyText>
                        <DetailsText onClick={() => onSelectPlayer(player)}>remove</DetailsText>
                    </FlexContainer>
                  </RowWrapper>
                </div>
              ))}
            </ScrollableContainer>)}
        <FlexContainer marginTop="16px">
          <Button label="Cancel" onClick={() => {history.goBack()}} />
          <Button label="Create League" onClick={onSubmit} />
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  )
}
