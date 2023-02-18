import React, {useMemo, useState} from 'react';
import styled from 'styled-components';
import { BodyText, DetailsText, Divider, FlexContainer, PageHeader, SectionHeadingText } from '../styled-components/common';
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
  margin: ${props => props.margin ?? '0'};
  padding: 20px;
  width: 100%;
`;

const NoShrink = styled.div`
  flex-shrink: 0;
  display: inline-block;
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
      expression
      id
      metricA {
        ... on Operation {
          name
          metricA {
            ... on Operation {
              name
              metricA {
                __typename
              }
              metricB {
                __typename
              }
              operation
              termAScalar
              termBScalar
            }
            ... on StatUnit {
              abbreviation
              name
            }
          }
          metricB {
            ... on Operation {
              name
              metricA {
                __typename
              }
              metricB {
                __typename
              }
              operation
              termAScalar
              termBScalar
            }
            ... on StatUnit {
              abbreviation
              name
            }
          }
          operation
          termAScalar
          termBScalar
          __typename
        }
        ... on StatUnit {
          __typename
          abbreviation
          name
        }
        __typename
      }
      metricB {
        ... on Operation {
          name
          metricA {
            ... on Operation {
              name
              metricA {
                __typename
              }
              metricB {
                __typename
              }
              operation
              termAScalar
              termBScalar
            }
            ... on StatUnit {
              abbreviation
              name
            }
          }
          metricB {
            ... on Operation {
              name
              metricA {
                __typename
              }
              metricB {
                __typename
              }
              operation
              termAScalar
              termBScalar
            }
            ... on StatUnit {
              abbreviation
              name
            }
          }
          operation
          termAScalar
          termBScalar
        }
        ... on StatUnit {
          abbreviation
          name
          __typename
        }
        __typename
      }
      name
      operation
      termAScalar
      termBScalar
      __typename
    }
    getStatUnits(seasonID: $seasonID) {
      abbreviation
      id
      name
      value
      __typename
    }
  }
