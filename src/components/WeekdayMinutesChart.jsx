"use client"

import { useState } from "react"

const WEEKDAY_SHORT = ["S", "M", "T", "W", "T", "F", "S"]

export default function WeekdayMinutesChart({ weekdayMinutes = [] }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const maxMinutes = Math.max(...weekdayMinutes, 1)

  return (
    <div className="mt-3 flex items-end justify-between gap-2">
      {weekdayMinutes.map((minutes, index) => {
        const barHeight = Math.max(10, Math.round((minutes / maxMinutes) * 80))
        const isHovered = hoveredIndex === index

        return (
          <div
            key={`${WEEKDAY_SHORT[index]}-${index}`}
            className="relative flex flex-1 flex-col items-center gap-2"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div
              className={`w-full rounded-[6px] bg-[var(--accent)]/15 transition-transform duration-150 ${isHovered ? "scale-[1.03]" : ""}`}
              style={{ height: "84px", position: "relative" }}
            >
              <div
                className={`absolute bottom-0 w-full rounded-[6px] bg-[var(--accent)] transition-all duration-150 ${isHovered ? "brightness-110" : ""}`}
                style={{ height: `${barHeight}px` }}
              />
              <div
                className={`pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-[6px] border border-[var(--border)] bg-[var(--bg-surface)] px-2 py-1 text-xs font-medium text-[var(--text-primary)] shadow-sm transition-all duration-150 ${isHovered ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"}`}
              >
                {minutes.toFixed(2)} min
              </div>
            </div>
            <span className="text-xs-label text-[var(--text-muted)]">{WEEKDAY_SHORT[index]}</span>
          </div>
        )
      })}
    </div>
  )
}
