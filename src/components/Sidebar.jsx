"use client"
import { useShallow } from 'zustand/react/shallow'
import { Clock, Sliders, ListOrdered, Volume2, LogOut } from 'lucide-react'
import { Switch } from "@/components/ui/switch"
import useQuizStore from '@/stores/quizStore'
import useTimerStore from '@/stores/timerStore'
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
    <div className="flex h-full w-full flex-col bg-white dark:bg-zinc-900 px-5 py-6">
      <div className="w-full space-y-6">
        <div className="w-full space-y-5">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-black bg-amber-400 shadow-[1px_1px_0px_#000000]">
              <Sliders className="h-3 w-3 text-black" />
            </span>
            <p className="font-fredoka text-xs font-black uppercase tracking-wider text-black dark:text-white">
              Quest Preferences
            </p>
          </div>

          {/* Time Per Question Selector Pills */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 font-fredoka text-xs font-bold text-zinc-700 dark:text-zinc-300">
              <Clock size={14} className="text-amber-500" />
              Time Per Word
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[10, 15, 20].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleTimeChange(t)}
                  className={`rounded-xl border-2 border-black py-2 font-fredoka text-xs font-black transition-all ${
                    countdownTime === t
                      ? "bg-amber-400 text-black shadow-[2px_2px_0px_#000000]"
                      : "bg-[#FAF6ED] dark:bg-zinc-800 text-black dark:text-white hover:bg-amber-100"
                  }`}
                >
                  {t}s
                </button>
              ))}
            </div>
          </div>

          {/* Question Count Selector Pills */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 font-fredoka text-xs font-bold text-zinc-700 dark:text-zinc-300">
              <ListOrdered size={14} className="text-amber-500" />
              Questions Per Session
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[10, 20, 30].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  className={`rounded-xl border-2 border-black py-2 font-fredoka text-xs font-black transition-all ${
                    questionCount === count
                      ? "bg-amber-400 text-black shadow-[2px_2px_0px_#000000]"
                      : "bg-[#FAF6ED] dark:bg-zinc-800 text-black dark:text-white hover:bg-amber-100"
                  }`}
                >
                  {count} Words
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Selector Pills */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 font-fredoka text-xs font-bold text-zinc-700 dark:text-zinc-300">
              <Sliders size={14} className="text-amber-500" />
              Challenge Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "easy", label: "Explorer", color: "bg-emerald-300" },
                { id: "medium", label: "Master", color: "bg-amber-300" },
                { id: "hard", label: "Champion", color: "bg-rose-300" },
              ].map((diff) => (
                <button
                  key={diff.id}
                  type="button"
                  onClick={() => changeDifficulty(diff.id)}
                  className={`rounded-xl border-2 border-black py-2 font-fredoka text-[11px] font-black uppercase transition-all ${
                    difficulty === diff.id
                      ? `${diff.color} text-black shadow-[2px_2px_0px_#000000]`
                      : "bg-[#FAF6ED] dark:bg-zinc-800 text-black dark:text-white hover:bg-zinc-200"
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>

          {/* Auto Pronounce Switch */}
          <div className="flex h-12 items-center justify-between rounded-2xl border-2 border-black bg-[#FAF6ED] dark:bg-zinc-800 px-3.5 shadow-[2px_2px_0px_#000000]">
            <span className="inline-flex items-center gap-2 font-fredoka text-xs font-black text-black dark:text-white">
              <Volume2 size={15} className="text-amber-500" />
              Auto-Speak Word
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
        <div className="border-t-2 border-black/10 dark:border-white/10 mb-4" />
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-black bg-rose-200 hover:bg-rose-300 text-black px-4 py-2.5 font-fredoka text-xs font-black uppercase shadow-[2px_2px_0px_#000000] transition-all active:translate-x-[1px] active:translate-y-[1px]"
        >
          <LogOut size={14} />
          Sign Out
        </button>
        <p className="mt-3 text-center font-fredoka text-[11px] font-bold text-zinc-500">
          nexuset v0.1.1 · Adventure Mode
        </p>
      </div>
    </div>
  )

  return (
    <>
      <div className="hidden w-[310px] shrink-0 min-h-[calc((100dvh-72px)*0.92)] max-h-[calc((100dvh-72px)*0.92)] overflow-hidden rounded-[32px] border-[2.5px] border-black bg-white dark:bg-zinc-900 shadow-[5px_5px_0px_#000000] dark:shadow-[5px_5px_0px_#3f3f46] lg:flex">
        <SidebarContent />
      </div>

      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="right" className="lg:hidden p-0 bg-white dark:bg-zinc-900 border-l-2 border-black">
          <div className="flex h-full flex-col">
            <SheetHeader className="border-b-2 border-black px-5 py-4">
              <SheetTitle className="text-left font-fredoka text-xl font-black text-black dark:text-white">
                Quest Preferences
              </SheetTitle>
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
