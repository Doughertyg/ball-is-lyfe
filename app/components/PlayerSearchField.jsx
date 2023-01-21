import { useMutation, useQuery } from '@apollo/react-hooks';
import React, {useEffect, useMemo, useState} from 'react';
import gql from 'graphql-tag';
import InputField from './InputField.jsx';
import styled from 'styled-components';
import { BodyText, DetailsText, Divider, FlexContainer, ModalStyle, ProfilePictureThumb } from '../styled-components/common.js';
import Icon from './Icon.jsx';
import LoadingSpinnerSpin from './LoadingSpinnerSpin.jsx';

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 10:
`;

const ModalWrapper = styled.div`
  position: relative;
  z-index: 1000;
`;

const ContentWrapper = styled.div`
  padding: 10px;
  box-sizing: border-box;
`;

const FETCH_LEAGUE_PLAYERS_QUERY = gql`
  query($leagueID: ID, $seasonID: ID) {
    getAllPlayers {
      email
      id
      name
      profilePicture
      username
    }
    getPlayersInLeague(leagueID: $leagueID, seasonID: $seasonID) {
      email
      id
      name
      profilePicture
      username
    }
    getPlayersNotInLeague(leagueID: $leagueID) {
      email
      id
      name
      profilePicture
      username
    }
  }
`;

/**
 * Component for searching for players in a given league
 * with dropdown filtered and selectable results
 * 
 *  ,.................................................,
 * |  Search...                                        |
 *  `'''''''''''''''''''''''''''''''''''''''''''''''''`
 *  |  Steph Curry #30                                |
 *  | ``````````````````````````````````````````````` |
 *  '._______________________________________________.'
 * 
 * 
 */
export default function PlayerSearchField({
  excludeLeague = false,
  height,
  leagueID, // if no leagueID is passed query for all players
  onClick,
  seasonID, // if seasonID is not null, will fetch players in league but NOT season
  selected = {},
  width
}) {
  const [input, setInput] = useState('');
  const [resultsOpen, setResultsOpen] = useState(false);
  const { loading, data, error } = useQuery(FETCH_LEAGUE_PLAYERS_QUERY, {
    variables: {leagueID: leagueID, seasonID}
  });

  if (error) {
    // do something with the error
    console.log('error querying for players in the PlayerSearchField. Error: ', error);
  }

  const source = leagueID == null ? data?.getAllPlayers :
    excludeLeague ?
      data?.getPlayersNotInLeague
      : data?.getPlayersInLeague;
  const results = useMemo(() => {
    return input != '' ? source?.filter(player => {
      return player?.username?.includes(input) ||
        player?.name?.includes(input) ||
        player?.email?.includes(input);
    }) ?? [] : []
  }, [data, input]);

  const onRowClick = (player) => {
    onClick(player);
  }

  const inputChange = (input) => {
    if (!resultsOpen) {
      setResultsOpen(true);
    }

    setInput(input);
  }

  const onInputClick = () => {
    if (!resultsOpen) {
      setResultsOpen(true);
    }
  }

  return (
    <>
      <InputField
        autoComplete={false}
        height={height}
        loading={loading}
        onChange={inputChange}
        onClick={onInputClick}
        placeholder="Search for players to add..."
        value={input}
        width={width ?? "700px"}
      />
      {results.length > 0 && resultsOpen && (
        <ModalWrapper>
          <ModalContainer onClick={() => setResultsOpen(false)} />
          <ModalStyle>
            <ContentWrapper>
            {results?.map((player, idx) => {
              return (
                <div key={idx} onClick={() => onRowClick(player)}>
                  {idx !== 0 && <Divider marginBottom="10px" />}
                  <FlexContainer alignItems="center" justify="space-between">
                    {player.profilePicture && (
                      <ProfilePictureThumb
                        height="32px"
                        referrerPolicy="no-referrer"
                        src={player.profilePicture}
                        width="32px" />
                    )}
                    <BodyText width="fit-content">
                      {player.name ?? player.username}
                    </BodyText>
                    <DetailsText flexGrow="1" margin="0 0 0 4px">
                      {player.email}
                    </DetailsText>
                    {selected[player.id] ? (
                      <Icon icon="checkFilled" />
                    ) :
                    (
                      <Icon icon="circle" />
                    )}
                  </FlexContainer>
                </div>
              );
            })}
            </ContentWrapper> 
          </ModalStyle>
        </ModalWrapper>
      )}
      {source?.length === 0 || source == null ? (
        <ModalWrapper>
          <ModalStyle>
            <ContentWrapper>
              <DetailsText>No players to add.</DetailsText>
            </ContentWrapper> 
          </ModalStyle>
        </ModalWrapper>
      ) : null}
    </>
  )
}
