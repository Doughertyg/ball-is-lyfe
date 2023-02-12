import React, { useMemo, useState} from 'react';
import InputField from './InputField.jsx';
import styled from 'styled-components';
import { BodyText, DetailsText, Divider, FlexContainer, ProfilePictureThumb } from '../styled-components/common.js';
import Icon from './Icon.jsx';

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 10:
`;

export const ModalStyle = styled.div`
  position: absolute;
  border-radius: 6px;
  box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.07);
  background-color: white;
  width: 100%;
  z-index: 10000;
`;

const ModalWrapper = styled.div`
  position: relative;
  z-index: 1000;
`;

const Clickable = styled.div`
  cursor: ${props => props.onClick != null ? 'pointer' : 'initial'};
`;

const ContentWrapper = styled.div`
  padding: 10px;
  box-sizing: border-box;
`;

/**
 * Component for searching a list of items
 * with dropdown filtered and selectable results
 * 
 *  ,.................................................,
 * |  Search...                                        |
 *  `'''''''''''''''''''''''''''''''''''''''''''''''''`
 *  |  Steph Curry #30                                |
 *  | ``````````````````````````````````````````````` |
 *  '._______________________________________________.'
 * 
 * 
 */
export default function SearchField({
  borderRadius,
  filterResults,
  getResultComponent,
  height,
  isDisabled,
  label,
  loading,
  onClick,
  selected,
  source,
  width
}) {
  const [input, setInput] = useState('');
  const [resultsOpen, setResultsOpen] = useState(false);

  const results = useMemo(() => {
    return input != '' ? source?.filter(entry => {
      return filterResults(entry, input);
    }) ?? [] : []
  }, [source, input, filterResults]);

  const onInputClick = () => {
    if (!resultsOpen) {
      setResultsOpen(true);
    }
  }

  const onResultClick = (entry) => {
    onClick?.(entry);
    if (selected == null) {
      // not multiselect, close results
      setResultsOpen(false);
    }
  }

  return (
    <FlexContainer direction="column" grow="1" overflow="visible">
      <InputField
        autoComplete={false}
        borderRadius={borderRadius}
        disabled={isDisabled}
        height={height}
        loading={loading}
        onChange={(input) => setInput(input)}
        onClick={onInputClick}
        placeholder={label ?? "Search..."}
        value={input}
        width={width ?? "700px"}
      />
      {results.length > 0 && resultsOpen && (
        <ModalWrapper>
          <ModalContainer onClick={() => setResultsOpen(false)} />
          <ModalStyle>
            <ContentWrapper>
            {results?.map((entry, idx) => {
              return (
                <Clickable key={idx} onClick={() => onResultClick(entry)}> 
                  {idx !== 0 && <Divider marginBottom="10px" />}
                  <FlexContainer alignItems="center" justify="space-between">
                    {getResultComponent ? getResultComponent(entry, idx) : (
                      <>
                        {entry.profilePicture && (
                          <ProfilePictureThumb
                            height="32px"
                            referrerPolicy="no-referrer"
                            src={entry.profilePicture}
                            width="32px" />
                        )}
                        <BodyText width="fit-content">
                          {entry.name ?? entry.username ?? 'Name missing'}
                        </BodyText>
                        <DetailsText flexGrow="1" margin="0 0 0 4px">
                          {entry.description}
                        </DetailsText>
                      </>)}
                    {selected != null && (selected[entry.id ?? entry] ? (
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
      {(source?.length === 0 || source == null) && resultsOpen ? (
        <ModalWrapper>
          <ModalContainer onClick={() => setResultsOpen(false)} />
            <ModalStyle>
              <ContentWrapper>
                <DetailsText>Nothin to search.</DetailsText>
              </ContentWrapper> 
            </ModalStyle>
        </ModalWrapper>
      ) : null}
    </FlexContainer>
  )
}
