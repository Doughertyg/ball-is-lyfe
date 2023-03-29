import React from 'react';
import styled from 'styled-components';
import {
  DetailsText,
  FlexContainer,
} from '../styled-components/common';

const Wrapper = styled.div`
  background-color: rgba(239, 239, 239, 1);
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: ${props => props.color ?? 'black'};
  margin-top: 8px;
  padding: 12px;
`;

/**
 * Component that displays a banner message
 *  ,--------------------------------------,
 * :            Banner message              :
 *  '--------------------------------------'
 */
const BannerComponent = ({ color, title, subtitle }) => {
  return (
    <Wrapper color={color}>
      <FlexContainer justify="center" alignItems="center">
        <FlexContainer direction="column" alignItems="center" justify="center">
          {title}
          {subtitle && (
            <DetailsText overflow="hidden">
              {subtitle}
            </DetailsText>
          )}
        </FlexContainer>
      </FlexContainer>
    </Wrapper>
  )
}

export default BannerComponent;
