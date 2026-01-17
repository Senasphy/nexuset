"use client"
import { useShallow } from 'zustand/react/shallow'
import { X, Moon, Sun, Monitor, Clock, Sliders, Globe } from 'lucide-react'
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
        bg-white/80 dark:bg-slate-900/80
        backdrop-blur-xl
        border-l border-white/20 dark:border-slate-700/30
        shadow-2xl shadow-black/20 dark:shadow-black/40
        transform transition-transform duration-500 ease-out
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-7 pt-8 pb-6 border-b border-slate-200/50 dark:border-slate-700/40">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Settings
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X className="h-8 w-8 text-slate-700 dark:text-slate-300" strokeWidth={2.5} />
        </Button>
      </div>

      {/* Content */}
      <div className="h-[calc(100vh-6rem)] overflow-y-auto">
        <div className="p-7 space-y-10">
          {/* Navigation */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-slate-800 dark:text-slate-200 text-xl">
              <Globe size={24} className="text-indigo-500" />
              <span className="font-medium">Navigation</span>
            </div>
            <Select value={navigation} onValueChange={setNavigation}>
              <SelectTrigger className="h-14 text-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-300/70 dark:border-slate-600/50 rounded-xl">
                <SelectValue placeholder="Choose mode" />
              </SelectTrigger>
              <SelectContent 
                className="z-[9999] bg-slate-50 dark:bg-slate-950 backdrop-blur-lg border-slate-200/70 dark:border-slate-700/50 rounded-xl"
                position="popper"
                sideOffset={10}
              >
                <SelectItem value="swipe" className="text-lg py-4">Swipe only</SelectItem>
                <SelectItem value="buttons" className="text-lg py-4">Buttons only</SelectItem>
                <SelectItem value="both" className="text-lg py-4">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Theme */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-slate-800 dark:text-slate-200 text-xl">
              {theme === 'dark' ? <Moon size={24} className="text-purple-500" /> :
               theme === 'light' ? <Sun size={24} className="text-amber-500" /> :
               <Monitor size={24} className="text-blue-500" />}
              <span className="font-medium">Appearance</span>
            </div>
            <Select value={theme ?? 'system'} onValueChange={setTheme}>
              <SelectTrigger className="h-14 text-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-300/70 dark:border-slate-600/50 rounded-xl">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent 
                className="z-[9999] bg-slate-50 dark:bg-slate-950 backdrop-blur-lg border-slate-200/70 dark:border-slate-700/50 rounded-xl"
                position="popper"
                sideOffset={10}
              >
                <SelectItem value="light" className="text-lg py-4">Light</SelectItem>
                <SelectItem value="dark" className="text-lg py-4">Dark</SelectItem>
                <SelectItem value="system" className="text-lg py-4">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-slate-800 dark:text-slate-200 text-xl">
              <Sliders size={24} className="text-rose-500" />
              <span className="font-medium">Difficulty</span>
            </div>
            <Select value={difficulty} onValueChange={changeDifficulty}>
              <SelectTrigger className="h-14 text-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-300/70 dark:border-slate-600/50 rounded-xl">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent 
                className="z-[9999] bg-slate-50 dark:bg-slate-950 backdrop-blur-lg border-slate-200/70 dark:border-slate-700/50 rounded-xl"
                position="popper"
                sideOffset={10}
              >
                <SelectItem value="easy" className="text-lg py-4">Easy</SelectItem>
                <SelectItem value="medium" className="text-lg py-4">Medium</SelectItem>
                <SelectItem value="hard" className="text-lg py-4">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Timer */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-slate-800 dark:text-slate-200 text-xl">
              <Clock size={24} className="text-teal-500" />
              <span className="font-medium">Time per question</span>
            </div>
            <Select
              value={countdownTime.toString()}
              onValueChange={handleTimeChange}
            >
              <SelectTrigger className="h-14 text-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-300/70 dark:border-slate-600/50 rounded-xl">
                <SelectValue placeholder="Time" />
              </SelectTrigger>
              <SelectContent 
                className="z-[9999] bg-slate-50 dark:bg-slate-950 backdrop-blur-lg border-slate-200/70 dark:border-slate-700/50 rounded-xl"
                position="popper"
                sideOffset={10}
              >
                <SelectItem value="50" className="text-lg py-4">Fast — 10 seconds</SelectItem>
                <SelectItem value="60" className="text-lg py-4">Moderate — 15 seconds</SelectItem>
                <SelectItem value="70" className="text-lg py-4">Relaxed — 20 seconds</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 py-6 border-t border-slate-200/40 dark:border-slate-700/40">
          <p className="text-base text-neutral-500 dark:text-neutral-500 text-center">
            Next Spelling • v1.0
          </p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
