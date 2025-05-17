import QuestionCard from '@/components/question-card'
import QuestionOptions from '@/components/question-options'
import QuestionNav from '@/components/question-nav'
import {useState} from 'react'
import {useSwipeable} from 'react-swipeable'



const QuestionComponent = ({questions}) => {
  const [index, setIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null)
  const handlers = useSwipeable({
    onSwipedLeft: () =>{
      setIndex(index+1)
      setSelectedOption(null)
    },
    onSwipedRight: ()=>{
      setIndex(index-1)
      setSelectedOption(null)
    },
    trackMouse: true,
    delta:10,
  })

  
  return (

       <div className='flex gap-4 flex-col w-full flex flex-col items-center justify-center' {...handlers}>
        <QuestionCard questions = {questions} index = {index}></QuestionCard>
        <QuestionOptions questions = {questions} index={index} setIndex={setIndex} selectedOption = {selectedOption}
        setSelectedOption = {setSelectedOption} ></QuestionOptions>
        <QuestionNav questions = {questions} index = {index} setIndex = {setIndex} 
        selectedOption = {selectedOption} setSelectedOption = {setSelectedOption}></QuestionNav>

    </div>
   

  )
}

export default QuestionComponent