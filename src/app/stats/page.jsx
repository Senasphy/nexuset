"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, Flame, Target, Trophy, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { fetchUserSessions } from "@/lib/sessionAnalytics"
import ShimmerText from "@/components/kokonutui/shimmer-text"
import WeekdayMinutesChart from "@/components/WeekdayMinutesChart"
import ThemeToggle from "@/components/ThemeToggle"

const formatDayKey = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const shortDay = (date) => date.toLocaleDateString(undefined, { weekday: "short" })
const shortDate = (date) => date.toLocaleDateString(undefined, { month: "short", day: "numeric" })

const clampPercent = (value) => Math.max(0, Math.min(100, value))
const formatDurationFromSeconds = (seconds) => {
  const safeSeconds = Math.max(0, Math.round(seconds || 0))
  if (safeSeconds < 60) return `${safeSeconds}s`
  return `${(safeSeconds / 60).toFixed(1)}m`
}
const formatDurationFromMinutes = (minutes) => formatDurationFromSeconds((Number(minutes) || 0) * 60)

const buildSparklinePath = (values, width, height) => {
  if (!values.length) return ""
  const maxValue = Math.max(...values, 1)
  const stepX = values.length > 1 ? width / (values.length - 1) : width
  return values
    .map((value, index) => {
      const x = index * stepX
      const y = height - (value / maxValue) * height
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(" ")
}

export default function Stats() {
  const { user, username, loading: authLoading } = useAuth()
  const [sessions, setSessions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadSessions = async () => {
      if (!user?.uid || user.uid === "guest") {
        if (isMounted) {
          setSessions([])
          setIsLoading(false)
        }
        return
      }

      setIsLoading(true)
      try {
        const rows = await fetchUserSessions(user.uid, 300)
        if (isMounted) setSessions(rows)
      } catch {
        if (isMounted) setSessions([])
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadSessions()
    return () => {
      isMounted = false
    }
  }, [user?.uid])

  const analytics = useMemo(() => {
    const normalized = sessions
      .map((session) => {
        const dateValue = session.endedAt || session.startedAt || (session.createdAtMs ? new Date(session.createdAtMs).toISOString() : null)
        const parsedDate = dateValue ? new Date(dateValue) : null
        return {
          ...session,
          parsedDate,
          category: session.category || "general",
          difficulty: session.difficulty || "easy",
          totalQuestions: Math.max(0, Number(session.totalQuestions) || 0),
          timeSpentSeconds: Math.max(0, Math.round(Number(session.timeSpentSeconds) || Math.round((Number(session.timeSpentMinutes) || 0) * 60))),
        }
      })
      .filter((item) => item.parsedDate && !Number.isNaN(item.parsedDate.getTime()))
      .filter((item) => item.timeSpentSeconds >= 30)
      .map((item) => {
        const correctAnswers = Math.min(Math.max(Number(item.correctAnswers) || 0, 0), item.totalQuestions)
        const accuracy = item.totalQuestions ? clampPercent(Math.round((correctAnswers / item.totalQuestions) * 100)) : 0
        return {
          ...item,
          correctAnswers,
          timeSpentMinutes: Number((item.timeSpentSeconds / 60).toFixed(2)),
          accuracy,
        }
      })
      .sort((a, b) => b.parsedDate.getTime() - a.parsedDate.getTime())

    const totalSessions = normalized.length
    const totalQuestions = normalized.reduce((sum, item) => sum + item.totalQuestions, 0)
    const totalCorrect = normalized.reduce((sum, item) => sum + item.correctAnswers, 0)
    const totalMinutes = normalized.reduce((sum, item) => sum + item.timeSpentMinutes, 0)
    const overallAccuracy = totalQuestions ? clampPercent(Math.round((totalCorrect / totalQuestions) * 100)) : 0
    const avgMinutes = totalSessions ? totalMinutes / totalSessions : 0
    const bestAccuracy = normalized.length ? Math.max(...normalized.map((s) => s.accuracy)) : 0

    const categoryMap = new Map()
    const difficultyMap = new Map()
    const weekdayMinutes = new Array(7).fill(0)

    normalized.forEach((session) => {
      const existingCategory = categoryMap.get(session.category) || { sessions: 0, minutes: 0, correct: 0, total: 0 }
      categoryMap.set(session.category, {
        sessions: existingCategory.sessions + 1,
        minutes: existingCategory.minutes + session.timeSpentMinutes,
        correct: existingCategory.correct + session.correctAnswers,
        total: existingCategory.total + session.totalQuestions,
      })

      difficultyMap.set(session.difficulty, (difficultyMap.get(session.difficulty) || 0) + 1)

      const weekday = session.parsedDate.getDay()
      weekdayMinutes[weekday] += session.timeSpentMinutes
    })

    const categories = Array.from(categoryMap.entries())
      .map(([name, value]) => ({
        name,
        ...value,
        accuracy: value.total ? clampPercent(Math.round((value.correct / value.total) * 100)) : 0,
      }))
      .sort((a, b) => b.sessions - a.sessions)

    const difficultyTotal = Array.from(difficultyMap.values()).reduce((sum, val) => sum + val, 0) || 1
    const difficulties = ["easy", "medium", "hard"].map((name) => {
      const count = difficultyMap.get(name) || 0
      return {
        name,
        count,
        share: Math.round((count / difficultyTotal) * 100),
      }
    })

    const days = [...Array(14)].map((_, index) => {
      const date = new Date()
      date.setHours(0, 0, 0, 0)
      date.setDate(date.getDate() - (13 - index))
      return date
    })

    const dayMap = new Map(days.map((date) => [formatDayKey(date), { minutes: 0, sessions: 0, correct: 0, total: 0 }]))
    normalized.forEach((session) => {
      const key = formatDayKey(session.parsedDate)
      if (!dayMap.has(key)) return
      const current = dayMap.get(key)
      dayMap.set(key, {
        minutes: current.minutes + session.timeSpentMinutes,
        sessions: current.sessions + 1,
        correct: current.correct + session.correctAnswers,
        total: current.total + session.totalQuestions,
      })
    })

    const daily = days.map((date) => {
      const key = formatDayKey(date)
      const stats = dayMap.get(key)
      return {
        key,
        label: shortDay(date),
        dateLabel: shortDate(date),
        minutes: stats.minutes,
        sessions: stats.sessions,
        accuracy: stats.total ? clampPercent(Math.round((stats.correct / stats.total) * 100)) : 0,
      }
    })

    const sparklineValues = daily.map((d) => d.minutes)
    const sparklinePath = buildSparklinePath(sparklineValues, 560, 120)

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const activeDaySet = new Set(normalized.map((s) => formatDayKey(s.parsedDate)))
    let streak = 0
    for (let i = 0; i < 365; i += 1) {
      const current = new Date(today)
      current.setDate(today.getDate() - i)
      const key = formatDayKey(current)
      if (activeDaySet.has(key)) streak += 1
      else break
    }

    return {
      normalized,
      totalSessions,
      totalQuestions,
      totalCorrect,
      totalMinutes,
      avgMinutes,
      overallAccuracy,
      bestAccuracy,
      categories,
      difficulties,
      daily,
      sparklinePath,
      weekdayMinutes,
      streak,
    }
  }, [sessions])

  const loading = authLoading || isLoading
  const hasData = analytics.totalSessions > 0
  const ringDeg = Math.max(0, Math.min(360, Math.round((analytics.overallAccuracy / 100) * 360)))

  return (
    <div className="min-h-[100dvh] bg-[#FAF6ED] dark:bg-zinc-950 text-black dark:text-white pb-16">
      {/* Floating Pill Capsule Header */}
      <header className="sticky top-3 z-sticky px-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border-2 border-black bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-5 py-2.5 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#3f3f46]">
          <Link href="/" className="group flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-amber-400 text-black shadow-[2px_2px_0px_#000000] transition-transform group-hover:rotate-12">
              <span className="font-fredoka text-sm font-black">N</span>
            </div>
            <span className="font-fredoka text-xl font-black tracking-tight text-black dark:text-white">
              nexus<span className="text-amber-500">et</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/categories"
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-amber-400 px-4 py-1.5 font-fredoka text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000000] hover:bg-amber-300 transition-all active:translate-x-[1px] active:translate-y-[1px]"
            >
              <ArrowLeft className="h-4 w-4" />
              Practice Quests
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-6">
        
        {/* Hero Achievement Hub Card */}
        <section className="relative overflow-hidden rounded-[32px] border-[2.5px] border-black bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#3f3f46]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-amber-400 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_#000000]">
                <Trophy className="h-3.5 w-3.5" />
                Spelling Trophy Room
              </div>
              <h1 className="mt-3 font-fredoka text-[clamp(2.2rem,4.5vw,3.2rem)] font-black text-black dark:text-white uppercase tracking-wide leading-tight">
                {username ? `${username}'s Achievements` : "Spelling Journal"}
              </h1>
              <p className="mt-1 font-fredoka text-base font-semibold text-zinc-600 dark:text-zinc-300">
                Track your active streaks, accuracy milestones, and category mastery over time!
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/categories">
                <Button variant="primary" className="h-12 px-7 text-sm font-black shadow-[3px_3px_0px_#000000]">
                  Start Another Quest <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* 4 Chunky Pill Stat Blocks (Matching Reference Screenshot Style) */}
          <div className="relative mt-8 grid gap-4 border-t-2 border-black/10 dark:border-white/10 pt-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border-2 border-black bg-emerald-300 p-4 shadow-[3px_3px_0px_#000000]">
              <span className="font-fredoka text-xs font-black uppercase text-black">Active Streak</span>
              <p className="mt-1 flex items-center gap-2 font-fredoka text-3xl font-black text-black">
                <Flame className="h-7 w-7 text-amber-700 fill-amber-500 animate-pulse" />
                {analytics.streak} {analytics.streak === 1 ? "Day" : "Days"}
              </p>
            </div>

            <div className="rounded-2xl border-2 border-black bg-amber-300 p-4 shadow-[3px_3px_0px_#000000]">
              <span className="font-fredoka text-xs font-black uppercase text-black">Overall Accuracy</span>
              <p className="mt-1 font-fredoka text-3xl font-black text-black">
                {analytics.overallAccuracy}%
              </p>
            </div>

            <div className="rounded-2xl border-2 border-black bg-sky-300 p-4 shadow-[3px_3px_0px_#000000]">
              <span className="font-fredoka text-xs font-black uppercase text-black">Words Mastered</span>
              <p className="mt-1 font-fredoka text-3xl font-black text-black">
                {analytics.totalQuestions}
              </p>
            </div>

            <div className="rounded-2xl border-2 border-black bg-purple-300 p-4 shadow-[3px_3px_0px_#000000]">
              <span className="font-fredoka text-xs font-black uppercase text-black">Practice Time</span>
              <p className="mt-1 font-fredoka text-3xl font-black text-black">
                {formatDurationFromMinutes(analytics.totalMinutes)}
              </p>
            </div>
          </div>
        </section>

        {loading && (
          <section className="py-16 text-center">
            <ShimmerText text="Loading your trophies & quests..." className="font-fredoka text-2xl font-black" />
          </section>
        )}

        {!loading && !hasData && (
          <section className="mt-8 rounded-[32px] border-[2.5px] border-black bg-white dark:bg-zinc-900 p-12 text-center shadow-[5px_5px_0px_#000000]">
            <CalendarDays className="mx-auto h-12 w-12 text-amber-500" />
            <h2 className="mt-4 font-fredoka text-2xl sm:text-3xl font-black text-black dark:text-white uppercase">
              No Quests Completed Yet!
            </h2>
            <p className="mx-auto mt-2 max-w-md font-fredoka text-base font-semibold text-zinc-600 dark:text-zinc-300">
              Jump into any category, spell a few words, and watch your badges and stats come alive here!
            </p>
            <div className="mt-6">
              <Link href="/categories">
                <Button variant="primary" className="h-11 px-8 text-sm font-black shadow-[3px_3px_0px_#000000]">
                  Start First Quest 🚀
                </Button>
              </Link>
            </div>
          </section>
        )}

        {!loading && hasData && (
          <>
            {/* 2-Column Section: 14-Day Activity Wave & Precision Dial */}
            <section className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
              <div className="rounded-[32px] border-[2.5px] border-black bg-white dark:bg-zinc-900 p-6 sm:p-7 shadow-[5px_5px_0px_#000000] dark:shadow-[5px_5px_0px_#3f3f46]">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <span className="rounded-full border border-black bg-amber-400 px-2.5 py-0.5 font-fredoka text-[10px] font-black uppercase text-black">
                      Activity Wave
                    </span>
                    <h2 className="mt-1.5 font-fredoka text-2xl font-black text-black dark:text-white uppercase">
                      Practice Intensity
                    </h2>
                  </div>
                  <p className="font-fredoka text-xs font-bold text-zinc-500">Last 14 Days</p>
                </div>

                <div className="rounded-2xl border-2 border-black bg-[#FAF6ED] dark:bg-zinc-800 p-4 shadow-[2px_2px_0px_#000000]">
                  <svg viewBox="0 0 560 140" className="w-full">
                    <defs>
                      <linearGradient id="waveFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>
                    <path d={`M 0 120 ${analytics.sparklinePath} L 560 120`} fill="url(#waveFill)" />
                    <path d={analytics.sparklinePath} fill="none" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </div>

                <div className="mt-4 grid grid-cols-7 gap-2 text-center">
                  {analytics.daily.slice(-7).map((day) => (
                    <div key={day.key} className="rounded-xl border border-black bg-white dark:bg-zinc-800 p-2 shadow-[1px_1px_0px_#000000]">
                      <p className="font-fredoka text-[11px] font-black uppercase text-zinc-500">{day.label}</p>
                      <p className="font-fredoka text-xs font-black text-black dark:text-white">{formatDurationFromMinutes(day.minutes)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Precision Dial */}
              <div className="flex flex-col justify-between rounded-[32px] border-[2.5px] border-black bg-white dark:bg-zinc-900 p-6 sm:p-7 shadow-[5px_5px_0px_#000000] dark:shadow-[5px_5px_0px_#3f3f46]">
                <div>
                  <span className="rounded-full border border-black bg-emerald-300 px-2.5 py-0.5 font-fredoka text-[10px] font-black uppercase text-black">
                    Accuracy Meter
                  </span>
                  <h2 className="mt-1.5 font-fredoka text-2xl font-black text-black dark:text-white uppercase">
                    Precision Dial
                  </h2>
                </div>

                <div className="mx-auto my-4 grid h-44 w-44 place-items-center rounded-full border-4 border-black shadow-[4px_4px_0px_#000000]" style={{ background: `conic-gradient(#10B981 ${ringDeg}deg, #F3EBD8 ${ringDeg}deg)` }}>
                  <div className="grid h-32 w-32 place-items-center rounded-full border-2 border-black bg-white dark:bg-zinc-800">
                    <p className="font-fredoka text-3xl font-black text-black dark:text-white">{analytics.overallAccuracy}%</p>
                  </div>
                </div>

                <div className="space-y-2 rounded-2xl border-2 border-black bg-[#FAF6ED] dark:bg-zinc-800 p-3.5 shadow-[2px_2px_0px_#000000]">
                  <div className="flex items-center justify-between font-fredoka text-xs font-bold">
                    <span className="inline-flex items-center gap-1.5">
                      <Trophy className="h-4 w-4 text-amber-500" />
                      Best Run:
                    </span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400">{analytics.bestAccuracy}%</span>
                  </div>
                  <div className="flex items-center justify-between font-fredoka text-xs font-bold">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 className="h-4 w-4 text-amber-500" />
                      Average Session:
                    </span>
                    <span className="font-black">{formatDurationFromMinutes(analytics.avgMinutes)}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Category Strength & Weekly Pattern */}
            <section className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
              <div className="rounded-[32px] border-[2.5px] border-black bg-white dark:bg-zinc-900 p-6 sm:p-7 shadow-[5px_5px_0px_#000000] dark:shadow-[5px_5px_0px_#3f3f46]">
                <h3 className="font-fredoka text-2xl font-black text-black dark:text-white uppercase">
                  Category Mastery
                </h3>
                <p className="mt-1 font-fredoka text-xs font-bold text-zinc-500">Words learned across subjects</p>

                <div className="mt-5 space-y-4">
                  {analytics.categories.slice(0, 6).map((category) => {
                    const width = Math.max(8, category.accuracy)
                    return (
                      <div key={category.name} className="rounded-2xl border-2 border-black bg-[#FAF6ED] dark:bg-zinc-800 p-3.5 shadow-[2px_2px_0px_#000000]">
                        <div className="flex items-center justify-between font-fredoka text-sm font-black capitalize">
                          <span>{category.name}</span>
                          <span className="text-amber-600 dark:text-amber-400">{category.accuracy}% Accuracy</span>
                        </div>
                        <div className="mt-2 h-3.5 w-full rounded-full border-2 border-black bg-zinc-200 overflow-hidden shadow-[1px_1px_0px_#000000]">
                          <div className="h-full bg-amber-400" style={{ width: `${width}%` }} />
                        </div>
                        <p className="mt-1.5 font-fredoka text-xs font-bold text-zinc-600 dark:text-zinc-400">
                          {category.sessions} Quests completed • {formatDurationFromMinutes(category.minutes)} practiced
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Weekly Pattern Card */}
              <div className="rounded-[32px] border-[2.5px] border-black bg-white dark:bg-zinc-900 p-6 sm:p-7 shadow-[5px_5px_0px_#000000] dark:shadow-[5px_5px_0px_#3f3f46]">
                <h3 className="font-fredoka text-2xl font-black text-black dark:text-white uppercase">
                  Weekly Habit
                </h3>
                <p className="mt-1 font-fredoka text-xs font-bold text-zinc-500">Minutes practiced per day</p>

                <WeekdayMinutesChart weekdayMinutes={analytics.weekdayMinutes} />

                <div className="mt-6 border-t-2 border-black/10 dark:border-white/10 pt-4">
                  <p className="font-fredoka text-xs font-black uppercase text-zinc-500 mb-2">Challenge Mix</p>
                  <div className="grid grid-cols-3 gap-2">
                    {analytics.difficulties.map((diff) => (
                      <div key={diff.name} className="rounded-xl border-2 border-black bg-[#FAF6ED] dark:bg-zinc-800 p-2 text-center shadow-[1px_1px_0px_#000000]">
                        <p className="font-fredoka text-[10px] font-black uppercase text-zinc-500">{diff.name}</p>
                        <p className="font-fredoka text-base font-black">{diff.share}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Recent Sessions List */}
            <section className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-fredoka text-2xl font-black text-black dark:text-white uppercase">
                  Recent Quest Runs
                </h3>
                <p className="font-fredoka text-xs font-bold text-zinc-500">Last completions</p>
              </div>

              <div className="space-y-3">
                {analytics.normalized.slice(0, 8).map((session) => (
                  <div
                    key={session.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-black bg-white dark:bg-zinc-900 px-5 py-3.5 shadow-[3px_3px_0px_#000000] hover:-translate-y-0.5 transition-transform"
                  >
                    <div>
                      <span className="font-fredoka text-base font-black capitalize text-black dark:text-white">
                        {session.category} Quest
                      </span>
                      <p className="font-fredoka text-xs font-semibold text-zinc-500">
                        {session.parsedDate.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="rounded-xl border-2 border-black bg-[#FAF6ED] dark:bg-zinc-800 px-3 py-1 font-fredoka text-xs font-black">
                        {session.correctAnswers} / {session.totalQuestions} Words
                      </span>
                      <span className="rounded-xl border-2 border-black bg-amber-300 px-3 py-1 font-fredoka text-xs font-black text-black">
                        {formatDurationFromSeconds(session.timeSpentSeconds)}
                      </span>
                      <span className="rounded-xl border-2 border-black bg-emerald-300 px-3 py-1 font-fredoka text-xs font-black text-black">
                        {session.accuracy}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

      </main>
    </div>
  )
}
