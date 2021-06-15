import React, { useContext } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import styled from 'styled-components';

import PostCard from '../../components/PostCard.jsx';
import { AuthContext } from '../../context/auth';

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

const PostWrapper = styled.div`
  margin-top: 20px;
`;

function Post(props) {
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);

  const { data } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId
    }
  });

  let postMarkup;
  if (!data || !data.getPost) {
    return <p>Loading Post...</p>;
  } 

  return (
    <PostWrapper>
      <PostCard navigateBackCallback={() => props.history.push('/')} post={data.getPost} />
    </PostWrapper>
  );
}

export default Post;
