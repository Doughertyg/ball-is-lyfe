import React, { useState } from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { DetailsText, Divider, FlexContainer, PageHeader, SectionHeadingText } from '../styled-components/common';
import CollapsibleSearchField from './CollapsibleSearchField.jsx';
import CompactDetailsCard from './CompactDetailsCard.jsx';
import CreateStatComponent from './CreateStatComponent.jsx';
import InputField from './InputField.jsx';
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
    value: 'GREATER'
  }, {
    name: 'Less than',
    description: 'The team with a lower score wins',
    value: 'LESSER'
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
 * 
 * configuration shape: {
 *   periods
 *   periodLength
 *   scoreStat {
 *     name
 *   }
 *   winCondition
 * }
 * 
 */
const ConfigureGamesComponent = ({ configuration, isLeagueAdmin, seasonID }) => {
  const [operator, setOperator] = useState( configuration?.winCondition === 'GREATER' ? OPTIONS[0] : OPTIONS[1]);
  const [scoreStat, setScoreStat] = useState(configuration?.scoreStat != null ? {name: configuration?.scoreStat?.name} : undefined);
  const [periods, setPeriods] = useState(configuration?.periods ?? 0);
  const [periodLength, setPeriodLength] = useState(configuration?.periodLength ?? 0);
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
    return entry?.name?.toLowerCase().includes(input);
  }

  const configurationDetails = [
    `Score stat: ${configuration?.scoreStat?.name ?? 'Not set'}`,
    `Win condition: ${configuration?.winCondition ?? 'Not set'}`,
    `Periods: ${configuration?.periods ?? 'Not set'}`,
    `Period length: ${configuration?.periodLength ?? 'Not set'}`
  ]

  return (
    <>
      <FlexContainer alignItems="center" justify="flex-start" marginBottom="8px">
        <SectionHeadingText>Game Configuration</SectionHeadingText>
        {isLeagueAdmin && <Icon borderRadius="50%" icon={configureGames ? "close" : "edit"} onClick={() => setConfigureGames(!configureGames)} />}
      </FlexContainer>
      {configureGames && (
        <Wrapper>
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
          <FlexContainer marginTop="8px" justify="flex-start" overflow="visible">
            <SectionHeadingText margin="0 8px 0 0">Win condition:</SectionHeadingText>
            <SimpleSelector grow={1} onClick={(entry) => setOperator(entry)} options={OPTIONS} value={operator.name} />
          </FlexContainer>
          <Divider marginTop="7px" marginBottom="10px" />
          <SectionHeadingText margin="0 0 4px 0">Periods</SectionHeadingText>
          <DetailsText marginBottom="8px">Set the number of periods in a game</DetailsText>
          <InputField onChange={(e) => setPeriods(e)} type="number" value={periods} />
          <SectionHeadingText margin="8px 0 4px 0">Period length</SectionHeadingText>
          <DetailsText marginBottom="8px">Set the length of periods in minutes</DetailsText>
          <InputField onChange={(e) => setPeriodLength(e)} type="number" value={periodLength} />
          <Divider marginTop="10px" marginBottom="10px" />
          <FlexContainer>
            <Button label="Cancel" onClick={() => setConfigureGames(false)} />
            <Button label="Submit" onClick={() => {}} />
          </FlexContainer>
        </Wrapper>
      )}
      {!configureGames && (
        <CompactDetailsCard title="Configuration" details={configurationDetails} />
      )}
    </>
  )
}

export default ConfigureGamesComponent;
