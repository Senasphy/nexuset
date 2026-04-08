"use client"

import { motion } from "framer-motion"
import { BarChart3, BookOpen, LayoutGrid, Timer } from "lucide-react"
import FeatureCard from "./FeatureCard"

const SECTION_EMPHASIS = "actually"

const FEATURES_LEFT = [
  {
    title: "Definition-first spelling",
    description:
      "They do not see the word first. They see the meaning and have to build it. That active recall makes the spelling stick.",
    icon: <BookOpen className="h-7 w-7" />,
    tone: "amber",
    ghostLetter: "A",
  },
  {
    title: "Curated word categories",
    description:
      "Animals, Science, Geography and more. The sets are focused, so kids build real vocabulary instead of guessing random lists.",
    icon: <LayoutGrid className="h-7 w-7" />,
    tone: "green",
    ghostLetter: "Z",
  },
]

const FEATURES_RIGHT = [
  {
    title: "Timed sessions",
    description:
      "Set a timer when you want energy and pace. Keep it open when you want calm and focus. Both modes work.",
    icon: <Timer className="h-7 w-7" />,
    tone: "amber",
  },
  {
    title: "Progress monitoring",
    description:
      "Track accuracy, session time, category strengths, and trends over time with clear visuals that guide what to practice next.",
    icon: <BarChart3 className="h-7 w-7" />,
    tone: "amber",
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export default function Features() {
  return (
    <section id="features" className="bg-[var(--landing-section-alt)] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="max-w-2xl font-display text-[clamp(2.4rem,4vw,3.6rem)] font-light leading-tight text-[var(--landing-ink)]">
          Everything you need to <span className="font-semibold italic">{SECTION_EMPHASIS}</span> learn
        </h2>

        <motion.div
          className="mt-12 grid items-stretch gap-6 md:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {[...FEATURES_LEFT, ...FEATURES_RIGHT].map((feature) => (
            <motion.div key={feature.title} variants={cardVariants}>
              <FeatureCard
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                tone={feature.tone}
                size={feature.ghostLetter ? "large" : "small"}
                ghostLetter={feature.ghostLetter}
                className="min-h-[260px]"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
