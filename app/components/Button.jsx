import React from 'react';
import { FlexContainer } from '../styled-components/common';
import { Button as ButtonWrapper } from '../styled-components/interactive';
import LoadingSpinnerSpin from './LoadingSpinnerSpin.jsx';

function Button({
  border,
  borderRadius,
  boxShadow,
  children,
  height = "40px",
  isDisabled,
  isLoading,
  label,
  margin,
  marginTop,
  onClick,
  width
}) {

  return (
    <ButtonWrapper border={border} borderRadius={borderRadius} boxShadow={boxShadow} height={height} disabled={isDisabled} margin={margin} marginTop={marginTop} onClick={onClick} width={width}>
      <FlexContainer>
        {isLoading ? <LoadingSpinnerSpin /> : (<>{children}{label}</>)}
      </FlexContainer>
    </ButtonWrapper>
  )
}

export default Button;
