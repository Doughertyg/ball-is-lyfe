import React from 'react';
import styled, { keyframes } from 'styled-components';
import BasketballSVG from '../icons/basketball-filled.svg';

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  animation: ${rotate} 1s ease infinite;
  width: ${props => props.width ?? '24px'};
  height: ${props => props.height ?? '24px'};
  border-radius: 50%;
`;

const LoadingSpinnerSpin = ({ height, width }) => {
  return (
    <Spinner height={height} width={width}>
      <BasketballSVG />
    </Spinner>
  )
}

export default LoadingSpinnerSpin;
