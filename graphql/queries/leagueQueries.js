import gql from 'graphql-tag';

export const FETCH_USER_LEAGUES_QUERY = gql`
  query($userID: ID!) {
    getLeagues {
      _id
      name
      description
      profilePicture
      sport
      location
    }
    getLeaguesByUser(userID: $userID) {
      _id
      name
      description
      profilePicture
      sport
      location
    }
  }
`;

// fetch public leagues queries
