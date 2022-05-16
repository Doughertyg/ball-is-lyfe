import React from 'react';
import InputField from '../../components/InputField.jsx';
import {useState} from 'react';
import useNewLeagueFormHook from '../../hooks/useNewLeagueFormHook';
import {useHistory} from 'react-router';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import {CardText, Divider, FlexContainer, PageHeader, SectionHeadingText} from '../../styled-components/common';
import Button from '../../components/Button.jsx';

const CREATE_LEAGUE = gql`
  mutation createLeague(
    $name: String!
    $description: String!
    $location: String!
    $sport: String!
    $profilePicture: String!
    $bannerPicture: String!
  ) {
    createLeague(
      leagueInput: {
        name: $name
        description: $description
        location: $location
        sport: $sport
        profilePicture: $profilePicture
        bannerPicture: $bannerPicture
      }
    ) {
      _id
      name
      description
      sport
      createdAt
    }
  }
`;

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
  const [errors, setErrors] = useState({});
  const history = useHistory();

  const {inputs, setters, validate} = useNewLeagueFormHook();

  const [createLeague, { loading }] = useMutation(CREATE_LEAGUE, {
    onCompleted: (res) => {
      console.log('onCompleted mutation: res:  ', res);
      onMutationCompleted?.();
      history.push(`/`);
    },
    onError: (error) => {
      console.log('stringified error on mutation:  ', JSON.stringify(error, null, 2));
    },
    update(proxy, { data: { newLeague: userData }}) {
      console.log('results: ', userData);
    },
    variables: {
      name: inputs.name,
      description: inputs.description,
      location: inputs.location,
      sport: inputs.sport,
      profilePicture: inputs.profilePicture ?? '',
      bannerPicture: inputs.bannerPicture ?? '',
    }
  })

  const onSubmit = () => {
    const errors = validate();
    setErrors(errors);
    

    if (Object.keys(errors).length === 0) {
      console.log('no errors! mutation submitted');
      createLeague();
    }
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
      <SectionHeadingText marginTop="16px">Location</SectionHeadingText>
      <InputField errors={errors.location ?? null} onChange={setters.setLocation} width="700px" value={inputs.location} />
      <FlexContainer marginTop="16px">
        <Button label="Cancel" onClick={() => {history.goBack()}} />
        <Button label="Create League" onClick={onSubmit} />
      </FlexContainer>
    </FlexContainer>
  )
}
