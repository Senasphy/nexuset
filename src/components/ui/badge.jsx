import * as React from "react"
import { cn } from "@/lib/utils"

function Badge({ className, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-[var(--bg-elevated)] px-3 py-1 text-[0.75rem] font-sans font-medium uppercase tracking-[0.08em] text-[var(--text-secondary)]",
        className
      )}
      {...props}
    />
  )
}

export { Badge }
