import React from 'react';

/**
 * The live game stats component
 * allows admins to record stats and score for a game.
 * 
 *  Utitlizes the LiveScoring module to record stats.
 *   - stats added to queue when added (with timestamp)
 *     - written to localStorage
 *   - as statUnits are saved to the backend, remove from queue
 *   stats are calculated in the UI in real time (later calculated and saved by the be)
 * 
 * ,--------------------------------------------------------,
 * |                                                        |
 * |                                                        |
 * |                                                        |
 * |                                                        |
 * |                                                        |
 * |                                                        |
 * |                                                        |
 * |                                                        |
 * |                                                        |
 * |                                                        |
 * '--------------------------------------------------------'
 * 
 */
const LiveGameStatsComponent = () => {
  // do the thing
  // const { statUnits } = useLiveStatModule();
  return (
    <>
      LiveGameStatsComponent stub
    </>
  )
}

export default LiveGameStatsComponent;
