"use client"

import { motion } from "framer-motion"
import Link from "next/link"

const HERO_EYEBROW = "Spelling that feels like play"
const HERO_HEADLINE = ["Learn every", "word like a", "champion."]
const HERO_SUBHEAD =
  "NextSpelling shows the meaning first, then asks kids to build the word one letter at a time. It feels like a small challenge, not a chore, and the progress adds up."
const CTA_PRIMARY = "Create an account"
const CTA_SECONDARY = "Login"

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

const letterBoxes = [
  { letter: "S", position: "left-4 top-12", duration: 3.2, state: "default" },
  { letter: "P", position: "left-20 top-28", duration: 2.8, state: "correct" },
  { letter: "A", position: "left-40 top-10", duration: 3.4, state: "focus" },
  { letter: "R", position: "left-60 top-32", duration: 2.6, state: "default" },
  { letter: "K", position: "left-80 top-16", duration: 3.1, state: "default" },
]

const starPositions = [
  { position: "left-10 top-6", delay: 0 },
  { position: "right-6 top-16", delay: 0.6 },
  { position: "left-24 bottom-10", delay: 0.3 },
]

const circleShapes = [
  { size: "h-40 w-40", position: "left-10 top-10" },
  { size: "h-52 w-52", position: "right-4 top-32" },
  { size: "h-28 w-28", position: "left-24 bottom-8" },
]

export default function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden bg-[var(--landing-hero-bg)]">
      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 pb-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative z-10 flex flex-col gap-6">
          <motion.div
            className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-[var(--landing-amber)]"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <motion.span
              className="h-2 w-2 rounded-full bg-[var(--landing-amber)]"
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
            ✦ {HERO_EYEBROW}
          </motion.div>

          <div className="space-y-2">
            {HERO_HEADLINE.map((line, index) => (
              <motion.h1
                key={line}
                className="font-display text-[clamp(3rem,7vw,5.5rem)] font-light leading-[1.1] text-[var(--landing-ink)]"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.1 + index * 0.1}
              >
                {line === "champion." ? (
                  <span className="relative inline-block font-display font-semibold italic">
                    {line}
                    <motion.svg
                      className="absolute -bottom-3 left-0 h-3 w-full"
                      viewBox="0 0 180 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <motion.path
                        d="M2 10 C30 2, 60 18, 90 10 C120 2, 150 18, 178 10"
                        stroke="var(--landing-amber)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                      />
                    </motion.svg>
                  </span>
                ) : (
                  line
                )}
              </motion.h1>
            ))}
          </div>

          <motion.p
            className="max-w-[420px] text-lg leading-[1.7] text-[var(--text-secondary)]"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.4}
          >
            {HERO_SUBHEAD}
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-4 sm:justify-start"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.55}
          >
            <Link href="/sign-up" className="flex">
              <motion.span
                whileTap={{ scale: 0.96 }}
                className="flex h-12 w-[220px] shrink-0 items-center justify-center rounded-[10px] bg-[var(--landing-amber)] px-8 text-base font-medium text-white shadow-sm transition-all hover:-translate-y-[1px] hover:shadow-[0_8px_18px_rgba(217,119,87,0.35)] hover:brightness-[1.04]"
              >
                {CTA_PRIMARY}
              </motion.span>
            </Link>
            <Link href="/login">
              <motion.span
              whileTap={{ scale: 0.96 }}
              className="flex h-12 w-[220px] shrink-0 items-center justify-center rounded-[10px] border border-[var(--border)] px-8 text-base font-medium text-[var(--text-primary)] transition-all hover:-translate-y-[1px] hover:border-[var(--border-strong)] hover:bg-[var(--bg-elevated)]"
            >
              {CTA_SECONDARY}
              </motion.span>
            </Link>
          </motion.div>

        </div>

        <motion.div
          className="relative mx-auto hidden min-h-[320px] w-full max-w-[340px] lg:block lg:min-h-[420px] lg:max-w-none"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.2 } }}
        >
          <svg
            className="absolute inset-0 h-full w-full text-[var(--landing-amber)] opacity-[0.04]"
            viewBox="0 0 400 400"
            aria-hidden
          >
            <defs>
              <pattern id="dotGrid" width="18" height="18" patternUnits="userSpaceOnUse">
                <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="400" height="400" fill="url(#dotGrid)" />
          </svg>

          {circleShapes.map((circle, index) => (
            <motion.div
              key={circle.position}
              className={`absolute ${circle.size} ${circle.position} rounded-full bg-[var(--landing-amber)] opacity-[0.07]`}
              animate={{ rotate: 360 }}
              transition={{ duration: 20 + index * 6, repeat: Infinity, ease: "linear" }}
            />
          ))}

          {starPositions.map((star) => (
            <motion.span
              key={star.position}
              className={`absolute ${star.position} text-sm text-[var(--landing-amber)]`}
              animate={{ y: [-4, 6, -4] }}
              transition={{ duration: 4, repeat: Infinity, delay: star.delay }}
            >
              ✦
            </motion.span>
          ))}

          <div className="absolute left-10 top-20 flex h-[280px] w-[320px] items-center justify-center">
            {letterBoxes.map((box, index) => {
              const baseClasses =
                "absolute flex h-[60px] w-[52px] items-center justify-center rounded-[8px] border-2 bg-[var(--neutral-letter)] font-mono text-[1.5rem] font-medium text-[var(--text-primary)] shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]"
              const stateClasses =
                box.state === "correct"
                  ? "border-[var(--correct-border)] bg-[var(--correct-bg)] text-[var(--correct)]"
                  : box.state === "focus"
                    ? "border-[var(--border-strong)] ring-2 ring-[var(--landing-amber)]"
                    : "border-[var(--border)]"

              return (
                <motion.div
                  key={box.letter}
                  className={`${baseClasses} ${stateClasses} ${box.position}`}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: box.duration, repeat: Infinity, delay: index * 0.1 }}
                >
                  {box.letter}
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>

    </section>
  )
}
