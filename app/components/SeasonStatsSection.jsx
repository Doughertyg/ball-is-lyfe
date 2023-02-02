import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';
import { FlexContainer, SectionHeadingText } from '../styled-components/common';
import Button from './Button.jsx';
import CollapsibleSearchField from './CollapsibleSearchField.jsx';
import CompactDetailsCard from './CompactDetailsCard.jsx';
import CreateStatComponent from './CreateStatComponent.jsx';

const SEASON_STATS_QUERY = gql`
  query($seasonID: ID!) {
    getSeasonStats(seasonID: $seasonID) {
      name
    }
  }
`;

/**
 * Component for rendering the stats section on the season page
 * Player stats for the seasom
 * ------------------------------------------------
 * Field Goal Percentage    Assists
 * ,-------------------,    ,-----------------,
 * |      ,''''',      |    |                 |
 * |      :     :      |    |
 * |       \   /       |    |
 * |       /   \       |    |
 * |  Steph Curry #30  |    |
 * |  - Klay Thompson  |
 * |  - Graham Doughert|
 * |  - Randall Stevens|
 * '-------------------'
 */
const SeasonStatsSection = ({ seasonID, isAdmin }) => {
  const [statsToAdd, setStatsToAdd] = useState({});
  const [stats, setStats] = useState([]);
  const [createStatExpanded, setCreateStatExpanded] = useState(false);
  const { loading, data: seasonStats, error } = useQuery(SEASON_STATS_QUERY, {
    variables: { seasonID }
  });

  useEffect(() => {
    if (seasonStats != null) {
      setStats(seasonStats);
    }
  }, [])

  if (error != null) {
    // TODO: display user friendly error to user
    console.log('error: ', JSON.stringify(error, null, 2));
  }

  const filterStatsResults = (entry, input) => {
    return entry?.name?.includes(input);
  }

  const onSelectStat = () => {
    // select stat
  }

  const getCreateStatButton = () => (
    <Button
      borderRadius="0 8px 8px 0"
      boxShadow="none"
      height='46px'
      label="Create Stat"
      margin="0"
      onClick={() => setCreateStatExpanded(true)}
    />
  );

  return (
    <>
      <FlexContainer alignItems="center" flexWrap="wrap" justify="flex-start" overflow="visible">
        <SectionHeadingText margin="20px 12px 20px 0">Stat Leaders</SectionHeadingText>
        {isAdmin && seasonID && (
          <CollapsibleSearchField
            filterResults={filterStatsResults}
            getRightButton={getCreateStatButton}
            label="Search for stats..."
            loading={loading}
            onClick={onSelectStat}
            onClose={() => setStatsToAdd({})}
            selected={statsToAdd}
            source={seasonStats ?? []}
          />)}
      </FlexContainer>
      {createStatExpanded && (
        <CreateStatComponent onCancel={() => setCreateStatExpanded(false)} />
      )}
      <FlexContainer flexWrap="wrap" justify="flex-start">
        Season Stats Section Stub
        {stats != null && stats.length > 0 && (
          stats.map((seasonStat, idx) => (
            <CompactDetailsCard
              key={idx}
              title={seasonStat.name}
            />
          ))
        )}
      </FlexContainer>
    </>
  )
}

export default SeasonStatsSection;
