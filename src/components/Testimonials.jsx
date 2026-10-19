"use client"

import { useAnimationFrame, useReducedMotion } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { Heart } from "lucide-react"

const TESTIMONIALS = [
  {
    name: "Selam Tadesse",
    role: "Mother of a 9-year-old",
    avatarBg: "bg-amber-300",
    quote:
      "We do ten minutes after dinner. I can actually see which category needs practice, and she doesn't fight me about spelling homework anymore!",
    rating: 5,
  },
  {
    name: "Biruk Alemu",
    role: "11 years old · 5th Grade",
    avatarBg: "bg-emerald-300",
    quote:
      "When I hear the pronunciation first, I get it faster. I missed 'mysterious' three times last week, then got it right today!",
    rating: 5,
  },
  {
    name: "Tigist Haile",
    role: "Mother of two (8 & 12)",
    avatarBg: "bg-sky-300",
    quote:
      "My older one chases streaks, my younger one uses hints. Same app, different styles, and both improve without stress.",
    rating: 5,
  },
  {
    name: "Naol Bekele",
    role: "10 years old · 4th Grade",
    avatarBg: "bg-rose-300",
    quote:
      "The timer makes it feel like a fun game challenge, but the words are real school words. I check my stats score after every run!",
    rating: 5,
  },
]

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
  const isPausedRef = useRef(false)
  const [cycleWidth, setCycleWidth] = useState(0)
  const shouldReduceMotion = useReducedMotion()

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
    if (isPausedRef.current || shouldReduceMotion) return
    const speed = 0.045
    const next = containerRef.current.scrollLeft + speed * delta
    containerRef.current.scrollLeft = next >= cycleWidth ? next - cycleWidth : next
  })

  const renderCard = (item, key) => (
    <div
      key={key}
      className="m-0 flex h-full min-h-[220px] w-[85vw] shrink-0 flex-col justify-between rounded-[28px] border-[2.5px] border-black bg-white dark:bg-zinc-900 p-6 shadow-[5px_5px_0px_#000000] dark:shadow-[5px_5px_0px_#3f3f46] sm:w-[360px] md:w-[400px] transition-transform hover:-translate-y-1"
    >
      <div>
        {/* Star Rating Badge */}
        <div className="flex items-center gap-1 text-base text-amber-500 font-black">
          {"★".repeat(item.rating)}
        </div>
        <p className="mt-3 font-fredoka text-sm sm:text-base font-semibold leading-relaxed text-black dark:text-zinc-100">
          &ldquo;{item.quote}&rdquo;
        </p>
      </div>

      <div className="mt-5 flex items-center gap-3 border-t-2 border-black/10 dark:border-white/10 pt-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-black ${item.avatarBg} text-xs font-black text-black shadow-[2px_2px_0px_#000000]`}>
          {getInitials(item.name)}
        </div>
        <div>
          <p className="font-fredoka text-sm font-black text-black dark:text-white leading-tight">
            {item.name}
          </p>
          <p className="font-fredoka text-xs font-bold text-zinc-500 dark:text-zinc-400">
            {item.role}
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <section id="testimonials" className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-amber-400 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_#000000]">
            <Heart className="h-3.5 w-3.5 fill-black" />
            Loved By Families
          </div>

          <h2 className="mt-4 font-fredoka text-[clamp(2.2rem,5vw,3.5rem)] font-black uppercase tracking-wide text-black dark:text-white drop-shadow-[2px_2px_0px_#f59e0b]">
            What young spellers &amp; parents say
          </h2>
          <p className="mt-2.5 max-w-lg font-fredoka text-base font-bold text-black/70 dark:text-zinc-300">
            Real feedback from happy kids and proud parents practicing every single week.
          </p>
        </div>

        <div className="relative mt-12">
          <div
            ref={containerRef}
            onScroll={wrapManualScroll}
            onMouseEnter={() => (isPausedRef.current = true)}
            onMouseLeave={() => (isPausedRef.current = false)}
            tabIndex={0}
            role="group"
            aria-label="Testimonials from families"
            className="no-scrollbar overflow-x-auto py-3 px-1"
          >
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
          </div>
        </div>
      </div>
    </section>
  )
}
