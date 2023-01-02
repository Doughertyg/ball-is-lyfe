import React, {useContext, useState} from 'react';
import Icon from '../../components/Icon.jsx';
import { AuthContext } from '../../context/auth';
import {
  BodyText,
  DetailsText,
  Divider,
  FlexContainer,
  PageHeader,
  SectionHeadingText,
  ScrollableContainer,
  ProfilePictureThumb
} from '../../styled-components/common';
import {useHistory} from 'react-router';
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/react-hooks';
import Card from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import dayjs from 'dayjs';
import styled from 'styled-components';
import PlayerSearchField from '../../components/PlayerSearchField.jsx';
import PlayerCard from '../../components/PlayerCard.jsx';
import { CardWrapper } from '../../styled-components/card.js';

const SearchWrapper = styled.div`
  height: 100%;
  width: ${props => props.width ?? 0};
  overflow: ${props => props.overflow ?? 'hidden'};
  transition: width .24s;
  transition-timing-function: ease-out;
`;

const RowWrapper = styled.div`
  padding: 8px;
`;

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
    getPlayersInLeague(leagueID: $leagueID) {
      email
      id
      name
      profilePicture
      username
    }
  }
`;

const ADD_PLAYERS_TO_LEAGUE_MUTATION = gql`
  mutation addPlayersToLeague(
    $leagueID: ID!,
    $playersToAdd: [ID!]
  ) {
    addPlayersToLeague(
      leagueID: $leagueID,
      playersToAdd: $playersToAdd
    ) {
      name
      _id
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
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [players, setPlayers] = useState({});
  console.log('league page. id: ', leagueID);

  if (leagueID == null) {
    console.log('leagueID null, redirecting home');
    history.push('/');
  }

  const [addPlayersToLeague, {isSubmitting}] = useMutation(ADD_PLAYERS_TO_LEAGUE_MUTATION, {
    onCompleted: (res) => {
      console.log('mutation completed!!! res: ', res);
      history.push('/');
    },
    onError: (error) => {
      console.log('stringified error on mutation:  ', JSON.stringify(error, null, 2))
    },
    variables: {
      leagueID,
      playersToAdd: Object.keys(players)
    }
  })

  const { loading, data: leagueData, error} = useQuery(FETCH_LEAGUE_QUERY, {
    variables: {leagueID: leagueID}
  });
  console.log('data: ', leagueData);

  // consider using useMemo
  const isLeagueAdmin = leagueData?.getLeagueByID?.admins?.reduce((acc, admin) => {
    return admin.id === user.id ? true : acc;
  }, false) ?? false;

  const onSelectPlayer = (player) => {
    if (!players[player.id]) {
      const newPlayersMap = {...players};
      newPlayersMap[player.id] = player;
      setPlayers(newPlayersMap);
    } else {
      const newPlayersMap = {...players};
      delete newPlayersMap[player.id];      
      setPlayers(newPlayersMap);
    }
  }

  return (
    <FlexContainer direction="column" justify="flex-start" maxWidth="800px">
      {loading ? (
        <FlexContainer justify="flex-start" width="800px">
          <h1>Loading...</h1>
        </FlexContainer>
      ) : (
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
          <FlexContainer justify="flex-start" overFlow="scroll" width="100%">
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
                  margin="0 8px 0 0"
                  onClick={() => {history.push(`/season/${season.id}`)}}
                />
              )
          }) :
            <DetailsText>No Seasons</DetailsText>
          }
          </FlexContainer>
          <FlexContainer alignItems="center" justify="flex-start" overflow="initial">
            <SectionHeadingText margin="20px 12px 20px 0">Players</SectionHeadingText>
            <SearchWrapper width={searchExpanded ? '400px' : '0'} overflow={searchExpanded ? 'initial' : 'hidden'}>
              <PlayerSearchField excludeLeague leagueID={leagueID} onClick={onSelectPlayer} selected={players} width={searchExpanded ? '400px' : '0'} />
            </SearchWrapper>
            {isLeagueAdmin && <Icon borderRadius="50%" icon={searchExpanded ? "close" : "plus"} onClick={() => setSearchExpanded(!searchExpanded)} />}
          </FlexContainer>
          {Object.keys(players).length > 0 && (
            <>
              <FlexContainer flexWrap="wrap" justify="start">
                {Object.values(players).map((player, idx) => (
                    <CardWrapper
                      boxShadow="0 0 10px rgba(0, 0, 0, 0.07)"
                      key={player.id ?? idx}
                      margin='4px 4px 0 0'>
                      <FlexContainer alignItems="center" justify="space-between">
                        {player.profilePicture && (
                          <ProfilePictureThumb
                            height="32px"
                            referrerPolicy="no-referrer"
                            src={player.profilePicture}
                            width="32px" />
                        )}
                        <FlexContainer direction="column">
                          <BodyText marginBottom="4px">
                            {player.name ?? player.username}
                          </BodyText>
                          <DetailsText>{player.email}</DetailsText>
                        </FlexContainer>
                        <Icon icon="close" onClick={() => onSelectPlayer(player)} />
                      </FlexContainer>
                    </CardWrapper>
                ))}
              </FlexContainer>
              <FlexContainer marginTop="12px">
                <Button isDisabled={isSubmitting} label="Cancel" onClick={() => setPlayers({})} />
                <Button isLoading={isSubmitting} label="Add players to league" onClick={() => addPlayersToLeague()} />
              </FlexContainer>
            </>)}
          <FlexContainer justify="flex-start" flexWrap="wrap">
          {leagueData?.getPlayersInLeague?.length > 0 ?
            leagueData.getPlayersInLeague.map((player, idx) => {
              return (
                <PlayerCard
                  email={player.email}
                  key={player.id ?? idx}
                  margin="0 8px 8px 0"
                  name={player.name}
                  picture={player.profilePicture}
                  username={player.username}
                />
              )
            }) :
            <DetailsText>No players in league</DetailsText>
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
