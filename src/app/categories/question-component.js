import QuestionCard from '@/components/question-card'
import QuestionOptions from '@/components/question-options'
import QuestionNav from '@/components/question-nav'
import { useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import Sidebar from '@/components/main-header'
import CategoryScroll from '@/components/category-scroll'
import { X } from 'lucide-react'; // Import the close icon from lucide-react
import Link from 'next/link'
import useQuizStore from '@/stores/quizStore'
import useTimerStore from '@/stores/timerStore'
import {Button} from '@/components/ui/button'
const QuestionComponent = ({ questions, difficulty, setDifficulty }) => {

  const {time, countdownTime} = useTimerStore((state)=>({
    time: state.time,
    countdownTime: state.countdownTime
  }) );
  const {index, incrementIndex, decrementIndex } = useQuizStore((state)=>({
    index: state.index,
    incrementIndex: state.incrementIndex,
    decrementIndex: state.decrementIndex,
  }));
  // const [index, setIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null)
  const [score, setScore] = useState(0)
  const [hasQuit, setHasQuit] = useState(false)
  const [isDone, setIsDone] = useState([]); 
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      // Only allow swiping if the game is not over
        
        // setIndex(index + 1)
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

  // Function to close the overlay and optionally reset game state
  const handleCloseOverlay = () => {
    // You could also add logic here to reset the game, e.g.:
    // setIndex(0);
    // setScore(0);
    // setSelectedOption(null);
  }

  return (
    <div className='flex gap-4 px-10 flex-col w-full h-full items-center justify-center relative' {...handlers}>
      {/* Overlay for Game Over message 
      {timeover && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[1000]'>
          <div className='w-full max-w-sm m-4 bg-black text-white rounded-lg shadow-2xl relative'>
            
            <button
              onClick={handleCloseOverlay}
              className='absolute top-2 right-2 text-white p-1 rounded-full hover:bg-red-700 transition-colors'
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <div className='p-8 text-center'>
                <h1 className='text-3xl font-bold mb-4'>Game Over!</h1>
                <p className='text-lg'>Time has run out.</p>
               <div className='flex gap-2 w-full justify-center'> 
                  <Link href='../stats'><Button variant='secondary'>Stats</Button></Link>
                  <Link href='../categories'><Button variant='secondary'>Close</Button></Link>
                </div> 
            </div>
          </div>
        </div>
      )} */}

       { (hasQuit && (countdownTime > 0))    &&       (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[1000]'>
          <div className='w-full max-w-sm m-4 bg-black text-white rounded-lg shadow-2xl relative'>
            
            <button
              onClick={handleCloseOverlay}
              className='absolute top-2 right-2 text-white p-1 rounded-full hover:bg-red-700 transition-colors'
              aria-label="Close"
            >
              <X size={24} />
            </button>

            <div className='p-8 text-center'>
                <h1 className='text-3xl font-bold mb-4'>Game Over!</h1>
                <p className='text-lg'>Time has run out.</p>
               <div className='flex gap-2 w-full justify-center'> 
                  <Link href='../stats'><Button variant='destructive'>Quit</Button></Link>
                  <Link href='../categories'><Button variant='secondary'>Resume</Button></Link>
                </div> 
         <div>{time} </div>
            </div>
          </div>
        </div>
      )}      {/* Main content of the game */}
      <Sidebar setHasQuit={setHasQuit}/> 
      <CategoryScroll   setSelectedOption={setSelectedOption} />
      <QuestionCard questions={questions} index={index}></QuestionCard>
      <QuestionOptions questions={questions}   selectedOption={selectedOption}
        setSelectedOption={setSelectedOption} score={score} setScore={setScore} isDone={isDone} setIsDone={setIsDone}></QuestionOptions>
      <QuestionNav questions={questions}  
        selectedOption={selectedOption} setSelectedOption={setSelectedOption} score={score} isDone={isDone}
        setIsDone={setIsDone}></QuestionNav>
    </div>
  )
}

export default QuestionComponent;
