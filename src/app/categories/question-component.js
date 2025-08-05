import QuestionCard from '@/components/question-card'
import QuestionOptions from '@/components/question-options'
import QuestionNav from '@/components/question-nav'
import { useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import Sidebar from '@/components/main-header'
import CategoryScroll from '@/components/category-scroll'
import { X } from 'lucide-react'; // Import the close icon from lucide-react
import Link from 'next/link'
import {Button} from '@/components/ui/button'
const QuestionComponent = ({ questions, difficulty, setDifficulty }) => {
  const [timeover, setTimeover] = useState(false)
  const [currentTime, setCurrentTime] = useState(10)
  const [hasQuit, setHasQuit] = useState(false)
  const [index, setIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null)
  const [score, setScore] = useState(0)
  const [isDone, setIsDone] = useState([]) 
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      // Only allow swiping if the game is not over
      if (!timeover) {
        setIndex(index + 1)
        setSelectedOption(null)
      }
    },
    onSwipedRight: () => {
      // Only allow swiping if the game is not over
      if (!timeover) {
        setIndex(index - 1)
        setSelectedOption(null)
      }
    },
    trackMouse: true,
    delta: 10,
  })

  // Function to close the overlay and optionally reset game state
  const handleCloseOverlay = () => {
    setTimeover(false);
    // You could also add logic here to reset the game, e.g.:
    // setIndex(0);
    // setScore(0);
    // setSelectedOption(null);
  }
  function formatTime(intSeconds){
    const minutes = Math.floor(intSeconds / 60);
    const second = Math.floor(intSeconds % 60)
    return `${minutes}:${second < 10 ? '0' : ''}${second}`
  }

  return (
    <div className='flex gap-4 px-10 flex-col w-full h-full items-center justify-center relative' {...handlers}>
      {/* Overlay for Game Over message */}
      {timeover && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[1000]'>
          <div className='w-full max-w-sm m-4 bg-black text-white rounded-lg shadow-2xl relative'>
            
            {/* Close button positioned at the top-right */}
            <button
              onClick={handleCloseOverlay}
              className='absolute top-2 right-2 text-white p-1 rounded-full hover:bg-red-700 transition-colors'
              aria-label="Close"
            >
              <X size={24} />
            </button>

            {/* Message content */}
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
      )}
       {( hasQuit && currentTime !==null  ) && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[1000]'>
          <div className='w-full max-w-sm m-4 bg-black text-white rounded-lg shadow-2xl relative'>
            
            {/* Close button positioned at the top-right */}
            <button
              onClick={handleCloseOverlay}
              className='absolute top-2 right-2 text-white p-1 rounded-full hover:bg-red-700 transition-colors'
              aria-label="Close"
            >
              <X size={24} />
            </button>

            {/* Message content */}
            <div className='p-8 text-center'>
                <h1 className='text-3xl font-bold mb-4'>Game Over!</h1>
                <p className='text-lg'>Time has run out.</p>
               <div className='flex gap-2 w-full justify-center'> 
                  <Link href='../stats'><Button variant='secondary'>Bollocks</Button></Link>
                  <Link href='../categories'><Button variant='secondary'>Bumass</Button></Link>
                </div> 
         {console.log( timeover)}
         <div>{formatTime(currentTime)} </div>
            </div>
          </div>
        </div>
      )}
      {/* Main content of the game */}
      <Sidebar setTimeover={setTimeover} setHasQuit={setHasQuit}  setCurrentTime={setCurrentTime}/>
      <CategoryScroll difficulty={difficulty} setDifficulty={setDifficulty} />
      <QuestionCard questions={questions} index={index}></QuestionCard>
      <QuestionOptions questions={questions} index={index} setIndex={setIndex} selectedOption={selectedOption}
        setSelectedOption={setSelectedOption} score={score} setScore={setScore} isDone={isDone} setIsDone={setIsDone}></QuestionOptions>
      <QuestionNav questions={questions} index={index} setIndex={setIndex}
        selectedOption={selectedOption} setSelectedOption={setSelectedOption} score={score} isDone={isDone}
        setIsDone={setIsDone}></QuestionNav>
    </div>
  )
}

export default QuestionComponent
