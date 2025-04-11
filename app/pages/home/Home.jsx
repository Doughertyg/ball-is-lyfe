import React, { useContext, useEffect, useMemo } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useHistory } from 'react-router';

import PostCard from '../../components/PostCard.jsx';
import Card from '../../components/Card.jsx';
import { AuthContext } from '../../context/auth';
import {BodyText, DetailsText, Divider, FlexContainer, PageHeader, ProfilePictureThumb} from '../../styled-components/common';
import Icon from '../../components/Icon.jsx';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import LoadingSpinnerBack from '../../components/LoadingSpinnerBack.jsx';
import LoadingSpinnerSpin from '../../components/LoadingSpinnerSpin.jsx';
import LoadingSpinnerBounce from '../../components/LoadingSpinnerBounce.jsx';
import CollapsibleSearchField from '../../components/CollapsibleSearchField.jsx';
import Button from '../../components/Button.jsx';
import CommonPageLayout from '../../components/layout/CommonPageLayout.jsx';
import { FETCH_USER_LEAGUES_QUERY } from '../../../graphql/queries/leagueQueries.js';
import { FETCH_USER_SEASONS_QUERY } from '../../../graphql/queries/seasonQueries.js';
import { FETCH_USER_TEAMS_QUERY } from '../../../graphql/queries/teamQueries.js';
dayjs.extend(isBetween);

/**
 * 
 * @param props 
 * @returns
 * Home page for the logged in user. Shows recent games, user stats across all games/leagues 
 *   recent leagues and sport (and other) badges. Select league at top to navigate to league page
 * 
 *     ,~-----------------------------------~,
 *     | Home                                |
 *     |                                     |
 *     | Active seasons                      |
 *     | ;'````````'; ;'````````'; ;'````````|
 *     | :  season1 : : season2  : : season..|
 *     |  `'''''''''`  `'''''''''`  `''''''''|
 *     | Leagues (+)                         |
 *     | ;'````````'; ;'````````'; ;'````````|
 *     | : League1  : :  League2 : :  League3|
 *     |  `'''''''''`  `'''''''''`  `''''''''|
 *     |  Teams                              |
 *     | :'`````````': :'`````````': :'``````|
 *     | | Team1     | | Team2     | | Team3 |
 *     | |  player 1 | |  player 1 | |  play |
 *     | |  player 2 | |  player 2 | |  playe|
 *     | |           | |           | |       |
 *     | `;_________;` `;_________;` `;______|
 *     |                                     |
 *     |  Stats                              |
 *     |   per season, lifetime, highest     |
 *     |   1. stat/standing (tbd)            |
 *     |   2. stat/standing (tbd)            |
 *     |   3. stat/standing (tbd)            |
 *     |                                     |
 *      `-----------------------------------"
 */
