import React, {useMemo, useState} from 'react';
import styled from 'styled-components';
import { DetailsText, Divider, FlexContainer, PageHeader, SectionHeadingText } from '../styled-components/common';
import Button from './Button.jsx';
import CollapsibleSearchField from './CollapsibleSearchField.jsx';
import CompactDetailsCard from './CompactDetailsCard.jsx';
import DropdownSelector from './DropdownSelector.jsx';
import InputField from './InputField.jsx';
import CreateStatMetricComponent from './CreateStatMetricComponent.jsx';
import SimpleSelector from './SimpleSelector.jsx';
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/react-hooks';

const Wrapper = styled.div`
  border-radius: 8px;
  border: 1px solid rgb(105, 105, 105);
  background-color: rgba(139, 139, 139, 0.2);
  box-sizing: border-box;
  margin: 8px 0;
  padding: 20px;
  width: 100%;
`;

const OPERATIONS = [
  {
    name: 'Multiply by',
    value: '*'
  },
  {
    name: 'Divide by',
    value: '/'
  },
  {
    name: 'Add to',
    value: '+'
  },
  {
    name: 'Subtract',
    value: '-'
  }
];

const CREATE_TYPES = [
  {
    name: "Stat Metric",
    value: "metric"
  },
  {
    name: "Operation",
    value: "operation"
  }
];

const FETCH_STAT_METRICS_OPERATIONS = gql`
  query($seasonID: ID) {
    getStatOperations(seasonID: $seasonID) {
      id
      metricA {
        __typename
      }
      metricB {
        __typename
      }
      name
      operation
    }
    getStatUnits(seasonID: $seasonID) {
      id
      name
      value
    }
  }
`;

