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
import DeleteButton from './DeleteButton.jsx';
import InputField from './InputField.jsx';

const BodyText = styled.div`
  font-size: 20px;
  text-align: left;
`;

const CommentInputWrapper = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  width: 100%;
`;

const CommentWrapper = styled.div`
  width: 100%;
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

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body 
        createdAt
        username
      }
      commentCount
    }
  }
`;

function PostCard({ post: { body, createdAt, id, username, likeCount, comments, commentCount, likes }, link, navigateBackCallback }) {
  const { user } = useContext(AuthContext);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
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

  const [submitComment, { loading: isSubmittingComment }] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment('');
    },
    variables: {
      postId: id,
      body: comment
    }
  })

  return (
    <FadeInTransition>
      <CardWrapper>
        <CardContentWrapper>
          <SectionHeadingText>{username}</SectionHeadingText>
          <DetailsText onClick={() => link && link()}>{moment(createdAt).fromNow()}</DetailsText>
          <Divider />
          <CardBody><BodyText>{body}</BodyText></CardBody>
          <Divider />
          <FlexContainer justify="space-evenly" marginBottom="-16px" width="100%">
            <Button border="none" margin="0" onClick={likePost} width="100%">
              {likeCount}
              <Icon fill={liked ? 'red' : 'black'} icon="heart" />
            </Button>
            <VerticalDivider height="40px" margin="auto 0" />
            <Button border="none" margin="0" onClick={() => setShowComments(!showComments)} width="100%">
              {commentCount}
              <Icon icon="comment" />
            </Button>
            {user && user.username === username && (
              <>
                <VerticalDivider height="40px" margin="auto 0" />
                  <DeleteButton postId={id} navigateBackCallback={navigateBackCallback} />
              </>)}
          </FlexContainer>
          {user && showComments && (
            <>
              <Divider />
              <CommentInputWrapper>
                <SectionHeadingText>Post a Comment</SectionHeadingText>
                <InputField name="comment" maxLength={250} onChange={setComment} placeholder="Add a comment..." value={comment} width="400px" />
                <Button label="Submit" isDisabled={comment.trim() === ''} isLoading={isSubmittingComment} marginTop="10px" onClick={submitComment} />
              </CommentInputWrapper>
            </>
          )}
          {comments && showComments && comments.map(comment => {
            return (
              <CommentWrapper key={comment.id}>
                <Divider marginBottom="10px" />
                <CardWrapper>
                  <CardContentWrapper>
                    <SectionHeadingText>{comment.username}</SectionHeadingText>
                    <DetailsText>{moment(comment.createdAt).fromNow()}</DetailsText>
                    <Divider />
                    <CardBody>{comment.body}</CardBody>
                    {user && user.username === comment.username && (
                      <DeleteButton commentId={comment.id} postId={id} />
                    )}
                  </CardContentWrapper>
                </CardWrapper>
              </CommentWrapper>  
            )
          })}
        </CardContentWrapper>
      </CardWrapper>
    </FadeInTransition>
  )
}

export default PostCard;
