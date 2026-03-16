"use client"
import React from 'react'
import { useShallow } from 'zustand/react/shallow'
import useQuizStore from '@/stores/quizStore'
import useScoreStore from '@/stores/scoreStore'
import {useAuth} from '@/context/AuthContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetCloseButton } from '@/components/ui/sheet'

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

  const {username, user} = useAuth();
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
  const avatarUrl = user?.photoURL || user?.providerData?.[0]?.photoURL || ""
  const displayName = username || user?.displayName || user?.email?.split('@')[0] || "User"
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "US"
  const progressValue = totalQuestions ? (index / totalQuestions) * 100 : 0

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-[var(--bg-surface)] px-5 py-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <p className="text-xs-label text-[var(--text-muted)]">Profile</p>
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11">
              <AvatarImage src={avatarUrl} alt={displayName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-base-body text-[var(--text-primary)]">{displayName}</p>
              <p className="text-sm-body text-[var(--text-secondary)]">Active session</p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <p className="text-xs-label text-[var(--text-muted)]">Session stats</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs-label text-[var(--text-muted)]">Correct</p>
              <p className="text-2xl-stat text-[var(--correct)]">
                {currentScore}
              </p>
            </div>
            <div>
              <p className="text-xs-label text-[var(--text-muted)]">Wrong</p>
              <p className="text-2xl-stat text-[var(--wrong)]">
                {Math.max(0, index - currentScore)}
              </p>
            </div>
            <div>
              <p className="text-xs-label text-[var(--text-muted)]">Accuracy</p>
              <p className="text-2xl-stat text-[var(--text-primary)]">
                {index === 0 ? "—" : `${accuracy}%`}
              </p>
            </div>
            <div>
              <p className="text-xs-label text-[var(--text-muted)]">Completed</p>
              <p className="text-2xl-stat text-[var(--text-primary)]">
                {index}
              </p>
            </div>
          </div>
          <Progress value={progressValue} className="h-1" />
        </div>

        <Separator />

        <div className="space-y-4">
          <p className="text-xs-label text-[var(--text-muted)]">Shortcuts</p>
          <div className="space-y-2 text-sm-body text-[var(--text-secondary)]">
            {[
              { action: "Skip question", key: "→" },
              { action: "Previous question", key: "←" },
              { action: "Focus input", key: "/" },
            ].map((item) => (
              <div key={item.action} className="flex items-center justify-between">
                <span>{item.action}</span>
                <kbd className="rounded-[8px] border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-1 font-mono text-[0.75rem] text-[var(--text-primary)]">
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
      <div className="sticky top-16 hidden w-[320px] max-h-[calc((100vh-64px)*0.9)] flex-col rounded-[12px] border border-[var(--border)] bg-[var(--bg-surface)] lg:flex overflow-y-auto">
        <SidebarContent />
      </div>

      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="right" className="lg:hidden p-0">
          <div className="flex h-full flex-col">
            <SheetHeader className="border-b border-[var(--border)] px-5 py-5">
              <SheetTitle>Session</SheetTitle>
              <SheetCloseButton />
            </SheetHeader>
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
