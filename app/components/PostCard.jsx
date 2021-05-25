import React from 'react';
import moment from 'moment';
import styled from 'styled-components';

const PostWrapper = styled.div`
  max-width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 8px;
  background-color: aliceblue;
  margin-bottom: 4px;
`;

const PostContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const PostBody = styled.div`
  background-color: white;
  border-radius: 6px;
  box-sizing: border-box;
  padding: 16px;
  width: 100%;
`;

const BodyText = styled.div`
  font-size: 20px;
  text-align: left;
`;

const DetailsText = styled.div`
  font-size: 12px;
  font-weight: 300;
  color: DimGrey;
  margin-bottom: 6px;
`;

const SectionHeadingText = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
`;

function PostCard({ post: { body, createdAt, id, username, likeCount, commentCount, likes } }) {
  console.log('createdAt: ', createdAt);

  return (
    <PostWrapper>
      <PostContentWrapper>
        <SectionHeadingText>{username}</SectionHeadingText>
        <DetailsText>{moment(createdAt).fromNow()}</DetailsText>
        <PostBody><BodyText>{body}</BodyText></PostBody>
      </PostContentWrapper>
    </PostWrapper>
  )
}

export default PostCard;
