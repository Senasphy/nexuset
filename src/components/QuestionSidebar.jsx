"use client"
import React from 'react'
import { Pause, X } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'
import useQuizStore from '@/stores/quizStore'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import useScoreStore from '@/stores/scoreStore'
import {useAuth} from '@/context/AuthContext'

export default function QuestionSidebar() {
  const {
    index,
    isPaused,
    toggleIsPaused,
    isFinished,
  } = useQuizStore(
    useShallow((s) => ({
      isPaused: s.isPaused,
      toggleIsPaused: s.toggleIsPaused,
      isFinished: s.isFinished,
      index: s.index
    }))
  )

  const {username} = useAuth();
  const {currentScore} = useScoreStore(useShallow((s) => ({
    currentScore: s.currentScore
  })))

  // Accuracy logic: only based on completed questions (index)
  const calculateAccuracy = () => {
    if (index === 0) return 0;
    const acc = Math.round((currentScore / index) * 100);
    return acc > 100 ? 100 : acc;
  }

  const accuracy = calculateAccuracy();
  const avatarUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80"
  const totalQuestions = 30

  return (
    <>
      <div className="
        hidden lg:flex 
        w-[380px] 
        flex-col 
        bg-white/70 dark:bg-slate-900/70 
        backdrop-blur-xl 
        border-l border-white/20 dark:border-slate-700/30 
        shadow-2xl shadow-black/10 dark:shadow-black/30 
        h-screen 
        sticky top-0 
        overflow-y-auto
      ">
        <div className="p-6 space-y-8">
          {/* Profile Card */}
          <div className="
            bg-white/60 dark:bg-slate-800/50 
            backdrop-blur-sm 
            rounded-2xl 
            border border-slate-200/60 dark:border-slate-700/50 
            p-5 
            shadow-sm
          ">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={avatarUrl}
                    alt={username}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {username}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Active session</p>
                </div>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={toggleIsPaused}
                disabled={isFinished}
                className={`
                  rounded-full transition-all duration-300
                  ${isPaused 
                    ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700' 
                    : 'border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }
                `}
              >
                <Pause className={`h-5 w-5 ${isPaused ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="space-y-5">
            <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 px-1">
              Session Stats
            </h3>

            <div className="grid gap-5">
              <div className="
                bg-white/60 dark:bg-slate-800/50
                rounded-2xl
                border border-slate-200/60 dark:border-slate-700/50
                p-6
                shadow-sm
              ">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Completed</span>
                  <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                    {index} / {totalQuestions}
                  </span>
                </div>
                <div className="w-full bg-slate-200/70 dark:bg-slate-700/50 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(index / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>

              <div className="
                bg-white/60 dark:bg-slate-800/50
                rounded-2xl
                border border-slate-200/60 dark:border-slate-700/50
                p-6
                shadow-sm
              ">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Accuracy</span>
                  <span className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                    {index === 0 ? '—' : `${accuracy}%`}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {currentScore} correct • {Math.max(0, index - currentScore)} attempted wrong
                </p>
              </div>
            </div>
          </div>

          <div className="
            bg-white/50 dark:bg-slate-800/40 
            rounded-2xl 
            border border-slate-200/50 dark:border-slate-700/40 
            p-6 
            shadow-sm
            space-y-5
          ">
            <h4 className="text-lg font-medium text-slate-800 dark:text-slate-200">
              Keyboard Shortcuts
            </h4>

            <div className="space-y-3 text-sm">
              {[
                { action: "Skip question", key: "→" },
                { action: "Previous question", key: "←" },
                { action: "Reset word", key: "R" },
                { action: "Pause game", key: "P" },
                { action: "Focus input", key: "/" },
              ].map((item) => (
                <div key={item.action} className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">{item.action}</span>
                  <kbd className="
                    px-3 py-1.5 
                    bg-slate-200/80 dark:bg-slate-700/60 
                    rounded-lg 
                    text-sm font-mono font-medium 
                    min-w-[2.5rem] 
                    text-center 
                    border border-slate-300/50 dark:border-slate-600/50
                    shadow-sm
                  ">
                    {item.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isPaused && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] px-5">
          <div className="
            relative 
            bg-white/95 dark:bg-slate-900/95 
            backdrop-blur-xl 
            rounded-2xl 
            shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]
            p-8 
            w-full max-w-sm
            animate-in fade-in duration-300 ease-out
            border border-slate-200/80 dark:border-slate-700/60
          ">
            <button
              onClick={toggleIsPaused}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-slate-600 dark:text-slate-400" strokeWidth={2.8} />
            </button>

            <h1 className="text-3xl font-bold mb-4 tracking-tight text-slate-900 dark:text-slate-50 text-center">
              Paused
            </h1>

            <p className="text-center text-slate-600 dark:text-slate-400 mb-7 text-base">
              Hang on just a bit...
            </p>

            <div className="grid gap-4">
              <Button
                size="lg"
                className="h-12 text-base font-semibold bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-md transition-all"
                onClick={toggleIsPaused}
              >
                Resume
              </Button>

              <Link href="/categories" className="w-full">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full h-12 text-base font-medium border-slate-400 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm transition-all"
                >
                  Quit
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

