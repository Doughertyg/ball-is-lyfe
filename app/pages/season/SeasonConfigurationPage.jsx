import React, {useContext, useEffect, useMemo, useState} from 'react';
import Icon from '../../components/Icon.jsx';
import { AuthContext } from '../../context/auth';
import { BodyText, DetailsText, Divider, FlexContainer, PageHeader, ProfilePictureThumb, SectionHeadingText } from '../../styled-components/common';
import {useHistory} from 'react-router';
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import LoadingSpinnerBack from '../../components/LoadingSpinnerBack.jsx';
import AddGamesComponent from '../../components/AddGamesComponent.jsx';
import BannerComponent from '../../components/BannerComponent.jsx';
import CollapsibleSearchField from '../../components/CollapsibleSearchField.jsx';
import Button from '../../components/Button.jsx';
import CreateEditTeamComponent from '../../components/CreateEditTeamComponent.jsx';
import AddPlayerSection from '../../components/AddPlayerSection.jsx';
import PlayerCard from '../../components/PlayerCard.jsx';
import Card from '../../components/Card.jsx';
import { CardWrapper } from '../../styled-components/card.js';
import CompactDetailsCard from '../../components/CompactDetailsCard.jsx';
import SeasonStatsSection from '../../components/SeasonStatsSection.jsx';
import BadgeComponent from '../../components/BadgeComponent.jsx';
import SteppedConfirmationModal from '../../components/SteppedConfirmationModal.jsx';
import ConfigureGamesComponent from '../../components/ConfigureGamesComponent.jsx';

const SEASON_STATUS_LABELS = {
  CONFIGURATION: 'Configuration',
  CONFIRMED: 'Confirmed',
  INACTIVE: 'Inactive',
  ACTIVE: 'Active',
};

const ERROR_TYPES = {
  FATAL: 'FATAL',
  WARNING: 'WARNING'
}

