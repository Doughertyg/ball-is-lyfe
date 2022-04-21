import React, { useContext } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import PostCard from '../../components/PostCard.jsx';
import { AuthContext } from '../../context/auth';
import {CenteredContainer, FlexContainer, PageHeader} from '../../styled-components/common';
import PostForm from '../../components/PostForm.jsx';
import { FETCH_POSTS_QUERY } from '../../../graphql/queries/graphql';

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

  if (data) {
    console.log(data)
  }
  
  return (
    <FlexContainer alignContent="start" direction="column" justify="flex-start">
      <PageHeader>Active seasons</PageHeader>
      <FlexContainer justify="start" overFlow="scroll" width="100%">
        {loading ? (<h1>LOADING...</h1>) :  
          data.getPosts.map(post => {
            return (
              <PostCard key={post.id} post={post} link={() => props.history.push(`/posts/${post.id}`)} />
            )
          })
        }
      </FlexContainer>
      <PageHeader>Leagues (+)</PageHeader>
      <FlexContainer justify="start" overFlow="scroll" width="100%">
        {loading ? (<h1>LOADING...</h1>) :  
          data.getPosts.map(post => {
            return (
              <PostCard key={post.id} post={post} link={() => props.history.push(`/posts/${post.id}`)} />
            )
          })
        }
      </FlexContainer>
      <PageHeader>Teams (+)</PageHeader>
      <FlexContainer justify="start" overFlow="scroll" width="100%">
        {loading ? (<h1>LOADING...</h1>) :  
          data.getPosts.map(post => {
            return (
              <PostCard key={post.id} post={post} link={() => props.history.push(`/posts/${post.id}`)} />
            )
          })
        }
      </FlexContainer>
    </FlexContainer>
  )
};

export default Home;
