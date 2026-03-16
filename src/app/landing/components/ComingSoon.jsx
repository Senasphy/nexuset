"use client"

import { motion } from "framer-motion"
import { BarChart3, Library, Users } from "lucide-react"
import FeatureCard from "./FeatureCard"

const EYEBROW = "What's next"
const TITLE = "The next chapter"
const SUBHEAD =
  "We are building the tools that make practice clearer for kids and easier for families."
const BADGE_LABEL = "Coming soon"

const COMING_SOON_ITEMS = [
  {
    title: "Deep Dive Analytics",
    description:
      "A clear dashboard with accuracy over time, tough words, category strengths, and streaks. It shows exactly what to practice next.",
    icon: <BarChart3 className="h-7 w-7" />,
  },
  {
    title: "Family Command Center",
    description:
      "A parent view with daily goals, progress snapshots, and weekly summaries. It keeps the learning calm and on track.",
    icon: <Users className="h-7 w-7" />,
  },
  {
    title: "Expanded Lexicon",
    description:
      "A bigger library with age-based sets and advanced vocabulary for students who want more challenge.",
    icon: <Library className="h-7 w-7" />,
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export default function ComingSoon() {
  return (
    <section id="coming-soon" className="bg-[var(--landing-section-alt)] py-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="w-full rounded-[20px] border border-[var(--border)] bg-[var(--bg-surface)] p-2 text-center shadow-sm sm:p-4">
          <div className="relative overflow-hidden rounded-[18px] bg-[radial-gradient(circle_at_top,_rgba(217,119,87,0.2),_transparent_65%)] p-3 sm:p-4">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--landing-amber)]">
              ✦ {EYEBROW}
            </span>
            <h2 className="mt-4 font-display text-3xl font-semibold text-[var(--text-primary)]">
              {TITLE}
            </h2>
            <p className="mt-3 text-base text-[var(--text-secondary)]">{SUBHEAD}</p>

            <motion.div
              className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-stretch"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {COMING_SOON_ITEMS.map((item) => (
                <motion.div key={item.title} variants={cardVariants} className="flex-1 min-w-0">
                  <FeatureCard
                    title={item.title}
                    description={item.description}
                    icon={item.icon}
                    variant="coming"
                    badge={BADGE_LABEL}
                    className="!p-5 !rounded-[16px] h-full min-h-[240px]"
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
