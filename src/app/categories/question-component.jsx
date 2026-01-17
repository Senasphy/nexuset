"use client"
import { useState, useEffect, useRef } from 'react'
import { useSwipeable } from 'react-swipeable'
import { Pause, X } from 'lucide-react'
import Link from 'next/link'
import { useShallow } from 'zustand/react/shallow'
import useQuizStore from '@/stores/quizStore'
import { Button } from '@/components/ui/button'
import QuestionSidebar from '@/components/QuestionSidebar'

const QuestionComponent = ({ questions }) => {
  const {
    index,
    incrementIndex,
    decrementIndex,
    isPaused,
    toggleIsPaused,
    isFinished,
    setIsFinished,
    resetIndex,
  } = useQuizStore(
    useShallow((s) => ({
      index: s.index,
      incrementIndex: s.incrementIndex,
      decrementIndex: s.decrementIndex,
      isPaused: s.isPaused,
      toggleIsPaused: s.toggleIsPaused,
      isFinished: s.isFinished,
      setIsFinished: s.setIsFinished,
      resetIndex: s.resetIndex,
    }))
  )

  if (!questions?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-muted-foreground">
        Loading questions...
      </div>
    )
  }

  const safeIndex = Math.max(0, Math.min(index, questions.length - 1))
  const currentQuestion = questions[safeIndex]
  const word = (currentQuestion?.correctAnswer || "").toLowerCase()

  const inputRefs = useRef([])
  const timerRef = useRef(null)
  const isTransitioning = useRef(false)

  const [userAnswer, setUserAnswer] = useState(new Array(word.length).fill(""))
  const [isError, setIsError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(15)

  useEffect(() => {
    resetIndex()
    setIsFinished(false)
  }, [])

  useEffect(() => {
    isTransitioning.current = false
    setUserAnswer(new Array(word.length).fill(""))
    setIsError(false)
    setIsSuccess(false)
    setSecondsLeft(15)

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          if (!isPaused && !isFinished) {
            isTransitioning.current = true
            if (safeIndex < questions.length - 1) incrementIndex()
            else setIsFinished(true)
            setTimeout(() => { isTransitioning.current = false }, 180)
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    const focusTimer = setTimeout(() => {
      inputRefs.current[0]?.focus()
    }, 80)

    return () => {
      clearInterval(timerRef.current)
      clearTimeout(focusTimer)
    }
  }, [safeIndex, word])

  useEffect(() => {
    if (isPaused) clearInterval(timerRef.current)
  }, [isPaused])

  const handlePause = () => {
    toggleIsPaused()
  }

  const handleResetInput = () => {
    setUserAnswer(new Array(word.length).fill(""))
    setIsError(false)
    setIsSuccess(false)
    inputRefs.current[0]?.focus()
  }

  const handleInputChange = (e, i) => {
    if (secondsLeft === 0 || isSuccess || isTransitioning.current) return

    const char = e.target.value.toLowerCase().slice(-1)
    const newAnswer = [...userAnswer]
    newAnswer[i] = char
    setUserAnswer(newAnswer)

    if (isError) setIsError(false)

    if (char && i < word.length - 1) {
      inputRefs.current[i + 1]?.focus()
    }

    if (newAnswer.join("").length === word.length) {
      const answerStr = newAnswer.join("")
      setIsSuccess(answerStr === word)
      setIsError(answerStr !== word && answerStr !== "")
    }
  }

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace" && !userAnswer[i] && i > 0) {
      inputRefs.current[i - 1]?.focus()
    }
  }

  const handlers = useSwipeable({
    onSwipedLeft: () => !isTransitioning.current && incrementIndex(),
    onSwipedRight: () => !isTransitioning.current && decrementIndex(),
    trackMouse: true,
  })

  return (
    <div
      className="flex dark:bg-darkDot-bg bg-lightDot-bg bg-cover bg-no-repeat gap-8 px-10 flex-col w-full h-screen items-center justify-center relative"
      {...handlers}
    >
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-200 dark:bg-gray-800 z-50">
        <div
          className="h-full bg-blue-500 transition-all duration-700 ease-in-out"
          style={{ width: `${((safeIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Top bar - Timer + Controls */}
      <div className="fixed top-4 left-0 right-0 z-40 px-6 flex justify-between items-center">
        {/* Timer */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-md border border-slate-200/50 dark:border-slate-700/40">
          <span className={`text-2xl font-medium tracking-wide ${secondsLeft <= 5 ? 'text-red-600' : 'text-slate-800 dark:text-slate-200'}`}>
            {secondsLeft}s
          </span>
        </div>

        {/* Pause + Menu toggle - visible on small screens */}
        <div className="flex items-center gap-4 lg:hidden">
          <button
            onClick={handlePause}
            disabled={isFinished}
            className="p-3 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/40 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-md"
          >
            <Pause className="h-7 w-7 text-slate-700 dark:text-slate-300" strokeWidth={2.5} />
          </button>

        </div>
      </div>

      {/* Premium Pause Modal */}

{isPaused && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] px-6">
    <div
      className="
        relative bg-gradient-to-b from-white/98 to-slate-50/98
        dark:from-slate-900/98 dark:to-slate-950/98
        backdrop-blur-2xl rounded-3xl
        shadow-[0_25px_80px_-15px_rgba(0,0,0,0.35)] dark:shadow-[0_25px_80px_-15px_rgba(0,0,0,0.65)]
        ring-1 ring-white/20 dark:ring-slate-700/30
        p-10 md:p-12 w-full max-w-md
        animate-in fade-in-0 zoom-in-95 duration-500 ease-out
        border border-slate-200/40 dark:border-slate-700/40
      "
    >
      {/* Close X */}
      <button
        onClick={toggleIsPaused}
        className="absolute top-6 right-6 p-3 rounded-full hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition-colors"
        aria-label="Close"
      >
        <X className="h-6 w-6 text-slate-600 dark:text-slate-400" strokeWidth={2.8} />
      </button>

      <h1 className="text-4xl font-bold mb-8 tracking-tight text-slate-900 dark:text-slate-50 text-center">
        Paused
      </h1>

      <p className="text-center text-slate-600 dark:text-slate-400 mb-10 text-lg">
        Hang on just a bit...
      </p>

      <div className="grid gap-5">
        <Button
          size="lg"
          className="h-14 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg transition-all"
          onClick={toggleIsPaused}
        >
          Resume
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="h-14 text-lg font-medium border-slate-400 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-md transition-all"
          onClick={() => {
            toggleIsPaused()
            handleResetInput()
          }}
        >
          Restart Question
        </Button>

        <Link
          href = '/categories'
          size="lg"
          variant="outline"
          className="h-14 text-lg font-medium border-slate-400 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-md transition-all"
          onClick={() => router.push('/categories')}
        >
          Quit
        </Link>
      </div>
    </div>
  </div>
)}

      {isFinished && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[1000] px-6'>
          <div className='w-full max-w-md dark:bg-black dark:text-white bg-white text-black rounded-lg shadow-2xl p-10 text-center'>
            <h1 className='text-3xl mb-8 font-bold uppercase tracking-tight'>Category Complete!</h1>
            <Link href='/categories'><Button className="w-full" size="lg">Back to Categories</Button></Link>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-12 w-full max-w-4xl mt-16 lg:pr-[440px]">
        <ul className="flex gap-3 flex-wrap justify-center">
          {userAnswer.map((char, i) => (
            <li key={i}>
              <input
                type="text"
                maxLength={1}
                value={char}
                disabled={secondsLeft === 0 || isSuccess}
                ref={(el) => (inputRefs.current[i] = el)}
                onChange={(e) => handleInputChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className={`h-16 w-12 text-center rounded-md bg-gray-900 text-white text-3xl border-2 transition-all outline-none uppercase
                  ${isSuccess ? 'border-green-500 bg-green-900/30' : isError ? 'border-red-500 bg-red-900/30 animate-shake' : 'border-gray-700 focus:border-blue-500'}`}
              />
            </li>
          ))}
        </ul>

        <div className="w-full max-w-2xl p-6 border-2 border-dashed border-gray-700 rounded-xl bg-gray-900/80 text-center shadow-sm">
          <span className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-bold font-mono">
            Definition
          </span>
          <p className="text-lg italic text-gray-200">{currentQuestion?.definition}</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full max-w-4xl mt-12">
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          <Button
            variant="outline"
            size="lg"
            className="min-w-[160px] sm:min-w-[180px] h-14 text-lg font-medium border-2 border-slate-400 hover:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-md transition-all"
            onClick={decrementIndex}
            disabled={safeIndex === 0 || isTransitioning.current}
          >
            Previous
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="min-w-[160px] sm:min-w-[180px] h-14 text-lg font-medium border-2 border-slate-400 hover:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-md transition-all"
            onClick={incrementIndex}
            disabled={safeIndex === questions.length - 1 || isTransitioning.current}
          >
            Skip
          </Button>

          <Button
            variant="destructive"
            size="lg"
            className="min-w-[160px] sm:min-w-[180px] h-14 text-lg font-medium shadow-lg hover:bg-red-700 transition-all"
            onClick={handleResetInput}
            disabled={isSuccess || secondsLeft === 0 || isTransitioning.current}
          >
            Reset Word
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <QuestionSidebar />
    </div>
  )
}

export default QuestionComponent
