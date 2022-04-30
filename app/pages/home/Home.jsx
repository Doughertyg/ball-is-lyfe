import React, { useContext } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useHistory } from 'react-router';

import PostCard from '../../components/PostCard.jsx';
import { AuthContext } from '../../context/auth';
import {CenteredContainer, DetailsText, FlexContainer, PageHeader} from '../../styled-components/common';
import PostForm from '../../components/PostForm.jsx';
import { FETCH_POSTS_QUERY } from '../../../graphql/queries/graphql';
import Icon from '../../components/Icon.jsx';

const FETCH_LEAGUES_QUERY = gql`
  query($userID: ID!) {
    getLeaguesByUser(userID: $userID) {
      name
      description
      profilePicture
      sport
    }
  }
`;

const FETCH_SEASONS_QUERY = gql`
  query($userID: ID!) {
    getSeasonsByUser(userID: $userID) {
      seasonStart
      seasonEnd
      league {
        name
        sport
      }
    }
  }
`;

const FETCH_TEAMS_QUERY = gql`
  query($userID: ID!) {
    getTeamsByUser(userID: $userID) {
      name
      description
      profilePicture
      bannerPicture
      sport
      players {
        name
        profilePicture
      }
    }
  }
`;


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
  const { loading: loadingLeagues, data: leagueData } = useQuery(FETCH_LEAGUES_QUERY);
  const { loading: loadingSeasons, data: seasonData } = useQuery(FETCH_SEASONS_QUERY);
  const { loading: loadingTeams, data: teamData } = useQuery(FETCH_TEAMS_QUERY);
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);
  const { user } = useContext(AuthContext);
  const history = useHistory();

  if (user == null) {
    history.push('/login');
  }
  
  return (
    <FlexContainer alignContent="start" alignItems="start" direction="column" justify="flex-start">
      <PageHeader>Active seasons</PageHeader>
      <FlexContainer justify="start" overFlow="scroll" width="100%">
        {loadingSeasons ?
          (<h1>LOADING...</h1>) :
          seasonData?.getSeasonsByUser?.length > 0 ?
          seasonData?.getSeasonsByUser?.map(post => {
            return (
              <PostCard key={post.id} post={post} link={() => props.history.push(`/posts/${post.id}`)} />
            )
          }) :
          <DetailsText>No Seasons</DetailsText>
        }
      </FlexContainer>
      <FlexContainer alignItems="center">
        <PageHeader margin="20px 12px 20px 0">Leagues</PageHeader>
        <Icon borderRadius="50%" icon="plus" onClick={() => history.push('/league/new')} />
      </FlexContainer>
      <FlexContainer justify="start" overFlow="scroll" width="100%">
        {loadingLeagues ? (<h1>LOADING...</h1>) :
          leagueData?.getLeaguesByUser?.length > 0 ?
            leagueData?.getLeaguesByUser?.map(post => {
              return (
                <PostCard key={post.id} post={post} link={() => props.history.push(`/posts/${post.id}`)} />
              )
            }) :
            <DetailsText>No Leagues</DetailsText>
        }
      </FlexContainer>
      <FlexContainer alignItems="center">
        <PageHeader margin="20px 12px 20px 0">Teams</PageHeader>
        <Icon borderRadius="50%" icon="plus" onClick={() => {console.log('add Team!');}} />
      </FlexContainer>
      <FlexContainer justify="start" overFlow="scroll" width="100%">
        {loadingTeams ? (<h1>LOADING...</h1>) :
          teamData?.getTeamsByUser?.length > 0 ?
            teamData?.getTeamsByUser.map(post => {
              return (
                <PostCard key={post.id} post={post} link={() => props.history.push(`/posts/${post.id}`)} />
              )
            }) :
            <DetailsText>No teams</DetailsText>
        }
      </FlexContainer>
    </FlexContainer>
  )
};

export default Home;
