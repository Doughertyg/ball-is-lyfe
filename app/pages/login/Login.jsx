import React, { useContext } from 'react';
import {useState} from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router';
import { GoogleLogin } from 'react-google-login';

import InputField from '../../components/InputField.jsx';
import {Divider, FlexContainer, PageHeader, SectionHeadingText} from '../../styled-components/common';
import {CardWrapper, CardContentWrapper, CardBody} from '../../styled-components/card';
import {Button, ErrorList, ErrorListWrapper} from '../../styled-components/interactive';
import { AuthContext } from '../../context/auth.js';

const CLIENT_ID = '1014510632298-mpkf456qeabonn3q835i3nk6b44g1v91.apps.googleusercontent.com';

const CenteredContainer = styled.div`
  margin: 0 auto;
  text-align: center;
  vertical-align: middle;
`;

const ErrorWrapper = styled.div`
  margin-top: 8px;
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

const LOGIN = gql`
  mutation loginUser(
    $token: String!
  ) {
    loginUser(
      token: $token
    ) {
      email
      id
      username
      token
    }
  }
`;

function Login({ oldLoginPageFlag }) {
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [username, setUsername] = useState('');
  const history = useHistory();
  const { login, logout } = useContext(AuthContext);

  const onGoogleAuthError = (err) => {
    const graphQLErrors = err.message ? {err: err.message} : err?.graphQLErrors[0]?.extensions?.exception?.errors ?? {'graphQLError': 'Server error has ocurred, please try again'};
    setErrors({...errors, ...graphQLErrors});
  }

  const [loginWithGoogleToken, { loading }] = useMutation(LOGIN, {
    onCompleted: (res) => {
      history.push('/home');
    },
    update: (_proxy, { data: { loginUser } }) => {
      login(loginUser);
    },
    onError: onGoogleAuthError
  })

  const [_loginUser, { _loading }] = useMutation(LOGIN_USER, {
    onCompleted: (res) => {
      history.push('/');
    },
    update(_proxy, { data: { login: userData }}) {
      login(userData);
    },
    onError: (err) => {
      setErrors({...errors, ...err.graphQLErrors[0]?.extensions.exception.errors})
    },
    variables: {
      username: username,
      password: password,
    }
  })

  const _validateForm = () => {
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

  const _submitForm = () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      return;
    }

    loginUser();
  }

  const onGoogleAuthSuccess = (res) => {
    loginWithGoogleToken({
      variables: {
        token: res.tokenId,
        userData: res.profileObj
      }
    });
  }
  
  return (
    <CenteredContainer>
        <PageHeader>
          LOGIN
        </PageHeader>
        <GoogleLogin
          clientId={CLIENT_ID}
          onSuccess={onGoogleAuthSuccess}
          onFailure={onGoogleAuthError}
          cookiePolicy='single_host_origin'
          prompt='consent'
        />
        {oldLoginPageFlag && (
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
        )}
        {errors != null && Object.keys(errors).length > 0 && 
          (
            <ErrorWrapper>
              <FlexContainer>
                <ErrorListWrapper>
                  <ErrorList>
                    {Object.values(errors).map(error => (<li>{error}</li>))}
                  </ErrorList>
                </ErrorListWrapper>
              </FlexContainer>
            </ErrorWrapper>
          )
        }
    </CenteredContainer>
  )
};

export default Login;
