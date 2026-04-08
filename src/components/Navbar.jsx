"use client"

import { useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion"
import { Menu, X } from "lucide-react"
import ThemeToggle from "./ThemeToggle"

const LOGO_PREFIX = "nexus"
const LOGO_SUFFIX = "et"
const CTA_LABEL = "Create account"

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "What's New", href: "#whats-new" },
  { label: "About", href: "#about" },
]

const mobileMenuVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { when: "beforeChildren", staggerChildren: 0.06 },
  },
  exit: { opacity: 0, transition: { duration: 0.14 } },
}

const mobileItemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { scrollY } = useScroll()
  const bgOpacity = useTransform(scrollY, [0, 60], [0, 1])

  return (
    <header className="sticky top-0 z-50 h-20">
      <motion.div
        className="absolute inset-0 bg-[var(--bg-surface)] backdrop-blur-[12px]"
        style={{ opacity: bgOpacity }}
        aria-hidden
      />
      <div className="relative mx-auto flex h-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center text-[1.25rem] leading-none">
          <span className="font-mono font-medium text-[var(--landing-amber)]">{LOGO_PREFIX}</span>
          <span className="font-display font-semibold italic text-[var(--landing-ink)]">
            {LOGO_SUFFIX}
          </span>
        </Link>

        <div className="ml-auto hidden items-center justify-end gap-8 lg:flex">
          <nav className="flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="group relative text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 bg-[var(--landing-amber)] transition-transform duration-200 group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>
          <ThemeToggle />
          <Link
            href="/sign-up"
            className="rounded-[8px] bg-[var(--landing-amber)] px-[18px] py-[10px] text-sm font-medium text-white shadow-sm transition-transform hover:-translate-y-[1px]"
          >
            {CTA_LABEL}
          </Link>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Open navigation menu"
            onClick={() => setIsOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-[var(--border)] bg-[var(--bg-elevated)]"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col bg-[var(--bg-base)]"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex h-16 items-center justify-between px-6">
              <span className="text-[1.25rem] font-medium">
                <span className="font-mono text-[var(--landing-amber)]">{LOGO_PREFIX}</span>
                <span className="font-display italic text-[var(--text-primary)]">
                  {LOGO_SUFFIX}
                </span>
              </span>
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setIsOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-[var(--border)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <motion.nav className="flex flex-1 flex-col items-end justify-center gap-6 px-6 text-right">
              {NAV_LINKS.map((link) => (
                <motion.div key={link.label} variants={mobileItemVariants}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-3xl font-semibold text-[var(--text-primary)]"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div variants={mobileItemVariants}>
                <div className="mt-2 flex w-full max-w-sm flex-col gap-3">
                  <Link
                    href="/sign-up"
                    className="inline-flex w-full items-center justify-center rounded-[10px] bg-[var(--landing-amber)] px-6 py-3 text-base font-medium text-white"
                  >
                    {CTA_LABEL}
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex w-full items-center justify-center rounded-[10px] border border-[var(--border)] px-6 py-3 text-base font-medium text-[var(--text-primary)]"
                  >
                    Login
                  </Link>
                </div>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
