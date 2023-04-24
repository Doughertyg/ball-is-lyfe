import React from 'react';
import { FlexContainer, SectionHeadingText } from '../styled-components/common';
import CompactDetailsCard from '../../components/CompactDetailsCard.jsx';

/**
 * Season standings section
 * - display team standings
 *  ,-------------------------------,
 * |  Standings                     |
 * |  1. Sacramento Kings           |
 * |  2. Golden State Warriors      |
 * |  3. ...                        |
 * |                                |
 * '--------------------------------'
 */
const SeasonStandingsSection = ({ teams }) => {

  return (
    <FlexContainer direction="column" justify="flex-start">
      <SectionHeadingText margin="20px 12px 20px 0">Standings</SectionHeadingText>
      {teams.map((team, idx) => (
        <CompactDetailsCard key={idx} title={team.name} subTitle={team.captain?.name} />
      ))}
    </FlexContainer>
  )
}

export default SeasonStandingsSection;
