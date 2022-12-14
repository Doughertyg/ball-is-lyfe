import React from 'react';
import styled from 'styled-components';

import Comment from '../icons/comment.svg';
import Comments from '../icons/comments.svg';
import Heart from '../icons/heart.svg';
import Message from '../icons/message.svg';
import Plus from '../icons/plus.svg'
import StyledSVG from '../styled-components/icons/styledSVG.js';
import Trash from '../icons/trash.svg';
import { Clickable } from '../styled-components/interactive';

function SvgComponent({ icon, ...rest }) {
  switch (icon) {
    case 'comment':
      return <Comment {...rest} />
    case 'comments':
      return <Comments {...rest} />
    case 'heart':
      return <Heart {...rest} />
    case 'info':
      return <Comments {...rest} />
    case 'message':
      return <Message {...rest} />
    case 'plus':
      return <Plus {...rest} />
    case 'trash':
      return <Trash {...rest} />
  }
}

function Icon({ borderRadius, fill, height, icon, margin, onClick, width}) {
  return (
    onClick != null ? (
      <Clickable borderRadius={borderRadius} onClick={onClick}>
        <StyledSVG fill={fill} height={height} margin={margin} width={width}>
          <SvgComponent icon={icon} />
        </StyledSVG>
      </Clickable>
    ) : (
      <StyledSVG fill={fill} height={height} width={width}>
        <SvgComponent icon={icon} />
      </StyledSVG>
    )
  )
}

export default Icon;
