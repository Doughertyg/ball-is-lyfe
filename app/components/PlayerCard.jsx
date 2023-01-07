import React from 'react';

import {BodyText, DetailsText, Divider, EmptyProfilePicture, PageHeader, ProfilePictureThumb, SectionHeadingText} from '../styled-components/common';
import {CardBody, CardContentWrapper, CardWrapper} from '../styled-components/card.js';
import FadeInTransition from './transitions/FadeInTransition.jsx';
import styled from 'styled-components';

const NameWrapper = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre-line;
  margin-top: ${props => props.marginTop ?? '0'};
  margin-bottom: ${props => props.marginBottom ?? '0'};
  display: -webkit-box;
  -webkit-line-clamp: ${props => props.lineClamp ?? '2'};
  -webkit-box-orient: vertical; 
  max-width: 100%;
  width: 100%;
`;

const PictureWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const PositionWrapper = styled.div`
  height: 200px;
  position: relative;
  width: 165px;
`;

const Wrapper = styled.div`
  width: 165px;
  &:hover {
    z-index: 1000;
    position: absolute;
    width: auto;
  }
`;

function PlayerCard({email, margin, onClick, name, picture, username}) {
  const getPlayerInitials = (name, username) => {
    const nameInitials = name != null ? name.slice(0, 1) + name.split(' ')[1]?.slice(0, 1) : null;
    const usernameInitials = username != null ? username.slice(0, 1) + username.slice(1,2) : null;

    return nameInitials ?? usernameInitials;
  }

  return (
    <FadeInTransition>
      <PositionWrapper>
        <Wrapper>
          <CardWrapper
            boxShadow="0 0 10px rgba(0, 0, 0, 0.07)"
            height={'200px'}
            margin={margin}
            padding="16px 16px 0 16px"
            onClick={onClick}>
            <CardContentWrapper height="100%">
              {picture != null ? (
                <PictureWrapper>
                  <ProfilePictureThumb borderRadius="4px" height="65px" src={picture} width="65px" />
                </PictureWrapper>) :
                (
                  <PictureWrapper>
                    <EmptyProfilePicture  borderRadius="4px" height="65px" src={picture} width="65px">{getPlayerInitials(name, username).toUpperCase()}
                    </EmptyProfilePicture>
                  </PictureWrapper>
                )
              }
              <Divider marginBottom="8px" />
              <NameWrapper><PageHeader margin="0">{name ?? username}</PageHeader></NameWrapper>
              {email && <NameWrapper lineClamp="1"><DetailsText marginBottom="4px" width="100%" overflow="hidden"><SectionHeadingText>{email}</SectionHeadingText></DetailsText></NameWrapper>}
              {username && <DetailsText width="100%" overflow="hidden" marginBottom="4px">{username}</DetailsText>}
            </CardContentWrapper>
          </CardWrapper>
        </Wrapper>
      </PositionWrapper>
    </FadeInTransition>
  )
}

export default PlayerCard;
