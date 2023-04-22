import React, {useState} from 'react';
import { DetailsText, ModalStyle } from '../styled-components/common';
import styled from 'styled-components';

const TransitionWrapper = styled.div`
  opacity: ${props => props.hide ? '0' : '1'};
  transition: opacity 0.5s ease-in-out;
`;

const TriggerWrapper = styled.div`
  inset: 0;
  position: absolute;
`;

const TextWrapper = styled.div`
  padding: 8px;
  width: fit-content;
`;

const Wrapper = styled.div`
  position: relative;
`;

/**
 * Tool tip component that shows a modal with the tooltip text
 *  ,-------------------,
 * |   Tooltip text...  |
 *  '-----------------._:,
 */
const TooltipComponent = ({ children, tooltip }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  if (tooltip == null) {
    return children;
  }

  const enter = () => {
    setShowTooltip(true);
  }

  const leave = () => {
    setShowTooltip(false);
  }

  return (
    <Wrapper onMouseLeave={leave}>
      <TransitionWrapper hide={!showTooltip}>
        <ModalStyle position="fixed" width="fit-content">
          <TextWrapper>
            <DetailsText>{tooltip}</DetailsText>
          </TextWrapper>
        </ModalStyle>
      </TransitionWrapper>
      {children}
      <TriggerWrapper onMouseEnter={enter} />
    </Wrapper>
    
  )
}

export default TooltipComponent;
