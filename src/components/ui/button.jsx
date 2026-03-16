import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[8px] font-sans text-[1rem] font-medium transition-[transform,box-shadow,background-color,color,border-color] duration-150 ease focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--accent)] text-white px-5 py-2.5 hover:brightness-[1.08] hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(217,119,6,0.3)] active:translate-y-0 active:scale-[0.97]",
        primary:
          "bg-[var(--accent)] text-white px-5 py-2.5 hover:brightness-[1.08] hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(217,119,6,0.3)] active:translate-y-0 active:scale-[0.97]",
        secondary:
          "border border-[var(--border)] bg-transparent text-[var(--text-secondary)] px-5 py-2.5 hover:bg-[var(--bg-elevated)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]",
        outline:
          "border border-[var(--border)] bg-transparent text-[var(--text-secondary)] px-5 py-2.5 hover:bg-[var(--bg-elevated)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]",
        ghost:
          "rounded-[6px] bg-transparent px-3 py-2 text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]",
        danger:
          "border border-[var(--border)] bg-transparent text-[var(--text-secondary)] px-5 py-2.5 hover:bg-[var(--bg-elevated)] hover:border-[var(--wrong-border)] hover:text-[var(--wrong)]",
        link: "text-[var(--text-primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-auto",
        sm: "h-8 px-3 text-[0.875rem]",
        lg: "h-11 px-6 text-[1rem]",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    (<Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />)
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
