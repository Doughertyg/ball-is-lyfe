import React from 'react';
import { FlexContainer } from '../styled-components/common';
import { Button as ButtonWrapper } from '../styled-components/interactive';

function Button({
  border,
  children,
  height,
  isDisabled,
  isLoading,
  label,
  margin,
  marginTop,
  onClick,
  width
}) {

  return (
    <ButtonWrapper border={border} height={height} disabled={isDisabled} margin={margin} marginTop={marginTop} onClick={onClick} width={width}>
      <FlexContainer>
        {isLoading ? 'Loading...' : (<>{children}{label}</>)}
      </FlexContainer>
    </ButtonWrapper>
  )
}

export default Button;
