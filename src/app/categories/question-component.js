import {useState, useEffect} from 'react'
import QuestionOptions from '@/components/question-options'
import QuestionNav from '@/components/question-nav'
import QuestionCard from '@/components/question-card'
import { useSwipeable } from 'react-swipeable'
import MainHeader from '@/components/main-header'
import { X } from 'lucide-react'; 
import Link from 'next/link'
import useQuizStore from '@/stores/quizStore'
import useTimerStore from '@/stores/timerStore'
import {Button} from '@/components/ui/button'
import { useShallow } from 'zustand/react/shallow'
const QuestionComponent = ({ questions }) => {

  const {time,  startTimer, setCountdownTime, resetTimer, restartTimer} = useTimerStore(useShallow((state)=>({
    time: state.time,
    countdownTime: state.countdownTime,
    startTimer: state.startTimer,
    setCountdownTime: state.setCountdownTime,
    resetTimer: state.resetTimer,
    restartTimer: state.restartTimer
  }) ));
  const {index, incrementIndex, decrementIndex, isPaused, toggleIsPaused, isFinished ,setIsFinished, navigation} = useQuizStore(useShallow((state)=>({
    index: state.index,
    incrementIndex: state.incrementIndex,
    decrementIndex: state.decrementIndex,
    isPaused: state.isPaused,
    toggleIsPaused: state.toggleIsPaused,
    isFinished: state.isFinished,
    setIsFinished: state.setIsFinished,
    navigation: state.navigation
  })));
  const [selectedOption, setSelectedOption] = useState(null)
  const [score, setScore] = useState(0)
  const [isDone, setIsDone] = useState([]); 
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      // Only allow swiping if the game is not over
        
        incrementIndex();  
        setSelectedOption(null)
    },
    onSwipedRight: () => {
      // Only allow swiping if the game is not over
        // setIndex(index - 1)
        decrementIndex()
        setSelectedOption(null)
    },
    trackMouse: true,
    delta: 10,
  })


  useEffect( () => {
  setCountdownTime(50)   
  startTimer()
  }, [] )


  function handleRestart(){
   toggleIsPaused();
   restartTimer(); 
  }
  
  function handleResume(){
    toggleIsPaused();
    startTimer();
  }

  function handleQuit(){
    restartTimer();   
    toggleIsPaused();
    setIsFinished(false) }
  return (

    <div className='flex  dark:bg-darkDot-bg   bg-lightDot-bg bg-cover  bg-no-repeat gap-8 px-10 flex-col w-full h-screen items-center justify-center relative' {...handlers}>

    {isPaused && (
          <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[1000]'>
          <div className='w-full max-w-sm dark:bg-black dark:text-white m-16 bg-white text-black rounded-lg shadow-2xl relative'>
            
            <button
              className='absolute top-2 right-2 text-red-400 p-1 rounded-full hover:bg-red-700 transition-colors'
              aria-label="Close" onClick={handleResume}
            >
              <X size={24} />
            </button>
<div className='p-8 text-center'>
    <h1 className='text-3xl  mb-4'>Game Paused!</h1>
    <div className='flex flex-col gap-2 w-full'>
        <div className='flex gap-4 w-full'>
            <Link href='../categories/' className='flex-1'>
                <Button variant='secondary' className='border-2 hover:shadow-lg shadow-sm w-full hover:bg-gray-200' onClick= {handleQuit}>Quit</Button>
            </Link>
            <Button variant='secondary' className='shadow-lg   opacity-80 dark:opacity-100 dark:text-black dark:border-2 bg-[#D8D8FF] hover:opacity-100 hover:bg-blue-300 hover:shadow-sm hover:shadow-blue-500 flex-1' onClick={handleResume}>Resume</Button>
        </div>
        <Button variant='secondary' className='border-2  w-full hover:bg-gray-200' onClick={handleRestart}>Restart</Button>
    </div>
</div>
      </div>
        </div>
      )} 

    {isFinished && (
          <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[1000]'>
          <div className='w-full max-w-sm m-16 dark:bg-black dark:text-white  bg-white text-black rounded-lg shadow-2xl relative'>
            
            <button
              className='absolute top-2 right-2 text-red-400 p-1 rounded-full  transition-colors'
              aria-label="Close" onClick={()=>{

                setIsFinished(false)
                resetTimer();
                startTimer();
                
              }}>
              <X size={24} />
            </button>
<div className='p-8 text-center'>
    <h1 className='text-xl  mb-4'>Congrats, you went through every question!</h1>
    <div className='flex flex-col gap-2 w-full'>
           <Button variant='secondary' className='shadow-lg   dark:text-black bg-[#D8D8FF] hover:opacity-100 hover:bg-blue-300 hover:shadow-sm hover:shadow-blue-500 flex-1' onClick={()=>{
      
                setIsFinished(false)
                restartTimer();               
              }}>Restart</Button>
       <Link href='../categories/' className='flex-1'>
                <Button variant='secondary' className='  hover:shadow-lg shadow-md w-full hover:bg-gray-200' onClick={handleQuit}>Quit</Button>
            </Link>
   </div>
    <div>{time}</div>
</div>         </div>
        </div>)}




    {/* Main content of the game */}

      <MainHeader  /> 
      <QuestionCard questions={questions} index={index}></QuestionCard>
      <QuestionOptions questions={questions}   selectedOption={selectedOption}
        setSelectedOption={setSelectedOption} score={score} setScore={setScore} isDone={isDone} setIsDone={setIsDone}></QuestionOptions>
    
    {(navigation === "both" || navigation === "buttons" ) && (<QuestionNav questions={questions}  selectedOption={selectedOption} setSelectedOption={setSelectedOption} score={score} isDone={isDone} setIsDone={setIsDone} />)}
    </div>
  )
}

export default QuestionComponent;
