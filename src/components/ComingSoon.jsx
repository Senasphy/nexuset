"use client"

import { motion } from "motion/react"
import { Check, Compass } from "lucide-react"

const EYEBROW = "Adventure Quest Log"
const TITLE = "Nexuset v0.1.1 Updates"
const SUBHEAD = "Sharper sessions, clearer tracking, and smoother learning flow across the app."

const RELEASE_ITEMS = [
  "Dynamic question engine with cleaner, distraction-free session control.",
  "Visual stat monitoring hub with streaks, category strength, and progress dials.",
  "TanStack-based caching for lightning fast repeat visits & instant quiz loading.",
  "Natural pronunciation support so learners spell what they hear, not what they guess.",
  "Expanded grade-appropriate vocabulary datasets with rich definitions.",
  "Playful cartoon-inspired redesign with tactile buttons and cheerful feedback.",
]

export default function ComingSoon() {
  return (
    <section id="whats-new" className="py-20">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <div className="w-full rounded-[32px] border-[2.5px] border-black bg-white dark:bg-zinc-900 p-6 sm:p-10 shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#3f3f46]">
          
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-amber-400 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_#000000]">
              <Compass className="h-3.5 w-3.5" />
              <span>{EYEBROW}</span>
            </div>

            <h2 className="mt-4 font-fredoka text-[clamp(2rem,4.5vw,3rem)] font-black uppercase tracking-wide text-black dark:text-white drop-shadow-[2px_2px_0px_#f59e0b]">
              {TITLE}
            </h2>
            <p className="mx-auto mt-2 max-w-lg font-fredoka text-base font-bold text-black/70 dark:text-zinc-300">
              {SUBHEAD}
            </p>
          </div>

          {/* Quest items grid */}
          <motion.div
            className="mt-10 grid gap-4 sm:grid-cols-2"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            {RELEASE_ITEMS.map((item, index) => (
              <div
                key={item}
                className="flex items-start gap-3.5 rounded-2xl border-2 border-black bg-[#FAF6ED] dark:bg-zinc-800 p-4 shadow-[3px_3px_0px_#000000] dark:shadow-[3px_3px_0px_#27272a] transition-transform hover:-translate-y-0.5"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-black bg-emerald-400 text-black shadow-[1px_1px_0px_#000000]">
                  <Check className="h-4 w-4 stroke-[3]" />
                </div>
                <div>
                  <span className="font-fredoka text-[11px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    QUEST UNLOCKED 0{index + 1}
                  </span>
                  <p className="mt-1 font-fredoka text-sm font-semibold text-black dark:text-zinc-100 leading-snug">
                    {item}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  )
}
