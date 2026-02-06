'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import useQuestions from '@/lib/api'
import QuestionComponent from "@/app/categories/question-component.jsx"
import { Loader } from 'lucide-react'
import useQuizStore from '@/stores/quizStore'

export default function QuestionsPage() {
    const difficulty = useQuizStore((state) => state.difficulty);
    const { category } = useParams()
    const { data, isLoading, error } = useQuestions(category)
    const [filteredData, setFilteredData] = useState(null)

    useEffect(() => {
        if (data) {
            setFilteredData(data.filter((item) => item.difficulty === difficulty))
        }
    }, [data, difficulty])

    if (isLoading) return (
         <div className="animate-text-gradient font-heading inline-flex bg-linear-to-r from-[#ACACAC] via-[#363636] to-[#ACACAC] bg-[200%_auto] bg-clip-text text-3xl text-transparent">
      I am thinking...
    </div>
    )
    
    if (error) return <div className="h-screen flex items-center justify-center">Error: {error.message}</div>
    if (!data || (filteredData && filteredData.length === 0)) return <div className="h-screen flex items-center justify-center">No data available for this criteria.</div>

    return (
        <div className='h-screen bg-lightDot-bg dark:bg-darkDot-bg overflow-hidden  g'>
            {filteredData && <QuestionComponent questions={filteredData} />}
        </div>
    )
}
