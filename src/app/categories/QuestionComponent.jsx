"use client"
import { useState, useEffect, useRef, useMemo } from 'react'
import { useSwipeable } from 'react-swipeable'
import { motion } from 'motion/react'
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
    setIsPaused,
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
        <ShimmerText text="Preparing your session questions..." className="text-2xl" />
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

  useEffect(() => {
    const init = setTimeout(() => {
      resetIndex()
      setIsFinished(false)
      resetScore()
      setIsPaused(false)
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
    utterance.rate = 0.88
    utterance.pitch = 1
    if (speechVoice) utterance.voice = speechVoice
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    synth.speak(utterance)
  }

  useEffect(() => {
    if (!autoPronounce || isPaused || isFinished || !word) return
    const autoSpeakTimer = setTimeout(() => {
      handlePronounce()
    }, 200)
    return () => clearTimeout(autoSpeakTimer)
  }, [safeIndex, word, autoPronounce, isPaused, isFinished])

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
  }, [safeIndex, word, countdownTime])

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
    }).catch(() => {})
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
    }, isCorrect ? 1800 : 2800)
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

  // Scrambled letters for on-screen chip keyboard (friendly for kids & tablets)
  const scrambledPool = useMemo(() => {
    if (!word) return []
    const letters = word.toUpperCase().split("")
    const commonDistractors = ["E", "A", "R", "S", "T", "O", "I", "N"]
      .filter((l) => !letters.includes(l))
      .slice(0, 2)
    return [...letters, ...commonDistractors].sort((a, b) => a.localeCompare(b))
  }, [word])

  const handleLetterChipClick = (char) => {
    if (secondsLeft === 0 || isSuccess || isTransitioning.current || isPaused) return
    const firstEmptyIndex = userAnswer.findIndex((c) => !c)
    if (firstEmptyIndex !== -1) {
      const nextAnswer = [...userAnswer]
      nextAnswer[firstEmptyIndex] = char.toLowerCase()
      setUserAnswer(nextAnswer)
      const nextInput = inputRefs.current[firstEmptyIndex + 1]
      if (nextInput) {
        nextInput.focus()
      }
      if (nextAnswer.every((c) => Boolean(c))) {
        evaluateAnswer(nextAnswer)
      }
    }
  }

  const handleBackspaceChip = () => {
    if (secondsLeft === 0 || isSuccess || isTransitioning.current || isPaused) return
    let lastFilledIndex = -1
    for (let i = userAnswer.length - 1; i >= 0; i--) {
      if (userAnswer[i]) {
        lastFilledIndex = i
        break
      }
    }
    if (lastFilledIndex !== -1) {
      const nextAnswer = [...userAnswer]
      nextAnswer[lastFilledIndex] = ""
      setUserAnswer(nextAnswer)
      const prevInput = inputRefs.current[lastFilledIndex]
      if (prevInput) prevInput.focus()
    }
  }

  const displayCategory = categoryName
    ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
    : "Spelling"
  const scorePercent = questions?.length
    ? Math.round((currentScore / questions.length) * 100)
    : 0

  return (
    <div className="min-h-screen bg-[#FAF6ED] dark:bg-zinc-950 text-black dark:text-white">
      {/* Floating Pill Capsule Header (Matching Reference Screenshot) */}
      <header className="sticky top-3 z-sticky px-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border-2 border-black bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-4 sm:px-6 py-2.5 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#3f3f46]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBackPress}
              className="flex items-center gap-1.5 rounded-full border-2 border-black bg-amber-400 px-3.5 py-1.5 font-fredoka text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000000] hover:bg-amber-300 transition-all active:translate-x-[1px] active:translate-y-[1px]"
            >
              <ArrowLeft className="h-4 w-4" />
              Topics
            </button>
            <span className="hidden sm:inline-block rounded-full border border-black bg-[#FAF6ED] dark:bg-zinc-800 px-3 py-0.5 font-fredoka text-xs font-black uppercase text-black dark:text-white shadow-[1px_1px_0px_#000000]">
              {displayCategory} Quest
            </span>
          </div>

          {/* Center / Right: Countdown Timer Block like Screenshot */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-2xl border-2 border-black bg-[#FAF6ED] dark:bg-zinc-800 px-3.5 py-1 shadow-[2px_2px_0px_#000000]">
              <span className="font-fredoka text-[11px] font-black uppercase text-zinc-600 dark:text-zinc-400">
                Time Left:
              </span>
              <span
                className={`font-fredoka text-base font-black ${
                  secondsLeft <= 5
                    ? "text-rose-600 animate-pulse"
                    : secondsLeft <= 10
                      ? "text-amber-500"
                      : "text-black dark:text-white"
                }`}
              >
                {secondsLeft}s
              </span>
            </div>

            <button
              onClick={handlePause}
              className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-black bg-white dark:bg-zinc-800 text-black dark:text-white shadow-[2px_2px_0px_#000000] hover:bg-amber-300 transition-all active:translate-x-[1px] active:translate-y-[1px]"
              aria-label="Pause quest"
              title="Pause"
            >
              <Pause className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Practice Container */}
      <div className="mx-auto flex w-full max-w-6xl gap-8 px-4 sm:px-6 pt-6 pb-12">
        <QuestionSidebar totalQuestions={questions.length} />

        <main id="main" className="flex min-h-[calc(100dvh-100px)] flex-1 flex-col justify-center">
          <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6" {...handlers}>
            
            {/* The Central Question Card (Inspired by Screenshot's Center Card) */}
            <div className="w-full rounded-[32px] border-[2.5px] border-black bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#3f3f46]">
              
              {/* Question Index Pill & Audio Button */}
              <div className="flex items-center justify-between border-b-2 border-black/10 dark:border-white/10 pb-4 mb-5">
                <span className="rounded-full border-2 border-black bg-amber-300 px-3 py-1 font-fredoka text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000000]">
                  Word {safeIndex + 1} of {questions.length}
                </span>

                <button
                  type="button"
                  onClick={handlePronounce}
                  disabled={!word}
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-black bg-amber-400 px-4 py-2 font-fredoka text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000000] hover:bg-amber-300 transition-all active:translate-x-[1px] active:translate-y-[1px] disabled:opacity-50"
                  aria-label="Pronounce the answer"
                >
                  <Volume2 className={`h-4 w-4 ${isSpeaking ? "animate-bounce" : ""}`} />
                  Hear Word 🔊
                </button>
              </div>

              {/* Clue Speech Frame */}
              <div className="relative rounded-2xl border-2 border-black bg-[#FAF6ED] dark:bg-zinc-800 p-5 shadow-[3px_3px_0px_#000000]">
                <p className="font-fredoka text-base sm:text-lg font-bold text-black dark:text-zinc-100 leading-relaxed">
                  &ldquo;{currentQuestion?.definition}&rdquo;
                </p>
                <div className="mt-2.5 flex items-center justify-between font-fredoka text-xs font-bold text-zinc-600 dark:text-zinc-400">
                  <span>Target length: {word.length} letters</span>
                  <span>Type or tap letters below</span>
                </div>
              </div>

              {/* Letter Tiles Slots */}
              <div className="mt-8 space-y-4">
                <ul className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
                  {userAnswer.map((char, i) => {
                    const isRevealed = revealedIndices[i]
                    const stateClass = isSuccess
                      ? "border-black bg-emerald-300 text-black animate-letter-correct"
                      : isError
                        ? "border-black bg-rose-300 text-black animate-letter-shake"
                        : isRevealed
                          ? "border-dashed border-black bg-amber-100 text-amber-900"
                          : char
                            ? "border-black bg-white dark:bg-zinc-800 text-black dark:text-white"
                            : "border-black bg-[#FAF6ED] dark:bg-zinc-800 text-zinc-400"

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
                          className={`h-14 w-12 sm:h-16 sm:w-14 rounded-2xl border-2 text-center font-fredoka text-2xl font-black uppercase outline-none shadow-[3px_3px_0px_#000000] transition-all focus:border-amber-500 ${stateClass}`}
                          style={{
                            animationDelay: isSuccess ? `${i * 45}ms` : "0ms",
                          }}
                        />
                      </li>
                    )
                  })}
                </ul>

                {showCorrectAnswer && (
                  <p className="mt-3 text-center font-fredoka text-xs font-bold text-zinc-600 dark:text-zinc-400">
                    Correct word was: <span className="font-fredoka text-sm font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{word}</span>
                  </p>
                )}
              </div>

              {/* On-Screen Clickable Letter Chips (For Kids & Tablets) */}
              <div className="mt-6 pt-5 border-t-2 border-black/10 dark:border-white/10 text-center">
                <p className="font-fredoka text-[11px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5">
                  Tap Letter Chips:
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {scrambledPool.map((letter, idx) => (
                    <button
                      key={`${letter}-${idx}`}
                      type="button"
                      onClick={() => handleLetterChipClick(letter)}
                      disabled={secondsLeft === 0 || isSuccess || isTransitioning.current || isPaused}
                      className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border-2 border-black bg-[#FAF6ED] dark:bg-zinc-800 font-fredoka text-base sm:text-lg font-black text-black dark:text-white shadow-[2px_2px_0px_#000000] hover:bg-amber-300 active:translate-x-[1px] active:translate-y-[1px] disabled:opacity-40"
                    >
                      {letter}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleBackspaceChip}
                    title="Delete letter"
                    disabled={secondsLeft === 0 || isSuccess || isTransitioning.current || isPaused}
                    className="flex h-10 px-3 items-center justify-center rounded-xl border-2 border-black bg-zinc-200 dark:bg-zinc-700 font-fredoka text-xs font-black text-black dark:text-white shadow-[2px_2px_0px_#000000] hover:bg-zinc-300 active:translate-x-[1px] active:translate-y-[1px] disabled:opacity-40"
                  >
                    ⌫ Erase
                  </button>
                </div>
              </div>

              {/* Action Bar (Skip, Hint, Submit) */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-5 border-t-2 border-black/10 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => !isTransitioning.current && goToNextQuestion(false)}
                    disabled={isTransitioning.current}
                    className="text-xs font-black uppercase"
                  >
                    Skip Word
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleHint}
                    disabled={hasUsedHint || isSuccess || isTransitioning.current || userAnswer.every((letter) => letter)}
                    className="text-xs font-black bg-amber-100 hover:bg-amber-200"
                  >
                    <Lightbulb className="h-4 w-4 mr-1 text-amber-500 fill-amber-500" />
                    Hint {hasUsedHint ? "✓" : ""}
                  </Button>
                </div>

                <Button
                  variant="primary"
                  onClick={handleCheck}
                  disabled={isSuccess || isTransitioning.current || userAnswer.some((letter) => !letter)}
                  className="px-7 py-3 text-sm font-black shadow-[3px_3px_0px_#000000]"
                >
                  Submit Answer 🚀
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="h-3 w-full rounded-full border-2 border-black bg-zinc-100 dark:bg-zinc-800 overflow-hidden shadow-[1px_1px_0px_#000000]">
                  <div
                    className="h-full bg-amber-400 transition-all duration-300"
                    style={{ width: `${((safeIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>

      {/* Pause Modal */}
      <Dialog open={isPauseOpen} onOpenChange={(open) => !open && handleResume()}>
        <DialogContent className="max-w-[440px] text-center">
          <DialogHeader className="text-center">
            <DialogTitle className="text-center font-fredoka text-3xl font-black text-black dark:text-white uppercase tracking-wide">
              Quest Paused ⏸️
            </DialogTitle>
            <DialogDescription className="text-center font-fredoka text-sm font-semibold text-zinc-600 dark:text-zinc-300">
              Take a quick breath and hop right back in!
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary" onClick={handleResume} className="w-full sm:w-auto">
              Resume Quest
            </Button>
            <Button variant="secondary" onClick={handleRestart} className="w-full sm:w-auto">
              Restart
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quit Prompt Modal */}
      <Dialog open={isQuitPromptOpen} onOpenChange={(open) => !open && handleQuitResume()}>
        <DialogContent className="max-w-[440px] text-center">
          <DialogHeader className="text-center">
            <DialogTitle className="text-center font-fredoka text-3xl font-black text-black dark:text-white uppercase tracking-wide">
              Leave This Quest?
            </DialogTitle>
            <DialogDescription className="text-center font-fredoka text-sm font-semibold text-zinc-600 dark:text-zinc-300">
              Your progress for this run will not be saved.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary" onClick={handleQuitResume} className="w-full sm:w-auto">
              Keep Going!
            </Button>
            <Button variant="danger" onClick={handleQuitConfirm} className="w-full sm:w-auto">
              Quit Quest
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Session Complete Modal (Celebration) */}
      <Dialog open={isFinished} onOpenChange={(open) => !open && setIsFinished(false)}>
        <DialogContent className="overflow-hidden p-8 text-center max-w-[480px]">
          {scorePercent >= 80 && (
            <div className="pointer-events-none absolute inset-0">
              {[...Array(12)].map((_, idx) => (
                <span
                  key={idx}
                  className="confetti-dot"
                  style={{
                    left: `${8 + idx * 7.5}%`,
                    top: "65%",
                    background: idx % 2 === 0 ? "#F59E0B" : "#10B981",
                    animationDelay: `${idx * 50}ms`,
                  }}
                />
              ))}
            </div>
          )}

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border-2 border-black bg-amber-400 text-black shadow-[3px_3px_0px_#000000] mb-3">
            <span className="font-fredoka text-3xl">🏆</span>
          </div>

          <DialogHeader className="text-center">
            <DialogTitle className="text-center font-fredoka text-3xl font-black text-black dark:text-white uppercase tracking-wide">
              Quest Complete!
            </DialogTitle>
            <DialogDescription className="text-center font-fredoka text-sm font-semibold text-zinc-600 dark:text-zinc-300">
              {scorePercent >= 80 ? "Outstanding spelling mastery!" : "Great effort! Practice makes permanent!"}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 rounded-2xl border-2 border-black bg-white dark:bg-zinc-800 p-5 shadow-[3px_3px_0px_#000000]">
            <p className="font-fredoka text-5xl font-black text-amber-500 leading-none">
              {scorePercent}%
            </p>
            <p className="mt-2 font-fredoka text-sm font-bold text-zinc-700 dark:text-zinc-300">
              You got <strong className="text-black dark:text-white text-base">{currentScore}</strong> correct out of <strong className="text-black dark:text-white text-base">{questions.length}</strong> words.
            </p>
          </div>

          <DialogFooter className="mt-6 flex justify-center sm:justify-center">
            <Button variant="primary" asChild className="h-12 px-8 text-sm font-black shadow-[3px_3px_0px_#000000]">
              <Link href="/categories">Choose Next Quest 🚀</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
export default QuestionComponent

