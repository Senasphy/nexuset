// Timer.js
import { useState, useEffect, useRef } from 'react';

function Timer({ duration, setCompleted, setTimeover, setCurrentTime }) {
  const [time, setTime] = useState(Number(duration) || 10000); // Ensure valid number
  const intervalRef = useRef(null);

  useEffect(() => {
    // Prevent multiple intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setTime(prevTime => {
        const newTime = Number(prevTime) - 1000; // Ensure prevTime is a number
        if (isNaN(newTime) || newTime <= 1000) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setTimeover(true);
          setCompleted(true);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [setTimeover, setCompleted]); // Include dependencies to prevent stale closures

  useEffect(() => {
    const formattedTime = getFormattedTime(time);
    console.log('Timer time:', time, 'Formatted total:', formattedTime.total);
    if (setCurrentTime) {
      setCurrentTime(formattedTime.total);
    }
  }, [time, setCurrentTime]);

  function getFormattedTime(milliSeconds = 0) {
    const safeMilliSeconds = Number(milliSeconds) || 0; // Ensure valid number
    if (safeMilliSeconds < 0) {
      return { formatted: '0:00', total: 0 };
    }
    const totalSeconds = Math.floor(safeMilliSeconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return { formatted: `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`, total: totalSeconds };
  }

  return <div>{getFormattedTime(time).formatted}</div>;
}

export default Timer;
