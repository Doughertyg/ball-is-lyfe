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
import AddPlayerSection from '../../components/AddPlayerSection.jsx';
import { CardWrapper } from '../../styled-components/card.js';
import LoadingSpinnerSpin from '../../components/LoadingSpinnerSpin.jsx';

const SearchWrapper = styled.div`
  height: 100%;
  width: ${props => props.width ?? 0};
  overflow: ${props => props.overflow ?? 'hidden'};
  transition: width .24s;
  transition-timing-function: ease-out;
`;

const FETCH_LEAGUE_QUERY = gql`
  query($leagueID: ID!, $userID: ID!) {
    getLeagueByID(leagueID: $leagueID, userID: $userID) {
      isAdmin
      league {
        _id
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
  const [selectedPlayers, setSelectedPlayers] = useState({});
  console.log('league page. id: ', leagueID);

  if (leagueID == null) {
    console.log('leagueID null, redirecting home');
    history.push('/');
  }

  const [addPlayersToLeague, {isSubmitting}] = useMutation(ADD_PLAYERS_TO_LEAGUE_MUTATION, {
    onCompleted: (res) => {
      console.log('mutation completed!!! res: ', res);
      location.reload();
    },
    onError: (error) => {
      console.log('stringified error on mutation:  ', JSON.stringify(error, null, 2))
    },
    variables: {
      leagueID,
      playersToAdd: Object.keys(selectedPlayers)
    }
  })

  const { loading, data: leagueData, error} = useQuery(FETCH_LEAGUE_QUERY, {
    variables: {leagueID: leagueID, userID: user.id}
  });
  const isLeagueAdmin = leagueData?.getLeagueByID?.isAdmin;

  const onSelectPlayer = (player) => {
    if (!selectedPlayers[player.id]) {
      const newPlayersMap = {...selectedPlayers};
      newPlayersMap[player.id] = player;
      setSelectedPlayers(newPlayersMap);
    } else {
      const newPlayersMap = {...selectedPlayers};
      delete newPlayersMap[player.id];      
      setSelectedPlayers(newPlayersMap);
    }
  }

  return (
    <FlexContainer direction="column" justify="flex-start" margin="0 auto" maxWidth="800px" padding="0 12px">
      {loading ? (
        <FlexContainer height="45px" justify="flex-start" width="800px">
          <LoadingSpinnerSpin />
        </FlexContainer>
      ) : (
        <>
          <PageHeader margin="20px 0 0 0">{leagueData?.getLeagueByID?.league?.name ?? 'League name missing'}</PageHeader>
          <FlexContainer alignItems="center" justify="start">
            <DetailsText>{
              (leagueData?.getLeagueByID?.league?.location ?? 'League location missing') + ' - ' + (leagueData?.getLeagueByID?.league?.sport ?? 'League sport missing')
            }</DetailsText>
            <Icon
              icon="info"
              onClick={() => {console.log('league info open!'/* Open league info panel */);}}
            />
          </FlexContainer>
          <br />
          <BodyText>
            {leagueData?.getLeagueByID?.league?.description}
          </BodyText>
          <Divider marginBottom="12px" />
          <FlexContainer alignItems="center" justify="start">
            <SectionHeadingText margin="20px 12px 20px 0">Recent Seasons</SectionHeadingText>
            {isLeagueAdmin && <Icon borderRadius="50%" icon="plus" onClick={() => history.push(`/league/${leagueID}/season/new`)} />}
          </FlexContainer>
          <FlexContainer justify="flex-start" overFlow="scroll" width="100%">
          {leagueData?.getLeagueByID?.league?.seasons.length > 0 ?
            leagueData?.getLeagueByID?.league?.seasons?.map((season, idx) => {
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
          }) : (
          <FlexContainer justify="flex-start" width="800px">
            <DetailsText>No Seasons</DetailsText>
          </FlexContainer>
          )}
          </FlexContainer>
          <AddPlayerSection
            excludeLeague
            isCollapsible
            isSubmitting={isSubmitting}
            label="Players"
            leagueID={leagueID}
            onClose={() => setSelectedPlayers({})}
            onSubmit={addPlayersToLeague}
            onSelectPlayer={onSelectPlayer}
            selectedPlayers={selectedPlayers}
            submitLabel="Add players to league"/>
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
            }) : (
              <FlexContainer justify="flex-start" width="800px">
                <DetailsText>No players in league</DetailsText>
              </FlexContainer>
            )
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
