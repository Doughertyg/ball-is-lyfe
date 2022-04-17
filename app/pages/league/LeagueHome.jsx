import react from 'react';
import Icon from '../../components/Icon';
import { Divider, FlexContainer, PageHeader, SectionHeadingText } from '../../styled-components/common';

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
export default LeagueHome = (props) => {
  const { user } = useContext(AuthContext);

  if (user == null) {
    // redirect to login page
    return "Please login....";
  }

  return (
    <FlexContainer>
      <PageHeader>League SFGBA</PageHeader>
      <SectionHeadingText>Spring 2022</SectionHeadingText>
      <Icon icon="info" onClick={() => {/* Open league info panel */}} />
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
  )


};
