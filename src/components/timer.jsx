import {useState, useEffect} from 'react';
import useTimerStore from '../stores/timerStore';


function Timer(){
  const { countdownTime, time, isRunning,incrementTimer} = useTimerStore((state)=> ({
    countdownTime: state.countdownTime,
    time: state.time,
    isRunning: state.isRunning,
    incrementTimer: state.incrementTimer,
  })
  );
  useEffect(() =>{
    let interval;
    if(isRunning){
      interval = setInterval(()=>{
        incrementTimer();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, incrementTimer]);

  return <div>{formatTime(time, countdownTime)}</div>
}

function formatTime(seconds,differenceTerm){
  console.log("seconds: ",seconds)
  
  console.log("differenceTerm: ",differenceTerm)
  const totalSeconds = Math.max(0, parseInt(differenceTerm) - seconds);
  const minutes = Math.floor(totalSeconds/60);
  const secs = totalSeconds % 60;
  return `${minutes.toString().padStart(2,'0')}:${secs.toString().padStart(2, '0')}`;
  }


export default Timer;
