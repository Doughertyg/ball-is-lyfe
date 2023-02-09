import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React, {useState} from 'react';
import styled from 'styled-components';
import { DetailsText, Divider, FlexContainer, PageHeader, SectionHeadingText } from '../styled-components/common';
import Button from './Button.jsx';
import CollapsibleSearchField from './CollapsibleSearchField.jsx';
import CompactDetailsCard from './CompactDetailsCard.jsx';
import CreateStatMetricComponent from './CreateStatMetricComponent.jsx';
import InputField from './InputField.jsx';

const Wrapper = styled.div`
  border-radius: 8px;
  background-color: rgba(139, 139, 139, 0.2);
  box-sizing: border-box;
  padding: 20px;
  width: 100%;
`;

const Bold = styled.div`
  display: inline-block;
  font-weight: 600;
`;

const NoShrink = styled.div`
  flex-shrink: 0;
`;

const FETCH_STAT_METRICS_OPERATIONS = gql`
  query($seasonID: ID) {
    getStatUnits(seasonID: $seasonID) {
      id
      name
      value
      __typename
    }
  }
`;

/**
 * Create simple stat component for creating 'simple' tabulated stats
 * These stats are just sum of the stat unit over a season or game or per game
 * 
 * ___________________________________________________________
 *  ,---------------------------------------------------------,
 *  |   ,--------------------------.                          |
 *  |  |     Name...                |                         |
 *  |   `--------------------------`                          |
 *  |   ,----------------------------------.                  |
 *  |  |   Add Stat Unit...      | Create  |                  |
 *  |   '----------------------------------'                  |
 *  |   .-------------------,                                 |
 *  |  |  FGA            X  |                                 |
 *  |   `-------------------`                                 |
 *  |  .------------------,                                   |
 *  |  |  Per Game    [_] |                                   |
 *  |  |  Total       [_] |                                   |
 *  |  '------------------'                                   |
 *  |                                                         |
 *  |              .--------.    .-------------.              |
 *  |              | Cancel |    | Create Stat |              |
 *  |              '--------'    '-------------'              |
 *  `---------------------------------------------------------`
 * 
 */
const CreateSimpleStatComponent = ({ onCancel, onCompleted, seasonID }) => {
  const [name, setName] = useState('');
  const [metric, setMetric] = useState();
  const [isPerGame, setIsPerGame] = useState(false);
  const [createStatMetricExpanded, setCreateMetricExpanded] = useState(false);

  const { loading, data, error } = useQuery(FETCH_STAT_METRICS_OPERATIONS, {
    variables: {seasonID}
  });

  if (error != null) {
    // TODO: display user friendly error to user
    console.log('error fetching stat units: ', JSON.stringify(error, null, 2));
  }

  const getCreateMetricButton = () => (
    <Button
      borderRadius="0 8px 8px 0"
      boxShadow="none"
      height='46px'
      label="Create Metric / Operation"
      margin="0"
      onClick={() => setCreateMetricExpanded(true)}
    />
  );

  const onSubmit = () => {
    // submit mutation
  }

  return (
    <Wrapper>
      <FlexContainer direction="column" height="100%" justify="flex-start" overflow="visible" padding="0 8px" width="100%">
        <PageHeader margin="0px">Create Simple Stat</PageHeader>
        <DetailsText padding="4px 0">
          Simple stats simply tabulate a player or team's totals for a given stat metric (FGA, Points, etc)
          over either a season or a game or <Bold>per</Bold> games. To create a simple stat that tracks stats per
          game, select the <Bold>"per game"</Bold> option.
        </DetailsText>
        <Divider width="100%" />
        <SectionHeadingText margin="20px 0 8px 0">Name</SectionHeadingText>
        <InputField errors={name === "" ? 'Name cannot be blank.' : null} loading={false/* isSubmitting */} name="name" onChange={(input) => setName(input)} placeholder="Stat name..." width="100%" value={name} />
        <SectionHeadingText margin="20px 0 8px 0">Stat Metric</SectionHeadingText>
        <CollapsibleSearchField
          filterResults={(entry, input) => entry?.name?.toLowerCase().includes(input.toLowerCase())}
          forceExpanded
          getRightButton={getCreateMetricButton}
          label="Add metric"
          loading={loading}
          onClick={(statMetric) => setMetric(statMetric)}
          onClose={() => {}}
          source={data?.getStatUnits ?? []}
        />
        {createStatMetricExpanded && (
          <CreateStatMetricComponent margin="4px 0 0 0" onCancel={() => setCreateMetricExpanded(false)} onComplete={() => {/* do something */}} />
        )}
        {metric != null && (
          <CompactDetailsCard
            title={metric?.name ?? 'metric name missing'}
          />
        )}
        <FlexContainer alignItems="center" marginTop="20px">
          <NoShrink>
            <SectionHeadingText margin="0 4px 0 0">Per game?</SectionHeadingText>
          </NoShrink>
          <InputField name="stat-frequency" onChange={() => setIsPerGame(!isPerGame)} placeholder="Per game" type="checkbox" value={isPerGame} />
        </FlexContainer>
        <DetailsText overflow="hidden" padding="4px 0 0 0">This stat will be calculated <Bold>per game</Bold> if the option above is selected. Otherwise the stat will simply show totals.</DetailsText>
        <FlexContainer justify="center" marginTop="20px">
          <Button isDisabled={false} label="Cancel" loading={false /* isSubmitting */} onClick={onCancel} />
          <Button isLoading={false} label="Create Simple Stat" loading={false /* isSubmitting */} onClick={onSubmit} />
        </FlexContainer>
      </FlexContainer>
    </Wrapper>
  )
}

export default CreateSimpleStatComponent;
