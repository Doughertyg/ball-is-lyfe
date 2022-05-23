import React, {useContext} from 'react';
import Icon from '../../components/Icon.jsx';
import { AuthContext } from '../../context/auth';
import { BodyText, DetailsText, Divider, FlexContainer, PageHeader, SectionHeadingText } from '../../styled-components/common';
import {useHistory} from 'react-router';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import Card from '../../components/Card.jsx';
import dayjs from 'dayjs';


const FETCH_LEAGUE_QUERY = gql`
  query($leagueID: ID!) {
    getLeagueByID(leagueID: $leagueID) {
      _id
      admins {
        id
        username
      }
      name
      description
      profilePicture
      seasons {
        id
        name
        description
        seasonEnd
        seasonStart
      }
      sport
      location
    }
  }
`;

/**
 * Home page for league. Logged in user sees stats, games, standings
 * 
 *     |*************************************|
 *     | League Name (i)                     |
 *     |   location - sport                  |
 *     |                                     |
 *     |  description of the league. short   |
 *     |  bio...                             |
 *     |  __________________________________ |
 *     | ;'````````'; ;'````````'; ;'````````|
 *     | :  recent  : : seasons..: :     ....|
 *     | |          | |          | |         |
 *     | |          | |          | |         |
 *     | |          | |          | |         |
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
const League = ({match}) => {
  const { user } = useContext(AuthContext);
  const leagueID = match.params?.leagueID;
  const history = useHistory();
  console.log('league page. id: ', leagueID);

  if (user == null) {
    // redirect to login page
    history.push('/login');
  }

  if (leagueID == null) {
    console.log('redirecting home');
    history.push('/');
  }

  const { loading, data: leagueData, error} = useQuery(FETCH_LEAGUE_QUERY, {
    variables: {leagueID: leagueID}
  });
  console.log('data: ', leagueData);
  console.log('error:::::  ', JSON.stringify(error, null, 2));

  // consider using useMemo
  const isLeagueAdmin = leagueData?.getLeagueByID?.admins?.reduce((acc, admin) => {
    return admin.id === user.id ? true : acc;
  }, false) ?? false;

  return (
    <FlexContainer direction="column">
      {loading ? <h1>Loading...</h1> : (
        <>
          <PageHeader margin="20px 0 0 0">{leagueData?.getLeagueByID?.name}</PageHeader>
          <FlexContainer alignItems="center" justify="start">
            <DetailsText>{
              leagueData?.getLeagueByID?.location + ' - ' + leagueData?.getLeagueByID?.sport
            }</DetailsText>
            <Icon
              icon="info"
              onClick={() => {console.log('league info open!'/* Open league info panel */);}}
            />
          </FlexContainer>
          <br />
          <BodyText>
            {leagueData?.getLeagueByID?.description}
          </BodyText>
          <Divider marginBottom="12px" />
          <FlexContainer alignItems="center" justify="start">
            <SectionHeadingText margin="20px 12px 20px 0">Recent Seasons</SectionHeadingText>
            {isLeagueAdmin && <Icon borderRadius="50%" icon="plus" onClick={() => history.push(`/league/${leagueID}/season/new`)} />}
          </FlexContainer>
          <FlexContainer justify="start" overFlow="scroll" width="100%">
          {leagueData?.getLeagueByID?.seasons.length > 0 ?
            leagueData?.getLeagueByID?.seasons?.map((season, idx) => {
              const start = dayjs(season?.seasonStart).format('MMM YYYY');
              const end = dayjs(season?.seasonEnd).format('MMM YYYY');
              return (
                <Card
                  body={season?.description}
                  key={idx}
                  subTitle={start + ' - ' + end}
                  title={season?.name}
                  margin="0 20px 0 0"
                  onClick={() => {history.push(`/season/${season.id}`)}}
                />
              )
          }) :
            <DetailsText>No Seasons</DetailsText>
          }
           </FlexContainer>
          {/* <Divider marginBottom="12px" />
          <SectionHeadingText>Stat Leaders</SectionHeadingText>
            :: :: :: :: stat cards :: :: :: :: 
          <Divider /> */}
        </>
      )}
    </FlexContainer>
  );
}

export default League;
