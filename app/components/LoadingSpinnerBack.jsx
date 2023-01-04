import React from 'react';
import styled, { keyframes } from 'styled-components';
import BasketballSVG from '../icons/basketball-filled.svg';

const rotate = keyframes`
  0% {
    transform: translateY(20px) translateX(0px) rotate(0deg);
  }

  15% {
    transform: translateY(0) translateX(10px) rotate(90deg);
  }

  21% {
    transform: translateY(20px) translateX(15px) rotate(135deg);
  }

  29% {
    transform: translateY(10px) translateX(20px) rotate(180deg);
  }

  35% {
    transform: translateY(20px) translateX(25px) rotate(225deg);
  }

  42% {
    transform: translateY(15px) translateX(30px) rotate(270deg);
  }

  56% {
    transform: translateY(20px) translateX(40px) rotate(360deg);
  }

  75% {
    transform: translateY(20px) translateX(60px) rotate(490deg);
  }

  100% {
    transform: translateY(20px) translateX(0) rotate(0deg);
  }
`;

const Spinner = styled.div`
  animation: ${rotate} 1s ease infinite;
  width: ${props => props.width ?? '24px'};
  height: ${props => props.height ?? '24px'};
  border-radius: 50%;
`;

const LoadingSpinnerBack = ({ height, width }) => {
  return (
    <Spinner height={height} width={width}>
      <BasketballSVG />
    </Spinner>
  )
}

export default LoadingSpinnerBack;
