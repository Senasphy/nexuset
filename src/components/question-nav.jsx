import { RotateCcw, ArrowBigLeft, ArrowBigRight} from 'lucide-react'
import {Button} from "@/components/ui/button"
import { updateScore, filterByCategory, getTime} from '@/lib/helpers'
import useQuizStore from '@/stores/quizStore'
import useScoreStore from '@/stores/scoreStore'
import useTimerStore from '@/stores/timerStore'
import { useShallow } from 'zustand/react/shallow'
import  { useAuth } from '@/context/AuthContext'


export const QuestionNav = ({questions,setIsDone,  setSelectedOption}  ) => {
  const { user } = useAuth()
  const { index, incrementIndex, decrementIndex, resetIndex, setIsFinished, isFinished, category, difficulty} = useQuizStore(useShallow((state) =>(
    {
      index: state.index,
      incrementIndex: state.incrementIndex,
      decrementIndex: state.decrementIndex,
      resetIndex: state.resetIndex,
      setIsFinished: state.setIsFinished,
      isFinished: state.isFinished,
      difficulty: state.difficulty,
      category: state.category

    })
  ));

  const { restartTimer, time } = useTimerStore(useShallow((state)=> ({
    restartTimer:  state.restartTimer,
    time :  state.time

  })))
 const { currentScore, resetScore} = useScoreStore(useShallow((state)=>({
   currentScore: state.currentScore,
   resetScore: state.resetScore,
 })));
  const endOfQuestions = index === questions.length-1 ;
  const updateObject = {
      category: category,
      completed: isFinished,
      difficulty: difficulty,
      duration: time,
  }
  
  const categories = ["general", "math", "science", "english", "geography", "total"]
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

     <div className="flex gap-4 dark:text-black items-center w-full justify-around ">
        <Button
          className="px-4 py-8 text-lg font-light md2:text-xl rounded-2xl shadow-md"
          variant="custom" 
        >
          Score: {currentScore} 
        </Button>


        <div
          className="p-3 bg-[#D8D8FF] text-lg font-bold md2:text-xl rounded-2xl shadow-md font-bold hover:scale-105 transition duration-300 hover:opacity-75 hover:cursor-pointer" onClick={()=>{
            handleResetQuestion();
            restartTimer()
            getTime(user, categories)
          }}
        >
          <RotateCcw color="red" size={36}/>
        </div>
        <button
          className="p-3 bg-[#D8D8FF] text-lg font-bold md2:text-xl rounded-2xl
           shadow-md font-bold hover:scale-105 transition duration-300 hover:opacity-75 
           hover:cursor-pointer"
          onClick={()=>previousQuestion()} disabled={index===0}
        >
          <ArrowBigLeft size={36}/>
        </button>
       
            {endOfQuestions ? (
          <Button variant  = "custom"
          className="px-4 py-6 text-lg h-14 font-light md2:text-xl rounded-2xl"
          onClick={()=>{
            setIsFinished(true);
            console.log("is Finished: ", isFinished)  
            updateScore(updateObject, user);
            filterByCategory(user, 'general')
            handleResetQuestion();
            restartTimer()

          }}
         >
          Submit
          </Button>
          
        ) : 
        <button
          className="p-3 bg-[#D8D8FF] text-lg font-bold md2:text-xl 
          rounded-2xl shadow-md font-bold hover:scale-105 transition duration-300 
          hover:opacity-75 hover:cursor-pointer"
          onClick={()=>nextQuestion()}  disabled = {endOfQuestions} 
        >
          <ArrowBigRight size={36}/>
        </button>
     }

        </div>
               </>
  )
}

export default QuestionNav;
