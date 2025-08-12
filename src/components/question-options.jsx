import {useState} from 'react'
import { handleOption} from '@/lib/helpers'
import {Button} from '@/components/ui/button'
import useQuizStore from '@/stores/quizStore'
import useScoreStore from '@/stores/scoreStore'


const QuestionOptions = ({isDone, setIsDone, questions,  selectedOption, setSelectedOption}) => {
  const index = useQuizStore((state) => state.index)
  const [correctOption, setCorrectOption] = useState(null)
  
  const { incrementScore , currentScore} = useScoreStore((state)=> ({
    incrementScore: state.incrementScore,
    currentScore: state.currentScore,
  }))




  function handleAnswer(data, item, optionIndex, index) {
    const isCorrect = data[index].correctAnswer === item;
    setSelectedOption(optionIndex);
    setCorrectOption(isCorrect);
    
   
    if (!isDone.includes(data[index].id)) {
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
                      key={item + optionIndex}
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
