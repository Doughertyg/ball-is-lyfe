import gql from 'graphql-tag';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useMutation, useQuery } from '@apollo/client';
import { BodyText, DetailsText, Divider, FlexContainer, PageHeader, SectionHeadingText } from '../styled-components/common';
import Button from './Button.jsx';
import CollapsibleSearchField from './CollapsibleSearchField.jsx';
import CompactDetailsCard from './CompactDetailsCard.jsx';
import CreateOperationComponent from './CreateOperationComponent.jsx';
import InputField from './InputField.jsx';

const Bold = styled.div`
  display: inline-block;
  font-weight: 600;
`;

const Wrapper = styled.div`
  border-radius: 8px;
  background-color: rgba(139, 139, 139, 0.2);
  box-sizing: border-box;
  padding: 20px;
  width: 100%;
`;

const NoShrink = styled.div`
  flex-shrink: 0;
`;

const FETCH_STAT_OPERATIONS = gql`
  query($seasonID: ID) {
    getStatOperations(seasonID: $seasonID) {
      expression
      id
      metricA {
        ... on StatUnit {
          name
        }
        ... on Operation {
          name
        }
      }
      metricB {
        ... on StatUnit {
          name
        }
        ... on Operation {
          name
        }
      }
      name
      operation
    }
  }
`;

const CREATE_STAT_MUTATION = gql`
  mutation createStat(
    $description: String,
    $isPerGame: Boolean!,
    $name: String!,
    $operation: ID!,
    $seasonID: ID!
  ) {
    createStat(
      description: $description,
      isPerGame: $isPerGame,
      name: $name,
      operation: $operation,
      seasonID: $seasonID
    ) {
      id
      name
    }
  }
`;

/**
 * Create Stat component for creating stats
 * Modeled after the CreateTeamComponent
 * (consider making singular component for this)
 * 
 *  ___________________________________________________________
 *  ,---------------------------------------------------------,
 *  |   ,--------------------------.                          |
 *  |  |     Name...                |                         |
 *  |   `--------------------------`                          |
 *  |   ,----------------------------------.                  |
 *  |  |   Add Operations...     | Create  |                  |
 *  |   '----------------------------------'                  |
 *  |   .-------------------,                                 |
 *  |  |  FGM + FGA      X  |                                 |
 *  |   `-------------------`                                 |
 *  |                                                         |
 *  |              .--------.    .-------------.              |
 *  |              | Cancel |    | Create Stat |              |
 *  |              '--------'    '-------------'              |
 *  `---------------------------------------------------------`
 */
