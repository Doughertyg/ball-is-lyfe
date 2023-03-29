import React from 'react';
import styled from 'styled-components';
import { FlexContainer } from '../styled-components/common';

const Banner = styled.div`
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: ${props => props.color ?? 'rgba(239, 239, 239, 1)'};
  color: DimGrey;
  height: fit-content;
  padding: 4px 12px;
  width: fit-content
`;

const StatusIcon = styled.div`
  background-color: ${props => props.color ?? 'dimgrey'};
  border-radius: 50%;
  box-shadow: ${props => `0 0 5px 5px ${props.shadowColor ?? rgba(0, 0, 0, 0.1)}`};
  height: 8px;
  margin: 8px;
  margin-left: 12px;
  width: 8px;
`;

const STATUS_ICON_COLOR_MAP = {
  ACTIVE: 'springgreen',
  INACTIVE: 'dimgrey',
  DRAFT: 'darkorange',
  CANCELLED: 'red'
}

const STATUS_ICON_SHADOW_COLOR_MAP = {
  ACTIVE: 'greenyellow',
  INACTIVE: 'darkgrey',
  DRAFT: 'orange',
  CANCELLED: 'orangered'
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
