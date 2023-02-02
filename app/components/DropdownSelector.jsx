import React, {useState} from 'react';
import { BodyText, DetailsText, Divider, FlexContainer, ProfilePictureThumb } from '../styled-components/common';
import styled from 'styled-components';
import { Clickable } from '../styled-components/interactive';
import Icon from './Icon.jsx';

const Wrapper = styled.div`
  background-color: white;
  border-radius: 8px;
  box-sizing: border-box;
  border: 1px solid rgba(0, 0, 0, 0.1);
  height: auto;
  width: 100%;
  max-width: 400px;
  line-height: 20px;
  padding: 12px;
`;

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
 * Dropdown selector component 
 * options prop is an array of the selectable options
 * Each option should have a name value to be displayed
 * and a value value used for setting the selection
 *  ,.................................................,
 * |  Select                                          |
 *  `'''''''''''''''''''''''''''''''''''''''''''''''''`
 *  |  Steph Curry #30                                |
 *  | ``````````````````````````````````````````````` |
 *  '._______________________________________________.'
 */
const DropdownSelector = ({
  getCustomEntryComponent,
  onClick,
  options,
  selected,
  value
}) => {
  const [resultsOpen, setResultsOpen] = useState(false);

  const onEntryClick = (entry) => {
    if (selected == null) { // if not multiselect, close selector on click
      setResultsOpen(false);
    }

    onClick?.(entry);
  }
  
  return (
    <FlexContainer direction="column" grow="1" overflow="visible">
      <Wrapper onClick={() => setResultsOpen(true)}>
        {value != null ? value : <DetailsText>Select...</DetailsText>}
      </Wrapper>
      {options?.length > 0 && resultsOpen && (
        <ModalWrapper>
          <ModalContainer onClick={() => setResultsOpen(false)} />
          <ModalStyle>
            <ContentWrapper>
            {options?.map((entry, idx) => {
              return (
                <Clickable key={idx} onClick={() => onEntryClick(entry)}> 
                  {idx !== 0 && <Divider marginBottom="10px" />}
                  <FlexContainer alignItems="center" justify="space-between">
                    {getCustomEntryComponent ? getCustomEntryComponent(entry, idx) : (
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
                      </>)}
                    {selected != null && (selected[entry.value ?? entry.id] ? (
                      <Icon icon="checkFilled" />
                    ) :
                    (
                      <Icon icon="circle" />
                    ))}
                  </FlexContainer>
                </Clickable>
              );
            })}
            </ContentWrapper> 
          </ModalStyle>
        </ModalWrapper>
      )}
    </FlexContainer>
  )
}

export default DropdownSelector;
