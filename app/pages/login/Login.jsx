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
import { logAndExtractErrors } from '../../util/errorHandling';

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
  const [googleLoginLoading, setGoogleLoginLoading] = useState(false);
  const history = useHistory();
  const { errors, loading, login, setErrors } = useContext(AuthContext);
  const isLoginLoading = loading || googleLoginLoading || emailPasswordLoading;

  const [loginUser, { loading: emailPasswordLoading }] = useMutation(LOGIN_USER, {
    onCompleted: (res) => {
      const userData = res?.login;
      login(userData)
        .then(() => history.push('/home'))
        .catch(() => console.log('LOGIN failed'));
    },
    onError: (err) => {
      setErrors(errors => ({...errors, ...logAndExtractErrors(err)}));
    }
  });

  const validateForm = () => {
    const formErrors = {};

    if (email?.trim() === '') {
      formErrors.email = 'Must type an email';
    }

    if (password?.trim() === '') {
      formErrors.password = 'Must type a password';
    }

    // setErrors(formErrors);
    return formErrors;
  }

  const submitForm = () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    loginUser({ variables: { email, password }});
  }

  const onGoogleAuthSuccess = (res) => {
    login(res.tokenId)
      .then(() => history.push('/home'))
      .catch(() => {})
      .finally(() => setGoogleLoginLoading(false));
  }

  const onGoogleAuthError = (err) => {
    setGoogleLoginLoading(false);
    setErrors(errors => ({...errors, ...logAndExtractErrors(err)}));
  };

  const showLegacyLogin = oldLoginPageFlag !== false;

  // Field-level errors render inline under their input; clear them as soon as
  // the user edits that field so corrections don't leave a stale message.
  const clearFieldError = (field) => {
    setErrors(errors => {
      if (!errors[field]) return errors;
      const { [field]: _removed, ...rest } = errors;
      return rest;
    });
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    clearFieldError('email');
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    clearFieldError('password');
  };

  const FIELD_ERROR_KEYS = ['email', 'password'];
  const generalErrors = Object.entries(errors ?? {}).filter(([key]) => !FIELD_ERROR_KEYS.includes(key));
  
  return (
    <CenteredContainer>
        {isLoginLoading ? (
          <FlexContainer height="45px" justify="flex-start" marginTop="20px" width="800px">
            <LoadingSpinnerSpin />
          </FlexContainer>) : (
        <>
          <PageHeader>
            LOGIN
          </PageHeader>
          <GoogleLogin
            clientId={CLIENT_ID}
            disabled={isLoginLoading}
            onRequest={() => setGoogleLoginLoading(true)}
            onSuccess={onGoogleAuthSuccess}
            onFailure={onGoogleAuthError}
            cookiePolicy='single_host_origin'
            prompt='consent'
          />
        </>)}
        {showLegacyLogin && (
          <CardWrapper>
            <CardContentWrapper>
              <CardBody>
                <SectionHeadingText>Email</SectionHeadingText>
                <InputField 
                  type="email"
                  errors={errors.email}
                  disabled={isLoginLoading}
                  name="email"
                  onChange={handleEmailChange}
                  placeholder="Type your email..."
                  value={email}
                />
                <Divider />
                <SectionHeadingText marginTop="20px">Password</SectionHeadingText>
                <InputField 
                  type="password"
                  errors={errors.password}
                  disabled={isLoginLoading}
                  name="password"
                  onChange={handlePasswordChange}
                  placeholder="Password..."
                  value={password}
                />
                <Divider />
                  <Button 
                    aria-label="Login"
                    disabled={isLoginLoading}
                    marginTop="20px"
                    onClick={submitForm}
                  >Login</Button>
              </CardBody>
            </CardContentWrapper>
          </CardWrapper>
        )}
        {errors != null && generalErrors.length > 0 && 
          (
            <ErrorWrapper>
              <FlexContainer>
                <ErrorListWrapper>
                  <ErrorList>
                    {generalErrors.map(([key, error]) => (<li key={key}>{error}</li>))}
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
