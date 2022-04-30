import React from 'react';
import InputField from '../../components/InputField.jsx';
import {useState} from 'react';
import useNewLeagueFormHook from '../../hooks/useNewLeagueFormHook';
import {Divider, FlexContainer, PageHeader, SectionHeadingText} from '../../styled-components/common';
import Button from '../../components/Button.jsx';

/**
 * Create league page for creating a new league
 * 
 *     ,~-----------------------------------~,
 *     | New League                          |
 *     |                                     |
 *     | Name :```````````````````````````:  |
 *     | Bio  :```````````````````````````:  |
 *     | Sport :``````````````````````````:  |
 *     |        ``````````````````````````   |
 *     | Location :```````````````````````:  |
 *     |           ```````````````````````   |
 *     | Photo :``````````````````````````:  |
 *     |        ``````````````````````````   |
 *     | Banner Photo: :```````````````````: |
 *     |                ```````````````````  |
 *     | Players (+)                         |
 *     | :'`````````': :'`````````': :'``````|
 *     | |   ,---,   | |           | |       |
 *     | |  | *  *|  | |           | |       |
 *     | |   \   /   | |           | |       |
 *     | |   Player  | |  Player   | |  Playe|
 *     | `;_________;` `;_________;` `;______|
 *     |                                     |
 *     |                                     |
 *     |                                     |
 *      `-----------------------------------"
 */
export default function LeagueNewPage() {
  const {inputs, setters, validate} = useNewLeagueFormHook();
  const [errors, setErrors] = useState({});
  const onSubmit = () => {
    const errors = validate();
    setErrors(errors);
  }
  
  return (
    <FlexContainer alignItems="center" direction="column" width="100%">
      <PageHeader>New League</PageHeader>
      <Divider />
      <SectionHeadingText marginTop="16px">Name</SectionHeadingText>
      <InputField errors={errors.name ?? null} onChange={setters.setName} width="700px" value={inputs.name} />
      <SectionHeadingText marginTop="16px">Description</SectionHeadingText>
      <InputField errors={errors.description ?? null} onChange={setters.setDescription} width="700px" value={inputs.description} />
      <SectionHeadingText marginTop="16px">Sport</SectionHeadingText>
      <InputField errors={errors.sport ?? null} onChange={setters.setSport} width="700px" value={inputs.sport} />
      <FlexContainer marginTop="16px">
        <Button label="Cancel" onClick={() => {console.log('cancel')}} />
        <Button label="Create League" onClick={() => {console.log('create league')}} />
      </FlexContainer>
    </FlexContainer>
  )
}
