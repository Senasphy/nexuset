"use client"
import React, {useState, useEffect,useRef} from 'react'
import {Button} from '@/components/ui/button'
import {addDoc, collection} from 'firebase/firestore';
import db from '../firebase/firebase.js'
 
export default function DisplayData({username}){
  const [data,setData] = useState([])
  const [index,setIndex] = useState(0)
  const [score, setScore] = useState(0);
  const [isDone, setIsDone] = useState([])
  const [selectedOption, setSelectedOption] = useState(null)
  const [correctOption,setCorrectOption] = useState(false)
 
  
  
 
  useEffect(() =>{fetch('https://nextspellingserver.onrender.com')
  .then(response =>{
    if(!response.ok){
      throw new Error("Error fetching data")

    }
    return response.json()
    

  })
  .then(jsonData =>
    setData(jsonData)
  )
  .catch(error => console.log(`Error: ${error}`)
)
}, [])

async function updateScore(){
  try{
     await addDoc(collection(db, 'scores'),{
      username,
      score
    })
  }catch(err){
    console.log("Error found: ", err)
  }
} 


function handleNextQuestion(){
  setIndex(index => index += 1);
  setCorrectOption(null)
  setSelectedOption(null)
  variant = 'outline';
}

function handlePreviousQuestion(){
  setIndex(index => index -= 1);
  setCorrectOption(null)
  setSelectedOption(null)
}

function handleResetQuestion(){
  setIndex(0);
  setScore(0)
}
function handleOption(idx){
  switch(idx){
    case 0:
      return "A"
    case 1:
      return "B"
    case 2:
      return "C"
    case 3:
      return "D"
  }
}
 
 
function handleAnswer(item,idx){
  const isCorrect = data[index].correctAnswer === item;
    setSelectedOption(idx);  
    setCorrectOption(isCorrect); 
    if(isCorrect && !isDone.includes(data[index].id) ){
      setScore(score => score + 1)

    }
    setIsDone(prevState => [...prevState, data[index].id])
    
}

 

function handleSubmit(){
  updateScore();
  alert(`Your score of ${score} has been updated`);
  handleResetQuestion();  
}
function DisplayQuestion(){
    return(<div className = 'flex flex-col justify-center items-center gap-8 mb-4 w-screen'>
      <div className = 'lg1:w-1/2 md2:w-3/4 border-2 h-40 p-2 rounded mx-4 mt-4 flex items-center'>
      <p className='text-center text-base md2:text-xl'>
      {data[index].question}</p></div>
    <div key = {index} className =
     'flex item-center justify-center flex-col gap-4 md: grid md1:grid-cols-2 md1: grid-rows-2 md2:text-xl ' > 
      
        {data[index].options.map((item, index) =>{
          const isSelected = selectedOption === index;
          const variant = isSelected ? ( correctOption ? 'default' : 'destructive') : 'outline'

      return(
      <>
  <Button className = ' h-10 w-48 md1:w-40 px-8 rounded mx-2 md2:text-xl 'key = {item} variant =
  {variant} onClick = {()=>handleAnswer(item,index)}> {handleOption(index)}: {item}  </Button> 

      </>
      
    )
    })}</div>
      </div>
    )
}

  return(
    <div className = 'overflow-hidden min-h-screen flex flex-col justify-center items-center gap-4 text-base md2:text-xl'>
 {data.length >  0? <DisplayQuestion />: <div className = 'loading-spinner'>...Loading</div>} 

 <div className = 'flex gap-2 flex-wrap items-center justify-center'>
<Button className = 'w-20 h-8 text-base font-light md2:text-xl' variant = 'custom' 
onClick = {handleNextQuestion} 
 disabled = {index == data.length - 1}>Next</Button>
 <Button className = 'w-20 h-8 text-base font-light md2:text-xl'  variant = 'custom' 
 onClick = {handlePreviousQuestion}
  disabled = {index == 0}>Previous</Button>
 <Button className = 'w-20 h-8 text-base font-light md2:text-xl '  variant = 'destructive' 
  onClick = {handleResetQuestion} 
 disabled = {index == 0}>Reset</Button>
 {index === data.length - 1 ? <Button onClick = {handleSubmit}>Submit</Button> : null}
 </div> 
  <div> Score: {score} </div>   

    </div>
  )

}