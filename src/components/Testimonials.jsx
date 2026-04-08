"use client"

import { motion, useAnimationFrame } from "framer-motion"
import { useEffect, useRef, useState } from "react"


const TESTIMONIALS = [
  {
    name: "Selam Tadesse",
    role: "Mother of a 9-year-old",
    quote:
      "We do ten minutes after dinner. I can actually see which category needs help, and she does not fight me about practice anymore.",
    tone: "amber",
  },
  {
    name: "Biruk Alemu",
    role: "11 years old",
    quote:
      "When I hear the pronunciation first, I get it faster. I missed 'mysterious' three times last week, then got it right today.",
    tone: "green",
  },
  {
    name: "Tigist Haile",
    role: "Father of two, ages 8 and 12",
    quote:
      "My older one chases streaks, my younger one uses hints. Same app, different style, and both are improving without pressure.",
    tone: "blue",
  },
  {
    name: "Naol Bekele",
    role: "10 years old",
    quote:
      "The timer makes it feel like a game, but the words are real school words. I check my score after every session.",
    tone: "rose",
  },
]

const toneClasses = {
  amber: "bg-[var(--landing-amber-light)] text-[var(--landing-amber)]",
  green: "bg-[rgba(22,163,74,0.14)] text-[var(--landing-green)]",
  blue: "bg-[#DDECF8] text-[#2C5D82]",
  rose: "bg-[#F8E3E1] text-[#A4463F]",
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
}

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export default function Testimonials() {
  const containerRef = useRef(null)
  const firstSetRef = useRef(null)
  const secondSetRef = useRef(null)
  const [cycleWidth, setCycleWidth] = useState(0)

  useEffect(() => {
    const measure = () => {
      if (!firstSetRef.current || !secondSetRef.current) return
      const width = secondSetRef.current.offsetLeft - firstSetRef.current.offsetLeft
      setCycleWidth(width)
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  const wrapManualScroll = () => {
    if (!containerRef.current || !cycleWidth) return
    if (containerRef.current.scrollLeft >= cycleWidth) {
      containerRef.current.scrollLeft %= cycleWidth
    }
  }

  useAnimationFrame((_, delta) => {
    if (!containerRef.current || !cycleWidth) return
    const speed = 0.04 // px per ms
    const next = containerRef.current.scrollLeft + speed * delta
    containerRef.current.scrollLeft = next >= cycleWidth ? next - cycleWidth : next
  })

  const renderCard = (item, key) => (
    <motion.div
      key={key}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative h-full min-h-[240px] w-screen shrink-0 rounded-[16px] border border-[var(--border)] bg-[var(--bg-surface)] p-7 transition-colors hover:border-[var(--border-strong)] sm:w-[320px] md:w-[360px]"
    >
      <span className="absolute -top-5 left-5 font-display text-[5rem] font-semibold text-[var(--landing-amber)] opacity-[0.2]">
        "
      </span>
      <div className="text-xs text-[var(--landing-amber)]">★★★★★</div>
      <p className="mt-4 text-base leading-[1.75] text-[var(--text-primary)]">
        {item.quote}
      </p>
      <div className="mt-6 flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
            toneClasses[item.tone]
          }`}
        >
          {getInitials(item.name)}
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--text-primary)]">{item.name}</p>
          <p className="text-xs text-[var(--text-secondary)]">{item.role}</p>
        </div>
      </div>
    </motion.div>
  )

  return (
    <section className="bg-[var(--landing-section-alt)] py-30">
      <div className="mx-auto max-w-6xl px-0 sm:px-6">
        <div className="px-6 text-center sm:px-0">
          <h2 className="font-display text-3xl font-semibold text-[var(--text-primary)]">
            What families are saying
          </h2>
          <div className="mx-auto mt-3 h-[3px] w-10  rounded-full bg-[var(--landing-amber)]" />
        </div>

        <motion.div
          ref={containerRef}
          onScroll={wrapManualScroll}
          className="no-scrollbar relative mt-12 overflow-x-auto py-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="pointer-events-none absolute  inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--landing-section-alt)] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--landing-section-alt)] to-transparent" />
          <div className="flex w-max gap-6">
            {[0, 1].map((setIndex) => (
              <div
                key={`set-${setIndex}`}
                ref={setIndex === 0 ? firstSetRef : secondSetRef}
                className="flex w-max gap-6"
                aria-hidden={setIndex === 1}
              >
                {TESTIMONIALS.map((item, index) =>
                  renderCard(item, `${item.name}-${setIndex}-${index}`),
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
