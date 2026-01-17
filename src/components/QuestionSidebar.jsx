"use client"
import React from 'react'
import { Pause, X } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'
import useQuizStore from '@/stores/quizStore'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function QuestionSidebar() {
  const {
    isPaused,
    toggleIsPaused,
    isFinished,
  } = useQuizStore(
    useShallow((s) => ({
      isPaused: s.isPaused,
      toggleIsPaused: s.toggleIsPaused,
      isFinished: s.isFinished,
    }))
  )

  // Dummy data
  const username = "Yanet Getu"
  const avatarUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80"

  const currentStreak = 7
  const questionsCompleted = 12
  const totalQuestions = 25
  const accuracy = 92
  const correctAnswers = 11
  const wrongAnswers = 1

  return (
    <>
      <div className="hidden lg:block fixed top-0 right-0 h-screen w-[360px] bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border-l border-white/20 dark:border-slate-700/30 shadow-2xl shadow-black/10 dark:shadow-black/30 z-30 overflow-y-auto">
        <div className="p-7 space-y-9">
          {/* User profile header */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-200/50 dark:border-slate-700/40">
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

            {/* Pause Activation Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleIsPaused}
              disabled={isFinished}
              className={`rounded-full transition-all duration-200 ${
                isPaused 
                  ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Pause className={`h-5 w-5 ${isPaused ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {/* Session Stats */}
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 mb-5">
              Session Stats
            </h3>
            <div className="grid gap-6">
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/40 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Current Streak</span>
                  <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{currentStreak}</span>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-500">questions in a row</div>
              </div>

              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/40 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Completed</span>
                  <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                    {questionsCompleted} / {totalQuestions}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${(questionsCompleted / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/40 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Accuracy</span>
                  <span className="text-3xl font-bold text-teal-600 dark:text-teal-400">{accuracy}%</span>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-500">
                  {correctAnswers} correct • {wrongAnswers} wrong
                </div>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="space-y-6 pt-5 border-t border-slate-200/50 dark:border-slate-700/40">
            <h4 className="text-lg font-medium text-slate-800 dark:text-slate-200">
              Keyboard Shortcuts
            </h4>
            <div className="space-y-4 text-sm">
              {[
                { action: "Skip question", key: "→" },
                { action: "Previous question", key: "←" },
                { action: "Reset word", key: "R" },
                { action: "Pause game", key: "P" },
                { action: "Focus input", key: "/" },
              ].map((item) => (
                <div key={item.action} className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">{item.action}</span>
                  <kbd className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 rounded text-sm font-mono font-medium min-w-[2.5rem] text-center">
                    {item.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PAUSE MODAL COPIED FROM QUESTION COMPONENT */}
      {isPaused && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] px-6">
          <div className="relative bg-gradient-to-b from-white/98 to-slate-50/98 dark:from-slate-900/98 dark:to-slate-950/98 backdrop-blur-2xl rounded-3xl shadow-[0_25px_80px_-15px_rgba(0,0,0,0.35)] dark:shadow-[0_25px_80px_-15px_rgba(0,0,0,0.65)] p-10 md:p-12 w-full max-w-md animate-in fade-in-0 zoom-in-95 duration-500 ease-out border border-slate-200/40 dark:border-slate-700/40">
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

              <Link href='/categories' className="w-full">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full h-14 text-lg font-medium border-slate-400 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-md transition-all"
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
