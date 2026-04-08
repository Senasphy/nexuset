"use client"

import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

const EYEBROW = "What's New"
const TITLE = "nexuset v0.1.1"
const SUBHEAD = "Sharper sessions, clearer tracking, and smoother study flow across the app."

const RELEASE_ITEMS = [
  "Dynamic questions with cleaner session control.",
  "A stat monitoring page with clear visuals over time, sessions, categories, and more.",
  "TanStack-based caching for faster repeat visits.",
  "Pronunciation support so learners spell what they hear, not what they guess.",
  "Faster loading via batch loading and an expanded data set.",
  "UI refinements across the entire site.",
]

export default function ComingSoon() {
  return (
    <section id="whats-new" className="bg-[var(--landing-section-alt)] py-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="w-full rounded-[20px] border border-[var(--border)] bg-[var(--bg-surface)] p-2 text-center shadow-sm sm:p-4">
          <div className="relative overflow-hidden rounded-[18px] bg-[radial-gradient(circle_at_top,_rgba(217,119,87,0.2),_transparent_65%)] p-3 sm:p-4">
            <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[var(--landing-amber)]">
              <span className="h-[6px] w-[6px] rounded-full bg-[var(--landing-amber)]" />
              <span>{EYEBROW}</span>
            </div>
            <h2 className="mt-4 font-display text-3xl font-semibold text-[var(--text-primary)]">
              {TITLE}
            </h2>
            <p className="mt-3 text-base text-[var(--text-secondary)]">{SUBHEAD}</p>

            <motion.div
              className="mx-auto mt-10 max-w-4xl text-left"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <ol className="relative space-y-6 border-l border-[var(--border-strong)] pl-6">
                {RELEASE_ITEMS.map((item, index) => (
                  <li key={item} className="relative">
                    <span className="absolute -left-[34px] top-0 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--bg-surface)] text-[var(--accent)]">
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                    <div className="space-y-1">
                      <p className="text-xs-label text-[var(--text-muted)]">Update {String(index + 1).padStart(2, "0")}</p>
                      <p className="text-base-body text-[var(--text-primary)]">{item}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
