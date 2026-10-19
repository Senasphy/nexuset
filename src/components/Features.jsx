"use client"

import { BookOpen, LayoutGrid, Timer, BarChart3 } from "lucide-react"

const FEATURES = [
  {
    step: "POWER 01",
    tagColor: "bg-emerald-300",
    iconBg: "bg-emerald-400",
    title: "Definition-first spelling",
    description:
      "Learners hear crystal clear pronunciation and read definitions before building words letter-by-letter. Active recall anchors spelling permanently.",
    icon: <BookOpen className="h-6 w-6 text-black" strokeWidth={2.5} />,
    span: "md:col-span-7",
  },
  {
    step: "POWER 02",
    tagColor: "bg-amber-300",
    iconBg: "bg-amber-400",
    title: "Curated word categories",
    description:
      "Animals, Science, Geography, Math, and English. Structured word sets thoughtfully tailored for real grade levels.",
    icon: <LayoutGrid className="h-6 w-6 text-black" strokeWidth={2.5} />,
    span: "md:col-span-5",
  },
  {
    step: "POWER 03",
    tagColor: "bg-sky-300",
    iconBg: "bg-sky-400",
    title: "Flexible session pace",
    description:
      "Choose 10s, 15s, or 20s countdown timers for lively, high-energy practice, or pause anytime for calm focus without pressure.",
    icon: <Timer className="h-6 w-6 text-black" strokeWidth={2.5} />,
    span: "md:col-span-5",
  },
  {
    step: "POWER 04",
    tagColor: "bg-purple-300",
    iconBg: "bg-purple-400",
    title: "Visual progress dials",
    description:
      "Monitor accuracy dials, 14-day activity streaks, and mastery charts across every practice run.",
    icon: <BarChart3 className="h-6 w-6 text-black" strokeWidth={2.5} />,
    span: "md:col-span-7",
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center rounded-full border-2 border-black bg-amber-400 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_#000000]">
            Core Superpowers
          </div>

          <h2 className="mt-4 font-fredoka text-[clamp(2.2rem,5vw,3.5rem)] font-black uppercase tracking-wide text-black dark:text-white drop-shadow-[2px_2px_0px_#f59e0b]">
            Designed for joyful, focused learning
          </h2>
          <p className="mt-2.5 max-w-xl font-fredoka text-base font-bold text-black/70 dark:text-zinc-300">
            Every feature is crafted to make practicing spelling feel like an exciting adventure rather than a chore.
          </p>
        </div>

        {/* Feature Cards Grid (Comic Panels) */}
        <div className="mt-12 grid items-stretch gap-6 md:grid-cols-12">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className={`flex flex-col justify-between rounded-[28px] border-[2.5px] border-black bg-white dark:bg-zinc-900 p-6 sm:p-7 shadow-[5px_5px_0px_#000000] dark:shadow-[5px_5px_0px_#3f3f46] transition-all hover:-translate-y-1 hover:shadow-[7px_7px_0px_#000000] ${feature.span}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  {/* Icon badge */}
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-black ${feature.iconBg} shadow-[2px_2px_0px_#000000]`}>
                    {feature.icon}
                  </div>

                  {/* Comic Step Badge */}
                  <span className={`rounded-full border-2 border-black ${feature.tagColor} px-3 py-0.5 font-fredoka text-[11px] font-black uppercase text-black shadow-[2px_2px_0px_#000000]`}>
                    {feature.step}
                  </span>
                </div>

                <h3 className="mt-5 font-fredoka text-xl sm:text-2xl font-black text-black dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2.5 font-fredoka text-sm font-semibold text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
