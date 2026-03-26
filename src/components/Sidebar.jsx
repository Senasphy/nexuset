"use client"
import { useShallow } from 'zustand/react/shallow'
import { Clock, Moon, Sliders, Sun } from 'lucide-react'
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
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetCloseButton } from '@/components/ui/sheet'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

function Sidebar() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { logout } = useAuth()
  const router = useRouter()

  const {
    difficulty,
    changeDifficulty,
    isSidebarOpen,
    setIsSidebarOpen,
  } = useQuizStore(
    useShallow((state) => ({
      difficulty: state.difficulty,
      changeDifficulty: state.changeDifficulty,
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

  const isDark = (theme === "dark") || resolvedTheme === "dark"
  const toggleTheme = () => setTheme(isDark ? "light" : "dark")
  const handleSignOut = async () => {
    try {
      await logout()
      setIsSidebarOpen(false)
      router.push('/')
    } catch {
    }
  }

  const SidebarContent = () => (
    <div className="flex h-full   flex-col bg-[var(--bg-surface)] px-5 py-6">
      <div className="space-y-6  ">
        <div className="space-y-3  ">
          <p className="text-xs-label text-[var(--text-muted)]">Preferences</p>
          <div className="flex h-11 items-center gap-12 justify-between rounded-[8px] px-2 transition-colors hover:bg-[var(--bg-elevated)]">
            <span className="text-base-body text-[var(--text-primary)]">Appearance</span>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className="relative flex h-9 w-[72px] items-center justify-between rounded-full border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-2 transition-colors hover:border-[var(--border-strong)]"
            >
              <span
                className={`absolute left-1 top-1 h-7 w-7 rounded-full bg-[var(--accent)] transition-transform duration-200 ${isDark ? "translate-x-[34px]" : "translate-x-0"}`}
              />
              <Sun className={`relative z-10 h-4 w-4 ${!isDark ? "text-white" : "text-[var(--text-muted)]"}`} />
              <Moon className={`relative z-10 h-4 w-4 ${isDark ? "text-white" : "text-[var(--text-muted)]"}`} />
            </button>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <p className="text-xs-label text-[var(--text-muted)]">Session</p>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm-body text-[var(--text-secondary)]">
              <Clock size={14} />
              Time per question
            </label>
            <Select value={countdownTime?.toString()} onValueChange={handleTimeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[1100]">
                <SelectItem value="10">10 seconds</SelectItem>
                <SelectItem value="15">15 seconds</SelectItem>
                <SelectItem value="20">20 seconds</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm-body text-[var(--text-secondary)]">
              <Sliders size={14} />
              Difficulty
            </label>
            <Select value={difficulty} onValueChange={changeDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent className="z-[1100]">
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6">
        <Separator />
        <button
          type="button"
          onClick={handleSignOut}
          className="mt-6 w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-base)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition hover:border-[var(--border-strong)] hover:bg-[var(--bg-elevated)]"
        >
          Sign out
        </button>
        <p className="mt-6 text-center text-xs text-[var(--text-muted)]">nexuset • v1.0</p>
      </div>
    </div>
  )

  return (
    <>
      <div className="sticky top-24 hidden px-4 min-h-[calc((100vh-64px)*0.9)] max-h-[calc((100vh-64px)*0.9)] self-start overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--bg-surface)] lg:flex">
        <SidebarContent />
      </div>

      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="right" className="lg:hidden p-0">
          <div className="flex h-full flex-col">
            <SheetHeader className="border-b border-[var(--border)] px-5 py-5">
              <SheetTitle>Settings</SheetTitle>
              <SheetCloseButton />
            </SheetHeader>
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default Sidebar