const CreateStatComponent = ({ onCancel, onCompleted, seasonID }) => {
  const [description, setDescription] = useState('');
  const [name, setName] = useState("");
  const [operations, setOperations] = useState(null);
  const [createOperationExpanded, setCreateOperationExpanded] = useState(false);
  const [isPerGame, setIsPerGame] = useState(false);

  const { loading: loadingOperations, data, error } = useQuery(FETCH_STAT_OPERATIONS, {
    variables: {seasonID}
  });

  const [createStat, {isSubmitting}] = useMutation(CREATE_STAT_MUTATION, {
    onCompleted: (res) => {
      console.log('mutation completed!!! res: ', res);
      onCompleted?.(res?.createStat);
    },
    onError: (error) => {
      console.log('stringified error on mutation:  ', JSON.stringify(error, null, 2))
    },
    variables: {
      description,
      name,
      operation: operations?.id,
      isPerGame,
      seasonID
    }
  });

  if (error != null) {
    // TODO: display user friendly error to user
    console.log('error: ', JSON.stringify(error, null, 2));
  }

  const onSubmit = () => {
    if (name === '' || operations == null) {
      // display error
      return;
    } else {
      createStat();
    }
  }

  const getCreateOperationButton = () => (
    <Button
      borderRadius="0 8px 8px 0"
      boxShadow="none"
      height='46px'
      label="Create Operation"
      margin="0"
      onClick={() => setCreateOperationExpanded(true)}
    />
  );
  
  const onCreateOperationCompleted = (res) => {
    if (res?.createStatOperation != null) {
      setOperations(res.createStatOperation);
    }

    setCreateOperationExpanded(false);
  }

  const getResultsComponent = entry => (
    <FlexContainer alignItems="start" direction="column">
      <FlexContainer alignItems="center">
        <BodyText width="fit-content">
          {entry.name}
        </BodyText>
      </FlexContainer>
      {entry.expression && (
        <DetailsText flexGrow="1">
          {entry.expression}
        </DetailsText>
      )}
    </FlexContainer>
  )

  return (
    <Wrapper>
      <FlexContainer direction="column" height="100%" justify="flex-start" overflow="visible" padding="0 8px" width="100%">
        <PageHeader margin="0px">Create Stat</PageHeader>
        <DetailsText padding="4px 0">
          Stats are the result of an operation. An operation can be be composed of multiple child operations. E.x.: Field Goal Percentage: FGM / (FGM + FGA). 
          Stats are computed per player and per team for a season or game. If <Bold>"per game"</Bold> is selected the stat is only computed for a season and is computed <Bold>per game.</Bold>
        </DetailsText>
        <Divider width="100%" />
        <SectionHeadingText margin="20px 0 8px 0">Name</SectionHeadingText>
        <InputField errors={name === "" ? 'Name cannot be blank.' : null} loading={false/* isSubmitting */} name="name" onChange={(input) => setName(input)} placeholder="Stat name..." width="100%" value={name} />
        <SectionHeadingText margin="20px 0 8px 0">Description</SectionHeadingText>
        <InputField loading={false/* isSubmitting */} name="description" maxLength={150} onChange={(input) => setDescription(input)} placeholder="Stat description..." width="100%" value={description} />
        <SectionHeadingText margin="20px 0 8px 0">Operations</SectionHeadingText>
        <CollapsibleSearchField
          filterResults={(entry, input) => entry?.name?.toLowerCase().includes(input.toLowerCase())}
          forceExpanded
          getResultComponent={getResultsComponent}
          getRightButton={getCreateOperationButton}
          label="Add Operations..."
          loading={loadingOperations}
          onClick={(operation) => setOperations(operation)}
          onClose={() => {}}
          source={data?.getStatOperations ?? []}
        />
        {createOperationExpanded && (
          <CreateOperationComponent margin="8px 0 0 0" onCancel={() => setCreateOperationExpanded(false)} onCompleted={onCreateOperationCompleted} seasonID={seasonID} />
        )}
        {operations != null && (
          <CompactDetailsCard
            title={operations?.name ?? 'Operation name missing'}
            subTitle={`${operations?.metricA?.name ?? 'term 1'} ${operations?.operation} ${operations?.metricB?.name ?? 'term 2'}`}
          />
        )}
        <FlexContainer alignItems="center" marginTop="20px">
          <NoShrink>
            <SectionHeadingText margin="0 4px 0 0">Per game?</SectionHeadingText>
          </NoShrink>
          <InputField name="stat-frequency" onChange={() => setIsPerGame(!isPerGame)} placeholder="Per game" type="checkbox" value={isPerGame} />
        </FlexContainer>
        <DetailsText overflow="hidden" padding="4px 0 0 0">This stat will be calculated <Bold>per game</Bold> if the option above is selected. Note that some stats will not make sense on a per game basis (such as percentages).</DetailsText>
        <FlexContainer justify="center" marginTop="20px">
          <Button isDisabled={false} label="Cancel" loading={isSubmitting} onClick={onCancel} />
          <Button isLoading={false} label="Create Stat" loading={isSubmitting} onClick={onSubmit} />
        </FlexContainer>
      </FlexContainer>
    </Wrapper>
  );
}

export default CreateStatComponent;
