"use client"

import { motion } from "framer-motion"
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
      whileTap={{ scale: 0.96 }}
      className={`relative flex h-7 w-14 items-center rounded-full border border-[var(--border)] p-1 ${className}`}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{ backgroundColor: isDark ? "#1E1C1A" : "#EFEDE8" }}
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
          className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-white text-[var(--accent)] shadow-sm dark:bg-[#46423D]"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          {isDark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
        </motion.div>
      </div>
    </motion.button>
  )
}
