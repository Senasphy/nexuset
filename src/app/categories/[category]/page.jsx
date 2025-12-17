'use client'
import {useState, useEffect} from 'react'
import {useParams} from 'next/navigation'
import useQuestions from '@/lib/api'
import QuestionComponent from "../question-component.js"
import {Loader} from 'lucide-react'
import useQuizStore from '@/stores/quizStore'

export default function QuestionsPage(){

    const difficulty = useQuizStore((state) => state.difficulty);  
    const {category} = useParams()
    const {data, isLoading, error } = useQuestions(category)
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

            <div className='h-screen bg-lightDot-bg   dark:bg-darkDot-bg overflow-hidden border-2 rounded-lg' >
        {filteredData && <QuestionComponent questions = {filteredData} /> }
         
        
        </div>
        )
    
}
