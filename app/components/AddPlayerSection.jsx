import React, { useState} from 'react';
import styled from 'styled-components';
import Icon from './Icon.jsx';
import PlayerSearchField from './PlayerSearchField.jsx';
import Button from './Button.jsx';
import {
  BodyText,
  DetailsText,
  Divider,
  FlexContainer,
  PageHeader,
  SectionHeadingText,
  ScrollableContainer,
  ProfilePictureThumb
} from '../styled-components/common';
import { CardWrapper } from '../styled-components/card.js';

const SearchWrapper = styled.div`
  height: 100%;
  width: ${props => props.width ?? 0};
  overflow: ${props => props.overflow ?? 'hidden'};
  transition: width .24s;
  transition-timing-function: ease-out;
`;

/**
 * Component that implements the player search and add component.
 * 
 *  ,--------------------------------------------,
 *  |  User1                                     |
 *  '--------------------------------------------'
 *  :'````````````':
 *  :  User2   (X) :
 *  `--------------`
 */
const AddPlayerSection = ({ excludeLeague, isCollapsible, isSubmitting, label, leagueID, onClose, onSelectPlayer, onSubmit, selectedPlayers, submitLabel }) => {
  const [searchExpanded, setSearchExpanded] = useState(!isCollapsible);

  const toggleSearchBar = () => {
    if (searchExpanded) {
      setSearchExpanded(false);
      onClose?.();
    } else {
      setSearchExpanded(true);
    }
  }

  const getExpandedWidth = () => {
    return searchExpanded ? '400px' : '0';
  }

  return (
    <>
      <FlexContainer alignItems="center" justify="flex-start" overflow="initial">
        {label && (<SectionHeadingText margin="20px 12px 20px 0">{label}</SectionHeadingText>)}
        <SearchWrapper width={searchExpanded ? '400px' : '0'} overflow={searchExpanded ? 'initial' : 'hidden'}>
          <PlayerSearchField excludeLeague={excludeLeague} leagueID={leagueID} onClick={onSelectPlayer} selected={selectedPlayers} width={isCollapsible ? getExpandedWidth() : '100%'} />
        </SearchWrapper>
        {isCollapsible && <Icon borderRadius="50%" icon={searchExpanded ? "close" : "plus"} onClick={toggleSearchBar} />}
      </FlexContainer>
      {Object.keys(selectedPlayers).length > 0 && (
        <>
          <FlexContainer flexWrap="wrap" justify="start" overflow="initial" shrink="0" width="100%">
            {Object.values(selectedPlayers).map((player, idx) => (
                <CardWrapper
                  boxShadow="0 0 10px rgba(0, 0, 0, 0.07)"
                  key={player.id ?? idx}
                  margin='4px 4px 0 0'>
                  <FlexContainer alignItems="center" justify="space-between">
                    {player.profilePicture && (
                      <ProfilePictureThumb
                        referrerPolicy="no-referrer"
                        height="32px"
                        src={player.profilePicture}
                        width="32px" />
                    )}
                    <FlexContainer direction="column">
                      <BodyText marginBottom="4px">
                        {player.name ?? player.username}
                      </BodyText>
                      <DetailsText>{player.email}</DetailsText>
                    </FlexContainer>
                    <Icon icon="close" onClick={() => onSelectPlayer(player)} />
                  </FlexContainer>
                </CardWrapper>
            ))}
          </FlexContainer>
          {onSubmit && onClose && (<FlexContainer marginTop="12px" width="100%">
            <Button isDisabled={isSubmitting} label="Cancel" onClick={toggleSearchBar} />
            <Button isLoading={isSubmitting} label={submitLabel} onClick={() => onSubmit()} />
          </FlexContainer>)}
        </>
      )}
    </>
  )
}

export default AddPlayerSection;
