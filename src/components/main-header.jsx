'use client';
import { Pause } from 'lucide-react';
import Timer from '@/components/timer'
import useTimerStore from '../stores/timerStore.js'
import useQuizStore from '../stores/quizStore.js'
export default function MainHeader() {

  const { pauseTimer } = useTimerStore();
  const toggleIsPaused = useQuizStore(state => state.toggleIsPaused)
    
  function handlePause(){
  pauseTimer();
  toggleIsPaused();
  }
  return (
    <div className=" flex justify-between  items-center  w-full ">
      <div>
        <Timer />
      </div>
      <button  onClick = {handlePause}>
        <Pause className='text-black dark:text-white hover:cursor-pointer'/>
      </button>
   </div>
  );
}
