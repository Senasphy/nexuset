"use client"
import {useState, useEffect} from 'react'
import useQuestions from '@/lib/api'
import Question from './question.jsx'
import {Loader} from 'lucide-react'
export default function testComponent(){
 const difficulty = "easy"; 
 const category = "english";
 const {data, isLoading, error}  = useQuestions(category)

const [filteredData, setFilteredData] = useState(data)


  useEffect(() =>{
    if(data){
      setFilteredData(data.filter((item)=>item.difficulty === difficulty))
    }
  }, [data])

    if (isLoading) return <div className =  'flex gap-2 justify-center items-center w-full h-screen'>
        <Loader className='animate-spin'/>Loading...</div>
    if (error) return <div>Error: {error.message}</div>
    if (!data) return <div>No data available at the moment</div>

        return (

            <div className='h-screen bg-lightDot-bg    overflow-hidden border-2 rounded-lg' >
        {filteredData && <Question question={filteredData[0]} /> }
          {console.log("Filtered Data: ", filteredData)}
         
        
        </div>
        )
 
}
