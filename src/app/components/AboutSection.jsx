"use client"

import { motion } from "framer-motion"
import { Github, Globe, Instagram, Linkedin, Send } from "lucide-react"

const EYEBROW = "Why I built this"
const DEVELOPER_NAME = "SENA ABEBE"
const DEVELOPER_TITLE = "Full stack developer and educator"

const SOCIAL_LINKS = {
  // TODO: replace with your portfolio URL
  portfolio: "https://sena-works.vercel.app",
  telegram: "https://t.me/SM10AR",
  linkedin: "https://www.linkedin.com/in/sena-abebe-430460289",
  instagram: "https://www.instagram.com/senasphy?igsh=MTEzejc1anI2YmlqdQ==",
  github: "https://github.com/Senasphy",
}

const SOCIAL_ITEMS = [
  { label: "Portfolio", icon: Globe, href: SOCIAL_LINKS.portfolio },
  { label: "Telegram", icon: Send, href: SOCIAL_LINKS.telegram },
  { label: "LinkedIn", icon: Linkedin, href: SOCIAL_LINKS.linkedin },
  { label: "Instagram", icon: Instagram, href: SOCIAL_LINKS.instagram },
  { label: "GitHub", icon: Github, href: SOCIAL_LINKS.github },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export default function AboutSection() {
  return (
    <section id="about" className="bg-[var(--landing-hero-bg)] py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-6">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--landing-amber)]">
            ✦ {EYEBROW}
          </span>
          <div className="space-y-1">
              <h2
                className="font-display text-[clamp(2.2rem,4vw,3.2rem)] font-light leading-tight text-[var(--landing-ink)]"
              >
              I wanted students to <span className="font-semibold italic">  actually enjoy </span> learning to spell.
              </h2>
          </div>
          <div className="space-y-4 text-base text-[var(--text-secondary)]">

            <p>
            Most spelling tools are either flat flashcards or noisy games. I wanted something in the middle that feels focused, calm, and rewarding. It should respect a child's attention and still feel fun.
            NextSpelling started as a weekend project and kept growing. I am proud of what it has become, and I am still making it better.
            </p>
          </div>
        </div>

        <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-surface)] p-8 shadow-sm">
          <h3 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
            {DEVELOPER_NAME}
          </h3>
          <p className="mt-2 text-base text-[var(--text-secondary)]">{DEVELOPER_TITLE}</p>
          <div className="mt-6 h-[2px] w-10 rounded-full bg-[var(--landing-amber)]" />

          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
          >
            {SOCIAL_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  variants={itemVariants}
                  className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-all hover:-translate-y-[2px] hover:border-[var(--border-strong)] hover:bg-[var(--bg-surface)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </motion.a>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
