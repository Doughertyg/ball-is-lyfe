import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import {DetailsText, Divider, FlexContainer, SectionHeadingText, VerticalDivider} from '../styled-components/common';
import {CardBody, CardContentWrapper, CardWrapper} from '../styled-components/card.js';
import FadeInTransition from './transitions/FadeInTransition.jsx';
import Icon from './Icon.jsx';
import Button from './Button.jsx';

import { AuthContext } from '../context/auth';

const BodyText = styled.div`
  font-size: 20px;
  text-align: left;
`;

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

function PostCard({ post: { body, createdAt, id, username, likeCount, commentCount, likes } }) {
  const { user } = useContext(AuthContext);
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    console.log('useEffect likes run');
    if (user && likes.find(like => like.username === user.username)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id}
  })

  return (
    <FadeInTransition>
      <CardWrapper>
        <CardContentWrapper>
          <SectionHeadingText>{username}</SectionHeadingText>
          <DetailsText>{moment(createdAt).fromNow()}</DetailsText>
          <Divider />
          <CardBody><BodyText>{body}</BodyText></CardBody>
          <Divider />
          <FlexContainer justify="space-evenly" marginBottom="-16px" width="100%">
            <Button border="none" margin="0" onClick={likePost} width="100%">
              <Icon fill={liked && 'red'} icon="heart" />
            </Button>
            <VerticalDivider height="40px" margin="auto 0" />
            <Button border="none" margin="0" width="100%">
              <Icon icon="comment" />
            </Button>
            {user && user.username === username && (
              <>
                <VerticalDivider height="40px" margin="auto 0" />
                  <Button
                    border="none"
                    margin="0"
                    onClick={() => console.log('delete')} width="100%">
                    <Icon icon="trash" />
                  </Button>
              </>)}
          </FlexContainer>
        </CardContentWrapper>
      </CardWrapper>
    </FadeInTransition>
  )
}

export default PostCard;
