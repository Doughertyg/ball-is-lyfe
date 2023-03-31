import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';
import { DetailsText, Divider, FlexContainer, SectionHeadingText } from '../styled-components/common';
import BannerComponent from './BannerComponent.jsx';
import Button from './Button.jsx';
import CollapsibleSearchField from './CollapsibleSearchField.jsx';
import CompactDetailsCard from './CompactDetailsCard.jsx';
import CreateOperationComponent from './CreateOperationComponent.jsx';
import CreateSimpleStatComponent from './CreateSimpleStatComponent.jsx';
import CreateStatComponent from './CreateStatComponent.jsx';
import SimpleSelector from './SimpleSelector.jsx';

const STAT_TYPES = {
  SIMPLE_STAT:
  {
    name: 'Simple Stat',
    value: 'SIMPLE_STAT'
  },
  COMPOUND_STAT:
  {
    name: 'Compound Stat',
    value: 'COMPOUND_STAT'
  }
};

const SEASON_STATS_QUERY = gql`
  query($seasonID: ID!) {
    getStats(seasonID: $seasonID) {
      id
      name
      operation {
        expression
      }
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
  const [createStatType, setCreateStatType] = useState(STAT_TYPES.SIMPLE_STAT.value);
  const { loading, data: seasonStats, error } = useQuery(SEASON_STATS_QUERY, {
    variables: { seasonID }
  });

  useEffect(() => {
    if (seasonStats != null) {
      setStats(seasonStats?.getStats ?? []);
    }
  }, [seasonStats])

  if (error != null) {
    // TODO: display user friendly error to user
    console.log('error: ', JSON.stringify(error, null, 2));
  }

  const filterStatsResults = (entry, input) => {
    return entry?.name?.toLowerCase()?.includes(input);
  }

  const onSelectStat = (stat) => {
    const newStatsToAdd = {...statsToAdd};
    if (newStatsToAdd[stat.id]) {
      delete newStatsToAdd[stat.id];
    } else {
      newStatsToAdd[stat.id] = stat;
    }
    setStatsToAdd(newStatsToAdd);
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

  const onCreateStat = (stat) => {
    setCreateStatExpanded(false);
    const newStats = [...stats];
    newStats.push(stat);
    setStats(newStats);
  }

  return (
    <>
      <FlexContainer alignItems="center" flexWrap="wrap" justify="flex-start" overflow="visible">
        <SectionHeadingText margin="20px 12px 20px 0">Stats</SectionHeadingText>
        {isAdmin && seasonID && (
          <CollapsibleSearchField
            filterResults={filterStatsResults}
            getRightButton={getCreateStatButton}
            label="Search for stats..."
            loading={loading}
            onClick={onSelectStat}
            onClose={() => setStatsToAdd({})}
            selected={statsToAdd}
            source={stats ?? []}
          />)}
      </FlexContainer>
      {createStatExpanded && (
        <CreateStatComponent onCancel={() => setCreateStatExpanded(false)} onCompleted={onCreateStat} seasonID={seasonID} />
      )}
      <FlexContainer flexWrap="wrap" justify="flex-start">
        {stats != null && stats.length > 0 && (
          stats.map((seasonStat, idx) => (
            <CompactDetailsCard
              key={idx}
              title={seasonStat.name}
              subTitle={seasonStat.operation.expression}
            />
          ))
        )}
      </FlexContainer>
      {Object.keys(statsToAdd).length > 0 && (
        <>
          <SectionHeadingText margin="20px 12px 20px 0">Stats to add</SectionHeadingText>
          <FlexContainer flexWrap="wrap" justify="flex-start">
            {Object.values(statsToAdd).map((stat, idx) => (
              <CompactDetailsCard
                key={idx}
                onClose={() => {
                  const newStatsToAdd = {...statsToAdd};
                  delete newStatsToAdd[stat.id];
                  setStatsToAdd(newStatsToAdd);
                }}
                title={stat.name}
                subTitle={stat?.operation?.expression}
              />
            ))}
          </FlexContainer>
        </>)}
        <Divider />
        <BannerComponent color="dimgrey" marginTop="10px" title="Confirming the season will move it from the Configuration status to Confirmed. Only a confirmed season can be launched and become active." />
        <FlexContainer justify="flex-end" marginTop="8px">
          <Button isLoading={false} label="Confirm season" loading="isSubmitting" margin="4px" marginTop="4px" onClick={() => {/* confirm season */}} />
        </FlexContainer>
      </>
  )
}

export default SeasonStatsSection;
