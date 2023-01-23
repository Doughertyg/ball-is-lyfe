import React from 'react';
import { CardWrapper } from '../styled-components/card';
import { BodyText, DetailsText, FlexContainer, ProfilePictureThumb, SectionHeadingText } from '../styled-components/common';
import Icon from './Icon.jsx';
import styled from 'styled-components';

const List = styled.ul`
  margin-top: 4px;
  list-style-type: circle;
`;

const ListItem = styled.li`
  margin-left: 4px;
`;

/**
 * Component for showing a compact display card of details
 * 
 *  ,------------------------------------.
 *  |  TITLE                      ,---,  |
 *  |  Subtitle                  | \_/ | |
 *  |   (details)                | /`\ | |
 *  |   (details)                 `----` |
 *  `------------------------------------`
 */
const CompactDetailsCard = ({
  picture,
  title,
  subTitle,
  details, // Array of strings
  onClose,
}) => {
  return (
    <CardWrapper
      boxShadow="0 0 10px rgba(0, 0, 0, 0.07)"
      margin='4px 4px 0 0'>
      <FlexContainer alignItems="center" justify="space-between">
        {picture && (
          <ProfilePictureThumb
            referrerPolicy="no-referrer"
            height="32px"
            src={picture}
            width="32px" />
        )}
        <FlexContainer direction="column">
          <DetailsText>
            <SectionHeadingText marginBottom="4px">
              {title}
            </SectionHeadingText>
          </DetailsText>
          <DetailsText>{subTitle}</DetailsText>
          {details?.length > 0 && (
            <FlexContainer>
              <List>
                {details?.map((detail, idx) => {
                  return (
                    <ListItem key={idx}><DetailsText key={idx}>{detail}</DetailsText></ListItem>
                  )
                })}
              </List>
            </FlexContainer>
          )}
        </FlexContainer>
        {onClose && <Icon icon="close" margin="4px 4px 4px 32px" onClick={onClose} />}
      </FlexContainer>
    </CardWrapper>
  )
}

export default CompactDetailsCard;
