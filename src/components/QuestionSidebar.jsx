"use client"
import React from 'react'
import { useShallow } from 'zustand/react/shallow'
import useQuizStore from '@/stores/quizStore'
import useScoreStore from '@/stores/scoreStore'
import { useAuth } from '@/context/AuthContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetCloseButton } from '@/components/ui/sheet'
import { Trophy, Zap } from 'lucide-react'

export default function QuestionSidebar({ totalQuestions = 30 }) {
  const {
    index,
    isSidebarOpen,
    setIsSidebarOpen,
  } = useQuizStore(
    useShallow((s) => ({
      index: s.index,
      isSidebarOpen: s.isSidebarOpen,
      setIsSidebarOpen: s.setIsSidebarOpen,
    }))
  )

  const { username, user } = useAuth();
  const { currentScore } = useScoreStore(useShallow((s) => ({
    currentScore: s.currentScore
  })))

  const calculateAccuracy = () => {
    if (index === 0) return 0;
    const acc = Math.round((currentScore / index) * 100);
    return acc > 100 ? 100 : acc;
  }

  const accuracy = calculateAccuracy();
  const avatarUrl = user?.photoURL || user?.providerData?.[0]?.photoURL || ""
  const displayName = username || user?.displayName || user?.email?.split('@')[0] || "Learner"
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "SP"
  const progressValue = totalQuestions ? (index / totalQuestions) * 100 : 0

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-white dark:bg-zinc-900 px-5 py-6">
      <div className="space-y-6">
        {/* User Card */}
        <div className="rounded-2xl border-2 border-black bg-[#FAF6ED] dark:bg-zinc-800 p-3.5 shadow-[2px_2px_0px_#000000]">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 border-2 border-black shadow-[2px_2px_0px_#000000]">
              <AvatarImage src={avatarUrl} alt={displayName} />
              <AvatarFallback className="bg-amber-300 font-fredoka font-black text-black">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-fredoka text-sm font-black text-black dark:text-white leading-tight">{displayName}</p>
              <p className="font-fredoka text-[11px] font-bold text-amber-600 dark:text-amber-400">Spelling Quest Active</p>
            </div>
          </div>
        </div>

        {/* Live Session Counters (Matching screenshot's 4-box layout) */}
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <Trophy className="h-4 w-4 text-amber-500" />
            <p className="font-fredoka text-xs font-black uppercase tracking-wider text-black dark:text-white">
              Live Session Stats
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-2xl border-2 border-black bg-emerald-300 p-3 shadow-[2px_2px_0px_#000000]">
              <p className="font-fredoka text-[10px] font-black uppercase text-black">Correct</p>
              <p className="font-fredoka text-2xl font-black text-black">{currentScore}</p>
            </div>
            <div className="rounded-2xl border-2 border-black bg-rose-200 p-3 shadow-[2px_2px_0px_#000000]">
              <p className="font-fredoka text-[10px] font-black uppercase text-black">Missed</p>
              <p className="font-fredoka text-2xl font-black text-black">{Math.max(0, index - currentScore)}</p>
            </div>
            <div className="rounded-2xl border-2 border-black bg-amber-300 p-3 shadow-[2px_2px_0px_#000000]">
              <p className="font-fredoka text-[10px] font-black uppercase text-black">Accuracy</p>
              <p className="font-fredoka text-2xl font-black text-black">{index === 0 ? "—" : `${accuracy}%`}</p>
            </div>
            <div className="rounded-2xl border-2 border-black bg-sky-200 p-3 shadow-[2px_2px_0px_#000000]">
              <p className="font-fredoka text-[10px] font-black uppercase text-black">Completed</p>
              <p className="font-fredoka text-2xl font-black text-black">{index} / {totalQuestions}</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-[11px] font-fredoka font-black mb-1">
              <span>Progress</span>
              <span>{Math.round(progressValue)}%</span>
            </div>
            <div className="h-3 w-full rounded-full border-2 border-black bg-zinc-100 overflow-hidden shadow-[1px_1px_0px_#000000]">
              <div
                className="h-full bg-amber-400 transition-all duration-300"
                style={{ width: `${progressValue}%` }}
              />
            </div>
          </div>
        </div>

        {/* Shortcuts */}
        <div className="rounded-2xl border-2 border-black bg-white dark:bg-zinc-800 p-4 shadow-[2px_2px_0px_#000000]">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <p className="font-fredoka text-xs font-black uppercase tracking-wider text-black dark:text-white">
              Quick Shortcuts
            </p>
          </div>
          <div className="space-y-2 font-fredoka text-xs font-semibold text-zinc-600 dark:text-zinc-300">
            {[
              { action: "Next Word", key: "→" },
              { action: "Previous Word", key: "←" },
              { action: "Submit Answer", key: "Enter" },
            ].map((item) => (
              <div key={item.action} className="flex items-center justify-between">
                <span>{item.action}</span>
                <kbd className="rounded-lg border-2 border-black bg-amber-200 px-2 py-0.5 font-fredoka text-[11px] font-black text-black shadow-[1px_1px_0px_#000000]">
                  {item.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div className="sticky top-20 hidden w-[310px] max-h-[calc((100dvh-80px)*0.92)] flex-col rounded-[32px] border-[2.5px] border-black bg-white dark:bg-zinc-900 shadow-[5px_5px_0px_#000000] dark:shadow-[5px_5px_0px_#3f3f46] lg:flex overflow-y-auto">
        <SidebarContent />
      </div>

      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="right" className="lg:hidden p-0 bg-white dark:bg-zinc-900 border-l-2 border-black">
          <div className="flex h-full flex-col">
            <SheetHeader className="border-b-2 border-black px-5 py-4">
              <SheetTitle className="font-fredoka text-xl font-black text-black dark:text-white">Session Dashboard</SheetTitle>
              <SheetCloseButton />
            </SheetHeader>
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
