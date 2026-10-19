"use client"

import { motion } from "motion/react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const ARIA_LABEL = "Toggle color theme"

export default function ThemeToggle({ className = "" }) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className={`h-7 w-14 ${className}`} />
  }

  const isDark = theme === "dark" || resolvedTheme === "dark"

  return (
    <motion.button
      type="button"
      aria-label={ARIA_LABEL}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative flex h-8 w-14 items-center rounded-full border-2 border-black dark:border-zinc-700 bg-white dark:bg-zinc-800 p-1 shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#3f3f46] ${className}`}
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-[var(--bg-elevated)]"
        transition={{ duration: 0.3 }}
      />
      <div className="relative z-10 flex w-full items-center justify-between px-1 text-[var(--text-muted)]">
        <Sun className={`h-3.5 w-3.5 ${!isDark ? "text-[var(--accent)]" : ""}`} />
        <Moon className={`h-3.5 w-3.5 ${isDark ? "text-[var(--accent)]" : ""}`} />
      </div>
      <div
        className={`absolute inset-0 flex items-center ${
          isDark ? "justify-end" : "justify-start"
        } px-1`}
      >
        <motion.div
          layout
          className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[var(--bg-surface)] text-[var(--accent-foreground)] shadow-sm"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          {isDark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
        </motion.div>
      </div>
    </motion.button>
  )
}
