import React, {useContext, useMemo, useState} from 'react';
import Icon from '../../components/Icon.jsx';
import { AuthContext } from '../../context/auth';
import { BodyText, DetailsText, Divider, FlexContainer, PageHeader, ProfilePictureThumb, SectionHeadingText } from '../../styled-components/common';
import {useHistory} from 'react-router';
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/react-hooks';
import dayjs from 'dayjs';
import LoadingSpinnerBack from '../../components/LoadingSpinnerBack.jsx';
import AddGamesComponent from '../../components/AddGamesComponent.jsx';
import CollapsibleSearchField from '../../components/CollapsibleSearchField.jsx';
import Button from '../../components/Button.jsx';
import CreatetTeamComponent from '../../components/CreateTeamComponent.jsx';
import AddPlayerSection from '../../components/AddPlayerSection.jsx';
import PlayerCard from '../../components/PlayerCard.jsx';
import { CardWrapper } from '../../styled-components/card.js';

const FETCH_SEASON_QUERY = gql`
  query($seasonID: ID!, $userID: ID!) {
    getSeasonByID(seasonID: $seasonID, userID: $userID) {
      season {
        captains {
          id
          name
          email
          profilePicture
          username
        }
        name
        description
        league {
          _id
          name
        }
        players {
          id
          name
          email
          profilePicture
          username
        }
        seasonStart 
        seasonEnd
      }
      isLeagueAdmin
    }
  }
`;

const FETCH_TEAMS_QUERY = gql`
  query {
    getTeams {
      name
      captaim {
        name
      }
      profilePicture
    }
  }
`;

const ADD_PLAYERS_MUTATION = gql`
  mutation addPlayersToSeason(
    $seasonID: ID!,
    $players: [ID!]
  ) {
    addPlayersToSeason(
      seasonID: $seasonID,
      players: $players
    ) {
      name
    }
  }
`;

