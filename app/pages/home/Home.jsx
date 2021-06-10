import React, { useContext } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import PostCard from '../../components/PostCard.jsx';
import { AuthContext } from '../../context/auth';
import {CenteredContainer, FlexContainer, PageHeader} from '../../styled-components/common';
import PostForm from '../../components/PostForm.jsx';
import { FETCH_POSTS_QUERY } from '../../../graphql/queries/graphql';

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
