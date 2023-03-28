import React from 'react';
import styled from 'styled-components';

import Comment from '../icons/comment.svg';
import Comments from '../icons/comments.svg';
import Heart from '../icons/heart.svg';
import Message from '../icons/message.svg';
import Pencil from '../icons/pencil.svg'
import Plus from '../icons/plus.svg'
import PlusRound from '../icons/plusround.svg';
import Circle from '../icons/circle.svg';
import Check from '../icons/checkcircle.svg';
import CheckFilled from '../icons/checkcirclefilled.svg';
import Close from '../icons/close.svg';
import StyledSVG from '../styled-components/icons/styledSVG.js';
import Trash from '../icons/trash.svg';
import { Clickable } from '../styled-components/interactive';

function SvgComponent({ icon, ...rest }) {
  switch (icon) {
    case 'check':
      return <Check {...rest} />
    case 'checkFilled':
      return <CheckFilled {...rest} />
    case 'circle':
      return <Circle {...rest} />
    case 'close':
      return <Close {...rest} />
    case 'comment':
      return <Comment {...rest} />
    case 'comments':
      return <Comments {...rest} />
    case 'edit':
      return <Pencil {...rest} />
    case 'heart':
      return <Heart {...rest} />
    case 'info':
      return <Comments {...rest} />
    case 'message':
      return <Message {...rest} />
    case 'plus':
      return <PlusRound {...rest} />
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
