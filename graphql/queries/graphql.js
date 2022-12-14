import gql from 'graphql-tag';

export const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

// export const FETCH_SEASONS_QUERY = gql`
//   {
//     getSeasons (userID) {
//       id
//     }
//   }
// `;

// export const FETCH_LEAGUE_QUERY = gql`
//   {
//     getLeagueSeason {
      
//     }
//   }
// `;
