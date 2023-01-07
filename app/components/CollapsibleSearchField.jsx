import React, { useState } from 'react';
import styled from 'styled-components';
import { FlexContainer } from '../styled-components/common';
import SearchField from './SearchField.jsx';
import Icon from './Icon.jsx';

const SearchWrapper = styled.div`
  display: flex;
  height: 100%;
  width: ${props => props.width ?? 0};
  overflow: ${props => props.overflow ?? 'hidden'};
  position: relative;
  transition: width .24s;
  transition-timing-function: ease-out;
`;

const RightButton = styled.div`
  flex-shrink: 0;
`;

/**
 * Component for a collapsible search field
 *   Accepts a source which is searched against
 *   results are rendered as a list/modal 
 * 
 *   ,-----------------------------------------,
 *   |  Search...                              | (X)
 *   '-----------------------------------------'
 *   |          results                        |
 *   |-----------------------------------------|
 *   |          results                        |
 *    '---------------------------------------'
 */
const CollapsibleSearchField = ({
  filterResults,
  getResultComponent,
  getRightButton,
  height,
  label,
  loading,
  onClick,
  onClose,
  selected,
  source,
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    if (expanded) {
      setExpanded(false);
      onClose?.();
    } else {
      setExpanded(true);
    }
  }

  return (
    <>
      <FlexContainer alignItems="center" justify="flex-start" overflow="initial">
        <SearchWrapper width={expanded ? '400px' : '0'} overflow={expanded ? 'initial' : 'hidden'}>
          <SearchField
            borderRadius={getRightButton != null ? "8px 0 0 8px" : null}
            filterResults={filterResults}
            getResultComponent={getResultComponent}
            height={height}
            label={label}
            loading={loading}
            onClick={onClick}
            selected={selected}
            source={source}
            width="100%"
          />
          {getRightButton && (
            <RightButton>
              {getRightButton?.()}
            </RightButton>
          )}
        </SearchWrapper>
        <Icon borderRadius="50%" icon={expanded ? "close" : "plus"} onClick={toggleExpanded} />
      </FlexContainer>
    </>
  )
}

export default CollapsibleSearchField;
