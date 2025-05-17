import React from 'react'
import {Button} from "@/components/ui/button"

const QuestionCard = ({questions, index}) => {

 if(!questions || questions.length === 0) return <div>No question available</div>
  return (
       <div className=" text-center bg-[#F9E1C0]  py-14 min-w-[400px] shadow-md rounded-2xl text-xl flex  gap-4 justify-center items-center"  >
       <div className='font-bold'>{index + 1}</div>
        <p>
          {questions[index].definition}
        </p>
        </div>
        
        
           
       
  )
  }


export default QuestionCard
