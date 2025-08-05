import {useState} from 'react'
import { RotateCcw, ArrowBigLeft, ArrowBigRight} from 'lucide-react'
import {Button} from "@/components/ui/button"
import { submitScore} from '@/lib/helpers'
import useQuizStore from '@/stores/quizStore'
export const QuestionNav = ({questions,isDone,setIsDone,  index, setIndex, selectedOption, setSelectedOption, score} ) => {

  const { currentScore } = useQuizStore();
  const resetScore = useQuizStore((state)=>state.resetScore)
  
 function previousQuestion(){
    setIndex(index - 1 )
    setSelectedOption(null)
  }
  function nextQuestion(){
    setIndex(index+1)
    setSelectedOption(null)
  }
  function handleResetQuestion(){
    resetScore()
    setIsDone([]);
    setSelectedOption(null)
    setIndex(0)
    console.log("Score")
    console.log("Reset is happening")
  }
  return (
    <>
     <div className="flex gap-4 items-center w-full justify-around ">
        <Button
          className="px-4 py-7 text-lg font-light md2:text-xl rounded-2xl shadow-md"
          variant="custom"
        >
          Score: {currentScore} 
        </Button>

        <div
          className="px-4 py-4 bg-[#D8D8FF] text-lg font-bold md2:text-xl 
          rounded-2xl shadow-md font-bold hover:scale-105 transition 
          duration-300 hover:opacity-75 hover:cursor-pointer"
          onClick={handleResetQuestion}

        >
          <RotateCcw color="red" size="24" />
        </div>
        <div
          className="px-4 py-4 bg-[#D8D8FF] text-lg font-bold md2:text-xl rounded-2xl
           shadow-md font-bold hover:scale-105 transition duration-300 hover:opacity-75 
           hover:cursor-pointer"
          onClick={()=>previousQuestion()}
        >
          <ArrowBigLeft />
        </div>

        <div
          className="px-4 py-4 bg-[#D8D8FF] text-lg font-bold md2:text-xl 
          rounded-2xl shadow-md font-bold hover:scale-105 transition duration-300 
          hover:opacity-75 hover:cursor-pointer"
          onClick={()=>nextQuestion()}
        >
          <ArrowBigRight />
        </div>
     
       
        </div>
        <div className='flex w-full justify-center items-center '>
             {index === questions.length - 1 ? (
       <div className=''>
          <Button variant  = "custom"
          className="px-4 py-6 text-lg h-14 font-light md2:text-xl rounded-2xl"
          onClick={submitScore}
          >
          Submit
          </Button>
          </div>
          
        ) : null}
        </div>
       </>
  )
}

export default QuestionNav
