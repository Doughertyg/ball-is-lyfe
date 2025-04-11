import React, {useState} from 'react';
import styled from 'styled-components';
import { DetailsText, Divider, FlexContainer, PageHeader, SectionHeadingText } from '../styled-components/common';
import InputField from './InputField.jsx';
import Button from './Button.jsx';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';

const Wrapper = styled.div`
  border-radius: 8px;
  border: 1px solid rgb(105, 105, 105);
  background-color: rgba(139, 139, 139, 0.2);
  box-sizing: border-box;
  margin: ${props => props.margin ?? '0'};
  padding: 20px;
  width: 100%;
`;

const CREATE_STAT_METRIC_MUTATION = gql`
  mutation createStatUnit(
    $abbreviation: String!,
    $name: String!,
    $value: Int!,
  ) {
    createStatUnit(
      abbreviation: $abbreviation,
      name: $name,
      value: $value
    ) {
      id
      name
      __typename
    }
  }
`;

/**
 * Create Stat Metric Component
 * Component for creating a stat metric that will be used
 * to track a specific stat (e.x.: FGA)
 * 
 *  ___________________________________________________________
 *  ,---------------------------------------------------------,
 *  |   ,--------------------------.                          |
 *  |  |     Name...                |                         |
 *  |   `--------------------------`                          |
 *  |   ,----------------------------------.                  |
 *  |  |   Value...                        |
 *  |   '----------------------------------'                  |
 *  |                                                         |
 *  |              .--------.    .------------------.         |
 *  |              | Cancel |    | Create Metric    |         |
 *  |              '--------'    '------------------'         |
 *  `---------------------------------------------------------`
 */
const CreateStatMetricComponent = ({ margin, onCancel, onComplete }) => {
  const [abbreviation, setAbbreviation] = useState('');
  const [name, setName] = useState('');
  const [value, setValue] = useState('');

  const [createStatMetric, {isSubmitting}] = useMutation(CREATE_STAT_METRIC_MUTATION, {
    onCompleted: (res) => {
      console.log('mutation completed!!! res: ', res);
      onComplete?.(res);
    },
    onError: (error) => {
      console.log('stringified error on mutation:  ', JSON.stringify(error, null, 2))
    },
    variables: {
      abbreviation,
      name,
      value: Number(value)
    }
  });

  return (
    <Wrapper margin={margin}>
      <FlexContainer direction="column" height="100%" justify="flex-start" overflow="visible" padding="0 8px" width="100%">
      <PageHeader margin="0px">Create Stat Metric</PageHeader>
      <DetailsText padding="4px 0" overflow="hidden">A Stat Metric is the most fundamental unit of a stat and meant purely for tracking/counting (FGA, Assists, etc.). All stats and operations will be built from your stat metrics.</DetailsText>
      <Divider width="100%" />
      <SectionHeadingText margin="20px 0 8px 0">Name</SectionHeadingText>
      <InputField errors={name === "" ? 'Name cannot be blank.' : null} loading={isSubmitting} name="name" onChange={(input) => setName(input)} placeholder="Stat Metric name..." width="100%" value={name} />
      <SectionHeadingText margin="20px 0 8px 0">Abbreviation</SectionHeadingText>
      <DetailsText padding="4px 0" overflow="hidden">The abbreviation will be used to identify the stat metric in search, stat operation previews, and in the live stats mode.</DetailsText>
      <InputField errors={abbreviation === "" ? 'Abbreviation cannot be blank.' : null} loading={isSubmitting} maxLength={5} minLength={1} name="abbreviation" onChange={(input) => setAbbreviation(input)} placeholder="Stat Metric abbreviation..." width="100%" value={abbreviation} />
      <SectionHeadingText margin="20px 0 8px 0">Value</SectionHeadingText>
      <InputField errors={value === "" ? 'Value cannot be blank.' : null} loading={isSubmitting} name="value" onChange={(input) => setValue(input)} placeholder="Stat Metric value..." type="number" width="100%" value={value} />
      <FlexContainer justify="center" marginTop="20px">
        <Button isDisabled={false} label="Cancel" loading={isSubmitting} onClick={onCancel} />
        <Button isLoading={false} label="Create Metric" loading={isSubmitting} onClick={createStatMetric} />
      </FlexContainer>
      </FlexContainer>
    </Wrapper>
  )
}

export default CreateStatMetricComponent;
