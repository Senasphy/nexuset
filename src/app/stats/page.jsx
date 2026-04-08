"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, Flame, Target, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { fetchUserSessions } from "@/lib/sessionAnalytics"
import ShimmerText from "@/components/kokonutui/shimmer-text"
import WeekdayMinutesChart from "@/components/WeekdayMinutesChart"

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
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <div className="mx-auto w-full max-w-6xl px-6 pb-16 pt-10">
        <section className="relative overflow-hidden rounded-[24px] border border-[var(--border)] bg-[linear-gradient(130deg,var(--bg-surface)_0%,var(--accent-subtle)_100%)] p-8">
          <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[var(--accent)]/15 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-14 left-1/3 h-44 w-44 rounded-full bg-[var(--correct)]/10 blur-2xl" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs-label text-[var(--text-secondary)]">Performance Journal</p>
              <h1 className="mt-2 text-3xl-display">
                {username ? `${username}'s Progress` : "Your Progress"}
              </h1>
              <p className="mt-2 max-w-xl text-base-body text-[var(--text-secondary)]">
                Review accuracy, session intensity, and category depth from your saved practice history.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/categories">
                <Button variant="secondary" className="h-11 rounded-[10px] px-6">
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
              </Link>
              <Link href="/categories">
                <Button variant="primary" className="h-11 rounded-[10px] px-6">
                  Start Another Session <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative mt-8 grid gap-6 border-t border-[var(--border)]/70 pt-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs-label text-[var(--text-muted)]">Sessions</p>
              <p className="mt-2 font-display text-[2rem] leading-none">{analytics.totalSessions}</p>
            </div>
            <div>
              <p className="text-xs-label text-[var(--text-muted)]">Focus Time</p>
              <p className="mt-2 font-display text-[2rem] leading-none">{formatDurationFromMinutes(analytics.totalMinutes)}</p>
            </div>
            <div>
              <p className="text-xs-label text-[var(--text-muted)]">Questions Solved</p>
              <p className="mt-2 font-display text-[2rem] leading-none">{analytics.totalQuestions}</p>
            </div>
            <div>
              <p className="text-xs-label text-[var(--text-muted)]">Daily Streak</p>
              <p className="mt-2 flex items-center gap-2 font-display text-[2rem] leading-none">
                <Flame className="h-7 w-7 text-[var(--accent)]" />
                {analytics.streak}
              </p>
            </div>
          </div>
        </section>

        {loading && (
          <section className="py-16 text-center">
            <ShimmerText text="Loading your stats..." className="text-2xl" />
          </section>
        )}

        {!loading && !hasData && (
          <section className="mt-12 rounded-[20px] border border-dashed border-[var(--border-strong)] bg-[var(--bg-surface)] p-12 text-center">
            <CalendarDays className="mx-auto h-8 w-8 text-[var(--text-muted)]" />
            <h2 className="mt-4 text-2xl-display">No Saved Sessions Yet</h2>
            <p className="mx-auto mt-2 max-w-lg text-base-body text-[var(--text-secondary)]">
              Complete a category session to start building your learning timeline and performance visuals.
            </p>
          </section>
        )}

        {!loading && hasData && (
          <>
            <section className="mt-10 grid gap-8 lg:grid-cols-[2fr_1fr]">
              <div className="rounded-[20px] border border-[var(--border)] bg-[var(--bg-surface)] p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs-label text-[var(--text-muted)]">Last 14 Days</p>
                    <h2 className="text-xl-ui">Activity Wave</h2>
                  </div>
                  <p className="text-sm-body text-[var(--text-secondary)]">Time per day</p>
                </div>
                <svg viewBox="0 0 560 150" className="w-full">
                  <defs>
                    <linearGradient id="waveFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.03" />
                    </linearGradient>
                  </defs>
                  <path d={`M 0 120 ${analytics.sparklinePath} L 560 120`} fill="url(#waveFill)" />
                  <path d={analytics.sparklinePath} fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <div className="mt-3 grid grid-cols-7 gap-2 text-center">
                  {analytics.daily.slice(-7).map((day) => (
                    <div key={day.key}>
                      <p className="text-xs-label text-[var(--text-muted)]">{day.label}</p>
                      <p className="text-sm-body text-[var(--text-secondary)]">{formatDurationFromMinutes(day.minutes)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-[20px] border border-[var(--border)] bg-[var(--bg-surface)] p-6">
                <div>
                  <p className="text-xs-label text-[var(--text-muted)]">Overall Accuracy</p>
                  <h2 className="text-xl-ui">Precision Dial</h2>
                </div>
                <div className="mx-auto mt-4 grid h-44 w-44 place-items-center rounded-full" style={{ background: `conic-gradient(var(--correct) ${ringDeg}deg, var(--bg-elevated) ${ringDeg}deg)` }}>
                  <div className="grid h-32 w-32 place-items-center rounded-full bg-[var(--bg-surface)]">
                    <p className="font-display text-[2.2rem] leading-none">{analytics.overallAccuracy}%</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="flex items-center justify-between text-sm-body text-[var(--text-secondary)]">
                    <span className="inline-flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-[var(--accent)]" />
                      Best Session
                    </span>
                    <span>{analytics.bestAccuracy}%</span>
                  </p>
                  <p className="flex items-center justify-between text-sm-body text-[var(--text-secondary)]">
                    <span className="inline-flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-[var(--accent)]" />
                      Avg Session Time
                    </span>
                    <span>{formatDurationFromMinutes(analytics.avgMinutes)}</span>
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <div className="mb-4 flex items-end justify-between">
                  <h3 className="text-xl-ui">Category Strength</h3>
                  <p className="text-sm-body text-[var(--text-secondary)]">Accuracy and minutes by category</p>
                </div>
                <div className="space-y-4">
                  {analytics.categories.slice(0, 6).map((category) => {
                    const width = Math.max(8, category.accuracy)
                    return (
                      <div key={category.name}>
                        <div className="mb-1 flex items-center justify-between">
                          <p className="text-base-body capitalize">{category.name}</p>
                          <p className="text-sm-body text-[var(--text-secondary)]">{category.accuracy}% accuracy</p>
                        </div>
                        <div className="h-2 rounded-full bg-[var(--bg-elevated)]">
                          <div className="h-2 rounded-full bg-[var(--accent)]" style={{ width: `${width}%` }} />
                        </div>
                        <p className="mt-1 text-sm-body text-[var(--text-muted)]">
                          {category.sessions} sessions • {formatDurationFromMinutes(category.minutes)}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="rounded-[20px] border border-[var(--border)] bg-[var(--bg-surface)] p-6">
                <h3 className="text-xl-ui">Difficulty Mix</h3>
                <div className="mt-5 space-y-4">
                  {analytics.difficulties.map((difficulty) => (
                    <div key={difficulty.name}>
                      <div className="mb-1 flex items-center justify-between">
                        <p className="text-base-body capitalize">{difficulty.name}</p>
                        <p className="text-sm-body text-[var(--text-secondary)]">{difficulty.share}%</p>
                      </div>
                      <div className="h-2 rounded-full bg-[var(--bg-elevated)]">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${difficulty.share}%`,
                            background: difficulty.name === "hard" ? "var(--wrong)" : difficulty.name === "medium" ? "var(--accent)" : "var(--correct)",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <h4 className="mt-8 text-sm-body text-[var(--text-secondary)]">Weekly Minute Pattern</h4>
                <WeekdayMinutesChart weekdayMinutes={analytics.weekdayMinutes} />
              </div>
            </section>

            <section className="mt-12">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl-ui">Recent Sessions</h3>
                <p className="text-sm-body text-[var(--text-secondary)]">Most recent completions</p>
              </div>
              <div className="space-y-3">
                {analytics.normalized.slice(0, 8).map((session) => (
                  <div key={session.id} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 rounded-[12px] border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3">
                    <div>
                      <p className="text-base-body capitalize">{session.category}</p>
                      <p className="text-sm-body text-[var(--text-secondary)]">{session.parsedDate.toLocaleString()}</p>
                    </div>
                    <p className="text-sm-body text-[var(--text-secondary)]">{session.correctAnswers}/{session.totalQuestions}</p>
                    <p className="text-sm-body text-[var(--text-secondary)]">{formatDurationFromSeconds(session.timeSpentSeconds)}</p>
                    <p className="inline-flex items-center gap-1 text-sm-body">
                      <Target className="h-4 w-4 text-[var(--accent)]" />
                      {session.accuracy}%
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
