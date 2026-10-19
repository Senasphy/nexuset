import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-fredoka font-bold transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-2 border-black bg-amber-400 text-black shadow-[2px_2px_0px_#000000] hover:bg-amber-300 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000000]",
        primary:
          "border-2 border-black bg-amber-400 text-black shadow-[3px_3px_0px_#000000] hover:bg-amber-300 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000000] uppercase font-black tracking-wide",
        secondary:
          "border-2 border-black bg-white dark:bg-zinc-800 text-black dark:text-white shadow-[2px_2px_0px_#000000] hover:bg-[#FAF6ED] active:translate-x-[1px] active:translate-y-[1px]",
        outline:
          "border-2 border-black bg-transparent text-black dark:text-white shadow-[2px_2px_0px_#000000] hover:bg-amber-100 active:translate-x-[1px] active:translate-y-[1px]",
        ghost:
          "bg-transparent text-zinc-700 dark:text-zinc-300 hover:bg-amber-200/50 hover:text-black",
        danger:
          "border-2 border-black bg-rose-400 text-black shadow-[2px_2px_0px_#000000] hover:bg-rose-300 active:translate-x-[1px] active:translate-y-[1px] uppercase font-black",
        link: "text-black dark:text-white underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 px-3.5 text-xs",
        lg: "h-12 px-7 text-base",
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
