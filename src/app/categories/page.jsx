"use client"
import { useAuth } from '@/context/AuthContext'
import Sidebar from '@/components/Sidebar'
import ThemeToggle from '@/components/ThemeToggle'
import { BarChart3, Menu } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'
import useQuizStore from '@/stores/quizStore'
import categories from './category-list'
import CategoryCard from '@/components/CategoryCard'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from "next/link"
import { useMemo, useState } from 'react'

const CategoryPage = () => {
  const { username, user } = useAuth()

  const { setIsSidebarOpen } = useQuizStore(
    useShallow((state) => ({
      setIsSidebarOpen: state.setIsSidebarOpen,
    }))
  )

  const avatarUrl = user?.photoURL || user?.providerData?.[0]?.photoURL || ""
  const displayName = username || user?.displayName || user?.email?.split('@')[0] || "User"
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "US"
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCategories = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()
    if (!normalizedQuery) {
      return categories
    }
    return categories.filter((item) => {
      const nameMatch = item.name.toLowerCase().includes(normalizedQuery)
      const descriptionMatch = item.description.toLowerCase().includes(normalizedQuery)
      return nameMatch || descriptionMatch
    })
  }, [searchQuery])

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <header className="sticky top-0 z-40 h-16 border-b border-[var(--border)] bg-[var(--bg-base)]">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center text-[1.25rem] leading-none">
          <span className="font-mono font-medium text-[var(--landing-amber)]">nexus</span>
          <span className="font-display font-semibold italic text-[var(--landing-ink)]">
            et
          </span>
        </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-6 sm:flex">
              <ThemeToggle />
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-base-body text-[var(--text-primary)]">{displayName}</p>
              </div>
              <Avatar>
                <AvatarImage src={avatarUrl} alt={username || "Profile"} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </div>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-[6px] text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] lg:hidden"
              aria-label="Open settings"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex h-[calc(100vh-64px)] w-full max-w-6xl gap-8 overflow-hidden px-6 py-10">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="mb-8 space-y-3">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-3xl-display">Choose a category</h1>
              <Link
                href="/stats"
                className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-[var(--border)] bg-[var(--bg-surface)] px-4 text-sm font-medium text-[var(--text-primary)] transition hover:border-[var(--border-strong)] hover:bg-[var(--bg-elevated)]"
              >
                <BarChart3 className="h-4 w-4" />
                Monitor stats
              </Link>
            </div>
            <p className="text-base-body text-[var(--text-secondary)]">
              Pick a set and get into a focused rhythm.
            </p>
          </div>

          <div className="mb-6 flex flex-col gap-4">
            <div className="relative max-w-xl">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M20 20L17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search categories"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-11 w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-elevated)] pl-10 pr-4 text-[1rem] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-strong)] focus:outline-none"
              />
            </div>
            <p className="text-sm-body text-[var(--text-muted)]">{filteredCategories.length} categories</p>
          </div>

          <div className="grid auto-rows-fr gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredCategories.map((item) => (
              <CategoryCard category={item} key={item.description} />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

export default CategoryPage
