import React from 'react';
import {useState, useContext} from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router';

import InputField from '../../components/InputField.jsx';
import { AuthContext } from '../../context/auth';
import {ButtonContainer, Divider, FlexContainer, PageHeader, SectionHeadingText} from '../../styled-components/common';
import {CardWrapper, CardContentWrapper, CardBody} from '../../styled-components/card';
import {Button, ErrorList, ErrorListItem, ErrorListWrapper, InputError} from '../../styled-components/interactive';

const CenteredContainer = styled.div`
  margin: 0 auto;
  text-align: center;
  vertical-align: middle;
`;

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState({});
  const history = useHistory();
  const { login } = useContext(AuthContext);

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    onCompleted: (res) => {
      console.log('completed! res: ', res);
      history.push('/');
    },
    update(proxy, { data: { register: userData }}) {
      console.log('results: ', userData);
      login(userData);
    },
    onError: (err) => {
      console.log('err: ', err.graphQLErrors);
      setErrors({...errors, ...err.graphQLErrors[0]?.extensions.exception.errors})
    },
    variables: {
      username: username,
      email: email,
      password: password,
      confirmPassword: confirmPassword
    }
  })

  const validateForm = () => {
    const formErrors = {};
    if (username === '') {
      formErrors.username = 'Must type a username';
    }

    if (email === '' /* do other validation here */) {
      formErrors.email = 'Must type an email';
    }

    if (password === '') {
      formErrors.password = 'Must type a password';
    }

    if (confirmPassword === '') {
      formErrors.confirmPassword = 'Must confirm your password';
    }

    setErrors(formErrors);
    return formErrors;
  }

  const submitForm = () => {
    const formErrors = validateForm();
    console.log('formErrors: ', formErrors);
    if (Object.keys(formErrors).length > 0) {
      return;
    }

    console.log('input: ', username, email, password, confirmPassword);
    addUser();
  }
  
  return (
    <CenteredContainer>
        <PageHeader>
          REGISTER
        </PageHeader>
        <CardWrapper>
          <CardContentWrapper>
            <CardBody>
              <SectionHeadingText>Username</SectionHeadingText>
              <InputField 
                type="text"
                errors={errors.username}
                disabled={loading}
                name="username"
                onChange={setUsername}
                placeholder="Type a username..."
                value={username}
              />
              <Divider />
              <SectionHeadingText marginTop="20px">Email</SectionHeadingText>
              <InputField 
                type="email"
                errors={errors.email}
                disabled={loading}
                name="email"
                onChange={setEmail}
                placeholder="Email..."
                value={email}
              />
              <Divider />
              <SectionHeadingText marginTop="20px">Password</SectionHeadingText>
              <InputField 
                type="password"
                errors={errors.password}
                disabled={loading}
                name="password"
                onChange={setPassword}
                placeholder="Password..."
                value={password}
              />
              <SectionHeadingText marginTop="20px">Confirm Password</SectionHeadingText>
              <InputField 
                type="password"
                errors={errors.confirmPassword}
                disabled={loading}
                name="confirm-password"
                onChange={setConfirmPassword}
                placeholder="Retype your password..."
                value={confirmPassword}
              />
              <Divider />
                <Button 
                  aria-label="Submit"
                  disabled={loading}
                  marginTop="20px"
                  onClick={submitForm}
                >Submit</Button>
            </CardBody>
          </CardContentWrapper>
        </CardWrapper>
        {errors != null && Object.keys(errors).length > 0 && 
          (
            <FlexContainer>
              <ErrorListWrapper>
                <ErrorList>
                  {Object.values(errors).map(error => (<li>{error}</li>))}
                </ErrorList>
              </ErrorListWrapper>
            </FlexContainer>
          )
        }
    </CenteredContainer>
  )
};

export default Register;
