import gql from 'graphql-tag';

export const FETCH_USER_SEASONS_QUERY = gql`
  query($userID: ID!) {
    getSeasonsByUser(userID: $userID) {
      description
      id
      league {
        name
        sport
      }
      name
      seasonStart
      seasonEnd
    }
  }
`;

// fetch public seasons query...
