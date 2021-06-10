import React from 'react';
import styled from 'styled-components';

import Comment from '../icons/comment.svg';
import Comments from '../icons/comments.svg';
import Heart from '../icons/heart.svg';
import Message from '../icons/message.svg';
import Trash from '../icons/trash.svg';

const IconWrapper = styled.div`
  fill: ${props => props.fill ?? 'black'};
  height: ${props => props.height ?? "24px"};
  margin: 4px;
  width: ${props => props.width ?? "24px"};
`;

function SvgComponent({ icon, ...rest }) {
  switch (icon) {
    case 'comment':
      return <Comment {...rest} />
    case 'comments':
      return <Comments {...rest} />
    case 'heart':
      return <Heart {...rest} filled={true} />
    case 'message':
      return <Message {...rest} />
    case 'trash':
      return <Trash {...rest} />
  }
}

function Icon({ fill, height, icon,  width}) {
  return (
    <IconWrapper fill={fill} height={height} width={width}>
      <SvgComponent icon={icon} />
    </IconWrapper>
  )
}

export default Icon;