const CREATE_OPERATION_MUTATION = gql`
  mutation createStatOperation(
    $name: String!,
    $term1: ID!,
    $term2: ID!
    $operation: String!
    $seasonID: ID
  ) {
    createStatOperation(
      input: {
        name: $name,
        term1: $term1,
        term2: $term2,
        operation: $operation,
        seasonID: $seasonID
      }
    ) {
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

/**
 * 
 * Create Operation Component for creating a stat operation.
 * User can choose from existing operations or statUnits and set an operation to perform (+, -, *, /)
 * If the user chooses an operation as a metric, the inner operation is calculated first
 * 
 *  ___________________________________________________________
 *  ,---------------------------------------------------------,
 *  |   ,--------------------------.                          |
 *  |  |     Name...                |                         |
 *  |   `--------------------------`                          |
 *  |   ,----------------------------------.                  |
 *  |  |   Add MetricA...        | Create  |                  |
 *  |   '----------------------------------'                  |
 *  |   ,----------------------------------.                  |
 *  |  |   Add MetricB...        | Create  |                  |
 *  |   '----------------------------------'                  |
 *  |   .------------------------,                            |
 *  |  |  Set Operation...     X  |                           |
 *  |   `------------------------`                            |
 *  |                                                         |
 *  |              .--------.    .------------------.         |
 *  |              | Cancel |    | Create Operation |         |
 *  |              '--------'    '------------------'         |
 *  `---------------------------------------------------------`
 */
const CreateOperationComponent = ({ onCancel, onCompleted, seasonID }) => {
  const [name, setName] = useState('');
  const [termA, setTermA] = useState(null);
  const [termB, setTermB] = useState(null);
  const [operation, setOperation] = useState(null);
  const [createMetricAExpanded, setCreateMetricAExpanded] = useState(false);
  const [createMetricAType, setCreateMetricAType] = useState();
  const [createMetricBExpanded, setCreateMetricBExpanded] = useState(false);
  const [createMetricBType, setCreateMetricBType] = useState();

  const { loading, data, error } = useQuery(FETCH_STAT_METRICS_OPERATIONS, {
    variables: {seasonID}
  });

  if (error != null) {
    // TODO: display user friendly error to user
    console.log('error: ', JSON.stringify(error, null, 2));
  }

  const [createOperation, {isSubmitting}] = useMutation(CREATE_OPERATION_MUTATION, {
    onCompleted: (res) => {
      console.log('mutation completed!!! res: ', res);
      onCompleted?.(res);
    },
    onError: (error) => {
      console.log('stringified error on mutation:  ', JSON.stringify(error, null, 2))
    },
    variables: {
      name,
      seasonID,
      term1: termA?.id,
      term2: termB?.id,
      operation: operation?.value
    }
  });

  const getCreateMetricButton = (onClick) => (
    <Button
      borderRadius="0 8px 8px 0"
      boxShadow="none"
      height='46px'
      label="Create Metric / Operation"
      margin="0"
      onClick={onClick}
    />
  )

  const createOperationCompleted = (setTerm, setExpanded) => (res) => {
    if (res?.createStatOperation != null) {
      setTerm(res.createStatOperation);
      setExpanded(false);
    }
  }

  const createStatUnitCompleted = (setTerm, setExpanded) => (res) => {
    if (res?.createStatUnit != null) {
      setTerm(res.createStatUnit);
      setExpanded(false)
    }
  }

  const statMetricsOperationsSource = useMemo(() => {
    const statUnits = data?.getStatUnits ?? [];
    const operations = data?.getStatOperations ?? [];
    return statUnits.concat(operations);
  }, [data?.getStatUnits, data?.getStatOperations]);

  return (
  <Wrapper>
    <FlexContainer direction="column" height="100%" justify="flex-start" overflow="visible" padding="0 8px" width="100%">
      <PageHeader margin="0px">Create Operation</PageHeader>
      <DetailsText margin="4px 0">
        Operations create a mathematical result from two Stat Metrics or operations. The operation value dictates what mathematical operation should be completed. Operations can be nested to create more complicated results.
      </DetailsText>
      <Divider width="100%" />
      <SectionHeadingText margin="8px 0 8px 0">Name</SectionHeadingText>
      <InputField errors={name === "" ? 'Name cannot be blank.' : null} loading={false/* isSubmitting */} name="name" onChange={(input) => setName(input)} placeholder="Operation name..." width="100%" value={name} />
      <SectionHeadingText margin="8px 0 8px 0">Term 1</SectionHeadingText>
      <DetailsText marginBottom="4px">
        A term can either be a Stat Metric (FGM, 3PA, etc.) or the result of another operation (FGM + FGA).
      </DetailsText>
      <CollapsibleSearchField
        filterResults={(entry, input) => entry?.name?.toLowerCase().includes(input.toLowerCase())}
        forceExpanded
        getRightButton={() => getCreateMetricButton(() => setCreateMetricAExpanded(true))}
        label="Add metric or operation..."
        loading={loading}
        onClick={(operation) => setTermA(operation)}
        onClose={() => {}}
        source={statMetricsOperationsSource}
      />
      {createMetricAExpanded && (
        <FlexContainer direction="column" marginTop="8px" overflow="visible">
          <SimpleSelector options={CREATE_TYPES} value={createMetricAType} onClick={(option) => setCreateMetricAType(option?.value)} />
          {createMetricAType != null ?
            createMetricAType === "metric" ?
              <CreateStatMetricComponent onCancel={() => setCreateMetricAExpanded(false)} onComplete={createStatUnitCompleted(setTermA, setCreateMetricAExpanded)} />
              : <CreateOperationComponent onCancel={() => setCreateMetricAExpanded(false)} onCompleted={createOperationCompleted(setTermA, setCreateMetricAExpanded)} seasonID={seasonID} />
            : null}
        </FlexContainer>
      )}
      {termA != null && (
        <CompactDetailsCard subTitle={[termB?.value]} title={termA?.name ?? 'term 1 name missing'} onClose={() => setTermA(null)} />
      )}
      <SectionHeadingText margin="8px 0 8px 0">Operation</SectionHeadingText>
      <DropdownSelector onClick={(entry) => setOperation(entry)} options={OPERATIONS} value={operation?.name} />
      <SectionHeadingText margin="8px 0 8px 0">Term 2</SectionHeadingText>
      <DetailsText marginBottom="4px">
        A term can either be a Stat Metric (FGM, 3PA, etc.) or the result of another operation (FGM + FGA).
      </DetailsText>
      <CollapsibleSearchField
        filterResults={(entry, input) => entry?.name?.toLowerCase().includes(input.toLowerCase())}
        forceExpanded
        getRightButton={() => getCreateMetricButton(() => setCreateMetricBExpanded(true))}
        label="Add metric or operation..."
        loading={loading}
        onClick={(operation) => setTermB(operation)}
        onClose={() => {}}
        source={statMetricsOperationsSource}
      />
      {createMetricBExpanded && (
        <FlexContainer direction="column" marginTop="8px" overflow="visible">
          <SimpleSelector options={CREATE_TYPES} value={createMetricBType?.name} onClick={(option) => setCreateMetricBType(option?.value)} />
          {createMetricBType != null ?
            createMetricBType === "metric" ?
              <CreateStatMetricComponent onCancel={() => setCreateMetricBExpanded(false)} onComplete={createStatUnitCompleted(setTermB, setCreateMetricBExpanded)} />
              : <CreateOperationComponent onCancel={() => setCreateMetricBExpanded(false)} onCompleted={createOperationCompleted(setTermB, setCreateMetricBExpanded)} seasonID={seasonID} />
            : null}
        </FlexContainer>
      )}
      {termB != null && (
        <CompactDetailsCard subTitle={[termB?.value]} title={termB?.name ?? 'term 2 name missing'} onClose={() => setTermB(null)} />
      )}
      <FlexContainer justify="center" marginTop="12px">
        <Button isDisabled={false} label="Cancel" loading={isSubmitting} onClick={onCancel} />
        <Button isLoading={false} label="Create Operation" loading={isSubmitting} onClick={createOperation} />
      </FlexContainer>
    </FlexContainer>
  </Wrapper>)
}

export default CreateOperationComponent;
