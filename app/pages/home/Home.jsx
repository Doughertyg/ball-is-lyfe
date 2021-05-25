import React from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import PostCard from '../../components/PostCard.jsx';

const CenteredContainer = styled.div`
  margin: 0 auto;
  text-align: center;
  vertical-align: middle;
`;

const PageHeader = styled.h1`
  font-weight: 600;
  font-size: 24px;
  margin: 20px 0;
`;

const FETCH_POSTS_QUERY = gql`
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

function Home() {
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);

  if (data) {
    console.log(data)
  }
  
  return (
    <CenteredContainer>
      <PageHeader>Recent Posts</PageHeader>
      {loading ? (<h1>LOADING...</h1>) :  
        data.getPosts.map(post => {
          return (
            <PostCard key={post.id} post={post} />
          )
        })
      }
    </CenteredContainer>
  )
};

export default Home;
