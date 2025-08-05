'use client'
import {useState, useEffect} from 'react'
import {useParams} from 'next/navigation'
import useQuestions from '@/lib/api'
import QuestionComponent from "../question-component.js"
import CategoryScroll from '@/components/category-scroll.jsx'
import {Loader} from 'lucide-react'


export default function QuestionsPage(){
  
    const {category} = useParams()
    const {data, isLoading, error } = useQuestions(category)
    const [difficulty, setDifficulty] = useState("easy")
    const [filteredData, setFilteredData] = useState(data)
  
    

    useEffect(() => { 
        if (data) {                 
        setFilteredData(data.filter((item) => item.difficulty === difficulty
       ))
    }
    }
    , [data, difficulty])


    if (isLoading) return <div className =  'flex gap-2 justify-center items-center w-full h-screen'>
        <Loader className='animate-spin'/>Loading...</div>
    if (error) return <div>Error: {error.message}</div>
    if (!data) return <div>No data available at the moment</div>

        return (

            <div className='h-full bg-custom  overflow-hidden border-2 rounded-lg m-2' >
        {filteredData && <QuestionComponent questions = {filteredData} difficulty={difficulty}
          setDifficulty={setDifficulty}/> }
         
        
        </div>
        )
    
}
