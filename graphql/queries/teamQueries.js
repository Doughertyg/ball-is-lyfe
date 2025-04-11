import gql from 'graphql-tag';

export const FETCH_USER_TEAMS_QUERY = gql`
  query($userID: ID!) {
    getTeamsByUser(userID: $userID) {
      id
      name
      description
      profilePicture
      bannerPicture
      sport
      players {
        name
        profilePicture
      }
    }
  }
`;

// fetch public teams query
