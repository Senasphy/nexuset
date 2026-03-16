"use client"
import { useState, useEffect, useRef } from 'react'
import { useSwipeable } from 'react-swipeable'
import { motion } from 'framer-motion'
import { ArrowLeft, Lightbulb, Pause } from 'lucide-react'
import Link from 'next/link'
import { useShallow } from 'zustand/react/shallow'
import useQuizStore from '@/stores/quizStore'
import useScoreStore from '@/stores/scoreStore'
import { Button } from '@/components/ui/button'
import QuestionSidebar from '@/components/QuestionSidebar'
import useTimerStore from '@/stores/timerStore'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'

const QuestionComponent = ({ questions, categoryName }) => {
  const {
    index,
    incrementIndex,
    decrementIndex,
    isPaused,
    setIsPaused, // New setter
    isFinished,
    setIsFinished,
    resetIndex,
    setIsSidebarOpen,
  } = useQuizStore(
    useShallow((s) => ({
      index: s.index,
      incrementIndex: s.incrementIndex,
      decrementIndex: s.decrementIndex,
      isPaused: s.isPaused,
      setIsPaused: s.setIsPaused,
      isFinished: s.isFinished,
      setIsFinished: s.setIsFinished,
      resetIndex: s.resetIndex,
      setIsSidebarOpen: s.setIsSidebarOpen,
    }))
  )
  const { incrementScore, resetScore, currentScore } = useScoreStore(
    useShallow((s) => ({
      incrementScore: s.incrementScore,
      resetScore: s.resetScore,
      currentScore: s.currentScore,
    }))
  )

  const { countdownTime, pauseTimer, startTimer, resetTimer } = useTimerStore(
    useShallow((s) => ({
      countdownTime: s.countdownTime,
      pauseTimer: s.pauseTimer,
      startTimer: s.startTimer,
      resetTimer: s.resetTimer,
    }))
  );
  if (!questions?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)] text-base-body text-[var(--text-secondary)]">
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
  const [isPauseOpen, setIsPauseOpen] = useState(false)
  const [revealedIndices, setRevealedIndices] = useState(new Array(word.length).fill(false))
  const [hasUsedHint, setHasUsedHint] = useState(false)

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

  const startCountdown = () => {
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
  }

  // Question / Timer Logic
  useEffect(() => {
    isTransitioning.current = false
    setUserAnswer(new Array(word.length).fill(""))
    setRevealedIndices(new Array(word.length).fill(false))
    setIsError(false)
    setIsSuccess(false)
    setSecondsLeft(countdownTime)
    setHasUsedHint(false)

    if (!isPaused) startCountdown()

    const focusTimer = setTimeout(() => {
      inputRefs.current[0]?.focus()
    }, 80)

    return () => {
      clearInterval(timerRef.current)
      clearTimeout(focusTimer)
    }
  }, [safeIndex, word, countdownTime]) // Reset timer on question change

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    if (!isFinished) startCountdown()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPaused, isFinished, safeIndex])

  const evaluateAnswer = (answer) => {
    if (answer.some((letter) => !letter)) return
    const answerStr = answer.join("")
    const isCorrect = answerStr === word

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

  const handleInputChange = (e, i) => {
    if (secondsLeft === 0 || isSuccess || isTransitioning.current || isPaused) return
    const char = e.target.value.toLowerCase().slice(-1)
    const newAnswer = [...userAnswer]
    newAnswer[i] = char
    setUserAnswer(newAnswer)

    if (revealedIndices[i]) {
      setRevealedIndices((prev) => {
        const next = [...prev]
        next[i] = false
        return next
      })
    }

    if (isError) setIsError(false)

    if (char && i < word.length - 1) {
      inputRefs.current[i + 1]?.focus()
    }

    evaluateAnswer(newAnswer)
  }

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace" && !userAnswer[i] && i > 0) {
      inputRefs.current[i - 1]?.focus()
    }
  }

  const handleHint = () => {
    if (secondsLeft === 0 || isSuccess || isTransitioning.current || isPaused || hasUsedHint) return
    const nextIndex = userAnswer.findIndex((letter, idx) => !letter && !revealedIndices[idx])
    if (nextIndex === -1) return
    const newAnswer = [...userAnswer]
    newAnswer[nextIndex] = word[nextIndex] || ""
    setUserAnswer(newAnswer)
    setHasUsedHint(true)
    setRevealedIndices((prev) => {
      const next = [...prev]
      next[nextIndex] = true
      return next
    })
    if (nextIndex < word.length - 1) {
      inputRefs.current[nextIndex + 1]?.focus()
    }
    evaluateAnswer(newAnswer)
  }

  const handleCheck = () => {
    if (secondsLeft === 0 || isSuccess || isTransitioning.current || isPaused) return
    evaluateAnswer(userAnswer)
  }

  const handlePause = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    pauseTimer()
    setIsPaused(true)
    setIsPauseOpen(true)
  }

  const handleResume = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    startTimer()
    setIsPaused(false)
    setIsPauseOpen(false)
  }

  const handleRestart = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    resetTimer()
    resetScore()
    resetIndex()
    setSecondsLeft(countdownTime)
    setIsFinished(false)
    setIsPaused(false)
    startTimer()
    setIsPauseOpen(false)
  }

  const handlers = useSwipeable({
    onSwipedLeft: () => !isTransitioning.current && incrementIndex(),
    onSwipedRight: () => !isTransitioning.current && decrementIndex(),
    trackMouse: true,
  })

  const wordHint = word.length
    ? `[ ${new Array(word.length).fill("_").join(" ")} ]`
    : ""
  const displayCategory = categoryName
    ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
    : "Session"
  const scorePercent = questions?.length
    ? Math.round((currentScore / questions.length) * 100)
    : 0
  const scoreColor =
    scorePercent >= 80
      ? "var(--correct)"
      : scorePercent >= 50
        ? "var(--accent)"
        : "var(--wrong)"

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <header className="sticky top-0 z-40 h-16 border-b border-[var(--border)] bg-[var(--bg-base)]">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/categories"
              className="flex items-center gap-2 rounded-[8px] border border-[var(--border)] px-3 py-2 text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <span className="hidden text-xl-ui text-[var(--text-primary)] sm:inline">
              {displayCategory}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div
              className="font-mono text-[1.25rem] font-medium"
              style={{
                color:
                  secondsLeft <= 5
                    ? "var(--wrong)"
                    : secondsLeft <= 10
                      ? "var(--accent)"
                      : "var(--text-primary)",
              }}
            >
              {secondsLeft}s
            </div>
            <button
              onClick={handlePause}
              className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-[var(--border)] text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-elevated)]"
              aria-label="Pause session"
            >
              <Pause className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl gap-8 px-6 py-8">
        <QuestionSidebar totalQuestions={questions.length} />
        <main className="flex min-h-[calc(100vh-64px)] flex-1 flex-col justify-center">
          <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8" {...handlers}>
            <div className="w-full rounded-[12px] border border-[var(--border)] bg-[var(--bg-surface)] p-6">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs-label text-[var(--text-muted)]">Definition</span>
              </div>
              <p className="text-lg-body text-[var(--text-primary)]">
                {currentQuestion?.definition}
              </p>
              <p className="mt-4 font-mono text-[0.95rem] text-[var(--text-muted)]">{wordHint}</p>
            </div>

            <ul className="flex flex-wrap justify-center gap-[6px]">
              {userAnswer.map((char, i) => {
                const isRevealed = revealedIndices[i]
                const stateClass = isSuccess
                  ? "border-[var(--correct-border)] bg-[var(--correct-bg)] text-[var(--correct)]"
                  : isError
                    ? "border-[var(--wrong-border)] bg-[var(--wrong-bg)] text-[var(--wrong)]"
                    : isRevealed
                      ? "border-[var(--border-strong)] border-dashed bg-[var(--neutral-letter)] text-[var(--text-muted)]"
                      : "border-[var(--border)] bg-[var(--neutral-letter)] text-[var(--text-primary)]"

                return (
                  <li key={i}>
                    <input
                      type="text"
                      maxLength={1}
                      value={char}
                      disabled={secondsLeft === 0 || isSuccess || isTransitioning.current || isPaused}
                      ref={(el) => (inputRefs.current[i] = el)}
                      onChange={(e) => handleInputChange(e, i)}
                      onKeyDown={(e) => handleKeyDown(e, i)}
                      className={`text-letter h-[60px] w-[52px] rounded-[8px] border-2 text-center uppercase outline-none shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)] transition-all focus:scale-[1.05] focus:border-[var(--border-strong)] focus:shadow-[0_0_0_2px_var(--accent-ring)] ${stateClass} ${isSuccess ? "animate-letter-correct" : ""} ${isError ? "animate-letter-wrong" : ""}`}
                      style={{
                        animationDelay: isSuccess ? `${i * 40}ms` : "0ms",
                      }}
                    />
                  </li>
                )
              })}
            </ul>

            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => !isTransitioning.current && incrementIndex()}
                  disabled={safeIndex === questions.length - 1 || isTransitioning.current}
                >
                  Skip
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleHint}
                  disabled={hasUsedHint || isSuccess || isTransitioning.current || userAnswer.every((letter) => letter)}
                >
                  <Lightbulb className="h-4 w-4" />
                  Hint
                </Button>
              </div>
              <Button
                variant="primary"
                onClick={handleCheck}
                disabled={isSuccess || isTransitioning.current || userAnswer.some((letter) => !letter)}
              >
                Check →
              </Button>
            </div>

            <Progress value={((safeIndex + 1) / questions.length) * 100} className="h-1 w-full" />
          </div>
        </main>
      </div>

      <Dialog open={isPauseOpen} onOpenChange={(open) => !open && handleResume()}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-[520px] overflow-hidden data-[state=open]:animate-none data-[state=closed]:animate-none sm:w-full">
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <DialogHeader className="text-center">
              <DialogTitle className="text-center">Session paused</DialogTitle>
              <DialogDescription>Take a breath, then jump back in.</DialogDescription>
            </DialogHeader>
            <div className="mt-6 flex flex-col gap-3 px-2 sm:flex-row sm:justify-center sm:px-0">
              <Button variant="primary" onClick={handleResume} className="w-full sm:w-auto">
                Resume
              </Button>
              <Button
                variant="secondary"
                onClick={handleRestart}
                className="w-full bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:bg-[var(--bg-surface)] sm:w-auto"
              >
                Restart
              </Button>
              <Button
                variant="ghost"
                className="w-full lg:hidden sm:w-auto"
                onClick={() => {
                  setIsPauseOpen(false)
                  setIsSidebarOpen(true)
                }}
              >
                View stats
              </Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>

      <Dialog open={isFinished} onOpenChange={(open) => !open && setIsFinished(false)}>
        <DialogContent className="overflow-hidden">
          {scorePercent >= 80 && (
            <div className="pointer-events-none absolute inset-0">
              {[...Array(8)].map((_, idx) => (
                <span
                  key={idx}
                  className="confetti-dot"
                  style={{
                    left: `${10 + idx * 10}%`,
                    top: "70%",
                    background: idx % 2 === 0 ? "var(--accent)" : "var(--correct)",
                    animationDelay: `${idx * 60}ms`,
                  }}
                />
              ))}
            </div>
          )}
          <DialogHeader className="text-center">
            <DialogTitle className="text-center">Session complete</DialogTitle>
            <DialogDescription>Your focus paid off.</DialogDescription>
          </DialogHeader>
          <div className="mt-6 text-center">
            <p className="font-display text-[3rem] font-semibold" style={{ color: scoreColor }}>
              {scorePercent}%
            </p>
            <p className="text-sm-body text-[var(--text-secondary)]">
              {currentScore} correct out of {questions.length}
            </p>
          </div>
          <DialogFooter className="mt-8">
            <Button variant="primary" asChild>
              <Link href="/categories">Back to Categories</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
export default QuestionComponent
