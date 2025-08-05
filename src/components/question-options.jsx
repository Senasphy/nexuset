import {useState} from 'react'
import { handleOption} from '@/lib/helpers'
import {Button} from '@/components/ui/button'
import useQuizStore from '@/stores/quizStore'



const QuestionOptions = ({isDone, setIsDone, questions, index, selectedOption, setSelectedOption, score, setScore}) => {
  const [correctOption, setCorrectOption] = useState(null)
  const {currentScore} = useQuizStore();
  const incrementScore= useQuizStore((state)=>state.incrementScore)
  function handleAnswer(data, item, optionIndex, index) {
    const isCorrect = data[index].correctAnswer === item;
    setSelectedOption(optionIndex);
    setCorrectOption(isCorrect);
    
   
    if (!isDone.includes(data[index].id)) {
      console.log(typeof setScore) 
      if (isCorrect) {
        incrementScore(); 

      }
      setIsDone((prevState) => [...prevState, data[index].id]);
    }
    
  }


 if(!questions || questions.length === 0) return <div>No question available</div>
  return (

         <div
                  key={questions[index].id}
                  className="flex flex-col   items-center justify-center
                   gap-4 md2:text-xl mb-4 w-full"
                >
                
               


                  {questions[index].options.map((item, optionIndex) => {
                  const isSelected = selectedOption === optionIndex;
                  const variant = isSelected ? questions[index].correctAnswer === item 
                   ? "correct" : "destructive" : "custom";
                   
                  
                    return (
                   <Button
                      className="py-6 text-md h-12 rounded-full  md2:text-[.9rem] w-full shadow-md"
                      key={item}
                      variant={variant}
                      onClick={(e) => {
                      handleAnswer(questions, item,optionIndex, index)
                      e.target.blur();
                      }}
                      
                    >
                      {handleOption(optionIndex)}: {item}
                    </Button>
                    );
                  })}
                </div>
  )
}

export default QuestionOptions
