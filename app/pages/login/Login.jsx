import React, { useContext } from 'react';
import {useState} from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { useHistory, Link } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';

import InputField from '../../components/InputField.jsx';
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') submitForm();
  };

  const FIELD_ERROR_KEYS = ['email', 'password'];
  const generalErrors = Object.entries(errors ?? {}).filter(([key]) => !FIELD_ERROR_KEYS.includes(key));

  return (
    <div className="w-full min-h-[80vh] box-border flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[380px] flex flex-col items-stretch box-border rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
        <h1 className="mb-5 text-center text-2xl font-semibold text-slate-900">Welcome back</h1>
        {isLoginLoading ? (
          <div className="flex justify-center">
            <LoadingSpinnerSpin />
          </div>
        ) : (
          <>
            <div className="mb-5 flex justify-center">
              <GoogleLogin
                clientId={CLIENT_ID}
                disabled={isLoginLoading}
                onRequest={() => setGoogleLoginLoading(true)}
                onSuccess={onGoogleAuthSuccess}
                onFailure={onGoogleAuthError}
                cookiePolicy='single_host_origin'
                prompt='consent'
              />
            </div>
            {showLegacyLogin && (
              <>
                <div className="my-4 flex items-center text-xs uppercase text-gray-500">
                  <span className="mr-3 flex-1 border-t border-black/10" />
                  or
                  <span className="ml-3 flex-1 border-t border-black/10" />
                </div>
                <div className="mb-4">
                  <div className="mb-1.5 text-base font-semibold">Email</div>
                  <InputField
                    type="email"
                    errors={errors.email}
                    disabled={isLoginLoading}
                    name="email"
                    onChange={handleEmailChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your email..."
                    value={email}
                  />
                </div>
                <div className="mb-4">
                  <div className="mb-1.5 text-base font-semibold">Password</div>
                  <InputField
                    type="password"
                    errors={errors.password}
                    disabled={isLoginLoading}
                    name="password"
                    onChange={handlePasswordChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Password..."
                    value={password}
                  />
                </div>
                <button
                  type="button"
                  aria-label="Login"
                  disabled={isLoginLoading}
                  onClick={submitForm}
                  className={`mt-2 w-full rounded-xl px-5 py-2.5 font-semibold shadow-sm transition-all duration-200 ${
                    isLoginLoading
                      ? 'cursor-default bg-slate-200 text-slate-500'
                      : 'bg-slate-900 text-white hover:bg-slate-700 hover:shadow-md active:bg-slate-800'
                  }`}
                >
                  Login
                </button>
              </>
            )}
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
          Don't have an account? <Link to="/register" className="font-semibold text-teal-600 hover:underline">Create one</Link>
        </div>
      </div>
    </div>
  )
};

export default Login;
