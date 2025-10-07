import {useState, useEffect} from 'react';
import useTimerStore from '../stores/timerStore';
import { useShallow } from 'zustand/react/shallow'

function Timer(){
  const { countdownTime, time, isRunning,incrementTimer, resetTimer,startTimer} = useTimerStore(useShallow((state)=> ({
    countdownTime: state.countdownTime,
    time: state.time,
    isRunning: state.isRunning,
    incrementTimer: state.incrementTimer,
    resetTimer: state.resetTimer,
    startTimer:state.startTimer
  })
  ));
  useEffect(() =>{
    let interval;
    if(isRunning){
      interval = setInterval(()=>{
        incrementTimer();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, incrementTimer,startTimer]);
 
useEffect(() => {
    const totalSeconds = Math.max(0, parseInt(countdownTime) - time);
    if (totalSeconds <= 0 && isRunning) {
      resetTimer(); // Stop and reset timer when countdown reaches 0
    }
  }, [time, countdownTime, isRunning, resetTimer]); 
function formatTime(seconds,differenceTerm){
  
  const totalSeconds = Math.max(0, parseInt(differenceTerm) - seconds);
 const minutes = Math.floor(totalSeconds/60);
  const secs = Math.floor(totalSeconds % 60)
  return `${minutes.toString().padStart(2,'0')}:${secs.toString().padStart(2, '0')}`;
  }

  return <div>{formatTime(time, countdownTime)}
  </div>

}

export default Timer;
