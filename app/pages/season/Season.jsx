import React, {useContext, useEffect, useMemo, useState} from 'react';
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
import Card from '../../components/Card.jsx';
import { CardWrapper } from '../../styled-components/card.js';
import CompactDetailsCard from '../../components/CompactDetailsCard.jsx';

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
        teams {
          id
          captain {
            email
            name
            profilePicture
            username
          }
          players {
            id
            email
            name
            profilePicture
            username
          }
          team {
            id
            name
          }
        }
        games {
          awayScore
          awayTeam {
            team {
              name
            }
          }
          date
          homeScore
          homeTeam {
            team {
              name
            }
          }
        }
      }
      isLeagueAdmin
    }
    getTeams(seasonIDToExclude: $seasonID) {
      id
      name
      players {
        id
        email
        name
        profilePicture
        username
      }
      profilePicture
      seasonPlayers {
        id
        email
        name
        profilePicture
        username
      }
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

const ADD_TEAMS_TO_SEASON_MUTATION = gql`
  mutation addTeamsToSeason($teamIDs: [ID], $seasonID: ID!) {
    addTeamsToSeason(teamIDs: $teamIDs, seasonID: $seasonID) {
      id
      name
      teams {
        captain {
          email
          name
          profilePicture
          username
        }
        players {
          id
          email
          name
          profilePicture
          username
        }
        team {
          name
        }
      }
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
  const [seasonTeams, setSeasonTeams] = useState([]);
  const [seasonGames, setSeasonGames] = useState([]);
  const { user } = useContext(AuthContext);
  const seasonID = match.params?.seasonID;
  const history = useHistory();

  const { loading, data: seasonData, error } = useQuery(FETCH_SEASON_QUERY, {
    variables: {seasonID, userID: user.id }
  });
  const isLeagueAdmin = seasonData?.getSeasonByID?.isLeagueAdmin ?? false;
  const leagueID = seasonData?.getSeasonByID?.season?.league?._id;

  if (error != null) {
    // TODO: display user friendly error to user
    console.log('error: ', JSON.stringify(error, null, 2));
  }  

  useEffect(() => {
    if (seasonData != null && seasonData?.getSeasonByID?.season?.teams != null) {
      setSeasonTeams(seasonData.getSeasonByID.season.teams);
    }
  }, [seasonData]);

  useEffect(() => {
    if (seasonData != null && seasonData?.getSeasonByID?.season?.games != null) {
      setSeasonGames(seasonData?.getSeasonByID?.season?.games);
    }
  }, [seasonData]);

  if (seasonID == null) {
    console.log('season ID null, redirecting home.');
    history.push('/');
  }

  const recentGames = useMemo(() => {
    return seasonGames?.filter(game => {
      return dayjs().isSame(game.date) || (dayjs().isAfter(game.date) && dayjs().subtract(1, 'week').isBefore(game.date));
    }) ?? [];
  }, [seasonGames]);

  const upcomingGames = useMemo(() => {
    return seasonGames?.filter(game => {
      return dayjs().isBefore(game.date); // when you only want to see this week's games: && dayjs().add(1, 'week').isAfter(game.date);
    }) ?? [];
  }, [seasonGames]);

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

  const [addTeamsToSeason, {isSubmitting: isAddingTeamsToSeason}] = useMutation(ADD_TEAMS_TO_SEASON_MUTATION, {
    onCompleted: (res) => {
      console.log('Added teams to season. res: ', res);
      if (res.addTeamsToSeason != null) {
        setSeasonTeams(res.addTeamsToSeason.teams);
      }
      setTeamsToAdd({});
    },
    onError: (error) => {
      console.log('stringified error on mutation:  ', JSON.stringify(error, null, 2))
    },
    variables: {
      seasonID,
      teamIDs: Object.keys(teamsToAdd)
    }
  });

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
    const teamToAdd = {...team};
    // only include the players that are in the season
    teamToAdd.players = teamToAdd.players.filter(player => {
      return seasonData.getSeasonByID?.season?.players?.map(seasonPlayer => seasonPlayer.id).includes(player.id);
    });

    if (teamsToAddMap[team.id]) {
      delete teamsToAddMap[team.id];
    } else {
      teamsToAddMap[team.id] = teamToAdd;
    }
    
    setTeamsToAdd(teamsToAddMap);
  }

  const getTeamResultsComponent = (team) => (
    <FlexContainer justify="space-between" alignItems="center" width="100%">
      {team.profilePicture && (
        <ProfilePictureThumb
          height="32px"
          referrerPolicy="no-referrer"
          src={team.profilePicture}
          width="32px" />
      )}
      <FlexContainer direction="column">
        <BodyText width="fit-content">
          {team.name}
        </BodyText>
        {team?.seasonPlayers?.map((player, idx) => (
          <DetailsText flexGrow="1" key={idx} margin="0 0 0 4px">
            {player.name ?? player.username ?? player.email}
          </DetailsText>)
        )}
      </FlexContainer>
      {teamsToAdd[team.id] ? (
        <Icon icon="checkFilled" />
      ) :
      (
        <Icon icon="circle" />
      )}
    </FlexContainer>
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

  const onCompleteCreateTeam = (res) => {
    // update cache to update view
    if (res?.createTeam?.teamInstance != null) {
      setSeasonTeams([...seasonTeams, {...res.createTeam.teamInstance}]);
    }
    // close create team modal
    setCreateTeamExpanded(false);
  }

  const nonCaptainPlayers = useMemo(() => {
    return seasonData?.getSeasonByID?.season?.players?.filter(player => {
      return !seasonData?.getSeasonByID?.season?.captains?.map(player => player.id).includes(player.id);
    }) ?? [];
  }, [seasonData?.getSeasonByID?.season?.captains, seasonData?.getSeasonByID?.season?.players]);

  const onAddGamesToSeason = (season) => {
    setAddGamesExpanded(false);
    if (season?.addGamesToSeason?.games != null) {
      setSeasonGames(season?.addGamesToSeason?.games);
    }
  }

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
          <FlexContainer justify="flex-start" flexWrap="wrap" width="100%">
            {recentGames.length > 0 ?
              recentGames.map((game, idx) => {
                const date = dayjs(game?.date).format('MMM YYYY');
                return (
                  <CompactDetailsCard
                    details={[
                      game?.homeTeam?.team?.name,
                      game?.awayTeam?.team?.name
                    ]}
                    picture={game?.homeTeam?.team?.profilePicture}
                    key={idx}
                    title={date}
                    onclose={() => {/* delete game */}}
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
            {isLeagueAdmin && <Icon borderRadius="50%" icon="plus" onClick={() => setAddGamesExpanded(!addGamesExpanded)} />}
          </FlexContainer>
          {addGamesExpanded && (
            <AddGamesComponent
              onCancel={() => setAddGamesExpanded(false)}
              onComplete={onAddGamesToSeason}
              seasonID={seasonID}
              teamsSource={seasonTeams}
            />)}
          <FlexContainer justify="flex-start" flexWrap="wrap" width="100%">
            {upcomingGames.length > 0 ?
              upcomingGames.map((game, idx) => {
                const date = `${dayjs(game?.date).format('MMM DD')} at ${dayjs(game?.date).format('h:MM')}`;
                return (
                  <CompactDetailsCard
                    details={[
                      game?.homeTeam?.team?.name,
                      game?.awayTeam?.team?.name
                    ]}
                    picture={game?.homeTeam?.team?.profilePicture}
                    key={idx}
                    title={date}
                    onclose={() => {/* delete game */}}
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
              loading={loading}
              onClick={onClickTeamEntry}
              onClose={() => setCreateTeamExpanded(false)}
              source={seasonData?.getTeams ?? []}
            />
          </FlexContainer>
          {createTeamExpanded && (
            <CreatetTeamComponent onCancel={() => setCreateTeamExpanded(false)} onComplete={onCompleteCreateTeam} seasonID={seasonID} />
          )}
          {Object.keys(teamsToAdd).length > 0 && (
            <>
              <FlexContainer flexWrap="wrap" justify="start" overflow="initial" shrink="0" width="100%">
                {Object.values(teamsToAdd).map((team, idx) => (
                  <CompactDetailsCard
                    key={idx}
                    title={team.name ?? 'Team name missing'}
                    details={team?.players?.map(player => player?.name ?? player?.username ?? player?.email)}
                    picture={team?.team?.profilePicture} 
                    onClose={() => onClickTeamEntry(team)} />
                ))}
              </FlexContainer>
              <FlexContainer alignItems="center" direction="column" marginTop="8px">
                <DetailsText>A team added to this season will only include players already in the season.</DetailsText>
                <FlexContainer marginTop="12px" width="100%">
                  <Button isDisabled={isAddingTeamsToSeason} label="Cancel" onClick={() => setTeamsToAdd({})} />
                  <Button isLoading={isAddingTeamsToSeason} label="Add teams to season" onClick={() => addTeamsToSeason()} />
                </FlexContainer>
              </FlexContainer>
            </>
          )}
          <FlexContainer justify="flex-start" flexWrap="wrap">
            {seasonTeams.length > 0 && (
              seasonTeams.map((team, idx) => {
                return (
                  <CompactDetailsCard
                    key={`season-teams-${team.id}-${idx}`}
                    title={team?.team?.name ?? 'team name missing'}
                    subTitle={team?.captain?.name ? `Captain: ${team?.captain?.name }` : 'No captain assigned'}
                    details={team?.players?.map(player => player?.name ?? player?.username ?? player?.email)}
                    picture={team?.team?.profilePicture}
                  />
                )
              })
            )}
          </FlexContainer>
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
