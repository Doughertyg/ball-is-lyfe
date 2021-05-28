import React from 'react';
import moment from 'moment';
import styled from 'styled-components';

import {DetailsText, Divider, SectionHeadingText} from '../styled-components/common';
import {CardBody, CardContentWrapper, CardWrapper} from '../styled-components/card.js';

const BodyText = styled.div`
  font-size: 20px;
  text-align: left;
`;

function PostCard({ post: { body, createdAt, id, username, likeCount, commentCount, likes } }) {
  console.log('createdAt: ', createdAt);

  return (
    <CardWrapper>
      <CardContentWrapper>
        <SectionHeadingText>{username}</SectionHeadingText>
        <DetailsText>{moment(createdAt).fromNow()}</DetailsText>
        <Divider />
        <CardBody><BodyText>{body}</BodyText></CardBody>
      </CardContentWrapper>
    </CardWrapper>
  )
}

export default PostCard;
