import React from 'react';
import styled from 'styled-components';
import { FlexContainer } from '../styled-components/common';

const Banner = styled.div`
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: ${props => props.color ?? 'rgba(239, 239, 239, 1)'};
  color: DimGrey;
  height: fit-content;
  padding: 2px 4px 1px 12px;
  width: fit-content
`;

const StatusIcon = styled.div`
  background-color: ${props => props.color ?? 'dimgrey'};
  border-radius: 50%;
  box-shadow: ${props => `0 0 5px 5px ${props.shadowColor ?? "rgba(0, 0, 0, 0.1)"}`};
  height: 6px;
  margin: 8px;
  margin-left: 12px;
  width: 6px;
`;

const STATUS_ICON_COLOR_MAP = {
  ACTIVE: 'springgreen',
  CONFIRMED: 'dodgerblue',
  INACTIVE: 'dimgrey',
  DRAFT: 'darkorange',
  CANCELLED: 'red'
}

const STATUS_ICON_SHADOW_COLOR_MAP = {
  ACTIVE: 'rgba(173, 255, 47, 0.8)',
  CONFIRMED: 'rgba(30, 144, 255, 0.3)',
  INACTIVE: 'rgba(105, 105, 105, 0.5)',
  DRAFT: 'rgba(255, 140, 0, 0.5)',
  CANCELLED: 'rgba(255, 0, 0, 0.3)'
}

const getColors = (status) => {
  switch(status) {
    case 'info':
      return {
        bg: 'bg-yellow-500',
        border: 'border-yellow-500',
        text: 'text-yellow-500'
      };
    case 'warning':
      return {
        bg: 'bg-red-500',
        border: 'border-red-500',
        text: 'text-red-500'
      };
    case 'active':
      return {
        bg: 'bg-green-500',
        border: 'border-green-500',
        text: 'text-green-500'
      };
    case 'confirmed':
      return {
        bg: 'bg-blue-500',
        border: 'border-blue-500',
        text: 'text-blue-500'
      };
    default: 
      return {
        bg: 'bg-gray-400',
        border: 'border-gray-400',
        text: 'text-gray-400'
      };
  }
}

export const BadgeTW = ({
  label,
  status,
  variant = 'flat',
  border = false
}) => {
  const colors = getColors(status);
  const flatStyle = `${border ? 'border-2 border-solid' : 'border-none'} ${colors.border} ${colors.text}`;
  const primaryStyle = `shadow-md ${colors.bg} text-white`;
  const style = variant === 'flat' ? flatStyle : variant === 'primary' ? primaryStyle : '';

  return (
    <div className={`${style} inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium max-h-6 px-2.5 py-1 text-xs text-foreground`}>
      {label}
      {variant !== 'primary' && <span className={`animate-ping h-3 w-3 inline-flex rounded-full ${colors.bg} opacity-75`} />}
    </div>
  )
}


/**
 * Component that displays a status badge
 * 
 * ,---------------,
 * :  Active {O}   :
 * '---------------'
 * 
 * A color can be passed in to set a custom background color
 * Or a status from the enum ACTIVE, INACTIVE, DRAFT, CANCELLED 
 *   can be passed to set the color based on status
 */
const BadgeComponent = ({ label, status, color }) => {
  return (
    <Banner color={color}>
      <FlexContainer alignItems="center" height="100%" justify="center">
        {label ?? "Status"}
        {status && <StatusIcon color={STATUS_ICON_COLOR_MAP[status]} shadowColor={STATUS_ICON_SHADOW_COLOR_MAP[status]} />}
      </FlexContainer>
    </Banner>
  )
}

export default BadgeComponent;
