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
  ProfilePictureThumb,
  SectionHeadingText,
  ScrollableContainer
} from '../../styled-components/common';
import Icon from '../../components/Icon.jsx';
import Button from '../../components/Button.jsx';
import PlayerSearchField from '../../components/PlayerSearchField.jsx';
import AddPlayerSection from '../../components/AddPlayerSection.jsx';
import useNewSeasonFormHook from '../../hooks/useNewSeasonFormHook';
import styled from 'styled-components';
import { CardWrapper } from '../../styled-components/card.js';

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
  const { user } = useContext(AuthContext);
  const history = useHistory();
  const leagueID = match.params?.leagueID;

  const {inputs, setters, validate} = useNewSeasonFormHook();
  const { players } = inputs;
  const { setPlayers } = setters;

  if (user == null) {
    history.push('/login');
  }

  const [createSeason, { isSubmitting }] = useMutation(CREATE_SEASON, {
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
      players: Object.keys(inputs.players) ?? [],
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
      <FlexContainer direction="column" height="100%" justify="flex-start" margin="0 auto" maxWidth="800px" padding="0 12px 0 12px" width="100%">
        <PageHeader margin="20px auto">New Season</PageHeader>
        <Divider width="100%" />
        <ScrollableContainer border="none" borderRadius="0" height="100%" maxHeight="none">
          <FlexContainer direction="column" height="100%" justify="flex-start" padding="0 8px" width="100%">
            <SectionHeadingText margin="24px 0 8px 0">Name</SectionHeadingText>
            <InputField errors={errors.name ?? null} name="name" onChange={setters.setName} width="100%" value={inputs.name} />
            <SectionHeadingText margin="24px 0 8px 0">Description</SectionHeadingText>
            <InputField errors={errors.description ?? null} name="description" onChange={setters.setDescription} width="100%" value={inputs.description} />
            <SectionHeadingText margin="24px 0 8px 0">Start date</SectionHeadingText>
            <InputField errors={errors.start ?? null} onChange={setters.setStart} width="100%" value={inputs.sport} type="date" />
            <SectionHeadingText margin="24px 0 8px 0">End date</SectionHeadingText>
            <InputField errors={errors.end ?? null} onChange={setters.setEnd} width="100%" value={inputs.location} type="date" />
            <SectionHeadingText margin="24px 0 8px 0">Players</SectionHeadingText>
            <AddPlayerSection
              isSubmitting={isSubmitting}
              leagueID={leagueID}
              onClose={() => setPlayers({})}
              onSelectPlayer={onSelectPlayer}
              selectedPlayers={players}/>
            <Divider marginTop="32px" width="100%" />
            <FlexContainer shrink="0" marginTop="32px">
              <Button isDisabled={isSubmitting} isLoading={isSubmitting} label="Cancel" onClick={() => {history.goBack()}} />
              <Button isDisabled={isSubmitting} isLoading={isSubmitting}  label="Create season" onClick={onSubmit} />
            </FlexContainer>
          </FlexContainer>
        </ScrollableContainer>
      </FlexContainer>
  )
}

export default SeasonNewPage;
