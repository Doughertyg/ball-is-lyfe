import { useQuery } from '@apollo/react-hooks';
import React, {useEffect, useMemo, useState} from 'react';
import gql from 'graphql-tag';
import InputField from './InputField.jsx';
import styled from 'styled-components';
import { BodyText, Divider, ModalStyle } from '../styled-components/common.js';

const ModalWrapper = styled.div`
  position: relative;
  margin: 8px;
  margin-top: 4px;
`;

const ContentWrapper = styled.div`
  padding: 10px;
  box-sizing: border-box;
`;

 const FETCH_LEAGUE_PLAYERS_QUERY = gql`
  query($leagueID: ID!) {
    getPlayersInLeague(leagueID: $leagueID) {
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
export default function PlayerSearchField({leagueID}) {
  const [input, setInput] = useState('');
  const { loading, data, error } = useQuery(FETCH_LEAGUE_PLAYERS_QUERY, {
    variables: {leagueID: leagueID}
  });

  if (error) {
    // do something with the error
    console.log('error querying for players in the PlayerSearchField. Error: ', error);
  }

  const dummy = [{username: 'sasquatch'}, {username: 'marc'}, {username: 'randall stevens'}, {username: 'kevin'}];

  const results = useMemo(() => {
    return input != '' ? dummy.filter(
      player => player?.username?.includes(input)
    ) : []
  }, [data, input]);

  return (
    <>
      <InputField
        autoComplete={false}
        onChange={setInput}
        placeholder="Search for players to add..."
        value={input}
        width="700px"
      />
      {results.length > 0 && (
        <ModalWrapper>
          <ModalStyle>
            <ContentWrapper>
            {results?.map((player, idx) => (
              <>
                {idx !== 0 && <Divider marginBottom="10px" />}
                <BodyText>
                  {player.username}
                </BodyText>
              </>
            ))}
            </ContentWrapper> 
          </ModalStyle>
        </ModalWrapper>
      )}
    </>
  )
}
