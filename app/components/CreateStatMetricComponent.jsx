import React, {useState} from 'react';
import styled from 'styled-components';
import { Divider, FlexContainer, PageHeader, SectionHeadingText } from '../styled-components/common';
import InputField from './InputField.jsx';
import Button from './Button.jsx';

const Wrapper = styled.div`
  border-radius: 8px;
  border: 1px solid rgb(105, 105, 105);
  background-color: rgba(139, 139, 139, 0.2);
  box-sizing: border-box;
  margin: 8px 0;
  padding: 20px;
  width: 100%;
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
const CreateStatMetricComponent = ({ onCancel }) => {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');

  const isSubmitting = false;

  const onSubmit = () => {
    // commit create stat metric mutation
  }

  return (
    <Wrapper>
      <FlexContainer direction="column" height="100%" justify="flex-start" overflow="visible" padding="0 8px" width="100%">
      <PageHeader margin="0px">Create Stat Metric</PageHeader>
      <Divider width="100%" />
      <SectionHeadingText margin="8px 0 8px 0">Name</SectionHeadingText>
      <InputField errors={name === "" ? 'Name cannot be blank.' : null} loading={false/* isSubmitting */} name="name" onChange={(input) => setName(input)} placeholder="Stat Metric name..." width="100%" value={name} />
      <SectionHeadingText margin="8px 0 8px 0">Value</SectionHeadingText>
      <InputField errors={value === "" ? 'Value cannot be blank.' : null} loading={false/* isSubmitting */} name="value" onChange={(input) => setValue(input)} placeholder="Stat Metric value..." width="100%" value={value} />
      <FlexContainer justify="center" marginTop="12px">
        <Button isDisabled={false} label="Cancel" loading={isSubmitting} onClick={onCancel} />
        <Button isLoading={false} label="Create Metric" loading={isSubmitting} onClick={onSubmit} />
      </FlexContainer>
      </FlexContainer>
    </Wrapper>
  )
}

export default CreateStatMetricComponent;
