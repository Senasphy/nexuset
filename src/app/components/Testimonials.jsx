"use client"

import { motion, useAnimationFrame, useMotionValue } from "framer-motion"
import { useEffect, useRef, useState } from "react"

const SECTION_TITLE = "What families are saying"

const TESTIMONIALS = [
  {
    name: "Selam Tadesse",
    role: "Mother of a 9-year-old",
    quote:
      "I walked in and she was doing it on her own. That never happens. Other apps felt loud, this one just made sense to her.",
    tone: "amber",
  },
  {
    name: "Biruk Alemu",
    role: "11 years old",
    quote:
      "The word \"mysterious\" kept beating me. I finally got it and my score jumped. I want to beat my cousin now.",
    tone: "green",
  },
  {
    name: "Tigist Haile",
    role: "Father of two, ages 8 and 12",
    quote:
      "One likes the timer, the other takes it slow. Both use it. I like that it is calm and not yelling at them.",
    tone: "blue",
  },
  {
    name: "Naol Bekele",
    role: "10 years old",
    quote:
      "It is not super fun, but I keep coming back. I like seeing the boxes fill up.",
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
  const trackRef = useRef(null)
  const x = useMotionValue(0)
  const [trackWidth, setTrackWidth] = useState(0)

  useEffect(() => {
    if (!trackRef.current) return
    const measure = () => {
      setTrackWidth(trackRef.current.offsetWidth)
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  useAnimationFrame((_, delta) => {
    if (!trackWidth) return
    const speed = 0.04 // px per ms
    const next = x.get() - speed * delta
    const wrapped = next <= -trackWidth ? 0 : next
    x.set(wrapped)
  })

  return (
    <section className="bg-[var(--landing-section-alt)] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="font-display text-3xl font-semibold text-[var(--text-primary)]">
            {SECTION_TITLE}
          </h2>
          <div className="mx-auto mt-3 h-[3px] w-10 rounded-full bg-[var(--landing-amber)]" />
        </div>

        <motion.div
          className="no-scrollbar relative mt-12 overflow-x-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--landing-section-alt)] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--landing-section-alt)] to-transparent" />
          <motion.div className="flex w-max gap-6" style={{ x }}>
            <div ref={trackRef} className="flex w-max gap-6">
              {TESTIMONIALS.map((item, index) => (
                <motion.div
                  key={`${item.name}-a-${index}`}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="relative h-full min-h-[240px] w-[320px] shrink-0 rounded-[16px] border border-[var(--border)] bg-[var(--bg-surface)] p-7 transition-colors hover:border-[var(--border-strong)] md:w-[360px]"
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
              ))}
            </div>
            <div className="flex w-max gap-6" aria-hidden>
              {TESTIMONIALS.map((item, index) => (
                <motion.div
                  key={`${item.name}-b-${index}`}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="relative h-full min-h-[240px] w-[320px] shrink-0 rounded-[16px] border border-[var(--border)] bg-[var(--bg-surface)] p-7 transition-colors hover:border-[var(--border-strong)] md:w-[360px]"
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
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
