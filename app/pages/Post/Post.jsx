import React from 'react';
import gql from 'graphql-tag';

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

function Post() {
  const postId = props.match.params.postId;
}

export default Post;
