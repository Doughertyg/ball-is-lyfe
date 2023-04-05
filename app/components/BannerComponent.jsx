import React from 'react';
import styled from 'styled-components';
import {
  DetailsText,
  FlexContainer,
} from '../styled-components/common';

const BANNER_TYPES = {
  INFO: 'info',
  ERROR: 'error'
}

const BANNER_TYPE_COLORS = {
  ERROR: 'red',
  INFO: 'dimgrey'
}

const BANNER_TYPE_BACKGROUND_COLORS = {
  ERROR: 'rgba(255, 0, 0, 0.1)',
  INFO: 'rgba(239, 239, 239, 1)'
}

const Wrapper = styled.div`
  background-color: ${props => props.backgroundColor ?? 'rgba(239, 239, 239, 1)'};
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: ${props => props.color ?? 'black'};
  margin-top: ${props => props.marginTop ?? '8px'};
  margin-bottom: ${props => props.marginBottom ?? '0'};
  padding: 12px;
`;

/**
 * Component that displays a banner message
 *   type prop should be used to set the styling of the banner
 *   types supported: error, info
 *  ,--------------------------------------,
 * :            Banner message              :
 *  '--------------------------------------'
 */
const BannerComponent = ({ backgroundColor: backgroundColorProp, color: colorProp, title, type, subtitle, marginBottom, marginTop }) => {
  const backgroundColor = backgroundColorProp ? backgroundColorProp :
    type === BANNER_TYPES.ERROR ? BANNER_TYPE_BACKGROUND_COLORS.ERROR :
    type === BANNER_TYPES.INFO ? BANNER_TYPE_BACKGROUND_COLORS.INFO :
    null;
  const color = colorProp ? colorProp :
    type === BANNER_TYPES.ERROR ? BANNER_TYPE_COLORS.ERROR :
    type === BANNER_TYPES.INFO ? BANNER_TYPE_COLORS.INFO :
    null;

  return (
    <Wrapper backgroundColor={backgroundColor} color={color} marginBottom={marginBottom} marginTop={marginTop}>
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
