import React, { useState } from 'react';
import styled from 'styled-components';
import { Divider, FlexContainer, PageHeader, SectionHeadingText } from '../styled-components/common';
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
const CreateStatComponent = ({ onCancel }) => {
  const [name, setName] = useState("");
  const [operations, setOperations] = useState(null);
  const [createOperationExpanded, setCreateOperationExpanded] = useState(false);
  
  const isSubmitting = false;
  const loadingOperations = false;

  const onSubmit = () => {
    // commit mutation
    console.log('submit mutation!!');
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

  return (
    <Wrapper>
      <FlexContainer direction="column" height="100%" justify="flex-start" overflow="visible" padding="0 8px" width="100%">
        <PageHeader margin="0px">Create Stat</PageHeader>
        <Divider width="100%" />
        <SectionHeadingText margin="8px 0 8px 0">Name</SectionHeadingText>
        <InputField errors={name === "" ? 'Name cannot be blank.' : null} loading={false/* isSubmitting */} name="name" onChange={(input) => setName(input)} placeholder="Stat name..." width="100%" value={name} />
        <SectionHeadingText margin="8px 0 8px 0">Operations</SectionHeadingText>
        <CollapsibleSearchField
          filterResults={(entry, input) => entry?.metricA?.name?.includes(input) || entry?.metricB?.name?.includes(input)}
          forceExpanded
          getRightButton={getCreateOperationButton}
          label="Add Operations..."
          loading={loadingOperations}
          onClick={(operation) => setOperations(operation)}
          onClose={() => {}}
          source={[]}
        />
        {createOperationExpanded && (
          <CreateOperationComponent onCancel={() => setCreateOperationExpanded(false)} />
        )}
        {operations != null && (
          <CompactDetailsCard
            title={operations?.name ?? 'Operation name missing'}
            details={[operations?.metricA?.name, operations?.operation, operations?.metricB?.name]}
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
