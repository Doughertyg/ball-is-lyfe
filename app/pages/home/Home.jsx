import React, { useContext } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import PostCard from '../../components/PostCard.jsx';
import { AuthContext } from '../../context/auth';
import {CenteredContainer, FlexContainer, PageHeader} from '../../styled-components/common';
import PostForm from '../../components/PostForm.jsx';

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
  const { user } = useContext(AuthContext);

  if (data) {
    console.log(data)
  }
  
  return (
    <FlexContainer justify="flex-start">
      {user && (
        <PostForm />
      )}
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
    </FlexContainer>
  )
};

export default Home;
