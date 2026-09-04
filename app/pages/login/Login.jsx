import React, { useContext } from 'react';
import {useState} from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import styled from 'styled-components';
import { useHistory } from 'react-router';
import { GoogleLogin } from 'react-google-login';

import InputField from '../../components/InputField.jsx';
import {Divider, FlexContainer, PageHeader, SectionHeadingText} from '../../styled-components/common';
import {CardWrapper, CardContentWrapper, CardBody} from '../../styled-components/card';
import {Button, ErrorList, ErrorListWrapper} from '../../styled-components/interactive';
import { AuthContext } from '../../context/auth.js';
import LoadingSpinnerSpin from '../../components/LoadingSpinnerSpin.jsx';

const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      email
      username
      authType
      token
    }
  }
`;

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const CenteredContainer = styled.div`
  margin: 0 auto;
  text-align: center;
  vertical-align: middle;
`;

const ErrorWrapper = styled.div`
  margin-top: 8px;
`;

function Login({ oldLoginPageFlag = true }) {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const history = useHistory();
  const { errors, loading, login, setErrors } = useContext(AuthContext);
  const [loginUser, { loading: emailPasswordLoading }] = useMutation(LOGIN_USER, {
    onCompleted: (res) => {
      const userData = res?.login;
      login(userData)
        .then(() => history.push('/home'))
        .catch(() => console.log('LOGIN failed'));
    },
    onError: (err) => {
      const graphQLErrors = err.message ? {err: err.message} : err?.graphQLErrors[0]?.extensions?.exception?.errors ?? {'graphQLError': 'Server error has ocurred, please try again'};
      setErrors(errors => ({...errors, ...graphQLErrors}));
    }
  });

  const validateForm = () => {
    const formErrors = {};

    if (email === '') {
      formErrors.email = 'Must type an email';
    }

    if (password === '') {
      formErrors.password = 'Must type a password';
    }

    return formErrors;
  };

  const submitForm = () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    loginUser({ variables: { email, password }});
  };

  const onGoogleAuthSuccess = (res) => {
    login(res.tokenId).then(() => history.push('/home')).catch(() => console.log('LOGIN failed'));
  };

  const onGoogleAuthError = (err) => {
    console.log('Error in the onGoogleAuthError callback: ', err);
    const graphQLErrors = err.message ? {err: err.message} : err?.graphQLErrors[0]?.extensions?.exception?.errors ?? {'graphQLError': 'Server error has ocurred, please try again'};
    setErrors(errors => ({...errors, ...graphQLErrors}));
  };

  const showLegacyLogin = oldLoginPageFlag !== false;
  const isLoading = loading || emailPasswordLoading;
  
  return (
    <CenteredContainer>
        {isLoading ? (
          <FlexContainer height="45px" justify="flex-start" marginTop="20px" width="800px">
            <LoadingSpinnerSpin />
          </FlexContainer>) : (
        <>
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
        </>) }
        {showLegacyLogin && (
          <CardWrapper>
            <CardContentWrapper>
              <CardBody>
                <SectionHeadingText>Email</SectionHeadingText>
                <InputField 
                  type="email"
                  errors={errors.email}
                  disabled={isLoading}
                  name="email"
                  onChange={setEmail}
                  placeholder="Type your email..."
                  value={email}
                />
                <Divider />
                <SectionHeadingText marginTop="20px">Password</SectionHeadingText>
                <InputField 
                  type="password"
                  errors={errors.password}
                  disabled={isLoading}
                  name="password"
                  onChange={setPassword}
                  placeholder="Password..."
                  value={password}
                />
                <Divider />
                  <Button 
                    aria-label="Login"
                    disabled={isLoading}
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