function Home(props) {
  const { accessToken, user } = useContext(AuthContext);
  const history = useHistory();

  const [fetchLeagues, { data: leagueData, loading: loadingLeagues, error: leagueError }] = useLazyQuery(FETCH_USER_LEAGUES_QUERY);
  const [fetchSeasons, { data: seasonData, loading: loadingSeasons, error: seasonError }] = useLazyQuery(FETCH_USER_SEASONS_QUERY);
  const [fetchTeams, { data: teamData, loading: loadingTeams, error: teamError }] = useLazyQuery(FETCH_USER_TEAMS_QUERY);

  useEffect(() => {
    if (user?.id) {
      fetchLeagues({ variables: { userID: user.id } });
      fetchSeasons({ variables: { userID: user.id } });
      fetchTeams({ variables: { userID: user.id } });
    }
  }, [user?.id]);
  
  const activeSeasons = useMemo(() => {
    return seasonData?.getSeasonsByUser?.filter(season => {
      return dayjs().isBetween(season.seasonStart, season.seasonEnd);
    }) ?? [];
  }, [seasonData]);

  const pastSeasons = useMemo(() => {
    return seasonData?.getSeasonsByUser?.filter(season => {
      return !dayjs().isBetween(season.seasonStart, season.seasonEnd) &&
      dayjs().isAfter(season.seasonEnd);
    }) ?? [];
  }, [seasonData]);

  const futureSeasons = useMemo(() => {
    return seasonData?.getSeasonsByUser?.filter(season => {
      return !dayjs().isBetween(season.seasonStart, season.seasonEnd) &&
      dayjs().isBefore(season.seasonStart);
    }) ?? [];
  }, [seasonData]);

  if (seasonError) {
    console.log('error:  ', JSON.stringify(seasonError, null, 2))
  }

  const filterLeagueSearchResults = (league, searchString) => {
    return league?.name?.includes(searchString) ||
      league?.description?.includes(searchString) ||
      league?.location?.includes(searchString) ||
      league?.sport?.includes(searchString);
  }

  const onClickLeagueEntry = (league) => {
    history.push(`/league/${league._id}`);
  }

  const getLeagueResultsComponent = (league) => (
    <>
      {league.profilePicture && (
        <ProfilePictureThumb
          height="32px"
          referrerPolicy="no-referrer"
          src={league.profilePicture}
          width="32px" />
      )}
      <BodyText width="fit-content">
        {league.name}
      </BodyText>
      <DetailsText flexGrow="1" margin="0 0 0 4px" onClick={() => onClickLeagueEntry(league)}>
        {`${league.location} - ${league.sport}`}
      </DetailsText>
    </>
  );

  const getRightButton = () => (
    <Button
      borderRadius="0 8px 8px 0"
      boxShadow="none"
      height='46px'
      label="Create League"
      margin="0"
      onClick={() => history.push('/league/new')}
    />
  )

  const getSeasonsContent = () => (
    (
      loadingSeasons
    ) ? (
      <FlexContainer height="45px" justify="flex-start" width="800px">
        <LoadingSpinnerBack />
      </FlexContainer>
    ) : (
      activeSeasons?.length > 0 ?
      activeSeasons?.map((season, idx) => {
        return (
          <Card
            body={season.description}
            bodyTitle={season?.league?.name?.toUpperCase()}
            bodySubTitle={`(${season?.league?.sport})`}
            key={season.id ?? idx}
            margin="0 8px 8px 0"
            onClick={() => history.push(`/season/${season.id}`)}
            subTitle={`${dayjs(season.seasonStart).format('MMM YYYY')} - ${dayjs(season.seasonEnd).format('MMM YYYY')}`}
            title={season.name}
          />
        )
      }) : (
        <FlexContainer justify="flex-start" width="800px">
          <DetailsText>No active seasons</DetailsText>
        </FlexContainer>
      )
    )
  )

  const getLeaguesContent = () => (
    loadingLeagues ? (
      <FlexContainer height="45px" justify="flex-start" width="800px">
        <LoadingSpinnerSpin />
      </FlexContainer>
    ) : (
      leagueData?.getLeaguesByUser?.length > 0 ?
        leagueData?.getLeaguesByUser?.map((league, idx) => {
          return (
            <Card
              body={league.description ?? ''}
              onClick={() => history.push(`/league/${league._id}`)}
              subTitle={`${league.location} - ${league.sport}`}
              title={league.name}
              margin="0 8px 8px 0"
              key={league._id ?? idx}
            />
          )
        }) : (
          <FlexContainer justify="flex-start" width="800px">
            <DetailsText>No Leagues</DetailsText>
          </FlexContainer>
        )
    )
  )

  const getPastSeasonsContent = () => (
    loadingSeasons ? 
      (
        <FlexContainer height="45px" justify="flex-start" width="800px">
          <LoadingSpinnerBounce />
        </FlexContainer>
      ) :
      pastSeasons?.length > 0 ?
      pastSeasons?.map((season, idx) => {
        return (
          <Card
            body={season.description}
            bodyTitle={season?.league?.name?.toUpperCase()}
            bodySubTitle={`(${season?.league?.sport})`}
            key={season.id ?? idx}
            margin="0 8px 8px 0"
            onClick={() => history.push(`/season/${season.id}`)}
            subTitle={`${dayjs(season.seasonStart).format('MMM YYYY')} - ${dayjs(season.seasonEnd).format('MMM YYYY')}`}
            title={season.name}
          />
        )
      }) :
      <FlexContainer justify="flex-start" width="800px">
        <DetailsText>No past seasons</DetailsText>
      </FlexContainer>
  )

  const getUpcomingSeasonsContent = () => (
    loadingSeasons ? 
      (
        <FlexContainer height="45px" justify="flex-start" width="800px">
          <LoadingSpinnerSpin />
        </FlexContainer>
      ) :
      futureSeasons?.length > 0 ?
      futureSeasons?.map((season, idx) => {
        return (
          <Card
            body={season.description}
            bodyTitle={season?.league?.name?.toUpperCase()}
            bodySubTitle={`(${season?.league?.sport})`}
            key={season.id ?? idx}
            margin="0 8px 8px 0"
            onClick={() => history.push(`/season/${season.id}`)}
            subTitle={`${dayjs(season.seasonStart).format('MMM YYYY')} - ${dayjs(season.seasonEnd).format('MMM YYYY')}`}
            title={season.name}
          />
        )
      }) :
      <FlexContainer justify="flex-start" width="800px">
        <DetailsText>No upcoming seasons</DetailsText>
      </FlexContainer>
  )

  const getTeamsContent = () => (
    loadingTeams ? 
      (
        <FlexContainer height="45px" justify="flex-start" width="800px">
          <LoadingSpinnerSpin />
        </FlexContainer>
      ) :
      teamData?.getTeamsByUser?.length > 0 ?
        teamData?.getTeamsByUser.map((post, idx) => {
          return (
            <PostCard key={post.id ?? idx} post={post} link={() => props.history.push(`/posts/${post.id}`)} />
          )
        }) :
        <FlexContainer justify="flex-start" width="800px">
          <DetailsText>No teams</DetailsText>
        </FlexContainer>
  )

  const getContent = () => (
    [
      {
        title: 'Active seasons',
        content: getSeasonsContent()
      },
      {
        title: 'Leagues',
        rightContent: (
          <CollapsibleSearchField
            filterResults={filterLeagueSearchResults}
            getResultComponent={getLeagueResultsComponent}
            getRightButton={getRightButton}
            label="Search leagues..."
            loading={loadingLeagues}
            onClick={onClickLeagueEntry}
            source={leagueData?.getLeagues ?? []}
          />
        ),
        content: getLeaguesContent()
      },
      {
        title: 'Past seasons',
        content: getPastSeasonsContent()
      },
      {
        title: 'Upcoming season',
        content: getUpcomingSeasonsContent()
      },
      {
        title: 'Teams',
        content: getTeamsContent(),
        rightContent: (
          <Icon borderRadius="50%" icon="plus" onClick={() => {console.log('add Team!');}} />
        )
      }
    ]
  )
  
  return (
    <CommonPageLayout content={getContent()} />
  )
};

export default Home;
