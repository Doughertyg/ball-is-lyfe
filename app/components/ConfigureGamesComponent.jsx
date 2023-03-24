import React, { useState } from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { DetailsText, Divider, FlexContainer, PageHeader, SectionHeadingText } from '../styled-components/common';
import CollapsibleSearchField from './CollapsibleSearchField.jsx';
import CompactDetailsCard from './CompactDetailsCard.jsx';
import CreateStatComponent from './CreateStatComponent.jsx';
import SearchField from './SearchField.jsx';
import SimpleSelector from './SimpleSelector.jsx';
import { useQuery } from '@apollo/react-hooks';
import { concatAST } from 'graphql';
import Button from './Button.jsx';
import Icon from './Icon.jsx';

const OPTIONS = [
  {
    name: 'Greater than',
    description: 'The team with a greater score wins',
    value: '+'
  }, {
    name: 'Less than',
    description: 'The team with a lower score wins',
    value: '-'
  }
];

const Wrapper = styled.div`
  border-radius: 8px;
  background-color: rgba(139, 139, 139, 0.2);
  box-sizing: border-box;
  padding: 20px;
  width: 100%;
`;

const SEASON_STATS_QUERY = gql`
  query($seasonID: ID!) {
    getStats(seasonID: $seasonID) {
      description
      name
    }
  }
`;

/**
 * Component for configuring games during season configuration
 * 
 * ,---------------------------------------------------------,
 * :  Configure Games                                        |
 * :  Points Stat                                            |
 * :    Stat for tabulating complete team points             |
 * :  ,-----------------------------,                        |
 * :  :  Search for stat   | Create :                        |
 * :  '-----------------------------'                        |
 * :  Win condition: { Greater than } v                      |
 * :           ,------------,   ,-------------,              |
 * :           :   Cancel   :   :  Configure  :              |
 * :           '------------'   '-------------'              |
 * '---------------------------------------------------------'
 */
const ConfigureGamesComponent = ({ isLeagueAdmin, seasonID }) => {
  const [operator, setOperator] = useState(OPTIONS[0]);
  const [scoreStat, setScoreStat] = useState();
  const [configureGames, setConfigureGames] = useState(false);
  const { loading, data, error } = useQuery(SEASON_STATS_QUERY, {
    variables: { seasonID }
  });

  const onSelectStat = () => {
    // do something
  }

  const onCreateStat = () => {
    // do something
  }

  const filterStatsResults = (entry, input) => {
    return entry?.name?.includes(input);
  }

  console.log('data:  ', data);
  return (
    <>
      <FlexContainer alignItems="center" justify="flex-start" marginBottom="8px">
        <SectionHeadingText>Game Configuration</SectionHeadingText>
        {isLeagueAdmin && <Icon borderRadius="50%" icon="plus" onClick={() => setConfigureGames(!configureGames)} />}
      </FlexContainer>
      {configureGames && <Wrapper>
        <PageHeader margin="0 0 8px 0">Configure Games</PageHeader>
        <Divider marginBottom="10px" marginTop="0" />
        <SectionHeadingText margin="0 0 4px 0">Stat for complete team score</SectionHeadingText>
        <DetailsText marginBottom="8px">Select the stat for tabulating complete team score</DetailsText>
        <SearchField
          filterResults={filterStatsResults}
          label="Search for stats..."
          loading={loading}
          onClick={(stat) => setScoreStat(stat)}
          selected={scoreStat}
          source={data?.getStats ?? []}
        />
        <FlexContainer flexWrap="wrap" justify="flex-start">
          {scoreStat != null && 
            <CompactDetailsCard
              title={scoreStat.name}
              onClose={() => setScoreStat(null)}
            />
          }
        </FlexContainer>
        <Divider marginBottom="10px" />
        <FlexContainer justify="flex-start" overflow="visible">
          <SectionHeadingText margin="0 8px 0 0">Win condition:</SectionHeadingText>
          <SimpleSelector grow={1} onClick={(entry) => setOperator(entry)} options={OPTIONS} value={operator.name} />
        </FlexContainer>
        <Divider marginTop="6px" marginBottom="10px" />
        <FlexContainer>
          <Button label="Cancel" onClick={() => setConfigureGames(false)} />
          <Button label="Submit" onClick={() => {}} />
        </FlexContainer>
      </Wrapper>}
    </>
  )
}

export default ConfigureGamesComponent;
