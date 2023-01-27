import React, { useState } from 'react';
import styled from 'styled-components';
import { Divider, FlexContainer, PageHeader, SectionHeadingText } from '../styled-components/common';
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
const CreateStatComponent = () => {
  const [name, setName] = useState("");
  const [operations, setOperations] = useState([]);
  // create Stat Component
  return (
    <Wrapper>
      <FlexContainer direction="column" height="100%" justify="flex-start" overflow="visible" padding="0 8px" width="100%">
        <PageHeader margin="0px">Create Stat</PageHeader>
        <Divider width="100%" />
        <SectionHeadingText margin="8px 0 8px 0">Name</SectionHeadingText>
        <InputField errors={name === "" ? 'Name cannot be blank.' : null} loading={false/* isSubmitting */} name="name" onChange={(input) => setName(input)} placeholder="Stat name..." width="100%" value={name} />
      </FlexContainer>
    </Wrapper>
  );
}

export default CreateStatComponent;
