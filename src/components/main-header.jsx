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

        <div className ='p-1 border-2 border-black rounded-md '>
    <Timer />
    </div>
    <button  onClick = {handlePause}>
    <Pause className='hover:cursor-pointer'/>
    </button>
   </div>
  );
}
