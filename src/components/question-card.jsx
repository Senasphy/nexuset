import React from 'react'

const QuestionCard = ({questions, index}) => {

 if(!questions || questions.length === 0) return <div>No question available</div>
  return (
       <div className=" text-center bg-[#F9E1C0]  dark:text-black w-full mx-4 py-14 min-w-[80%] shadow-md rounded-2xl text-xl flex  gap-4 justify-center items-center"  >
       <p className='font-bold'>{index + 1}</p>
        <p>
          {questions[index].definition}
        </p>
        </div>
        
        
           
       
  )
  }


export default QuestionCard
