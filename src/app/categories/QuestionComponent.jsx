"use client"
import { useState, useEffect, useRef } from 'react'
import { useSwipeable } from 'react-swipeable'
import { motion } from 'framer-motion'
import { ArrowLeft, Lightbulb, Pause, Volume2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useShallow } from 'zustand/react/shallow'
import useQuizStore from '@/stores/quizStore'
import useScoreStore from '@/stores/scoreStore'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import QuestionSidebar from '@/components/QuestionSidebar'
import useTimerStore from '@/stores/timerStore'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { saveUserSession } from '@/lib/sessionAnalytics'
import ShimmerText from '@/components/kokonutui/shimmer-text'

const QuestionComponent = ({ questions, categoryName }) => {
  const router = useRouter()
  const {
    index,
    setIndex,
    decrementIndex,
    isPaused,
    setIsPaused, // New setter
    isFinished,
    setIsFinished,
    resetIndex,
    setIsSidebarOpen,
    difficulty,
    questionCount,
    autoPronounce,
  } = useQuizStore(
    useShallow((s) => ({
      index: s.index,
      setIndex: s.setIndex,
      decrementIndex: s.decrementIndex,
      isPaused: s.isPaused,
      setIsPaused: s.setIsPaused,
      isFinished: s.isFinished,
      setIsFinished: s.setIsFinished,
      resetIndex: s.resetIndex,
      setIsSidebarOpen: s.setIsSidebarOpen,
      difficulty: s.difficulty,
      questionCount: s.questionCount,
      autoPronounce: s.autoPronounce,
    }))
  )
  const { user } = useAuth()
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
        <ShimmerText text="Loading questions..." className="text-2xl" />
      </div>
    )
  }

  const safeIndex = Math.max(0, Math.min(index, questions.length - 1))
  const currentQuestion = questions[safeIndex]
  const word = (currentQuestion?.correctAnswer || "").toLowerCase()

  const inputRefs = useRef([])
  const timerRef = useRef(null)
  const revealCorrectTimeoutRef = useRef(null)
  const transitionTimeoutRef = useRef(null)
  const sessionStartAtRef = useRef(Date.now())
  const totalPausedMsRef = useRef(0)
  const pauseStartedAtRef = useRef(null)
  const hasSavedSessionRef = useRef(false)
  const attemptedIndicesRef = useRef(new Set())
  const quitPromptWasRunningRef = useRef(false)
  const isTransitioning = useRef(false)

  const [userAnswer, setUserAnswer] = useState(new Array(word.length).fill(""))
  const [isError, setIsError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(countdownTime)
  const [isPauseOpen, setIsPauseOpen] = useState(false)
  const [isQuitPromptOpen, setIsQuitPromptOpen] = useState(false)
  const [revealedIndices, setRevealedIndices] = useState(new Array(word.length).fill(false))
  const [hasUsedHint, setHasUsedHint] = useState(false)
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechVoice, setSpeechVoice] = useState(null)

  // Initialization
  useEffect(() => {
    const init = setTimeout(() => {
      resetIndex()
      setIsFinished(false)
      resetScore()
      setIsPaused(false) // Force unpause on load
      sessionStartAtRef.current = Date.now()
      totalPausedMsRef.current = 0
      pauseStartedAtRef.current = null
      hasSavedSessionRef.current = false
      attemptedIndicesRef.current = new Set()
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
            goToNextQuestion(false)
            setTimeout(() => { isTransitioning.current = false }, 180)
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const stopPronunciation = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }

  const goToNextQuestion = (markCurrentAsAttempted = false) => {
    const total = questions.length
    if (markCurrentAsAttempted) attemptedIndicesRef.current.add(safeIndex)
    if (attemptedIndicesRef.current.size >= total) {
      setIsFinished(true)
      return
    }

    for (let offset = 1; offset <= total; offset += 1) {
      const nextIndex = (safeIndex + offset) % total
      if (!attemptedIndicesRef.current.has(nextIndex)) {
        setIndex(nextIndex)
        return
      }
    }
  }

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return
    const synth = window.speechSynthesis

    const pickVoice = () => {
      const voices = synth.getVoices()
      if (!voices?.length) return
      const englishVoice =
        voices.find((v) => v.lang?.toLowerCase().startsWith("en-us")) ||
        voices.find((v) => v.lang?.toLowerCase().startsWith("en")) ||
        voices[0]
      setSpeechVoice(englishVoice || null)
    }

    pickVoice()
    synth.onvoiceschanged = pickVoice

    return () => {
      synth.onvoiceschanged = null
    }
  }, [])

  const handlePronounce = () => {
    if (
      !word ||
      typeof window === "undefined" ||
      !("speechSynthesis" in window) ||
      !("SpeechSynthesisUtterance" in window)
    ) return

    const synth = window.speechSynthesis
    synth.cancel()
    synth.resume()

    const utterance = new window.SpeechSynthesisUtterance(currentQuestion?.correctAnswer || word)
    utterance.lang = "en-US"
    utterance.rate = 0.9
    utterance.pitch = 1
    if (speechVoice) utterance.voice = speechVoice
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    setIsSpeaking(true)
    synth.speak(utterance)
  }

  useEffect(() => {
    if (!autoPronounce || isPaused || isFinished || !word) return
    const autoSpeakTimer = setTimeout(() => {
      handlePronounce()
    }, 180)
    return () => clearTimeout(autoSpeakTimer)
  }, [safeIndex, word, autoPronounce, isPaused, isFinished])

  // Question / Timer Logic
  useEffect(() => {
    isTransitioning.current = false
    setUserAnswer(new Array(word.length).fill(""))
    setRevealedIndices(new Array(word.length).fill(false))
    setIsError(false)
    setIsSuccess(false)
    setShowCorrectAnswer(false)
    stopPronunciation()
    setSecondsLeft(countdownTime)
    setHasUsedHint(false)

    if (!isPaused) startCountdown()

    const focusTimer = setTimeout(() => {
      inputRefs.current[0]?.focus()
    }, 80)

    return () => {
      clearInterval(timerRef.current)
      stopPronunciation()
      if (revealCorrectTimeoutRef.current) clearTimeout(revealCorrectTimeoutRef.current)
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current)
      clearTimeout(focusTimer)
    }
  }, [safeIndex, word, countdownTime]) // Reset timer on question change

  useEffect(() => {
    if (isPaused) {
      if (!pauseStartedAtRef.current) pauseStartedAtRef.current = Date.now()
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    if (pauseStartedAtRef.current) {
      totalPausedMsRef.current += Math.max(0, Date.now() - pauseStartedAtRef.current)
      pauseStartedAtRef.current = null
    }
    if (!isFinished) startCountdown()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPaused, isFinished, safeIndex])

  useEffect(() => {
    if (!isFinished || hasSavedSessionRef.current) return
    hasSavedSessionRef.current = true

    const endedAtMs = Date.now()
    const pausedMs = pauseStartedAtRef.current
      ? totalPausedMsRef.current + Math.max(0, endedAtMs - pauseStartedAtRef.current)
      : totalPausedMsRef.current
    const activeMs = Math.max(0, endedAtMs - sessionStartAtRef.current - pausedMs)
    const timeSpentSeconds = Math.round(activeMs / 1000)
    const totalQuestions = questions.length
    const correctAnswers = Math.min(Math.max(currentScore, 0), totalQuestions)
    const wrongAnswers = Math.max(0, totalQuestions - correctAnswers)
    const accuracy = totalQuestions ? Math.min(100, Math.max(0, Math.round((correctAnswers / totalQuestions) * 100))) : 0

    saveUserSession(user?.uid, {
      category: categoryName,
      difficulty,
      plannedQuestions: questionCount,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      accuracy,
      timeSpentSeconds,
      startedAt: new Date(sessionStartAtRef.current).toISOString(),
      endedAt: new Date(endedAtMs).toISOString(),
    }).catch(() => {
    })
  }, [isFinished, questions.length, currentScore, categoryName, difficulty, questionCount, user?.uid])

  const evaluateAnswer = (answer) => {
    if (answer.some((letter) => !letter)) return
    const answerStr = answer.join("")
    const isCorrect = answerStr === word

    setIsSuccess(isCorrect)
    setIsError(!isCorrect)
    setShowCorrectAnswer(false)

    clearInterval(timerRef.current)
    isTransitioning.current = true

    if (isCorrect) {
      incrementScore()
    } else {
      if (revealCorrectTimeoutRef.current) clearTimeout(revealCorrectTimeoutRef.current)
      revealCorrectTimeoutRef.current = setTimeout(() => {
        setShowCorrectAnswer(true)
      }, 900)
    }

    if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current)
    transitionTimeoutRef.current = setTimeout(() => {
      goToNextQuestion(true)
    }, isCorrect ? 2000 : 3000)
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

  const handleBackPress = () => {
    quitPromptWasRunningRef.current = !isPaused
    if (quitPromptWasRunningRef.current) {
      if (timerRef.current) clearInterval(timerRef.current)
      pauseTimer()
      setIsPaused(true)
    }
    setIsQuitPromptOpen(true)
  }

  const handleQuitResume = () => {
    setIsQuitPromptOpen(false)
    if (quitPromptWasRunningRef.current) {
      startTimer()
      setIsPaused(false)
      quitPromptWasRunningRef.current = false
    }
  }

  const handleQuitConfirm = () => {
    setIsQuitPromptOpen(false)
    router.push('/categories')
  }

  const handleRestart = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    resetTimer()
    resetScore()
    resetIndex()
    setSecondsLeft(countdownTime)
    setIsFinished(false)
    setIsPaused(false)
    sessionStartAtRef.current = Date.now()
    totalPausedMsRef.current = 0
    pauseStartedAtRef.current = null
    hasSavedSessionRef.current = false
    attemptedIndicesRef.current = new Set()
    startTimer()
    setIsPauseOpen(false)
  }

  const handlers = useSwipeable({
    onSwipedLeft: () => !isTransitioning.current && goToNextQuestion(false),
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
            <button
              type="button"
              onClick={handleBackPress}
              className="flex items-center gap-2 rounded-[8px] border border-[var(--border)] px-3 py-2 text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
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
                <button
                  type="button"
                  onClick={handlePronounce}
                  disabled={!word}
                  className="inline-flex h-8 items-center gap-2 rounded-[8px] border border-[var(--border)] px-3 text-xs-label text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-elevated)] disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Pronounce the answer"
                >
                  <Volume2 className={`h-3.5 w-3.5 ${isSpeaking ? "text-[var(--accent)]" : ""}`} />
                  Pronounce
                </button>
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
            {showCorrectAnswer && (
              <p className="mt-1 text-xs-label text-[var(--text-muted)]">
                Correct spelling: <span className="font-mono text-[var(--text-secondary)]">{word.toUpperCase()}</span>
              </p>
            )}

            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => !isTransitioning.current && goToNextQuestion(false)}
                  disabled={isTransitioning.current}
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

      <Dialog open={isQuitPromptOpen} onOpenChange={(open) => !open && handleQuitResume()}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-[460px] overflow-hidden data-[state=open]:animate-none data-[state=closed]:animate-none sm:w-full">
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.24, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <DialogHeader className="text-center">
              <DialogTitle className="text-center">Quit this session?</DialogTitle>
              <DialogDescription>
                Are you sure you want to quit? Your current progress for this run will be lost.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6 flex flex-col gap-3 px-2 sm:flex-row sm:justify-center sm:px-0">
              <Button variant="primary" onClick={handleQuitResume} className="w-full sm:w-auto">
                Resume
              </Button>
              <Button variant="danger" onClick={handleQuitConfirm} className="w-full sm:w-auto">
                Quit
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
