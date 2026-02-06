"use client"
import { useShallow } from 'zustand/react/shallow'
import { X, Moon, Sun,  Clock, Sliders, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTheme } from 'next-themes'
import useQuizStore from '@/stores/quizStore'
import useTimerStore from '@/stores/timerStore'

function Sidebar() {
  const { theme, setTheme } = useTheme()

  const {
    difficulty,
    changeDifficulty,
    navigation,
    setNavigation,
    isSidebarOpen,
    setIsSidebarOpen,
  } = useQuizStore(
    useShallow((state) => ({
      difficulty: state.difficulty,
      changeDifficulty: state.changeDifficulty,
      navigation: state.navigation,
      setNavigation: state.setNavigation,
      isSidebarOpen: state.isSidebarOpen,
      setIsSidebarOpen: state.setIsSidebarOpen,
    }))
  )

  const { countdownTime, setCountdownTime, resetTimer, startTimer } = useTimerStore(
    useShallow((state) => ({
      countdownTime: state.countdownTime,
      setCountdownTime: state.setCountdownTime,
      resetTimer: state.resetTimer,
      startTimer: state.startTimer,
    }))
  )

  const handleTimeChange = (time) => {
    resetTimer()
    setCountdownTime(Number(time))
    startTimer()
  }


  return (
    <div
      className={`
        fixed inset-y-0 right-0 z-[1000]
        w-full max-w-md
        bg-white dark:bg-[#0a0f1e]
        border-l border-slate-200 dark:border-white/5
        shadow-2xl
        transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-7 pt-8 pb-6 border-b border-slate-100 dark:border-white/5">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Settings
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X className="h-6 w-6 text-slate-600 dark:text-slate-400" />
        </Button>
      </div>

      {/* Content */}
      <div className="h-[calc(100vh-6rem)] overflow-y-auto">
        <div className="p-7 space-y-8">
          
          {/* Navigation */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
              <Globe size={16} className="text-blue-500" />
              Navigation mode
            </label>
            <Select value={navigation} onValueChange={setNavigation}>
              <SelectTrigger className="h-12 border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white font-medium rounded-xl">
                <SelectValue placeholder="Choose mode" />
              </SelectTrigger>
              <SelectContent className="z-[1100] bg-white dark:bg-[#161b2c] border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl">
                <SelectItem value="swipe">Swipe only</SelectItem>
                <SelectItem value="buttons">Buttons only</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
              {theme === 'dark' ? <Moon size={16} className="text-blue-500" /> : <Sun size={16} className="text-blue-500" />}
              Theme
            </label>
            <Select value={theme ?? 'system'} onValueChange={setTheme}>
              <SelectTrigger className="h-12 border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white font-medium rounded-xl">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent className="z-[1100] bg-white dark:bg-[#161b2c] border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl">
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
              <Sliders size={16} className="text-blue-500" />
              Difficulty
            </label>
            <Select value={difficulty} onValueChange={changeDifficulty}>
              <SelectTrigger className="h-12 border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white font-medium rounded-xl">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent className="z-[1100] bg-white dark:bg-[#161b2c] border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl">
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Timer */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
              <Clock size={16} className="text-blue-500" />
              Time per question
            </label>
            <Select
              value={countdownTime?.toString()}
              onValueChange={handleTimeChange}
            >
              <SelectTrigger className="h-12 border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white font-medium rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[1100] bg-white dark:bg-[#161b2c] border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl">
                <SelectItem value="10">10 seconds</SelectItem>
                <SelectItem value="15">15 seconds</SelectItem>
                <SelectItem value="20">20 seconds</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 py-8 mt-4 border-t border-slate-100 dark:border-white/5">
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center font-medium">
            Next Spelling • v1.0
          </p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
