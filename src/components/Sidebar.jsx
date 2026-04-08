"use client"
import { useShallow } from 'zustand/react/shallow'
import { Clock, Sliders, ListOrdered, Volume2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import useQuizStore from '@/stores/quizStore'
import useTimerStore from '@/stores/timerStore'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetCloseButton } from '@/components/ui/sheet'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

function Sidebar() {
  const { logout } = useAuth()
  const router = useRouter()

  const {
    difficulty,
    changeDifficulty,
    questionCount,
    setQuestionCount,
    autoPronounce,
    setAutoPronounce,
    isSidebarOpen,
    setIsSidebarOpen,
  } = useQuizStore(
    useShallow((state) => ({
      difficulty: state.difficulty,
      changeDifficulty: state.changeDifficulty,
      questionCount: state.questionCount,
      setQuestionCount: state.setQuestionCount,
      autoPronounce: state.autoPronounce,
      setAutoPronounce: state.setAutoPronounce,
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

  const handleSignOut = async () => {
    try {
      await logout()
      setIsSidebarOpen(false)
      router.push('/')
    } catch {
    }
  }

  const SidebarContent = () => (
    <div className="flex h-full w-full flex-col bg-[var(--bg-surface)] px-5 py-6">
      <div className="w-full space-y-6">
        <div className="w-full space-y-4">
          <p className="text-xs-label text-[var(--text-muted)]">Session</p>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm-body text-[var(--text-secondary)]">
              <Clock size={14} />
              Time per question
            </label>
            <Select value={countdownTime?.toString()} onValueChange={handleTimeChange}>
              <SelectTrigger className="px-4">
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
              <ListOrdered size={14} />
              Questions per session
            </label>
            <Select value={questionCount?.toString()} onValueChange={setQuestionCount}>
              <SelectTrigger className="px-4">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[1100]">
                <SelectItem value="10">10 questions</SelectItem>
                <SelectItem value="20">20 questions</SelectItem>
                <SelectItem value="30">30 questions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm-body text-[var(--text-secondary)]">
              <Sliders size={14} />
              Difficulty
            </label>
            <Select value={difficulty} onValueChange={changeDifficulty}>
              <SelectTrigger className="px-4">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent className="z-[1100]">
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex h-11 items-center justify-between rounded-[8px] border border-[var(--border)] bg-[var(--bg-elevated)] px-3">
            <span className="inline-flex items-center gap-2 text-sm-body text-[var(--text-secondary)]">
              <Volume2 size={14} />
              Auto pronounce
            </span>
            <Switch
              checked={autoPronounce}
              onCheckedChange={setAutoPronounce}
              aria-label="Toggle auto pronounce"
            />
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
        <p className="mt-6 text-center text-xs text-[var(--text-muted)]">nexuset • v0.1.1</p>
      </div>
    </div>
  )

  return (
    <>
      <div className="hidden w-[320px] shrink-0 px-4 min-h-[calc((100vh-64px)*0.9)] max-h-[calc((100vh-64px)*0.9)] overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--bg-surface)] lg:flex">
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
