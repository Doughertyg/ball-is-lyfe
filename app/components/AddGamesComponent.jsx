import React, {useState} from 'react';
import { FlexContainer, SectionHeadingText } from '../styled-components/common';
import Button from './Button.jsx';
import InputField from './InputField.jsx';
import SearchField from './SearchField.jsx';

/**
 * collapsible omponent for adding games to a season
 * 
 * ,---------------,    ,-----------------,     ,------,
 * :   teamA       : vs :     teamB       : at: : :_:v :
 * `---------------`    `-----------------`     `------`
 *     ,--------,   ,--------------,
 *     : Cancel :   :   Add game   ;
 *     `--------`   `--------------`
 */
const AddGamesComponent = ({ isExpanded, onCancel, seasonID }) => {
  const [gamesToAdd, setGamesToAdd] = useState([]);
  const [teamA, setTeamA] = useState(null);
  const [teamB, setTeamB] = useState(null);
  const [date, setDate] = useState(null);

  return (
    <FlexContainer alignItems="center">
      <SearchField
        filterResults={() => {}}
        label="Search teams..."
        onClick={() => {}}
        source={[]}
        width="auto"
      />
      <SectionHeadingText margin="0 8px">vs.</SectionHeadingText>
      <SearchField
        filterResults={() => {}}
        label="Search teams..."
        onClick={() => {}}
        source={[]}
        width="auto"
      />
      <SectionHeadingText margin="0 8px">on</SectionHeadingText>
      <InputField
        onChange={setDate}
        width="100%"
        value={date}
        type="datetime-local"
      />
      <Button label="Add" marginTop="4px" onClick={() => {}} />
    </FlexContainer>
  )
}

export default AddGamesComponent;
