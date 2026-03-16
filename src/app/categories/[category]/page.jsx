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
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)] text-base-body text-[var(--text-secondary)]">
            Loading session...
        </div>
    )
    
    if (error) return <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)] text-base-body text-[var(--text-secondary)]">Error: {error.message}</div>
    if (!data || (filteredData && filteredData.length === 0)) return <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)] text-base-body text-[var(--text-secondary)]">No data available for this criteria.</div>

    return (
        <div className='min-h-screen bg-[var(--bg-base)]'>
            {filteredData && <QuestionComponent questions={filteredData} categoryName={category} />}
        </div>
    )
}
