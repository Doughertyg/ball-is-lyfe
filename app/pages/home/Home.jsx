import React from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import PostCard from '../../components/PostCard.jsx';

import {CenteredContainer, PageHeader} from '../../styled-components/common';

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
