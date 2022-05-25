import { useQuery } from '@apollo/react-hooks';
import React, {useEffect, useMemo, useState} from 'react';
import gql from 'graphql-tag';
import InputField from './InputField.jsx';
import styled from 'styled-components';
import { BodyText, DetailsText, Divider, FlexContainer, ModalStyle } from '../styled-components/common.js';

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
      id
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
export default function PlayerSearchField({leagueID, onClick}) {
  const [input, setInput] = useState('');
  const [selected, setSelected] = useState({});
  const { loading, data, error } = useQuery(FETCH_LEAGUE_PLAYERS_QUERY, {
    variables: {leagueID: leagueID}
  });

  if (error) {
    // do something with the error
    console.log('error querying for players in the PlayerSearchField. Error: ', error);
  }

  const dummy = [{username: 'sasquatch', id: 'dfslklk23lk'}, {username: 'marc', id: 'lkj234lkjlknlkn'}, {username: 'randall stevens', id: 'wef3sdfsdf4354'}, {username: 'kevin', id: '23fer4fwefsdfs'}];

  const results = useMemo(() => {
    return input != '' ? dummy.filter(
      player => player?.username?.includes(input)
    ) : []
  }, [data, input]);

  const onRowClick = (player) => {
    if (selected[player.id]) {
      const newSelected = {...selected};
      delete newSelected[player.id];
      setSelected(newSelected);
    } else {
      const newSelected = {...selected};
      newSelected[player.id] = true;
      setSelected(newSelected);
    }

    onClick?.(player);
  }

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
            {results?.map((player, idx) => {
              console.log('player: ', player, '   selected: ', selected);
              return (
              <div key={idx} onClick={() => onRowClick(player)}>
                {idx !== 0 && <Divider marginBottom="10px" />}
                <FlexContainer justify="space-between">
                  <BodyText>
                    {player.username}
                  </BodyText>
                  {selected[player.id] ? (
                    <DetailsText>deselect</DetailsText>
                  ) :
                  (
                    <DetailsText>select</DetailsText>
                  )}
                </FlexContainer>
              </div>);
            })}
            </ContentWrapper> 
          </ModalStyle>
        </ModalWrapper>
      )}
    </>
  )
}
