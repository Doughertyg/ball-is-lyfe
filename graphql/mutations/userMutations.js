export const LOGIN_WITH_GOOGLE_MUTATION = (googleToken) => `
  mutation {
    loginUserWithGoogle(token: "${googleToken}") {
      token
      user {
        email
        id
        username
        profilePicture
      }
    }
  }
`;

export const REFRESH_TOKEN_MUTATION = `
  mutation {
    refreshToken {
      token
      user {
        id
        email
        username
        profilePicture
      }
    }
  }
`;

export const LOGOUT_MUTATION = `
  mutation {
    logout
  }
`;
