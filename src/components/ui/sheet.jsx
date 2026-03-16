"use client"

import * as React from "react"
import { motion } from "framer-motion"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Sheet = SheetPrimitive.Root
const SheetTrigger = SheetPrimitive.Trigger
const SheetClose = SheetPrimitive.Close
const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 data-[state=closed]:opacity-0 data-[state=open]:opacity-100",
      className
    )}
    {...props}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const SheetContent = React.forwardRef(({ className, side = "left", ...props }, ref) => {
  const initialX = side === "left" ? -280 : 280
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content asChild>
        <motion.div
          ref={ref}
          initial={{ x: initialX, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
          className={cn(
            "fixed z-50 h-full w-[280px] bg-[var(--bg-surface)] p-6",
            side === "left" && "left-0 top-0 border-r border-[var(--border)]",
            side === "right" && "right-0 top-0 border-l border-[var(--border)]",
            className
          )}
          {...props}
        />
      </SheetPrimitive.Content>
    </SheetPortal>
  )
})
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({ className, ...props }) => (
  <div className={cn("mb-6 flex items-center justify-between", className)} {...props} />
)

const SheetTitle = React.forwardRef(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("font-display text-[1.25rem] font-semibold", className)}
    {...props}
  />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetCloseButton = ({ className, ...props }) => (
  <SheetClose
    className={cn("rounded-[6px] p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]", className)}
    {...props}
  >
    <X className="h-4 w-4" />
    <span className="sr-only">Close</span>
  </SheetClose>
)

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetCloseButton,
}
