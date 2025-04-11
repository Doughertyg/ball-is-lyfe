import React, { useContext } from 'react';
import {useState} from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router';
import { GoogleLogin } from 'react-google-login';

import InputField from '../../components/InputField.jsx';
import {Divider, FlexContainer, PageHeader, SectionHeadingText} from '../../styled-components/common';
import {CardWrapper, CardContentWrapper, CardBody} from '../../styled-components/card';
import {Button, ErrorList, ErrorListWrapper} from '../../styled-components/interactive';
import { AuthContext } from '../../context/auth.js';
import LoadingSpinnerSpin from '../../components/LoadingSpinnerSpin.jsx';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const CenteredContainer = styled.div`
  margin: 0 auto;
  text-align: center;
  vertical-align: middle;
`;

const ErrorWrapper = styled.div`
  margin-top: 8px;
`;

function Login({ oldLoginPageFlag }) {
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const history = useHistory();
  const { errors, loggingIn, login, setErrors } = useContext(AuthContext);

  const _validateForm = () => {
    const formErrors = {};

    if (username === '') {
      formErrors.username = 'Must type a username';
    }

    if (password === '') {
      formErrors.password = 'Must type a password';
    }

    // setErrors(formErrors);
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
    login(res.tokenId).then(() => history.push('/home')).catch(() => console.log('LOGIN failed'))
  }

  const onGoogleAuthError = (err) => {
    console.log('Error in the onGoogleAuthError callback: ', err);
    const graphQLErrors = err.message ? {err: err.message} : err?.graphQLErrors[0]?.extensions?.exception?.errors ?? {'graphQLError': 'Server error has ocurred, please try again'};
    setErrors(errors => ({...errors, ...graphQLErrors}));
  }
  
  return (
    <CenteredContainer>
        {loggingIn ? (
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
        </>)}
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
