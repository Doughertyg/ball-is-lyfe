import React, {useContext} from 'react';
import Icon from '../../components/Icon.jsx';
import { AuthContext } from '../../context/auth';
import { Divider, FlexContainer, PageHeader, SectionHeadingText } from '../../styled-components/common';
import {useHistory} from 'react-router';

/**
 * Home page for league. Logged in user sees stats, games, standings
 * 
 *     |*************************************|
 *     | League Name (i)                     |
 *     |   league dates...                   |
 *     |                                     |
 *     | ;'````````'; ;'````````'; ;'````````|
 *     | :  recent  : :  games.. : :     ....|
 *     |  `'''''''''`  `'''''''''`  `''''''''|
 *     | ;'````````'; ;'````````'; ;'````````|
 *     | : upcoming : :  games.. : :     ....|
 *     |  `'''''''''`  `'''''''''`  `''''''''|
 *     |  Stat leaders                       |
 *     | :'`````````': :'`````````': :'``````|
 *     | | Stat      | | Stat      | | Stat  |
 *     | |  player 1 | |  player 1 | |  play |
 *     | |  player 2 | |  player 2 | |  playe|
 *     | |           | |           | |       |
 *     | `;_________;` `;_________;` `;______|
 *     |                                     |
 *     |  Standings                          |
 *     |   1. team...                        |
 *     |   2. team....                       |
 *     |   3. team.....                      |
 *     |                                     |
 *      `-----------------------------------"
 * 
 */
const Season = ({match}) => {
  const { user } = useContext(AuthContext);
  const leagueID = match.params?.seasonID;
  const history = useHistory();
  console.log('season page');

  if (user == null) {
    // redirect to login page
    history.push('/login');
  }

  if (leagueID == null) {
    console.log('redirecting home');
    history.push('/');
  }

  return (
    <FlexContainer direction="column">
      <PageHeader>League SFGBA</PageHeader>
      <SectionHeadingText>Spring 2022</SectionHeadingText>
      <Icon icon="info" onClick={() => {console.log('league info open!'/* Open league info panel */);}} />
      <Divider />
        <SectionHeadingText>Recent Games</SectionHeadingText>
          "Recent Games..."
        <SectionHeadingText>Upcoming Games</SectionHeadingText>
          "Upcoming Games..."
      <Divider />
      <SectionHeadingText>Stat Leaders</SectionHeadingText>
        "Stat cards..."
      <Divider />
      <SectionHeadingText>Standings</SectionHeadingText>
        "league standings..."
    </FlexContainer>
  );
}

export default Season;
