import React from 'react';
import { FlexContainer } from '../styled-components/common';
import { Button as ButtonWrapper } from '../styled-components/interactive';

function Button({
  border,
  children,
  height,
  label,
  margin,
  onClick,
  width
}) {

  return (
    <ButtonWrapper border={border} height={height} margin={margin} onClick={onClick} width={width}>
      <FlexContainer>
        {children}{label}
      </FlexContainer>
    </ButtonWrapper>
  )
}

export default Button;
