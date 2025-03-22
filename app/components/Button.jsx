import React from 'react';
import { FlexContainer } from '../styled-components/common';
import { Button as ButtonWrapper } from '../styled-components/interactive';
import LoadingSpinnerSpin from './LoadingSpinnerSpin.jsx';
import TooltipComponent from './TooltipComponent.jsx';

export const ButtonTW = ({
  children,
  className,
  isDisabled,
  isLoading,
  label,
  onClick,
  variant = 'flat',
  tooltip
}) => {
  const style = variant === 'primary' ? (
    'bg-indigo-600 text-white shadow-sm hover:shadow-lg hover:bg-indigo-700 active:bg-indigo-800'
  ) : variant === 'secondary' ? (
    `bg-gray-200 text-slate-800 shadow-sm hover:bg-gray-400 active:bg-gray-800 active:text-slate-200`
  ) : variant === 'flat' ? (
    'bg-transparent border border-gray-400 shadow-md hover:shadow-lg hover:text-slate-200 hover:border-gray-200 active:text-slate-900 active:border-gray-900'
  ) : '';

  const baseStyle = `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors
      focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 max-h-9 px-4 py-2`

  return (
    <TooltipComponent tooltip={tooltip}>
      <button
        disabled={isDisabled || isLoading}
        onClick={onClick}
        className={`${baseStyle} ${style} ${className}`}
      >
        {isLoading ? <LoadingSpinnerSpin /> : (<>{children}{label}</>)}
      </button>
    </TooltipComponent>
  )
}

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
  primary,
  secondary,
  tooltip,
  width
}) {

  return (
    <>
      <TooltipComponent tooltip={tooltip}>
        <ButtonWrapper border={border} borderRadius={borderRadius} boxShadow={boxShadow} height={height} disabled={isDisabled} margin={margin} marginTop={marginTop} onClick={onClick} primary={primary} secondary={secondary} width={width}>
          <FlexContainer>
            {isLoading ? <LoadingSpinnerSpin /> : (<>{children}{label}</>)}
          </FlexContainer>
        </ButtonWrapper>
      </TooltipComponent>
    </>
  )
}

export default Button;
