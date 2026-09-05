import React from 'react';
import {useState, useContext} from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router';
import { GoogleLogin } from 'react-google-login';

import InputField from '../../components/InputField.jsx';
import { AuthContext } from '../../context/auth';
import {ButtonContainer, Divider, FlexContainer, PageHeader, SectionHeadingText} from '../../styled-components/common';
import {CardWrapper, CardContentWrapper, CardBody} from '../../styled-components/card';
import {Button, ErrorList, ErrorListItem, ErrorListWrapper, InputError} from '../../styled-components/interactive';
import LoadingSpinnerBack from '../../components/LoadingSpinnerBack.jsx';
import { logAndExtractErrors } from '../../util/errorHandling';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const CenteredContainer = styled.div`
  margin: 0 auto;
  text-align: center;
  vertical-align: middle;
`;

const ErrorWrapper = styled.div`
  margin-top: 8px;
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

const REGISTER_GOOGLE_USER = gql`
  mutation registerUser(
    $token: String!
  ) {
    registerUser(
      token: $token
    ) {
      id
      email
      createdAt
      profilePicture
      username
      name
      token
    }
  }
`;

function Register({ oldRegisterFlow = true }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState({});
  const history = useHistory();
  const { login } = useContext(AuthContext);
  const showLegacyRegister = oldRegisterFlow !== false;

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    onCompleted: (res) => {
      console.log('completed! res: ', res);
      history.push('/');
    },
    onError: (err) => {
      setErrors({...errors, ...logAndExtractErrors(err)})
    },
    update(proxy, { data: { register: userData }}) {
      console.log('results: ', userData);
      login(userData);
    },
    variables: {
      username: username,
      email: email,
      password: password,
      confirmPassword: confirmPassword
    }
  })

  const [registerUser, { registeringGoogleUser }] = useMutation(REGISTER_GOOGLE_USER, {
    onCompleted: (res) => {
      console.log('completed new registration!');
      history.push('/');
    },
    onError: (err) => {
      setErrors({...errors, ...logAndExtractErrors(err)});
    },
    update(proxy, { data: { registerUser: userData }}) {
      login(userData);
    }
  });

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

  const onGoogleAuthSuccess = (res) => {
    registerUser({
      variables: {
        token: res.tokenId,
        userData: res.profileObj
      }
    });
  }

  const onGoogleAuthError = (err) => {
    setErrors({...errors, ...logAndExtractErrors(err)});
  }

  // Field-level errors render inline under their input; clear them as soon as
  // the user edits that field so corrections don't leave a stale message.
  const clearFieldError = (field) => {
    setErrors(errors => {
      if (!errors[field]) return errors;
      const { [field]: _removed, ...rest } = errors;
      return rest;
    });
  };

  const handleUsernameChange = (value) => { setUsername(value); clearFieldError('username'); };
  const handleEmailChange = (value) => { setEmail(value); clearFieldError('email'); };
  const handlePasswordChange = (value) => { setPassword(value); clearFieldError('password'); };
  const handleConfirmPasswordChange = (value) => { setConfirmPassword(value); clearFieldError('confirmPassword'); };

  const FIELD_ERROR_KEYS = ['username', 'email', 'password', 'confirmPassword'];
  const generalErrors = Object.entries(errors ?? {}).filter(([key]) => !FIELD_ERROR_KEYS.includes(key));
  
  return (
    <CenteredContainer>
        {registeringGoogleUser ? (
          <FlexContainer  height="45px" justify="flex-start" marginTop="20px" width="800px">
            <h1>Registering user...</h1>
            <LoadingSpinnerBack />
          </FlexContainer>) : (
          <>
            <PageHeader>
              REGISTER
            </PageHeader>
            <GoogleLogin
              clientId={CLIENT_ID}
              onSuccess={onGoogleAuthSuccess}
              onFailure={onGoogleAuthError}
              cookiePolicy='single_host_origin'
              prompt='consent'
            />
          </>
        )}
        {showLegacyRegister && (
          <CardWrapper>
            <CardContentWrapper>
              <CardBody>
                <SectionHeadingText>Username</SectionHeadingText>
                <InputField 
                  type="text"
                  errors={errors.username}
                  disabled={loading}
                  name="username"
                  onChange={handleUsernameChange}
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
                  onChange={handleEmailChange}
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
                  onChange={handlePasswordChange}
                  placeholder="Password..."
                  value={password}
                />
                <SectionHeadingText marginTop="20px">Confirm Password</SectionHeadingText>
                <InputField 
                  type="password"
                  errors={errors.confirmPassword}
                  disabled={loading}
                  name="confirm-password"
                  onChange={handleConfirmPasswordChange}
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

export default Register;
