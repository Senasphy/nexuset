"use client"

import Link from "next/link"
import ThemeToggle from "./ThemeToggle"

const LOGO_PREFIX = "next"
const LOGO_SUFFIX = "spelling"
const FOOTER_COPY = "© 2025 NextSpelling. Made with care."
const BACK_TO_TOP = "Back to top ↑"

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-base)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-[var(--text-muted)] md:flex-row">
        <Link href="/" className="flex items-center text-[1.1rem] leading-none">
          <span className="font-mono font-medium text-[var(--landing-amber)]">{LOGO_PREFIX}</span>
          <span className="font-display font-semibold italic text-[var(--text-primary)]">
            {LOGO_SUFFIX}
          </span>
        </Link>
        <span>{FOOTER_COPY}</span>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="#top" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            {BACK_TO_TOP}
          </Link>
        </div>
      </div>
    </footer>
  )
}
