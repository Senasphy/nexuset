"use client"
import { useState, useEffect, useRef } from 'react'
import { useSwipeable } from 'react-swipeable'
import { Pause, X, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { useShallow } from 'zustand/react/shallow'
import useQuizStore from '@/stores/quizStore'
import useScoreStore from '@/stores/scoreStore'
import { Button } from '@/components/ui/button'
import QuestionSidebar from '@/components/QuestionSidebar'
import { useAuth } from '@/context/AuthContext'
import useTimerStore from '@/stores/timerStore'

const QuestionComponent = ({ questions }) => {
  const {
    index,
    incrementIndex,
    decrementIndex,
    isPaused,
    toggleIsPaused,
    setIsPaused, // New setter
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
      setIsPaused: s.setIsPaused,
      isFinished: s.isFinished,
      setIsFinished: s.setIsFinished,
      resetIndex: s.resetIndex,
    }))
  )
  const { incrementScore, resetScore } = useScoreStore(
    useShallow((s) => ({
      incrementScore: s.incrementScore,
      resetScore: s.resetScore
    }))
  )

  const { countdownTime } = useTimerStore();
  const { username } = useAuth();

  if (!questions?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-muted-foreground bg-white dark:bg-slate-950">
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
  const [secondsLeft, setSecondsLeft] = useState(countdownTime)

  // Initialization
  useEffect(() => {
    const init = setTimeout(() => {
      resetIndex()
      setIsFinished(false)
      resetScore()
      setIsPaused(false) // Force unpause on load
    }, 0)
    
    return () => clearTimeout(init)
  }, [])  

  // Question / Timer Logic
  useEffect(() => {
    isTransitioning.current = false
    setUserAnswer(new Array(word.length).fill(""))
    setIsError(false)
    setIsSuccess(false)
    setSecondsLeft(countdownTime) // Using the constant value

    if (timerRef.current) clearInterval(timerRef.current)

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
  }, [safeIndex, word, countdownTime, isPaused]) // Added isPaused to sync timer accurately

  const handlePause = () => toggleIsPaused()

  const handleResetInput = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setUserAnswer(new Array(word.length).fill(""))
    setIsError(false)
    setIsSuccess(false)
    setSecondsLeft(countdownTime) // Reset local timer to constant
    resetIndex(0)
    setIsPaused(false) // Force unpause on reset
    inputRefs.current[0]?.focus()
  }

  const handleInputChange = (e, i) => {
    if (secondsLeft === 0 || isSuccess || isTransitioning.current || isPaused) return
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
      const isCorrect = answerStr === word;

      setIsSuccess(isCorrect)
      setIsError(!isCorrect)

      clearInterval(timerRef.current)
      isTransitioning.current = true

      if (isCorrect) incrementScore()

      setTimeout(() => {
        if (safeIndex < questions.length - 1) {
          incrementIndex()
        } else {
          setIsFinished(true)
        }
      }, 2000)
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
    <div className="flex justify-center items-center min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500">
      <div className="flex-1 flex flex-col items-center px-5 sm:px-8 lg:px-12 py-8 lg:py-12">
        <div className="w-full max-w-4xl flex flex-col items-center gap-10 sm:gap-12" {...handlers}>
          
          {/* Progress Bar */}
          <div className="fixed top-0 left-0 right-0 h-1.5 bg-slate-100 dark:bg-slate-800 z-50 lg:right-[360px]">
            <div
              className="h-full bg-blue-500 transition-all duration-700 ease-in-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              style={{ width: `${((safeIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Top Controls */}
          <div className="fixed top-4 left-4 right-4 z-40 flex justify-between items-center lg:left-12 lg:right-[384px]">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-6 py-3 rounded-xl shadow-sm">
              <span className={`text-2xl font-bold tabular-nums tracking-tighter ${secondsLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-slate-900 dark:text-slate-100'}`}>
                {secondsLeft}s
              </span>
            </div>

            <div className="flex items-center gap-4 lg:hidden">
              <button onClick={handlePause} disabled={isFinished} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm group">
                <Pause className="h-6 w-6 text-slate-900 dark:text-slate-100 group-hover:text-blue-500 transition-colors" strokeWidth={2.5} />
              </button>
            </div>
          </div>

          <div className="mt-20 lg:mt-16 w-full flex flex-col items-center gap-12">
            
            {/* Input Grid */}
            <ul className="flex gap-3 flex-wrap justify-center">
              {userAnswer.map((char, i) => (
                <li key={i}>
                  <input
                    type="text"
                    maxLength={1}
                    value={char}
                    disabled={secondsLeft === 0 || isSuccess || isTransitioning.current || isPaused}
                    ref={(el) => (inputRefs.current[i] = el)}
                    onChange={(e) => handleInputChange(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    className={`h-16 w-12 text-center rounded-xl text-3xl border-2 transition-all outline-none uppercase font-bold
                      ${isSuccess 
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                        : isError 
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 animate-shake' 
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:border-blue-500 focus:bg-white dark:focus:bg-black'}`}
                  />
                </li>
              ))}
            </ul>

            {/* Definition Box */}
            <div className="w-full max-w-2xl p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 text-center relative overflow-hidden">
              <span className="block text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4 font-black">Definition</span>
              <p className="text-xl font-medium leading-relaxed text-slate-800 dark:text-slate-100">
                "{currentQuestion?.definition}"
              </p>
            </div>

            {/* Action Buttons */}
            <div className="w-full max-w-4xl mt-4">
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  variant="outline" 
                  className="min-w-[140px] h-14 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 border-2 rounded-xl font-bold uppercase tracking-tight transition-all" 
                  onClick={decrementIndex} 
                  disabled={safeIndex === 0 || isTransitioning.current}
                >
                  Previous
                </Button>
                
                <Button 
                  variant="outline" 
                  className="min-w-[140px] h-14 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 border-2 rounded-xl font-bold uppercase tracking-tight transition-all" 
                  onClick={() => !isTransitioning.current && incrementIndex()} 
                  disabled={safeIndex === questions.length - 1 || isTransitioning.current}
                >
                  Skip
                </Button>

                <Button 
                  variant="outline" 
                  className="min-w-[140px] h-14 bg-white dark:bg-slate-900 text-red-500 border-slate-200 dark:border-slate-800 hover:border-red-500 dark:hover:border-red-500 border-2 rounded-xl font-bold uppercase tracking-tight transition-all flex gap-2" 
                  onClick={handleResetInput} 
                  disabled={isSuccess || isTransitioning.current}
                >
                  <RotateCcw size={16} />
                  Reset
                </Button>
              </div>
            </div>
          </div>

          {/* Modals */}
          {isPaused && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[1000] px-6">
              <div className='w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center shadow-2xl'>
                <h1 className='text-2xl mb-8 font-black uppercase tracking-tight text-slate-900 dark:text-white'>Game Paused</h1>
                <Button className="w-full h-14 rounded-xl text-lg font-bold bg-blue-600 hover:bg-blue-700" onClick={handlePause}>Resume Play</Button>
              </div>
            </div>
          )}

          {isFinished && (
            <div className='fixed inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-lg z-[1000] px-6'>
              <div className='w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center shadow-2xl'>
                <div className="mb-4 text-5xl">🎉</div>
                <h1 className='text-2xl mb-2 font-black uppercase tracking-tight text-slate-900 dark:text-white'>Well Done!</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Category completed successfully.</p>
                <Link href='/categories' className="w-full">
                  <Button className="w-full h-14 rounded-xl text-lg font-bold bg-blue-600 hover:bg-blue-700">Back to Categories</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <QuestionSidebar />
    </div>
  )
}
export default QuestionComponent
