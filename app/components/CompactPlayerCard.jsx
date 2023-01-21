import React from 'react';
import { CardWrapper } from '../styled-components/card';
import { BodyText, DetailsText, FlexContainer, ProfilePictureThumb } from '../styled-components/common';
import Icon from './Icon.jsx';

const CompactPlayerCard = ({
  picture,
  name,
  onClick,
  subLabel
}) => {
  return (
    <CardWrapper
      boxShadow="0 0 10px rgba(0, 0, 0, 0.07)"
      margin='4px 4px 0 0'>
      <FlexContainer alignItems="center" justify="start">
        {picture && (
          <ProfilePictureThumb
            referrerPolicy="no-referrer"
            height="32px"
            src={picture}
            width="32px" />
        )}
        <FlexContainer direction="column" grow="1">
          <BodyText marginBottom="4px">
            {name}
          </BodyText>
          <DetailsText>{subLabel}</DetailsText>
        </FlexContainer>
        <Icon icon="close" onClick={onClick} />
      </FlexContainer>
    </CardWrapper>
  )
};

export default CompactPlayerCard;
