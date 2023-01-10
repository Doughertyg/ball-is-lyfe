import React, {useContext, useMemo, useState} from 'react';
import Icon from '../../components/Icon.jsx';
import { AuthContext } from '../../context/auth';
import { BodyText, DetailsText, Divider, FlexContainer, PageHeader, SectionHeadingText } from '../../styled-components/common';
import {useHistory} from 'react-router';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import dayjs from 'dayjs';
import LoadingSpinnerBack from '../../components/LoadingSpinnerBack.jsx';
import AddGamesComponent from '../../components/AddGamesComponent.jsx';

const FETCH_SEASON_QUERY = gql`
  query($seasonID: ID!, $userID: ID!) {
    getSeasonByID(seasonID: $seasonID, userID: $userID) {
      season {
        name
        description
        league {
          name
        }
        seasonStart 
        seasonEnd
      }
      isLeagueAdmin
    }
  }
`;

/**
 * Home page for season. Logged in user sees stats, games, standings
 * 
 *     |*************************************|
 *     | Season Name (i)                     |
 *     |   Season dates...                   |
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
  const [addGamesExpanded, setAddGamesExpanded] = useState(false);
  const { user } = useContext(AuthContext);
  const seasonID = match.params?.seasonID;
  const history = useHistory();

  console.log('seasonID:  ', seasonID);

  if (seasonID == null) {
    console.log('season ID null, redirecting home.');
    history.push('/');
  }

  const { loading, data: seasonData, error } = useQuery(FETCH_SEASON_QUERY, {
    variables: {seasonID, userID: user.id }
  });
  const isLeagueAdmin = seasonData?.getSeasonByID?.isLeagueAdmin ?? false;

  const recentGames = useMemo(() => {
    return seasonData?.getSeasonByID?.season?.games?.filter(game => {
      return dayjs().isSame(game.date) || (dayjs().isAfter(game.date) && dayjs().subtract(1, 'week').isBefore(game.date));
    }) ?? [];
  }, [seasonData?.getSeasonByID?.season?.games]);

  const upcomingGames = useMemo(() => {
    return seasonData?.getSeasonByID?.season?.games?.filter(game => {
      return dayjs().isBefore(game.date) && dayjs().add(1, 'week').isAfter(game.date);
    }) ?? [];
  }, [seasonData?.getSeasonByID?.season?.games]);

  return (
    <FlexContainer direction="column" justify="flex-start" margin="0 auto" maxWidth="800px" padding="0 12px">
      {loading ? (
        <FlexContainer height="45px" justify="flex-start" width="800px">
          <LoadingSpinnerBack />
        </FlexContainer>
      ) : (
        <>
          <FlexContainer direction="row" justify="space-between">
            <FlexContainer direction="column">
              <PageHeader margin="20px 0 8px 0">{seasonData?.getSeasonByID?.season?.name ?? 'Season name missing'}</PageHeader>
              <DetailsText marginBottom="4px">
                <SectionHeadingText>{seasonData?.getSeasonByID?.season?.league?.name ?? 'League missing'}</SectionHeadingText>
              </DetailsText>
              <FlexContainer alignItems="center" justify="start">
                <DetailsText>{
                  (dayjs(seasonData?.getSeasonByID?.season?.seasonStart).format('MMM YYYY') ?? 'Season start missing') + ' - ' + (dayjs(seasonData?.getSeasonByID?.season?.seasonEnd).format('MMM YYYY') ?? 'season end missing')
                }</DetailsText>
              </FlexContainer>
            </FlexContainer>
          </FlexContainer>
          <br />
          <BodyText>
            {seasonData?.getSeasonByID?.season?.description}
          </BodyText>
          <Divider marginBottom="12px" />
          <FlexContainer alignItems="center" justify="start">
            <SectionHeadingText margin="20px 12px 20px 0">Recent Games</SectionHeadingText>
          </FlexContainer>
          <FlexContainer justify="flex-start" overFlow="scroll" width="100%">
            {recentGames.length > 0 ?
              recentGames.map((game, idx) => {
                const date = dayjs(game?.date).format('MMM YYYY');
                return (
                  <Card
                    key={idx}
                    subTitle={date}
                    title={`${game?.awayTeam?.name ?? 'away team'} at ${game?.homeTeam?.name ?? 'home team'}`}
                    margin="0 8px 0 0"
                    onClick={() => {history.push(`/game/${game.id}`)}}
                  />
                )
            }) : (
            <FlexContainer justify="flex-start" width="800px">
              <DetailsText>No recent Games</DetailsText>
            </FlexContainer>
            )}
          </FlexContainer>
          <FlexContainer alignItems="center" justify="start" overFlow="visible">
            <SectionHeadingText margin="20px 12px 20px 0">Upcoming Games</SectionHeadingText>
            {addGamesExpanded && <AddGamesComponent />}
            {isLeagueAdmin && <Icon borderRadius="50%" icon="plus" onClick={() => setAddGamesExpanded(!addGamesExpanded)} />}
          </FlexContainer>
          <FlexContainer justify="flex-start" overFlow="scroll" width="100%">
            {upcomingGames.length > 0 ?
              upcomingGames.map((game, idx) => {
                const date = dayjs(game?.date).format('MMM YYYY');
                return (
                  <Card
                    key={idx}
                    subTitle={date}
                    title={`${game?.awayTeam?.name ?? 'away team'} at ${game?.homeTeam?.name ?? 'home team'}`}
                    margin="0 8px 0 0"
                    onClick={() => {history.push(`/game/${game.id}`)}}
                  />
                )
            }) : (
            <FlexContainer justify="flex-start" width="800px">
              <DetailsText>No upcoming Games</DetailsText>
            </FlexContainer>
            )}
          </FlexContainer>
          <Divider />
          <SectionHeadingText margin="20px 12px 20px 0">Stat Leaders</SectionHeadingText>
          <Divider />
          <SectionHeadingText margin="20px 12px 20px 0">Standings</SectionHeadingText>
          <Divider />
          <SectionHeadingText margin="20px 12px 20px 0">Teams</SectionHeadingText>
          <Divider />
          <SectionHeadingText margin="20px 12px 20px 0">Players</SectionHeadingText>
        </>
      )}
    </FlexContainer>
  );
}

export default Season;
