import {useState} from 'react'
import { RotateCcw, ArrowBigLeft, ArrowBigRight} from 'lucide-react'
import {Button} from "@/components/ui/button"
import { submitScore} from '@/lib/helpers'
import useQuizStore from '@/stores/quizStore'
import useScoreStore from '@/stores/scoreStore'
export const QuestionNav = ({questions,isDone,setIsDone, selectedOption, setSelectedOption, score} ) => {
  const { index, incrementIndex, decrementIndex, resetIndex  } = useQuizStore((state) =>(
    {
      index: state.index,
      incrementIndex: state.incrementIndex,
      decrementIndex: state.decrementIndex,
      resetIndex: state.resetIndex
    })
  )

 const { currentScore, resetScore} = useQuizStore((state)=>({
   currentScore: state.currentScore,
   resetScore: state.resetScore,
 }));
  const endOfQuestions = index === questions.length ;
 function previousQuestion(){
    decrementIndex();
    setSelectedOption(null)
  }
  function nextQuestion(){
    incrementIndex();
    setSelectedOption(null)
  }
  function handleResetQuestion(){
    resetScore()
    setIsDone([]);
    setSelectedOption(null)
    resetIndex()
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
       
            {endOfQuestions ? (
          <Button variant  = "custom"
          className="px-4 py-6 text-lg h-14 font-light md2:text-xl rounded-2xl"
          onClick={submitScore(currentScore)}
          >
          Submit
          </Button>
          
        ) : 
        <button
          className="px-4 py-4 bg-[#D8D8FF] text-lg font-bold md2:text-xl 
          rounded-2xl shadow-md font-bold hover:scale-105 transition duration-300 
          hover:opacity-75 hover:cursor-pointer"
          onClick={()=>nextQuestion()}  disabled = {endOfQuestions} 
        >
          <ArrowBigRight />
        </button>
     }

        </div>
               </>
  )
}

export default QuestionNav;
