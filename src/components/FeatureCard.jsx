"use client"

import { motion } from "motion/react"

export default function FeatureCard({
  title,
  description,
  icon,
  className = "",
}) {
  return (
    <motion.div
      className={`flex h-full flex-col justify-between rounded-[20px] border border-[var(--border)] bg-[var(--bg-surface)] p-8 shadow-xs transition-colors hover:border-[var(--border-strong)] ${className}`}
    >
      <div>
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-[12px] border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--accent)]">
          {icon}
        </div>
        <h3 className="font-display text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          {title}
        </h3>
        <p className="mt-3 text-base text-[var(--text-secondary)] leading-relaxed font-normal">
          {description}
        </p>
      </div>
    </motion.div>
  )
}
