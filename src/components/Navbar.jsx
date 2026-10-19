"use client"

import { useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "motion/react"
import { Menu, X, LayoutGrid, BarChart3, Volume2, BookOpen } from "lucide-react"
import ThemeToggle from "./ThemeToggle"
import { useAuth } from "@/context/AuthContext"

const NAV_LINKS = [
  { label: "Practice", href: "/categories" },
  { label: "Features", href: "#features" },
  { label: "Feedback", href: "#testimonials" },
  { label: "Quest Log", href: "#whats-new" },
  { label: "About", href: "#about" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasPlayedSound, setHasPlayedSound] = useState(false)
  const { user } = useAuth()

  const isLoggedIn = Boolean(user && user.uid && user.uid !== "guest")

  const handleSoundTest = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance("Welcome to Nexuset! Spell what you hear!")
      utterance.rate = 0.95
      utterance.pitch = 1.15
      window.speechSynthesis.speak(utterance)
      setHasPlayedSound(true)
      setTimeout(() => setHasPlayedSound(false), 2000)
    }
  }

  return (
    <header className="sticky top-3 z-sticky w-full px-4 sm:px-6">
      <nav
        aria-label="Main Navigation"
        className="mx-auto flex max-w-5xl items-center justify-between rounded-full border-2 border-black bg-[#FAF6EE]/95 dark:bg-zinc-900/95 backdrop-blur-md px-4 sm:px-6 py-2.5 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#3f3f46] transition-all"
      >
        {/* Brand with Playful Mascot Logo Badge */}
        <Link
          href="/"
          className="group flex items-center gap-2.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-amber-400 text-black shadow-[2px_2px_0px_#000000] transition-transform group-hover:rotate-12 group-hover:scale-105">
            <span className="font-fredoka text-base font-black">N</span>
          </div>
          <span className="font-fredoka text-xl sm:text-2xl font-black tracking-tight text-black dark:text-white">
            nexus<span className="text-amber-500">et</span>
          </span>
        </Link>

        {/* Center Nav Links */}
        <div className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-fredoka text-xs font-bold uppercase tracking-wider text-black/80 dark:text-zinc-200 transition-colors hover:text-amber-500"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Action Buttons */}
        <div className="hidden items-center gap-3 lg:flex">
          {/* Orange Circle Action Buttons (Inspired by Reference Screenshot) */}
          <button
            type="button"
            onClick={handleSoundTest}
            title="Hear Audio Greeting"
            aria-label="Test Speech Pronunciation"
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-amber-400 text-black shadow-[2px_2px_0px_#000000] transition-all hover:bg-amber-300 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000000]"
          >
            <Volume2 className={`h-4 w-4 ${hasPlayedSound ? "animate-bounce" : ""}`} />
          </button>

          <Link
            href="/stats"
            title="View Stats"
            aria-label="View Spelling Stats"
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-amber-400 text-black shadow-[2px_2px_0px_#000000] transition-all hover:bg-amber-300 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000000]"
          >
            <BarChart3 className="h-4 w-4" />
          </Link>

          <Link
            href="/categories"
            title="Explore Quests"
            aria-label="Explore Categories"
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-amber-400 text-black shadow-[2px_2px_0px_#000000] transition-all hover:bg-amber-300 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000000]"
          >
            <LayoutGrid className="h-4 w-4" />
          </Link>

          {/* Theme Toggle */}
          <div className="ml-1">
            <ThemeToggle />
          </div>

          {/* Primary CTA Button */}
          {isLoggedIn ? (
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-amber-400 px-5 py-2 font-fredoka text-xs font-black uppercase text-black shadow-[3px_3px_0px_#000000] transition-all hover:bg-amber-300 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000000]"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Go Practice
            </Link>
          ) : (
            <div className="flex items-center gap-2 ml-1">
              <Link
                href="/login"
                className="font-fredoka text-xs font-bold uppercase tracking-wider text-black/80 dark:text-zinc-200 hover:text-amber-500 px-2 py-1"
              >
                Log In
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-amber-400 px-4 py-2 font-fredoka text-xs font-black uppercase text-black shadow-[3px_3px_0px_#000000] transition-all hover:bg-amber-300 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000000]"
              >
                Start Practice 🚀
              </Link>
            </div>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={handleSoundTest}
            aria-label="Sound check"
            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-amber-400 text-black shadow-[2px_2px_0px_#000000]"
          >
            <Volume2 className="h-3.5 w-3.5" />
          </button>
          <ThemeToggle />
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-black bg-white dark:bg-zinc-800 text-black dark:text-white shadow-[2px_2px_0px_#000000]"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-modal flex flex-col bg-[#FAF6EE] dark:bg-zinc-950 p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="flex h-12 items-center justify-between">
              <span className="font-fredoka text-2xl font-black text-black dark:text-white">
                nexus<span className="text-amber-500">et</span>
              </span>
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setIsOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-black bg-white dark:bg-zinc-800 shadow-[2px_2px_0px_#000000]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-1 flex-col items-center justify-center gap-6 py-8 text-center">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="font-fredoka text-2xl font-bold uppercase tracking-wider text-black dark:text-white hover:text-amber-500"
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-6 w-full max-w-xs space-y-3">
                <Link
                  href="/categories"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-black bg-amber-400 py-3 font-fredoka text-base font-black uppercase text-black shadow-[4px_4px_0px_#000000]"
                >
                  <BookOpen className="h-5 w-5" />
                  Start Practice
                </Link>
                {!isLoggedIn && (
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex w-full items-center justify-center rounded-2xl border-2 border-black bg-white dark:bg-zinc-800 py-3 font-fredoka text-base font-bold text-black dark:text-white shadow-[3px_3px_0px_#000000]"
                  >
                    Log In
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
