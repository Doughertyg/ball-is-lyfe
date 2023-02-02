import React, { useState } from 'react';
import styled from 'styled-components';
import { BodyText, DetailsText, Divider, FlexContainer } from '../styled-components/common';
import { Clickable } from '../styled-components/interactive';

const ModalWrapper = styled.div`
  position: relative;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 10:
`;

const ModalStyle = styled.div`
  position: absolute;
  border-radius: 6px;
  box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.07);
  background-color: white;
  width: 100%;
  z-index: 10000;
`;

const ContentWrapper = styled.div`
  padding: 10px;
  box-sizing: border-box;
`;

/**
 * Simple Selector Component
 * Show the selected option and a down arrow button
 */
const SimpleSelector = ({ options, value, onClick }) => {
  const [expanded, setExpanded] = useState(false);

  const onEntryClick = (entry) => {
    onClick?.(entry);
    setExpanded(false);
  }

  return (
    <>
      <FlexContainer justify="flex-start">
        {value != null ? value : 'Select'}<Clickable onClick={() => setExpanded(true)}>  &#9660;</Clickable>
      </FlexContainer>
      {options?.length > 0 && expanded && (
        <ModalWrapper>
          <ModalContainer onClick={() => setExpanded(false)} />
          <ModalStyle>
            <ContentWrapper>
            {options?.map((entry, idx) => {
              return (
                <Clickable key={idx} onClick={() => onEntryClick(entry)}> 
                  {idx !== 0 && <Divider marginBottom="10px" />}
                  <FlexContainer alignItems="center" justify="space-between">
                    <>
                      {entry?.profilePicture && (
                        <ProfilePictureThumb
                          height="32px"
                          referrerPolicy="no-referrer"
                          src={entry.profilePicture}
                          width="32px" />
                      )}
                      <BodyText width="fit-content">
                        {entry?.name ?? 'Name missing'}
                      </BodyText>
                      <DetailsText flexGrow="1" margin="0 0 0 4px">
                        {entry.description}
                      </DetailsText>
                    </>
                  </FlexContainer>
                </Clickable>
              );
            })}
            </ContentWrapper> 
          </ModalStyle>
        </ModalWrapper>
      )}
    </>
  )
}

export default SimpleSelector;
