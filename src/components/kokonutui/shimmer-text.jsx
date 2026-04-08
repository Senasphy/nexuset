"use client";
/**
 * @author: @dorianbaffier
 * @description: Shimmer Text
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export default function ShimmerText({
  text = "Text Shimmer",
  className
}) {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden px-2 py-1"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}>
        <motion.h1
          animate={{
            backgroundPosition: ["200% center", "-200% center"],
          }}
          className={cn(
            "bg-[length:200%_100%] bg-gradient-to-r from-[var(--text-muted)] via-[var(--accent)] to-[var(--text-muted)] bg-clip-text font-display font-semibold text-2xl text-transparent",
            className
          )}
          transition={{
            duration: 2.5,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
          }}>
          {text}
        </motion.h1>
      </motion.div>
    </div>
  );
}
