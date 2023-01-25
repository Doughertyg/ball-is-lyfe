import React, {useMemo, useState} from 'react';
import styled from 'styled-components';
import { Divider, FlexContainer, PageHeader, SectionHeadingText } from '../styled-components/common';
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
const AddGamesComponent = ({ onCancel, seasonID, teamsSource }) => {
  const [gamesToAdd, setGamesToAdd] = useState([]);
  const [homeTeam, setHomeTeam] = useState();
  const [awayTeam, setAwayTeam] = useState();
  const [date, setDate] = useState();
  const isSubmitting = false;

  const onSubmit = () => {
    // submit mutation here
  }

  const filterTeamResults = (team, input) => {
    return team?.name?.includes(input);
  }

  const homeTeamSource = useMemo(() => {
    return teamsSource?.filter(team => team?.id !== awayTeam?.id);
  }, [teamsSource, awayTeam]);

  const awayTeamSource = useMemo(() => {
    return teamsSource?.filter(team => team?.id !== homeTeam?.id);
  }, [teamsSource, homeTeam]);

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
              label="Search teams..."
              onClick={(team) => setHomeTeam(team)}
              source={homeTeamSource}
            />
          </FlexContainer>
          <SectionHeadingText margin="8px 24px">Vs.</SectionHeadingText>
          <FlexContainer direction="column" overflow="clip visible">
            <SectionHeadingText margin="8px 0 8px 0">Away Team</SectionHeadingText>
            <SearchField
              filterResults={filterTeamResults}
              label="Search teams..."
              onClick={(team) => setAwayTeam(team)}
              source={awayTeamSource}
            />
          </FlexContainer>
        </FlexContainer>
        <FlexContainer alignItems="center" justify="space-between">
          {homeTeam != null && (
            <CompactDetailsCard
              title={homeTeam?.name ?? 'Team name missing'}
              onClose={() => setHomeTeam(null)} />
          )}
          {awayTeam != null && (
            <CompactDetailsCard
              title={awayTeam?.name ?? 'Team name missing'}
              onClose={() => setAwayTeam(null)} />
          )}
        </FlexContainer>
        <FlexContainer alignItems="center" marginTop="20px">
          <SectionHeadingText margin="8px 12px 8px 0">At</SectionHeadingText>
          <InputField
            onChange={setDate}
            width="100%"
            value={date}
            type="datetime-local"
          />
        </FlexContainer>
        <FlexContainer justify="center" marginTop="12px">
          <Button isDisabled={isSubmitting} label="Cancel" loading={isSubmitting} onClick={onCancel} />
          <Button isLoading={isSubmitting} label="Add Game" loading={isSubmitting} onClick={onSubmit} />
        </FlexContainer>
      </FlexContainer>
    </Wrapper>
  )
}

export default AddGamesComponent;