const VALIDATION_ERRORS = {
  NO_PLAYERS_ADDED: onNext => ({
    text: 'Please add players to the season before continuing.',
    type: ERROR_TYPES.FATAL,
    nextLabel: 'Done',
    onNext,
    preventNext: true,
  }),
  NO_TEAMS_ADDED: onNext => ({
    text: 'No teams added to the season, please add at least one before continuing.',
    type: ERROR_TYPES.FATAL,
    nextLabel: 'Done',
    onNext,
    preventNext: true
  }),
  NO_CAPTAINS_ADDED: onNext => ({
    text: 'No captains added to the season, Do you want to continue?',
    type: ERROR_TYPES.WARNING
  }),
  NO_GAMES_ADDED: onNext => ({
    text: 'No games added, please add at least one game before continuing.',
    type: ERROR_TYPES.FATAL,
    nextLabel: 'Done',
    onNext,
    preventNext: true
  }),
  NO_GAME_CONFIGURATION: onNext => ({
    text: 'Season games not configured, please configure before continuing.',
    type: ERROR_TYPES.FATAL,
    nextLabel: 'Done',
    onNext,
    preventNext: true
  }),
  NO_STATS_ADDED: onNext => ({
    text: 'No stats added! Do you want to continue?',
    type: ERROR_TYPES.WARNING
  })
}

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
        status
        stats {
          __typename
        }
        teams {
          id
          captain {
            id
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
        gameConfiguration {
          periods
          periodLength
          scoreStat {
            id
            name
            operation {
              expression
            }
          }
          winCondition
        }
      }
      isCaptain
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

const CONFIRM_SEASON = gql`
  mutation confirmSeason($seasonID: ID!) {
    confirmSeason(seasonID: $seasonID) {
      id
      name
      status
    }
  }
`;

/**
 * Home page for configuring a season.
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
const SeasonConfigurationPage = ({match}) => {
  const [addGamesExpanded, setAddGamesExpanded] = useState(false);
  const [teamsToAdd, setTeamsToAdd] = useState({});
  const [playersToAdd, setPlayersToAdd] = useState({});
  const [captainsToAdd, setCaptainsToAdd] = useState({});
  const [createTeamExpanded, setCreateTeamExpanded] = useState(false);
  const [seasonTeams, setSeasonTeams] = useState([]);
  const [seasonGames, setSeasonGames] = useState([]);
  const [seasonStats, setSeasonStats] = useState([]);
  const [gameConfiguration, setGameConfiguration] = useState({});
  const [confirmMutationError, setConfirmMutationError] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [addCaptainsError, setAddCaptainsError] = useState(null);
  const [teamToEdit, setTeamToEdit] = useState(null);
  const { user } = useContext(AuthContext);
  const seasonID = match.params?.seasonID;
  const history = useHistory();

  const { loading, data: seasonData, error } = useQuery(FETCH_SEASON_QUERY, {
    variables: {seasonID, userID: user.id }
  });
  const isLeagueAdmin = seasonData?.getSeasonByID?.isLeagueAdmin ?? false;
  const isCaptain = seasonData?.getSeasonByID?.isCaptain ?? false;
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
    if (seasonData != null && seasonData?.getSeasonByID?.season?.stats != null) {
      setSeasonStats(seasonData.getSeasonByID.season.stats);
    }
  }, [seasonData]);

  useEffect(() => {
    if (seasonData != null && seasonData?.getSeasonByID?.season?.games != null) {
      setSeasonGames(seasonData?.getSeasonByID?.season?.games);
    }
  }, [seasonData]);

  useEffect(() => {
    if (seasonData != null && seasonData?.getSeasonByID?.season?.gameConfiguration != null) {
      setGameConfiguration(seasonData?.getSeasonByID?.season?.gameConfiguration);
    }
  }, [seasonData]);

  if (seasonID == null) {
    console.log('season ID null, redirecting home.');
    history.push('/');
  }

  const filterTeamSearchResults = (team, searchString) => {
    return team?.name?.toLowerCase().includes(searchString.toLowerCase());
  }

  const [confirmSeason, {isSubmitting: isConfirmingSeason}] = useMutation(CONFIRM_SEASON, {
    onCompleted: res => {
      location.reload();
    },
    onError: error => {
      console.log('Error confirming season. error: ', JSON.stringify(error, null, 2));
      setConfirmMutationError(error?.message ?? 'Error confirming season, please try again.');
    },
    variables: {
      seasonID
    }
  });

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
      console.log('stringified error on mutation:  ', JSON.stringify(error, null, 2));
      setAddCaptainsError(error?.message ?? 'There was an error, please try again.');
    },
    variables: {
      seasonID,
      captains: Object.keys(captainsToAdd)
    }
  });

  const [addTeamsToSeason, {isSubmitting: isAddingTeamsToSeason}] = useMutation(ADD_TEAMS_TO_SEASON_MUTATION, {
    onCompleted: (res) => {
      console.log('Added teams to season. res: ', res);
      setSeasonTeams(res?.addTeamsToSeason?.teams ?? []);
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

  const onCompleteCreateEditTeam = (newTeam) => {
    // update cache to update view
    if (newTeam != null) {
      setSeasonTeams([...seasonTeams.filter(team => team.id !== newTeam.id), {...newTeam}]);
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

  const addError = (errorObj, errorArray) => {
    const error = errorObj(() => setValidationErrors([]));
    if (error.type === ERROR_TYPES.FATAL) {
      errorArray.unshift(error);
    } else {
      errorArray.push(error);
    }
  }

  const validateInput = () => {
    // validate page input
    // prompt user when validations fail
    const validationErrors = [];
    if (gameConfiguration == null
      || gameConfiguration?.periods == null
      || gameConfiguration?.periodLength == null
      || gameConfiguration?.winCondition == null
      || gameConfiguration?.scoreStat == null) {
      addError(VALIDATION_ERRORS.NO_GAME_CONFIGURATION, validationErrors);
    }

    if (seasonGames.length === 0) {
      addError(VALIDATION_ERRORS.NO_GAMES_ADDED, validationErrors);
    }

    if (seasonTeams.length === 0) {
      addError(VALIDATION_ERRORS.NO_TEAMS_ADDED, validationErrors);
    }

    if (seasonData?.getSeasonByID?.season?.captains?.length === 0) {
      addError(VALIDATION_ERRORS.NO_CAPTAINS_ADDED, validationErrors);
    }

    if (seasonData?.getSeasonByID?.season?.players?.length === 0) {
      addError(VALIDATION_ERRORS.NO_PLAYERS_ADDED, validationErrors);
    }

    if (seasonStats.length === 0) {
      addError(VALIDATION_ERRORS.NO_STATS_ADDED, validationErrors);
    }

    setValidationErrors(validationErrors);
    return validationErrors;
  }

  const onSubmitConfirmSeason = () => {
    setConfirmMutationError(null);
    const errors = validateInput();

    if (errors.length === 0) {
      confirmSeason();
    }
  }

  const onCreateStat = (stat) => {
    const newStats = [...seasonStats];
    newStats.push(stat);
    setSeasonStats(newStats);
  }

  return (
    <FlexContainer direction="column" justify="flex-start" margin="0 auto" maxWidth="800px" padding="0 12px">
      {loading ? (
        <FlexContainer height="45px" justify="flex-start" width="800px" overflow="hidden">
          <LoadingSpinnerBack />
        </FlexContainer>
      ) : (
        <>
          <BannerComponent color="orange" title="Configure your season" subtitle="Only admins can configure a season" />
          <FlexContainer direction="row" justify="space-between">
            <FlexContainer direction="column" width="100%">
              <FlexContainer alignItems="center" justify="space-between" width="100%">
                <PageHeader margin="20px 0 8px 0">
                  {seasonData?.getSeasonByID?.season?.name ?? 'Season name missing'}
                </PageHeader>
                <BadgeComponent label={SEASON_STATUS_LABELS[seasonData?.getSeasonByID?.season?.status]} status="DRAFT" />
              </FlexContainer>
              <DetailsText padding="0 0 4px 0">
                <SectionHeadingText>{seasonData?.getSeasonByID?.season?.league?.name ?? 'League missing'}</SectionHeadingText>
              </DetailsText>
              <FlexContainer alignItems="center" justify="start">
                <DetailsText overflow="hidden">{
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
              {addCaptainsError && <BannerComponent backgroundColor="rgba(255, 0, 0, 0.2)" color="red" title={addCaptainsError} />}
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
          <Divider marginBottom="10px" />
          <FlexContainer alignItems="center" justify="start" overflow="visible">
            <SectionHeadingText margin="20px 12px 20px 0">Teams</SectionHeadingText>
            {(isLeagueAdmin || isCaptain) && <CollapsibleSearchField
              filterResults={filterTeamSearchResults}
              getResultComponent={getTeamResultsComponent}
              getRightButton={getCreateTeamButton}
              label="Search teams..."
              loading={loading}
              onClick={onClickTeamEntry}
              onClose={() => setCreateTeamExpanded(false)}
              source={seasonData?.getTeams ?? []}
            />}
          </FlexContainer>
          {createTeamExpanded && (
            <CreateEditTeamComponent
              defaultCaptain={isCaptain ? user : null}
              onCancel={() => setCreateTeamExpanded(false)}
              onComplete={onCompleteCreateEditTeam}
              seasonID={seasonID}/>
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
                const isTeamCaptain = team.captain?.id === user.id;
                const canEdit = isLeagueAdmin || isTeamCaptain || (team.captain == null && isCaptain);
                const playersObject = team.players?.reduce((acc, player) => {
                  acc[player.id] = player;
                  return acc;
                }, {});
                return teamToEdit === team.id ? (
                  <CreateEditTeamComponent
                    defaultCaptain={team.captain}
                    isEditing
                    key={`season-teams-${team.id}-${idx}`}
                    onCancel={() => setTeamToEdit(null)}
                    onComplete={newTeam => {
                      onCompleteCreateEditTeam(newTeam);
                      setTeamToEdit(null);
                    }}
                    seasonID={seasonID}
                    teamID={team.id}
                    teamName={team.team?.name}
                    teamPlayers={playersObject} />
                ) : (
                  <CompactDetailsCard
                    key={`season-teams-${team.id}-${idx}`}
                    onEdit={canEdit ? () => {setTeamToEdit(team.id)} : null}
                    title={team?.team?.name ?? 'team name missing'}
                    subTitle={team?.captain ? `Captain: ${team?.captain?.name ?? team?.captain?.username ?? team?.captain?.email ?? 'Captain name missing'}` : 'No captain assigned'}
                    details={team?.players?.map(player => player?.name ?? player?.username ?? player?.email)}
                    picture={team?.team?.profilePicture}
                  />
                )
              })
            )}
          </FlexContainer>
          <Divider />
          <FlexContainer alignItems="center" justify="start" overFlow="visible">
            <SectionHeadingText margin="20px 12px 20px 0">Games</SectionHeadingText>
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
            {seasonGames.length > 0 ?
              seasonGames.map((game, idx) => {
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
              <DetailsText>No games added to season</DetailsText>
            </FlexContainer>
            )}
          </FlexContainer>
          <Divider marginBottom="10px" />
          <ConfigureGamesComponent
            configuration={gameConfiguration}
            onCompleted={(res) => setGameConfiguration(res?.gameConfiguration)}
            seasonID={seasonID}
            isLeagueAdmin={isLeagueAdmin}/>
          <Divider marginBottom="10px" />
          <SeasonStatsSection isAdmin={isLeagueAdmin} onCreateStat={onCreateStat} seasonID={seasonID} />
          <Divider />
          {isLeagueAdmin && <><BannerComponent color="dimgrey" marginTop="10px" title="Confirming the season will move it from the Configuration status to Confirmed. Only a confirmed season can be launched and become active." />
          {confirmMutationError && <BannerComponent backgroundColor="rgba(255, 0, 0, 0.2)" color="red" title={confirmMutationError} />}
          <FlexContainer justify="flex-end" marginTop="8px">
            <Button isDisabled={isConfirmingSeason} label="Confirm season" margin="4px" marginTop="4px" onClick={onSubmitConfirmSeason} />
          </FlexContainer>
          <Divider /></>}
        </>
      )}
      {validationErrors.length > 0 ? (
        <SteppedConfirmationModal onCancel={() => setValidationErrors([])} onSubmit={confirmSeason} steps={validationErrors} />) : null}
    </FlexContainer>
  );
}

export default SeasonConfigurationPage;
