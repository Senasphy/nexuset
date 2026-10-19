"use client"
import { useAuth } from '@/context/AuthContext'
import Sidebar from '@/components/Sidebar'
import ThemeToggle from '@/components/ThemeToggle'
import { BarChart3, Menu, Search, BookOpen, SlidersHorizontal } from 'lucide-react'
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
  const displayName = username || user?.displayName || user?.email?.split('@')[0] || "Learner"
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "SP"
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
    <div className="min-h-[100dvh] bg-[#FAF6ED] dark:bg-zinc-950 text-black dark:text-white">
      {/* Top Floating / Sticky Pill Header */}
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
              href="/stats"
              title="Spelling Journal"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-amber-400 px-3.5 py-1.5 font-fredoka text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000000] hover:bg-amber-300 transition-all"
            >
              <BarChart3 className="h-3.5 w-3.5" />
              Journal
            </Link>

            <ThemeToggle />

            {/* User Profile Pill */}
            <div className="flex items-center gap-2.5 border-l-2 border-black/10 dark:border-white/10 pl-3">
              <div className="hidden text-right md:block">
                <p className="font-fredoka text-xs font-black text-black dark:text-white leading-tight">{displayName}</p>
                <p className="font-fredoka text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400">Junior Speller</p>
              </div>
              <Avatar className="h-9 w-9 border-2 border-black shadow-[2px_2px_0px_#000000]">
                <AvatarImage src={avatarUrl} alt={displayName} />
                <AvatarFallback className="bg-amber-300 text-xs font-black text-black">{initials}</AvatarFallback>
              </Avatar>
            </div>

            {/* Settings Drawer Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-black bg-amber-400 text-black shadow-[2px_2px_0px_#000000] hover:bg-amber-300 transition-all active:translate-x-[1px] active:translate-y-[1px]"
              aria-label="Open settings"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="mx-auto flex h-[calc(100dvh-72px)] w-full max-w-6xl gap-8 overflow-hidden px-4 sm:px-6 pt-6 pb-4">
        <Sidebar />

        <main id="main" className="flex-1 overflow-y-auto pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          
          {/* Welcome Banner (Styled like comic quest board) */}
          <div className="relative mb-6 overflow-hidden rounded-[32px] border-[2.5px] border-black bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-[5px_5px_0px_#000000] dark:shadow-[5px_5px_0px_#3f3f46]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-emerald-300 px-3 py-0.5 font-fredoka text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000000]">
                  <BookOpen className="h-3 w-3" />
                  Select Your Quest
                </div>
                <h1 className="mt-3 font-fredoka text-[clamp(1.8rem,4vw,2.6rem)] font-black text-black dark:text-white uppercase tracking-wide leading-tight">
                  Choose a spelling topic
                </h1>
                <p className="mt-1 font-fredoka text-sm font-semibold text-zinc-600 dark:text-zinc-300">
                  Pick a topic below to hear natural pronunciations, solve clues, and build your streak!
                </p>
              </div>

              <Link
                href="/stats"
                className="inline-flex h-11 items-center gap-2 rounded-2xl border-2 border-black bg-amber-400 px-5 font-fredoka text-xs font-black uppercase text-black shadow-[3px_3px_0px_#000000] hover:bg-amber-300 shrink-0 transition-transform active:translate-x-[1px] active:translate-y-[1px]"
              >
                <BarChart3 className="h-4 w-4" />
                View Stats &amp; Badges
              </Link>
            </div>
          </div>

          {/* Search Bar with Comic Styling */}
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 dark:text-zinc-400" />
              <input
                type="text"
                placeholder="Search topics (e.g. Science, Animals, Math)..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-11 w-full rounded-2xl border-2 border-black bg-white dark:bg-zinc-900 pl-10 pr-4 font-fredoka text-sm font-semibold text-black dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-[3px_3px_0px_#000000]"
              />
            </div>
            <p className="font-fredoka text-xs font-bold uppercase text-zinc-500 dark:text-zinc-400">
              {filteredCategories.length} Topics Ready
            </p>
          </div>

          {/* Category Cards Grid */}
          <div className="grid auto-rows-fr gap-6 md:grid-cols-2 xl:grid-cols-3 pb-12">
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
