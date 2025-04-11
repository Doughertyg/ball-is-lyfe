import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React, {useMemo, useState} from 'react';
import styled from 'styled-components';
import { BodyText, Divider, FlexContainer, PageHeader, SectionHeadingText } from '../styled-components/common';
import Button from './Button.jsx';
import CompactDetailsCard from './CompactDetailsCard.jsx';
import InputField from './InputField.jsx';
import SearchField from './SearchField.jsx';

const Wrapper = styled.div`
  border-radius: 8px;
  background-color: rgba(139, 139, 139, 0.2);
  box-sizing: border-box;
  padding: 20px;
  width: 100%;
`;

const ADD_GAMES_TO_SEASON_MUTATION = gql`
  mutation addGamesToSeason(
    $seasonID: ID!,
    $gamesToAdd: [GamesToAddInput!]
  ) {
    addGamesToSeason(
      seasonID: $seasonID,
      gamesToAdd: $gamesToAdd
    ) {
      name
      games {
        awayTeam {
          team {
            name
          }
        }
        awayScore
        date
        homeTeam {
          team {
            name
          }
        }
        homeScore
      }
    }
  }
`;

/**
 * collapsible component for adding games to a season
 * Multiple can be created and added at the same time.
 * 
 * ___________________________________________________________
 *  ,---------------------------------------------------------,
 *  |  ,---------------,    ,-----------------,     ,------,  |
 *  |  :   teamA       : vs :     teamB       : at: : :_:v :  |
 *  |  `---------------`    `-----------------`     `------`  |
 *  |                                                         |
 *  |             ,--------,   ,--------------,               |
 *  |             | Cancel |   |   Add game   |               |
 *  |             `--------`   `--------------`               |
 *  `---------------------------------------------------------`
 * 
 */
const AddGamesComponent = ({ onCancel, onComplete, seasonID, teamsSource }) => {
  const [homeTeam, setHomeTeam] = useState();
  const [awayTeam, setAwayTeam] = useState();
  const [date, setDate] = useState();

  const [addGamesToSeason, { isSubmitting }] = useMutation(ADD_GAMES_TO_SEASON_MUTATION, {
    onCompleted: (res) => {
      console.log('successfully added game to season');
      onComplete?.(res);
    },
    onError: (error) => {
      console.log('Stringified error on mutation: ', JSON.stringify(error, null, 2));
    },
    variables: {
      seasonID,
      gamesToAdd: [{
        awayTeam: awayTeam?.id,
        date,
        homeTeam: homeTeam?.id
      }]
    }
  });

  const filterTeamResults = (teamInstance, input) => {
    return teamInstance?.team?.name?.includes(input);
  }

  const homeTeamSource = useMemo(() => {
    return teamsSource?.filter(team => team?.id !== awayTeam?.id);
  }, [teamsSource, awayTeam]);

  const awayTeamSource = useMemo(() => {
    return teamsSource?.filter(team => team?.id !== homeTeam?.id);
  }, [teamsSource, homeTeam]);

  const getTeamResultsComponent = (teamInstance) => {
    return (
      <>
        {teamInstance?.team?.profilePicture && (
          <ProfilePictureThumb
            height="32px"
            referrerPolicy="no-referrer"
            src={teamInstance?.tea?.profilePicture}
            width="32px" />
        )}
        <BodyText width="fit-content">
          {teamInstance?.team?.name ?? 'Name missing'}
        </BodyText>
      </>
    )
  }

  return (
    <Wrapper>
      <FlexContainer direction="column" height="100%" justify="flex-start" overflow="visible" padding="0 8px" width="100%">
        <PageHeader margin="0px">Add game</PageHeader>
        <Divider width="100%" />
        <FlexContainer alignItems="flex-end" overflow="visible">
          <FlexContainer direction="column" overflow="clip visible">
            <SectionHeadingText margin="8px 0 8px 0">Home Team</SectionHeadingText>
            <SearchField
              filterResults={filterTeamResults}
              getResultComponent={getTeamResultsComponent}
              label="Search teams..."
              loading={isSubmitting}
              onClick={(team) => setHomeTeam(team)}
              source={homeTeamSource}
            />
          </FlexContainer>
          <SectionHeadingText margin="8px 24px">Vs.</SectionHeadingText>
          <FlexContainer direction="column" overflow="clip visible">
            <SectionHeadingText margin="8px 0 8px 0">Away Team</SectionHeadingText>
            <SearchField
              filterResults={filterTeamResults}
              getResultComponent={getTeamResultsComponent}
              label="Search teams..."
              loading={isSubmitting}
              onClick={(team) => setAwayTeam(team)}
              source={awayTeamSource}
            />
          </FlexContainer>
        </FlexContainer>
        <FlexContainer alignItems="center" justify="space-between">
          {homeTeam != null && (
            <CompactDetailsCard
              title={homeTeam?.team?.name ?? 'Team name missing'}
              onClose={() => setHomeTeam(null)} />
          )}
          {awayTeam != null && (
            <CompactDetailsCard
              title={awayTeam?.team?.name ?? 'Team name missing'}
              onClose={() => setAwayTeam(null)} />
          )}
        </FlexContainer>
        <FlexContainer alignItems="center" marginTop="20px">
          <SectionHeadingText margin="8px 12px 8px 0">At</SectionHeadingText>
          <InputField
            onChange={setDate}
            loading={isSubmitting}
            width="100%"
            value={date}
            type="datetime-local"
          />
        </FlexContainer>
        <FlexContainer justify="center" marginTop="12px">
          <Button isDisabled={isSubmitting} label="Cancel" loading={isSubmitting} onClick={onCancel} />
          <Button isLoading={isSubmitting} label="Add Game" loading={isSubmitting} onClick={addGamesToSeason} />
        </FlexContainer>
      </FlexContainer>
    </Wrapper>
  )
}

export default AddGamesComponent;
