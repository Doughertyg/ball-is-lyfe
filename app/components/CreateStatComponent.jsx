import gql from 'graphql-tag';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { DetailsText, Divider, FlexContainer, PageHeader, SectionHeadingText } from '../styled-components/common';
import Button from './Button.jsx';
import CollapsibleSearchField from './CollapsibleSearchField.jsx';
import CompactDetailsCard from './CompactDetailsCard.jsx';
import CreateOperationComponent from './CreateOperationComponent.jsx';
import InputField from './InputField.jsx';

const Wrapper = styled.div`
  border-radius: 8px;
  background-color: rgba(139, 139, 139, 0.2);
  box-sizing: border-box;
  padding: 20px;
  width: 100%;
`;

const FETCH_STAT_OPERATIONS = gql`
  query($seasonID: ID) {
    getStatOperations(seasonID: $seasonID) {
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
    $name: String!,
    $operation: ID!,
    $seasonID: ID!
  ) {
    createStat(
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
  const [name, setName] = useState("");
  const [operations, setOperations] = useState(null);
  const [createOperationExpanded, setCreateOperationExpanded] = useState(false);

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
      name,
      operation: operations?.id,
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

  return (
    <Wrapper>
      <FlexContainer direction="column" height="100%" justify="flex-start" overflow="visible" padding="0 8px" width="100%">
        <PageHeader margin="0px">Create Stat</PageHeader>
        <DetailsText padding="4px 0">
          Stats are the result of an operation. An operation can be be composed of multiple child operations. E.x.: Field Goal Percentage: FGM / (FGM + FGA)
        </DetailsText>
        <Divider width="100%" />
        <SectionHeadingText margin="8px 0 8px 0">Name</SectionHeadingText>
        <InputField errors={name === "" ? 'Name cannot be blank.' : null} loading={false/* isSubmitting */} name="name" onChange={(input) => setName(input)} placeholder="Stat name..." width="100%" value={name} />
        <SectionHeadingText margin="8px 0 8px 0">Operations</SectionHeadingText>
        <CollapsibleSearchField
          filterResults={(entry, input) => entry?.name?.toLowerCase().includes(input.toLowerCase())}
          forceExpanded
          getRightButton={getCreateOperationButton}
          label="Add Operations..."
          loading={loadingOperations}
          onClick={(operation) => setOperations(operation)}
          onClose={() => {}}
          source={data?.getStatOperations ?? []}
        />
        {createOperationExpanded && (
          <CreateOperationComponent onCancel={() => setCreateOperationExpanded(false)} onCompleted={onCreateOperationCompleted} seasonID={seasonID} />
        )}
        {operations != null && (
          <CompactDetailsCard
            title={operations?.name ?? 'Operation name missing'}
            subTitle={`${operations?.metricA?.name ?? 'term 1'} ${operations?.operation} ${operations?.metricB?.name ?? 'term 2'}`}
          />
        )}
        <FlexContainer justify="center" marginTop="12px">
          <Button isDisabled={false} label="Cancel" loading={isSubmitting} onClick={onCancel} />
          <Button isLoading={false} label="Create Stat" loading={isSubmitting} onClick={onSubmit} />
        </FlexContainer>
      </FlexContainer>
    </Wrapper>
  );
}

export default CreateStatComponent;
