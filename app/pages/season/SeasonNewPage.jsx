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
import SearchField from '../../components/SearchField.jsx';

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
  const [captains, setCaptains] = useState({});
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
      
      if (captains[player.id]) {
        const newCaptains = {...captains};
        delete newCaptains[player.id];
        setCaptains(newCaptains);
      }
    }
  }

  const onSelectCaptains = (player) => {
    if (!captains[player.id]) {
      const newCaptainsMap = {...captains};
      newCaptainsMap[player.id] = player;
      setCaptains(newCaptainsMap);
    } else {
      const newCaptainsMap = {...captains};
      delete newCaptainsMap[player.id];
      setCaptains(newCaptainsMap);
    }
  }

  const filterCaptainResults = (player, input) => {
    return player?.name?.includes(input) || player?.email?.includes(input) || player?.username?.includes(input);
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
            <SectionHeadingText margin="24px 0 8px 0">Captains</SectionHeadingText>
            <DetailsText>Select players to be team captains</DetailsText>
            <SearchField filterResults={filterCaptainResults} label="Select a captain..." onClick={onSelectCaptains} selected={captains} source={Object.values(players) ?? []} />
            <FlexContainer flexWrap="wrap" justify="start" overflow="initial" shrink="0" width="100%">
              {Object.values(captains).map((player, idx) => (
                  <CardWrapper
                    boxShadow="0 0 10px rgba(0, 0, 0, 0.07)"
                    key={player.id ?? idx}
                    margin='4px 4px 0 0'>
                    <FlexContainer alignItems="center" justify="space-between">
                      {player.profilePicture && (
                        <ProfilePictureThumb
                          referrerPolicy="no-referrer"
                          height="32px"
                          src={player.profilePicture}
                          width="32px" />
                      )}
                      <FlexContainer direction="column">
                        <BodyText marginBottom="4px">
                          {player.name ?? player.username}
                        </BodyText>
                        <DetailsText>{player.email}</DetailsText>
                      </FlexContainer>
                      <Icon icon="close" onClick={() => onSelectCaptains(player)} />
                    </FlexContainer>
                  </CardWrapper>
              ))}
            </FlexContainer>
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
