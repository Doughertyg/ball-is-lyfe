import React, { useEffect, useState, useRef } from 'react';
import Date from 'dayjs';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import useTimerHook from './useTimerHook';

const MUTATION_MIN_INTERVAL = 1000;

const STATS_MUTATION_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  FAILED: 'FAILED'
}

const ADD_STAT_UNIT_RECORD = gql`
  mutation addStatUnitRecord(
    $seasonID: ID!,
    $statUnitID: ID!,
    $gameID: ID!,
    $playerID: ID!,
    $timeCode: Int!
  ) {
    addStatUnitRecord(
      seasonID: $seasonID,
      statUnitID: $statUnitID,
      gameID: $gameID,
      playerID: $playerID,
      timeCode: $timeCode
    ) {
      id
      __typename
    }
  }
`;

/**
 * Hook for managing the LiveStatModule
 * 
 * - add statUnitRecords first to a queue
 * - add statUnitRecords to localStorage (for backup)
 * - call mutation to create statUnitRecords in queue
 * - calculate stats live
 * 
 * in localStorage store the game info:
 * 
 * gameID: {
 *    statUnitsToSubmit: {
 *      timeCode+statUnitID+playerID: {
 *        statUnitRecord
 *      }
 *    }
 *  }
 */
const useLiveStatsModuleHook = (gameID = 'gameIDMissing', periodLength, seasonID) => {
  const [statUnitRecordsToSubmit, setStatUnitRecordsToSubmit] = useState([]);
  const {setTimeRemaining, startTimer, stopTimer, timeRemaining} = useTimerHook(periodLength);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canSubmit, setCanSubmit] = useState(true);
  const [stats, setStats] = useState([]);
  const timerRef = useRef(null);

  const [createStatUnitRecord, { isSubmitting: isSubmittingMutation }] = useMutation(ADD_STAT_UNIT_RECORD, {
    onCompleted: res => {
      console.log('completed mutation add statUnitRecord. res: ', res);
    },
    onError: error => {
      console.log('stringified error on mutation:  ', JSON.stringify(error, null, 2));
      throw error;
    },
  })
  
  // if game info is already saved in local storage, load.
  useEffect(() => {
    let gameObject = {};
    try {
      gameObject = JSON.parse(localStorage.getItem(gameID)) ?? {};
    } catch (err) {
      console.log('error loading from local storage. error: ', err);
    }
    
    if (Object.keys(gameObject?.statUnitsToSubmit ?? {}).length > 0
        || Object.keys(gameObject?.statUnits ?? {}).length > 0
        || gameObject?.timeRemaining > 0) {
      const statUnitRecordsToSubmitMethods = Object.values(gameObject?.statUnitsToSubmit ?? {}).map(({
        game,
        player,
        season,
        statUnit,
        timeCode,
      }) => {
        const statUnitRecord = {
          statUnit,
          game,
          player,
          season,
          timeCode
        };
        const submitMutation = () => {
          setIsSubmitting(true);
          createStatUnitRecord({
            variables: {
              gameID: game,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
              playerID: player,
              seasonID: season,
              statUnitID: statUnit,
              timeCode
            }
          })
          .then(res => {
            setStats(stateStats => ({
              ...stateStats, 
              [`${timeCode}${statUnit}${player}`]: {
                status: STATS_MUTATION_STATUS.CONFIRMED,
                stat: statUnitRecord
              }
            }));
            setIsSubmitting(false);
            addOrRemoveFromStorage(true,  player, statUnit, statUnitRecord, timeCode);
          })
          .catch(err => {
            setStats(stateStats => ({
              ...stateStats, 
              [`${timeCode}${statUnit}${player}`]: {
                status: STATS_MUTATION_STATUS.FAILED,
                stat: statUnitRecord
              }
            }));
            setStatUnitRecordsToSubmit(records => [...records, submitMutation]);
          });
        }
        return submitMutation;
      })
      setStatUnitRecordsToSubmit(statUnitRecordsToSubmitMethods);
      setTimeRemaining(time => gameObject?.timeRemaining ?? time);
    } else {
      try {
        localStorage.setItem(gameID, JSON.stringify({}));
      } catch (err) {
        console.log('error setting local storage in onMount useEffect. error: ', err);
      }
    }
  }, []);

  /**
   * UseEffect controls the queue flow and procesing of mutations.
   *  - if not submitting and records in queue and canSubmit, remove first from queue and execute
   *  - canSubmit is used to throttle mutations so that they cannot fire faster than MUTATION_MIN_INTERVAL
   */
  useEffect(() => {
    if (statUnitRecordsToSubmit.length > 0 && !isSubmitting && canSubmit) {
      const records = [...statUnitRecordsToSubmit];
      const next = records.shift();
      setStatUnitRecordsToSubmit(records);
      setCanSubmit(false);
      // This ensures we don't send requests too rapidly
      timerRef.current = window.setTimeout(() => {
        setCanSubmit(true);
      }, MUTATION_MIN_INTERVAL);
      next?.();
    }
  }, [statUnitRecordsToSubmit, isSubmitting, canSubmit])

  /**
   * Clear the timeout if one is still in progress
   */
  useEffect(() => {
    if (timerRef.current != null) {
      clearTimeout(timerRef.current);
    }
  }, [])
  
  /**
   * Add or remove a statUnit from local storage.
   * If add, add statUnit to stats and statsToSubmit
   * - never remove from statUnits, only from statsToAdd
   * - want stats to be a complete master list of all the stats
   */
  const addOrRemoveFromStorage = (isRemove, playerID, statUnitID, statUnitRecord, timeStamp) => {
    let gameObject = {};
    try {
      gameObject = JSON.parse(localStorage.getItem(gameID));
    } catch (err) {
      console.log('error loading from local storage. error: ', err);
    }

    if (isRemove) {
      delete gameObject['statUnitsToSubmit'][`${timeStamp}${statUnitID}${playerID}`];
    } else {    
      const statUnits = gameObject?.statUnits ? {...gameObject.statUnits} : {};
      statUnits[`${timeStamp}${statUnitID}${playerID}`] = statUnitRecord;
      gameObject.statUnits = statUnits;
      const statUnitsToBeSubmitted = gameObject?.statUnitsToSubmit ? {...gameObject.statUnitsToSubmit} : {};
      statUnitsToBeSubmitted[`${timeStamp}${statUnitID}${playerID}`] = statUnitRecord;
      gameObject.statUnitsToSubmit = statUnitsToBeSubmitted;
      gameObject.timeRemaining = timeStamp;
    }

    try {
      localStorage.setItem(gameID, JSON.stringify(gameObject));
    } catch (err) {
      console.log('Error setting local storage in addOrRemoveFromStorage. Error: ', err);
    }
  }
  
  /**
   * add statUnitRecord
   *  - save the record to localStorage 
   *  - add the record to the queue to be submitted
   *  - submit mutations in queue
   */
  const addStatUnitRecord = (playerID, statUnitID) => {
    const statTime = timeRemaining;
    const statUnitRecord = {
      statUnit: statUnitID,
      game: gameID,
      player: playerID,
      season: seasonID,
      timeCode: statTime
    };

    const submitMutation = () => {
      setIsSubmitting(true);
      createStatUnitRecord({
        variables: {
          gameID,
          playerID,
          seasonID,
          statUnitID,
          timeCode: statTime
        }
      })
      .then(res => {
        setStats(stateStats => ({
          ...stateStats, 
          [`${statTime}${statUnitID}${playerID}`]: {
            status: STATS_MUTATION_STATUS.CONFIRMED,
            stat: statUnitRecord
          }
        }));
        setIsSubmitting(false);
        addOrRemoveFromStorage(true,  playerID, statUnitID, statUnitRecord, statTime);
      })
      .catch(err => {
        setStats(stateStats => ({
          ...stateStats, 
          [`${statTime}${statUnitID}${playerID}`]: {
            status: STATS_MUTATION_STATUS.FAILED,
            stat: statUnitRecord
          }
        }));
        setIsSubmitting(false);
        setStatUnitRecordsToSubmit(records => [...records, submitMutation]);
      });
    }

    setStats(stateStats => ({
      ...stateStats, 
      [`${statTime}${statUnitID}${playerID}`]: {
        status: STATS_MUTATION_STATUS.PENDING,
        stat: statUnitRecord
      }
    }));
    addOrRemoveFromStorage(false, playerID, statUnitID, statUnitRecord, statTime);
    const records = [...statUnitRecordsToSubmit];
    records.push(submitMutation);
    setStatUnitRecordsToSubmit(records);
  }

  return {
    addStatUnitRecord,
    startTimer,
    stats,
    stopTimer,
    timeRemaining
  }
}

export default useLiveStatsModuleHook;