`;

const CREATE_OPERATION_MUTATION = gql`
  mutation createStatOperation(
    $name: String!,
    $term1: ID,
    $term1Scalar: Float,
    $term2: ID,
    $term2Scalar: Float,
    $operation: String!
    $seasonID: ID
  ) {
    createStatOperation(
      input: {
        name: $name,
        term1: $term1,
        term1Scalar: $term1Scalar
        term2: $term2,
        term2Scalar: $term2Scalar,
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
      termAScalar
      termBScalar
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
const CreateOperationComponent = ({ margin, onCancel, onCompleted, seasonID }) => {
  const [name, setName] = useState('');
  const [termA, setTermA] = useState(null);
  const [termB, setTermB] = useState(null);
  const [operation, setOperation] = useState(null);
  const [createMetricAExpanded, setCreateMetricAExpanded] = useState(false);
  const [createMetricAType, setCreateMetricAType] = useState();
  const [createMetricBExpanded, setCreateMetricBExpanded] = useState(false);
  const [createMetricBType, setCreateMetricBType] = useState();
  const [term1Constant, setTerm1Constant] = useState();
  const [isTerm1Constant, setIsTerm1Constant] = useState();
  const [term2Constant, setTerm2Constant] = useState();
  const [isTerm2Constant, setIsTerm2Constant] = useState();

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
      term1: term1Constant == null ? termA?.id : null,
      term1Scalar: term1Constant != null ? Number(term1Constant) : null,
      term2: term2Constant == null ? termB?.id : null,
      term2Scalar: term2Constant != null ? Number(term2Constant) : null,
      operation: operation?.value
    }
  });

  const getCreateMetricButton = (onClick, isDisabled) => (
    <Button
      borderRadius="0 8px 8px 0"
      boxShadow="none"
      isDisabled={isDisabled}
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

  console.log('data:  ', data);

  const statMetricsOperationsSource = useMemo(() => {
    const statUnits = data?.getStatUnits ?? [];
    const operations = data?.getStatOperations ?? [];
    return statUnits.concat(operations);
  }, [data?.getStatUnits, data?.getStatOperations]);

  const getResultsComponent = (entry /* either an operation or a stat unit */) => (
    <FlexContainer alignItems="center">
      <BodyText width="fit-content">
        {entry.abbreviation ?? entry.name}
      </BodyText>
      {entry.abbreviation && (
        <DetailsText flexGrow="1" margin="0 0 0 4px">
          {entry?.name}
        </DetailsText>
      )}
    </FlexContainer>
  )

  return (
    <Wrapper margin={margin}>
      <FlexContainer direction="column" height="100%" justify="flex-start" overflow="visible" padding="0 8px" width="100%">
        <PageHeader margin="0px">Create Operation</PageHeader>
        <DetailsText padding="4px 0">
          Operations create a mathematical result from two Stat Metrics or operations. The operation value dictates what mathematical operation should be completed. Operations can be nested to create more complicated results.
        </DetailsText>
        <Divider width="100%" />
        <SectionHeadingText margin="20px 0 8px 0">Name</SectionHeadingText>
        <InputField errors={name === "" ? 'Name cannot be blank.' : null} loading={false/* isSubmitting */} name="name" onChange={(input) => setName(input)} placeholder="Operation name..." width="100%" value={name} />
        <SectionHeadingText margin="20px 0 8px 0">Term 1</SectionHeadingText>
        <DetailsText padding="0 0 4px 0">
          A term can either be a Stat Metric (FGM, 3PA, etc.), the result of another operation (FGM + FGA), or a constant value (2, 0.5, etc.).
        </DetailsText>
        <CollapsibleSearchField
          isDisabled={isTerm1Constant}
          filterResults={(entry, input) => entry?.name?.toLowerCase().includes(input.toLowerCase())}
          forceExpanded
          getResultComponent={getResultsComponent}
          getRightButton={() => getCreateMetricButton(() => setCreateMetricAExpanded(true), isTerm1Constant)}
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
          <CompactDetailsCard isDisabled={isTerm1Constant} subTitle={[termA?.__typename]} title={termA?.name ?? 'term 1 name missing'} onClose={() => setTermA(null)} />
        )}
        <FlexContainer alignItems="center" marginTop="20px">
          <NoShrink>
            <SectionHeadingText margin="0 4px 0 0">Constant value:</SectionHeadingText>
          </NoShrink>
          <InputField margin="0 4px 0 0" name="term1 constant" onChange={() => setIsTerm1Constant(!isTerm1Constant)} type="checkbox" value={isTerm1Constant} width="24px" wrapperWidth="24px" />
          <InputField disabled={!isTerm1Constant} name="term1 constant value" onChange={(num) => setTerm1Constant(num)} placeholder="Type a number" type="number" value={term1Constant || 1} />
        </FlexContainer>
        <DetailsText margin="4px 0 0 0">If a constant value is set above, no Stat metric or operation will be attached for term 1.</DetailsText>
        <SectionHeadingText margin="20px 0 8px 0">Operation</SectionHeadingText>
        <DropdownSelector onClick={(entry) => setOperation(entry)} options={OPERATIONS} value={operation?.name} />
        <SectionHeadingText margin="20px 0 8px 0">Term 2</SectionHeadingText>
        <DetailsText padding="0 0 4px 0">
          A term can either be a Stat Metric (FGM, 3PA, etc.), the result of another operation (FGM + FGA), or a constant value (2, 0.5, etc.).
        </DetailsText>
        <CollapsibleSearchField
          filterResults={(entry, input) => entry?.name?.toLowerCase().includes(input.toLowerCase())}
          forceExpanded
          getResultComponent={getResultsComponent}
          getRightButton={() => getCreateMetricButton(() => setCreateMetricBExpanded(true), isTerm2Constant)}
          isDisabled={isTerm2Constant}
          label="Add metric or operation..."
          loading={loading}
          onClick={(operation) => setTermB(operation)}
          onClose={() => {}}
          source={statMetricsOperationsSource}
        />
        {createMetricBExpanded && (
          <FlexContainer direction="column" marginTop="8px" overflow="visible">
            <SimpleSelector options={CREATE_TYPES} value={createMetricBType} onClick={(option) => setCreateMetricBType(option?.value)} />
            {createMetricBType != null ?
              createMetricBType === "metric" ?
                <CreateStatMetricComponent onCancel={() => setCreateMetricBExpanded(false)} onComplete={createStatUnitCompleted(setTermB, setCreateMetricBExpanded)} />
                : <CreateOperationComponent onCancel={() => setCreateMetricBExpanded(false)} onCompleted={createOperationCompleted(setTermB, setCreateMetricBExpanded)} seasonID={seasonID} />
              : null}
          </FlexContainer>
        )}
        {termB != null && (
          <CompactDetailsCard isDisabled={isTerm2Constant} subTitle={[termB?.__typename]} title={termB?.name ?? 'term 2 name missing'} onClose={() => setTermB(null)} />
        )}
        <FlexContainer alignItems="center" marginTop="20px">
          <NoShrink>
            <SectionHeadingText margin="0 4px 0 0">Constant value:</SectionHeadingText>
          </NoShrink>
          <InputField margin="0 4px 0 0" name="term2 constant" onChange={() => setIsTerm2Constant(!isTerm2Constant)} type="checkbox" value={isTerm2Constant} width="24px" wrapperWidth="24px" />
          <InputField disabled={!isTerm2Constant} onChange={(num) => setTerm2Constant(num)} placeholder="Type a number" type="number" value={term2Constant || 1} />
        </FlexContainer>
        <DetailsText margin="4px 0 0 0">If a constant value is set above, no Stat metric or operation will be attached for term 2.</DetailsText>
        <FlexContainer justify="center" marginTop="20px">
          <Button isDisabled={false} label="Cancel" loading={isSubmitting} onClick={onCancel} />
          <Button isLoading={false} label="Create Operation" loading={isSubmitting} onClick={createOperation} />
        </FlexContainer>
      </FlexContainer>
    </Wrapper>
  )
}

export default CreateOperationComponent;
