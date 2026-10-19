"use client"

import { useState } from "react"

const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export default function WeekdayMinutesChart({ weekdayMinutes = [] }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const maxMinutes = Math.max(...weekdayMinutes, 1)

  return (
    <div className="mt-4 flex items-end justify-between gap-2 sm:gap-3">
      {weekdayMinutes.map((minutes, index) => {
        const barHeight = Math.max(8, Math.round((minutes / maxMinutes) * 80))
        const isHovered = hoveredIndex === index

        return (
          <div
            key={`${WEEKDAY_SHORT[index]}-${index}`}
            className="relative flex flex-1 flex-col items-center gap-2"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div
              className={`w-full rounded-2xl border-2 border-black bg-[#FAF6ED] dark:bg-zinc-800 transition-transform ${isHovered ? "scale-105" : ""} shadow-[1px_1px_0px_#000000]`}
              style={{ height: "90px", position: "relative", overflow: "hidden" }}
            >
              <div
                className={`absolute bottom-0 w-full bg-amber-400 border-t-2 border-black transition-all duration-200 ${isHovered ? "bg-amber-300" : ""}`}
                style={{ height: `${barHeight}px` }}
              />
              <div
                className={`pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap rounded-xl border-2 border-black bg-white dark:bg-zinc-900 px-2.5 py-1 font-fredoka text-[11px] font-black text-black dark:text-white shadow-[2px_2px_0px_#000000] transition-all duration-150 ${isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
              >
                {minutes.toFixed(1)} mins
              </div>
            </div>
            <span className="font-fredoka text-[11px] font-black uppercase text-zinc-600 dark:text-zinc-400">
              {WEEKDAY_SHORT[index]}
            </span>
          </div>
        )
      })}
    </div>
  )
}
