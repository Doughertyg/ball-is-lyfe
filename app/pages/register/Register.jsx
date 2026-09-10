import React from 'react';
import {useState, useContext} from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { useHistory, Link } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';

import InputField from '../../components/InputField.jsx';
import { AuthContext } from '../../context/auth';
import LoadingSpinnerBack from '../../components/LoadingSpinnerBack.jsx';
import { logAndExtractErrors } from '../../util/errorHandling';
import { PASSWORD_REQUIREMENTS_MESSAGE, meetsPasswordRequirements } from '../../../util/validators';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

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
    } else if (!meetsPasswordRequirements(password)) {
      formErrors.password = PASSWORD_REQUIREMENTS_MESSAGE;
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
    <div className="w-full min-h-[80vh] box-border flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[380px] flex flex-col items-stretch box-border rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
        {registeringGoogleUser ? (
          <div className="flex flex-col items-center justify-center gap-3 py-5">
            <h1 className="text-lg font-semibold">Registering user...</h1>
            <LoadingSpinnerBack />
          </div>
        ) : (
          <>
            <h1 className="mb-5 text-center text-2xl font-semibold text-slate-900">Create an account</h1>
            <div className="mb-5 flex justify-center">
              <GoogleLogin
                clientId={CLIENT_ID}
                onSuccess={onGoogleAuthSuccess}
                onFailure={onGoogleAuthError}
                cookiePolicy='single_host_origin'
                prompt='consent'
              />
            </div>
          </>
        )}
        {showLegacyRegister && (
          <>
            <div className="my-4 flex items-center text-xs uppercase text-gray-500">
              <span className="mr-3 flex-1 border-t border-black/10" />
              or
              <span className="ml-3 flex-1 border-t border-black/10" />
            </div>
            <div className="mb-4">
              <div className="mb-1.5 text-base font-semibold">Username</div>
              <InputField 
                type="text"
                errors={errors.username}
                disabled={loading}
                name="username"
                onChange={handleUsernameChange}
                placeholder="Type a username..."
                value={username}
              />
            </div>
            <div className="mb-4">
              <div className="mb-1.5 text-base font-semibold">Email</div>
              <InputField 
                type="email"
                errors={errors.email}
                disabled={loading}
                name="email"
                onChange={handleEmailChange}
                placeholder="Email..."
                value={email}
              />
            </div>
            <div className="mb-4">
              <div className="mb-1.5 text-base font-semibold">Password</div>
              <InputField 
                type="password"
                errors={errors.password}
                disabled={loading}
                name="password"
                onChange={handlePasswordChange}
                placeholder="Password..."
                value={password}
              />
              {!errors.password && <p className="mt-1 text-left text-xs text-gray-500">{PASSWORD_REQUIREMENTS_MESSAGE}</p>}
            </div>
            <div className="mb-4">
              <div className="mb-1.5 text-base font-semibold">Confirm Password</div>
              <InputField 
                type="password"
                errors={errors.confirmPassword}
                disabled={loading}
                name="confirm-password"
                onChange={handleConfirmPasswordChange}
                placeholder="Retype your password..."
                value={confirmPassword}
              />
            </div>
            <button
              type="button"
              aria-label="Submit"
              disabled={loading}
              onClick={submitForm}
              className={`mt-2 w-full rounded-xl px-5 py-2.5 font-semibold shadow-sm transition-all duration-200 ${
                loading
                  ? 'cursor-default bg-slate-200 text-slate-500'
                  : 'bg-slate-900 text-white hover:bg-slate-700 hover:shadow-md active:bg-slate-800'
              }`}
            >
              Submit
            </button>
          </>
        )}
        {generalErrors.length > 0 && (
          <div className="mt-4 w-full rounded-md border border-red-500 bg-red-500/10 p-5 box-border">
            <ul className="list-disc text-left text-red-600">
              {generalErrors.map(([key, error]) => (<li key={key}>{error}</li>))}
            </ul>
          </div>
        )}
        <div className="mt-5 w-full text-center text-sm text-gray-500">
          Already have an account? <Link to="/login" className="font-semibold text-teal-600 hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
  )
};

export default Register;
