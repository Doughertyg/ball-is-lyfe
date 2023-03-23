import React from 'react';
import styled from 'styled-components';
import {
  DetailsText,
  FlexContainer,
} from '../styled-components/common';

const Wrapper = styled.div`
  background-color: ${props => props.color ?? 'springgreen'};
  border-radius: 8px;
  box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.1);
  margin-top: 8px;
  padding: 12px;
`;

/**
 * Component that displays a banner message
 *  ,--------------------------------------,
 * :            Banner message              :
 *  '--------------------------------------'
 */
const BannerComponent = ({ title, subtitle }) => {
  return (
    <Wrapper>
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
