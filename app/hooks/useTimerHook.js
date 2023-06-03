import React, {useState} from 'react'; 

/**
 * Hook for handling a timer
 */
const useTimerHook = (initialValue) => {
  const [timer, setTimer] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(initialValue);

  /**
   * Resume/start the timer
   */
  const startTimer = () => {
    if (timer == null) {
      const t = setInterval(() => {
        setTimeRemaining(t => t - 1);
      }, 100);
      setTimer(t);
    }
  }

  /**
   * Stop the timer
   */
  const stopTimer = () => {
    clearInterval(timer);
    setTimer(null);
  }

  /**
   * set the current time. Time param must be in milliseconds
   * @param {Number} time 
   */
  const setTime = (time) => {
    setTimeRemaining(time);
  }

  return {
    setTime,
    setTimeRemaining,
    startTimer,
    stopTimer,
    timeRemaining
  }
}

export default useTimerHook;
