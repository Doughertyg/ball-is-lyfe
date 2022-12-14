import React, {useContext, useState} from 'react';
import InputField from '../../components/InputField.jsx';
import {useHistory} from 'react-router';
import { AuthContext } from '../../context/auth';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import {
  BodyText,
  DetailsText,
  Divider,
  FlexContainer,
  PageHeader,
  SectionHeadingText,
  ScrollableContainer
} from '../../styled-components/common';
import Button from '../../components/Button.jsx';
import PlayerSearchField from '../../components/PlayerSearchField.jsx';
import useNewSeasonFormHook from '../../hooks/useNewSeasonFormHook';
import styled from 'styled-components';

const Wrapper = styled.div`
  height: auto;
`;

const RowWrapper = styled.div`
  padding: 8px;
`;

const CREATE_SEASON = gql`
  mutation createSeason(
    $name: String!
    $description: String!
    $end: String!
    $league: ID!
    $players: [ID]!
    $start: String!
  ) {
    createSeason(
      seasonInput: {
        name: $name
        description: $description
        seasonEnd: $end
        league: $league
        players: $players
        seasonStart: $start
      }
    ) {
      name
    }
  }
`;

/**
 * Page for creating a new season
 * 
 *     ,~-----------------------------------~,
 *     | New Season                          |
 *     |                                     |
 *     | Name  :``````````````````````````:  |
 *     | Desc.  :`````````````````````````:  |
 *     | start  :`````````````````````````:  |
 *     |        ``````````````````````````   |
 *     | end  :```````````````````````````:  |
 *     |       ```````````````````````````   |
 *     |                                     |
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
 * 
 */
const SeasonNewPage = ({ match }) => {
  const [errors, setErrors] = useState({});
  const [players, setPlayers] = useState({});
  const { user } = useContext(AuthContext);
  const history = useHistory();
  const leagueID = match.params?.leagueID;

  const {inputs, setters, validate} = useNewSeasonFormHook();

  if (user == null) {
    history.push('/login');
  }

  const [createSeason, { loading }] = useMutation(CREATE_SEASON, {
    onCompleted: (res) => {
      console.log('create season mutation complete. res: ', res);
      history.push(`/league/${leagueID}`);
    },
    onError: (error) => {
      console.log('stringified error on mutation:  ', JSON.stringify(error, null, 2));
    },
    variables: {
      name: inputs.name,
      description: inputs.description ?? '',
      league: leagueID,
      end: inputs.end,
      players: inputs.players ?? [],
      start: inputs.start
    }
  })

  const onSubmit = () => {
    const errors = validate();
    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      console.log('create season!! inputs: ', inputs);
      createSeason();
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

  console.log('start: ', inputs, '   map:  ', players);

  return (
    <Wrapper>
      <FlexContainer alignItems="center" direction="column" justify="start" width="100%">
        <PageHeader>New Season</PageHeader>
        <Divider />
        <ScrollableContainer border="none" borderRadius="0" maxHeight="none">
        <FlexContainer direction="column" justify="flex-start">
          <SectionHeadingText margin="8px 0">Name</SectionHeadingText>
          <InputField errors={errors.name ?? null} name="name" onChange={setters.setName} width="700px" value={inputs.name} />
          <SectionHeadingText margin="8px 0">Description</SectionHeadingText>
          <InputField errors={errors.description ?? null} name="description" onChange={setters.setDescription} width="700px" value={inputs.description} />
          <SectionHeadingText margin="8px 0">Start date</SectionHeadingText>
          <InputField errors={errors.start ?? null} onChange={setters.setStart} width="700px" value={inputs.sport} type="date" />
          <SectionHeadingText margin="8px 0">End date</SectionHeadingText>
          <InputField errors={errors.end ?? null} onChange={setters.setEnd} width="700px" value={inputs.location} type="date" />
          <SectionHeadingText margin="8px 0">Players</SectionHeadingText>
          <PlayerSearchField leagueID={leagueID} onClick={onSelectPlayer} selected={players} />
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
          <FlexContainer marginTop="12px">
            <Button label="Cancel" onClick={() => {history.goBack()}} />
            <Button label="Create season" onClick={onSubmit} />
          </FlexContainer>
        </FlexContainer>
        </ScrollableContainer>
      </FlexContainer>
    </Wrapper>
  )
}

export default SeasonNewPage;
