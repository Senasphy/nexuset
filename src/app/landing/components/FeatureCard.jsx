"use client"

import { motion } from "framer-motion"
export default function FeatureCard({
  title,
  description,
  icon,
  tone = "amber",
  size = "small",
  ghostLetter,
  badge,
  variant = "feature",
  className = "",
}) {
  const toneClass =
    tone === "green"
      ? "bg-[rgba(22,163,74,0.12)] text-[var(--landing-green)]"
      : "bg-[var(--landing-amber-light)] text-[var(--landing-amber)]"

  const baseClasses =
    variant === "coming"
      ? "group border border-dashed border-[var(--border-strong)] bg-[var(--bg-elevated)] transition-colors duration-200 group-hover:border-[var(--accent)]"
      : "border border-[var(--border)] bg-[var(--bg-surface)]"

  return (
    <motion.div
      className={`relative h-full overflow-hidden rounded-[12px] p-6 ${baseClasses} ${className}`}
      whileHover={variant === "feature" ? { y: -4, transition: { duration: 0.2 } } : undefined}
    >
      {badge && (
        <span className="absolute right-4 top-4 rounded-full border border-[var(--landing-amber)] px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.12em] text-[var(--landing-amber)]">
          {badge}
        </span>
      )}
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-[10px] ${toneClass}`}>
        {icon}
      </div>
      <h3
        className={`font-display text-xl font-semibold text-[var(--text-primary)] ${
          size === "large" ? "text-2xl" : ""
        }`}
      >
        {title}
      </h3>
      <p className="mt-3 text-base text-[var(--text-secondary)]">{description}</p>
      {ghostLetter && (
        <span className="pointer-events-none absolute bottom-6 right-6 font-display text-[8rem] font-light text-[var(--text-primary)] opacity-[0.04]">
          {ghostLetter}
        </span>
      )}
      {variant === "coming" && null}
    </motion.div>
  )
}