const ADD_CAPTAINS_MUTATION = gql`
  mutation addCaptainsToSeason(
    $seasonID: ID!,
    $captains: [ID!]
  ) {
    addCaptainsToSeason(
      seasonID: $seasonID,
      captains: $captains
    ) {
      name
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
  const [teamsToAdd, setTeamsToAdd] = useState({});
  const [playersToAdd, setPlayersToAdd] = useState({});
  const [captainsToAdd, setCaptainsToAdd] = useState({});
  const [createTeamExpanded, setCreateTeamExpanded] = useState(false);
  const { user } = useContext(AuthContext);
  const seasonID = match.params?.seasonID;
  const history = useHistory();

  if (seasonID == null) {
    console.log('season ID null, redirecting home.');
    history.push('/');
  }

  const { loading, data: seasonData, error } = useQuery(FETCH_SEASON_QUERY, {
    variables: {seasonID, userID: user.id }
  });
  const isLeagueAdmin = seasonData?.getSeasonByID?.isLeagueAdmin ?? false;
  const leagueID = seasonData?.getSeasonByID?.season?.league?._id;

  const { loading: loadingTeams, data: teamData } = useQuery(FETCH_TEAMS_QUERY);

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

  const filterTeamSearchResults = (team, searchString) => {
    return team?.name?.includes(searchString);
  }

  const [addPlayersToSeason, {isSubmitting}] = useMutation(ADD_PLAYERS_MUTATION, {
    onCompleted: (res) => {
      console.log('mutation completed!!! res: ', res);
      location.reload();
    },
    onError: (error) => {
      console.log('stringified error on mutation:  ', JSON.stringify(error, null, 2))
    },
    variables: {
      seasonID,
      players: Object.keys(playersToAdd)
    }
  });

  const [addCaptainsToSeason, {isSubmitting: isSubmittingCaptains}] = useMutation(ADD_CAPTAINS_MUTATION, {
    onCompleted: (res) => {
      console.log('mutation completed!!! res: ', res);
      location.reload();
    },
    onError: (error) => {
      console.log('stringified error on mutation:  ', JSON.stringify(error, null, 2))
    },
    variables: {
      seasonID,
      captains: Object.keys(captainsToAdd)
    }
  });

  const addTeamsToSeason = () => {
    // commit mutation here
  }

  const onSelectPlayers = (player) => {
    if (!playersToAdd[player.id]) {
      const newPlayersToAddMap = {...playersToAdd};
      newPlayersToAddMap[player.id] = player;
      setPlayersToAdd(newPlayersToAddMap);
    } else {
      const newPlayersToAddMap = {...playersToAdd};
      delete newPlayersToAddMap[player.id];
      setPlayersToAdd(newPlayersToAddMap);
      if (captainsToAdd[player.id]) {
        const newCaptainsToAdd = {...captainsToAdd};
        delete newCaptainsToAdd[player.id];
        setCaptainsToAdd(newCaptainsToAdd);
      }
    }
  }

  const onClickTeamEntry = (team) => {
    const teamsToAddMap = {...teamsToAdd};

    if (teamsToAddMap[team.id]) {
      delete teamsToAddMap[team.id];
    } else {
      teamsToAddMap[team.id] = team;
    }
    
    setTeamsToAdd(teamsToAddMap);
  }

  const getTeamResultsComponent = (team) => (
    <>
      {team.profilePicture && (
        <ProfilePictureThumb
          height="32px"
          referrerPolicy="no-referrer"
          src={team.profilePicture}
          width="32px" />
      )}
      <BodyText width="fit-content">
        {team.name}
      </BodyText>
      <DetailsText flexGrow="1" margin="0 0 0 4px" onClick={() => onClickTeamEntry(team)}>
        {`Captain: ${team?.captain?.name}`}
      </DetailsText>
      {teamsToAdd[team.id] ? (
        <Icon icon="checkFilled" />
      ) :
      (
        <Icon icon="circle" />
      )}
    </>
  );

  const getCreateTeamButton = () => (
    <Button
      borderRadius="0 8px 8px 0"
      boxShadow="none"
      height='46px'
      label="Create Team"
      margin="0"
      onClick={() => setCreateTeamExpanded(true)}
    />
  );

  const filterCaptainResults = (player, input) => {
    return player?.name?.includes(input) || player?.email?.includes(input) || player?.username?.includes(input);
  }

  const onSelectCaptains = (player) => {
    console.log('onSelectCaptains player: ', player);
    if (!captainsToAdd[player.id]) {
      const newCaptainsToAddMap = {...captainsToAdd};
      newCaptainsToAddMap[player.id] = player;
      setCaptainsToAdd(newCaptainsToAddMap);
    } else {
      const newCaptainsToAddMap = {...captainsToAdd};
      delete newCaptainsToAddMap[player.id];
      setCaptainsToAdd(newCaptainsToAddMap);
    }
  }

  const nonCaptainPlayers = useMemo(() => {
    return seasonData?.getSeasonByID?.season?.players?.filter(player => {
      return !seasonData?.getSeasonByID?.season?.captains?.map(player => player.id).includes(player.id);
    }) ?? [];
  }, [seasonData?.getSeasonByID?.season?.captains, seasonData?.getSeasonByID?.season?.players]);

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
                    key={`recent-games-${game.id}-${idx}`}
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
                    key={`upcoming-games-${game.id}-${idx}`}
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
          <Divider marginBottom="10px" />
          <FlexContainer alignItems="center" justify="start" overflow="visible">
            <SectionHeadingText margin="20px 12px 20px 0">Teams</SectionHeadingText>
            <CollapsibleSearchField
              filterResults={filterTeamSearchResults}
              getResultComponent={getTeamResultsComponent}
              getRightButton={getCreateTeamButton}
              label="Search teams..."
              loading={loadingTeams}
              onClick={onClickTeamEntry}
              onClose={() => setCreateTeamExpanded(false)}
              source={teamData?.getTeams ?? []}
            />
          </FlexContainer>
          {createTeamExpanded && (
            <CreatetTeamComponent onCancel={() => setCreateTeamExpanded(false)} seasonID={seasonID} />
          )}
          {Object.keys(teamsToAdd).length > 0 && (
            <>
              <FlexContainer flexWrap="wrap" justify="start" overflow="initial" shrink="0" width="100%">
                {Object.values(teamsToAdd).map((team, idx) => (
                    <CardWrapper
                      boxShadow="0 0 10px rgba(0, 0, 0, 0.07)"
                      key={`teamsToAdd-${team.id}-${idx}`}
                      margin='4px 4px 0 0'>
                      <FlexContainer alignItems="center" justify="space-between">
                        {teamsToAddMap.profilePicture && (
                          <ProfilePictureThumb
                            referrerPolicy="no-referrer"
                            height="32px"
                            src={team.profilePicture}
                            width="32px" />
                        )}
                        <FlexContainer direction="column">
                          <BodyText marginBottom="4px">
                            {team.name ?? 'Team name missing'}
                          </BodyText>
                          <DetailsText>{team.captain.name}</DetailsText>
                          {team.players > 0 && team.players.map((player, idx) => {
                            return (
                              <DetailsText key={idx}>{player.name}</DetailsText>
                            )
                          })}
                        </FlexContainer>
                        <Icon icon="close" onClick={() => onSelectPlayer(team)} />
                      </FlexContainer>
                    </CardWrapper>
                ))}
              </FlexContainer>
              {Object.keys(teamsToAdd).length > 0 && (<FlexContainer marginTop="12px" width="100%">
                <Button isDisabled={isSubmitting} label="Cancel" onClick={toggleSearchBar} />
                <Button isLoading={isSubmitting} label={submitLabel} onClick={() => addTeamsToSeason()} />
              </FlexContainer>)}
            </>
          )}
          <Divider />
          <FlexContainer alignItems="center" flexWrap="wrap" justify="flex-start" overflow="visible">
            <SectionHeadingText margin="20px 12px 20px 0">Players</SectionHeadingText>
            {isLeagueAdmin && leagueID && (
              <AddPlayerSection
                isCollapsible
                isSubmitting={isSubmitting}
                leagueID={leagueID}
                onClose={() => setPlayersToAdd({})}
                onSubmit={addPlayersToSeason}
                onSelectPlayer={onSelectPlayers}
                seasonID={seasonID}
                selectedPlayers={playersToAdd}
                submitLabel="Add players to season"/>)}
          </FlexContainer>
          <FlexContainer justify="flex-start" flexWrap="wrap">
          {seasonData?.getSeasonByID?.season?.players?.length > 0 ?
            seasonData.getSeasonByID?.season?.players.map((player, idx) => {
              return (
                <PlayerCard
                  email={player.email}
                  key={`players-${player.id}-${idx}`}
                  margin="0 8px 8px 0"
                  name={player.name}
                  picture={player.profilePicture}
                  username={player.username}
                />
              )
            }) : (
              <FlexContainer justify="flex-start" width="800px">
                <DetailsText>No players in season</DetailsText>
              </FlexContainer>
            )
          }
          </FlexContainer>
          <Divider />
          <FlexContainer alignItems="center" flexWrap="wrap" justify="flex-start" overflow="visible">
            <SectionHeadingText margin="20px 12px 20px 0">Captains</SectionHeadingText>
            {isLeagueAdmin && leagueID && (
              <CollapsibleSearchField
                filterResults={filterCaptainResults}
                label="Search for players..."
                onClick={onSelectCaptains}
                onClose={() => setCaptainsToAdd({})}
                selected={captainsToAdd}
                source={Object.values(playersToAdd).concat(nonCaptainPlayers) ?? []}
              />)}
          </FlexContainer>
          <FlexContainer flexWrap="wrap" justify="start" overflow="initial" shrink="0" width="100%">
            {Object.values(captainsToAdd).map((player, idx) => (
                <CardWrapper
                  boxShadow="0 0 10px rgba(0, 0, 0, 0.07)"
                  key={`captains-${player.id}-${idx}`}
                  margin='4px 4px 0 0'>
                  <FlexContainer alignItems="center" justify="space-between">
                    {player.profilePicture && (
                      <ProfilePictureThumb
                        referrerPolicy="no-referrer"
                        height="32px"
                        src={player.profilePicture}
                        width="32px" />
                    )}
                    <FlexContainer direction="column">
                      <BodyText marginBottom="4px">
                        {player.name ?? player.username}
                      </BodyText>
                      <DetailsText>{player.email}</DetailsText>
                    </FlexContainer>
                    <Icon icon="close" onClick={() => onSelectCaptains(player)} />
                  </FlexContainer>
                </CardWrapper>
            ))}
          </FlexContainer>
          {Object.keys(captainsToAdd).length > 0 && (
            <FlexContainer alignItems="center" direction="column" marginTop="8px">
              <DetailsText>Adding a captain that has not already been added as a player will add them as a player.</DetailsText>
              <FlexContainer marginBottom="12px" marginTop="12px" width="100%">
                <Button isDisabled={isSubmitting} label="Cancel" onClick={() => setCaptainsToAdd({})} />
                <Button isLoading={isSubmitting} label="Assign captains" onClick={() => addCaptainsToSeason()} />
              </FlexContainer>
            </FlexContainer>)}
          <FlexContainer justify="flex-start" flexWrap="wrap">
            {seasonData?.getSeasonByID?.season?.captains?.length > 0 ?
              seasonData.getSeasonByID?.season?.captains.map((player, idx) => {
                return (
                  <PlayerCard
                    email={player.email}
                    key={`captains-added-${player.id}-${idx}`}
                    margin="0 8px 8px 0"
                    name={player.name}
                    picture={player.profilePicture}
                    username={player.username}
                  />
                )
              }) : (
                <FlexContainer justify="flex-start" width="800px">
                  <DetailsText>No captains assigned</DetailsText>
                </FlexContainer>
              )
            }
          </FlexContainer>
          <SectionHeadingText margin="20px 12px 20px 0">Stat Leaders</SectionHeadingText>
          <Divider />
          <SectionHeadingText margin="20px 12px 20px 0">Standings</SectionHeadingText>
          
        </>
      )}
    </FlexContainer>
  );
}

export default Season;
