import React, { useContext } from 'react';
import {useState} from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router';

import InputField from '../../components/InputField.jsx';
import {ButtonContainer, Divider, FlexContainer, PageHeader, SectionHeadingText} from '../../styled-components/common';
import {CardWrapper, CardContentWrapper, CardBody} from '../../styled-components/card';
import {Button, ErrorList, ErrorListItem, ErrorListWrapper, InputError} from '../../styled-components/interactive';
import { AuthContext } from '../../context/auth.js';

const CenteredContainer = styled.div`
  margin: 0 auto;
  text-align: center;
  vertical-align: middle;
`;

const LOGIN_USER = gql`
  mutation login(
    $username: String!
    $password: String!
  ) {
    login(
        username: $username
        password: $password
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

function Login() {
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [username, setUsername] = useState('');
  const history = useHistory();
  const { login, logout } = useContext(AuthContext);

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    onCompleted: (res) => {
      console.log('completed! res: ', res);
      history.push('/');
    },
    update(_proxy, { data: { login: userData }}) {
      console.log('results: ', userData);
      login(userData);
    },
    onError: (err) => {
      console.log('errs: ', err.graphQLErrors, err);
      setErrors({...errors, ...err.graphQLErrors[0]?.extensions.exception.errors})
    },
    variables: {
      username: username,
      password: password,
    }
  })

  const validateForm = () => {
    const formErrors = {};

    if (username === '') {
      formErrors.username = 'Must type a username';
    }

    if (password === '') {
      formErrors.password = 'Must type a password';
    }

    setErrors(formErrors);
    return formErrors;
  }

  const submitForm = () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      return;
    }

    console.log('input: ', username, password);
    loginUser();
  }
  
  return (
    <CenteredContainer>
        <PageHeader>
          LOGIN
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
              <Divider />
                <Button 
                  aria-label="Login"
                  disabled={loading}
                  marginTop="20px"
                  onClick={submitForm}
                >Login</Button>
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

export default Login;
