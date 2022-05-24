import React, {useContext, useState} from 'react';
import InputField from '../../components/InputField.jsx';
import {useHistory} from 'react-router';
import { AuthContext } from '../../context/auth';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import {
  Divider,
  FlexContainer,
  PageHeader,
  SectionHeadingText
} from '../../styled-components/common';
import Button from '../../components/Button.jsx';
import PlayerSearchField from '../../components/PlayerSearchField.jsx';
import useNewSeasonFormHook from '../../hooks/useNewSeasonFormHook';
import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100vh;
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

  console.log('start: ', inputs.start);

  return (
    <Wrapper>
      <FlexContainer alignItems="center" direction="column" height="100vh" width="100%">
        <PageHeader>New Season</PageHeader>
        <Divider />
        <FlexContainer direction="column" height="100%" justify="flex-start">
          <SectionHeadingText margin="8px 0">Name</SectionHeadingText>
          <InputField errors={errors.name ?? null} name="name" onChange={setters.setName} width="700px" value={inputs.name} />
          <SectionHeadingText margin="8px 0">Description</SectionHeadingText>
          <InputField errors={errors.description ?? null} name="description" onChange={setters.setDescription} width="700px" value={inputs.description} />
          <SectionHeadingText margin="8px 0">Start date</SectionHeadingText>
          <InputField errors={errors.start ?? null} onChange={setters.setStart} width="700px" value={inputs.sport} type="date" />
          <SectionHeadingText margin="8px 0">End date</SectionHeadingText>
          <InputField errors={errors.end ?? null} onChange={setters.setEnd} width="700px" value={inputs.location} type="date" />
          <SectionHeadingText margin="8px 0">Players</SectionHeadingText>
          <PlayerSearchField leagueID={leagueID} />
          <FlexContainer marginTop="12px">
            <Button label="Cancel" onClick={() => {history.goBack()}} />
            <Button label="Create season" onClick={onSubmit} />
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </Wrapper>
  )
}

export default SeasonNewPage;
