'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import useQuestions from '@/lib/api'
import QuestionComponent from "@/app/categories/QuestionComponent"
import useQuizStore from '@/stores/quizStore'
import ShimmerText from '@/components/kokonutui/shimmer-text'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function QuestionsPage() {
    const difficulty = useQuizStore((state) => state.difficulty)
    const questionCount = useQuizStore((state) => state.questionCount)
    const { category } = useParams()
    const { data, isLoading, error } = useQuestions(category, questionCount, difficulty)
    const [filteredData, setFilteredData] = useState(null)

    useEffect(() => {
        if (data) {
            setFilteredData(data)
        }
    }, [data])

    if (isLoading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF6ED] dark:bg-zinc-950 px-4">
            <div className="rounded-[32px] border-[2.5px] border-black bg-white dark:bg-zinc-900 p-8 text-center shadow-[6px_6px_0px_#000000]">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-black bg-amber-400 text-black shadow-[2px_2px_0px_#000000] mb-4 animate-bounce">
                    <BookOpen className="h-7 w-7" />
                </div>
                <ShimmerText text="Preparing your spelling quest..." className="font-fredoka text-2xl font-black text-black dark:text-white uppercase" />
                <p className="mt-2 font-fredoka text-xs font-bold text-zinc-500">
                    Loading words, pronunciations &amp; clues
                </p>
            </div>
        </div>
    )
    
    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF6ED] dark:bg-zinc-950 px-4">
            <div className="rounded-[32px] border-[2.5px] border-black bg-white dark:bg-zinc-900 p-8 text-center shadow-[6px_6px_0px_#000000] max-w-md">
                <span className="font-fredoka text-4xl">⚠️</span>
                <h2 className="mt-3 font-fredoka text-2xl font-black text-black dark:text-white uppercase">Something went sideways</h2>
                <p className="mt-1 font-fredoka text-sm font-semibold text-zinc-600 dark:text-zinc-300">{error.message}</p>
                <div className="mt-6">
                    <Button variant="primary" asChild className="h-11 px-6">
                        <Link href="/categories">Back to Topics</Link>
                    </Button>
                </div>
            </div>
        </div>
    )

    if (!data || (filteredData && filteredData.length === 0)) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF6ED] dark:bg-zinc-950 px-4">
            <div className="rounded-[32px] border-[2.5px] border-black bg-white dark:bg-zinc-900 p-8 text-center shadow-[6px_6px_0px_#000000] max-w-md">
                <span className="font-fredoka text-4xl">🎒</span>
                <h2 className="mt-3 font-fredoka text-2xl font-black text-black dark:text-white uppercase">No words found for this level</h2>
                <p className="mt-1 font-fredoka text-sm font-semibold text-zinc-600 dark:text-zinc-300">Try switching your difficulty to Explorer or Master.</p>
                <div className="mt-6">
                    <Button variant="primary" asChild className="h-11 px-6">
                        <Link href="/categories">Back to Topics</Link>
                    </Button>
                </div>
            </div>
        </div>
    )

    return (
        <div className='min-h-screen bg-[#FAF6ED] dark:bg-zinc-950'>
            {filteredData && <QuestionComponent questions={filteredData} categoryName={category} />}
        </div>
    )
}
