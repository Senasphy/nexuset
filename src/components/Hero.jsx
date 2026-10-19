"use client"

import { useState } from "react"
import { motion } from "motion/react"
import Link from "next/link"
import { Volume2, CheckCircle2, RotateCcw, ArrowRight } from "lucide-react"
import { LeftMascot, RightMascot } from "./HeroMascots"

// Word for the interactive hero mini-challenge
const SAMPLE_WORD = "GIRAFFE"
const SAMPLE_CLUE = "The tallest gentle animal on the African savanna 🦒"
const SCRAMBLED_LETTERS = ["G", "I", "R", "A", "F", "F", "E", "P", "S"]

export default function Hero() {
  const [typedLetters, setTypedLetters] = useState([])
  const [isWordComplete, setIsWordComplete] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  // Speech synthesizer for hearing the word
  const speakWord = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance("Giraffe. Can you spell Giraffe?")
      utterance.rate = 0.9
      utterance.pitch = 1.15
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleLetterClick = (letter) => {
    if (isWordComplete) return
    const nextLetters = [...typedLetters, letter]
    setTypedLetters(nextLetters)

    if (nextLetters.join("") === SAMPLE_WORD) {
      setIsWordComplete(true)
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        const cheer = new SpeechSynthesisUtterance("Super job! You spelled Giraffe correctly!")
        cheer.rate = 1.0
        cheer.pitch = 1.2
        window.speechSynthesis.speak(cheer)
      }
    }
  }

  const handleReset = () => {
    setTypedLetters([])
    setIsWordComplete(false)
  }

  return (
    <section className="relative overflow-hidden pt-6 pb-16 lg:py-16">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Main Title & Subtitle */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-fredoka text-[clamp(2.6rem,7vw,5rem)] font-black uppercase tracking-wider text-black dark:text-white drop-shadow-[3px_3px_0px_#f59e0b] sm:drop-shadow-[4px_4px_0px_#f59e0b] leading-none"
          >
            Nexuset Spelling
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-4 max-w-xl font-fredoka text-base sm:text-lg font-bold text-black/80 dark:text-zinc-200 leading-snug"
          >
            Welcome to Nexuset — the magical &amp; playful sound-first spelling quest for curious young minds!
          </motion.p>
        </div>

        {/* 3-Column Hero Layout: Mascot Left | Central Quest Card | Mascot Right */}
        <div className="mt-8 flex flex-col items-center justify-center gap-8 lg:flex-row lg:items-start lg:gap-6 xl:gap-12">
          
          {/* Left Mascot Column (Hidden on tiny screens, visible on md+) */}
          <div className="order-2 lg:order-1 flex justify-center lg:pt-10">
            <LeftMascot />
          </div>

          {/* Central Quest Card (Inspired directly by reference screenshot) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="order-1 lg:order-2 w-full max-w-[430px] rounded-[32px] border-[2.5px] border-black bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#3f3f46]"
          >
            {/* Top Subcard: Quest Title & 4 Pill Stat Boxes */}
            <div className="rounded-2xl border-2 border-black bg-[#FAF6ED] dark:bg-zinc-800 p-4 shadow-[2px_2px_0px_#000000]">
              <div className="flex items-center justify-between">
                <span className="font-fredoka text-xs font-black uppercase tracking-wider text-black dark:text-white">
                  Daily Word Quest
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-black bg-emerald-300 px-2 py-0.5 text-[10px] font-black uppercase text-black">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Active
                </span>
              </div>

              {/* 4 Pill Boxes like screenshot countdown */}
              <div className="mt-3 grid grid-cols-4 gap-2">
                <div className="rounded-xl border-2 border-black bg-white dark:bg-zinc-900 p-2 text-center shadow-[2px_2px_0px_#000000]">
                  <p className="font-fredoka text-base sm:text-lg font-black text-black dark:text-white leading-none">
                    07
                  </p>
                  <p className="mt-1 text-[9px] font-black uppercase text-zinc-600 dark:text-zinc-400">
                    Streak
                  </p>
                </div>
                <div className="rounded-xl border-2 border-black bg-white dark:bg-zinc-900 p-2 text-center shadow-[2px_2px_0px_#000000]">
                  <p className="font-fredoka text-base sm:text-lg font-black text-black dark:text-white leading-none">
                    15m
                  </p>
                  <p className="mt-1 text-[9px] font-black uppercase text-zinc-600 dark:text-zinc-400">
                    Daily
                  </p>
                </div>
                <div className="rounded-xl border-2 border-black bg-white dark:bg-zinc-900 p-2 text-center shadow-[2px_2px_0px_#000000]">
                  <p className="font-fredoka text-base sm:text-lg font-black text-black dark:text-white leading-none">
                    50K
                  </p>
                  <p className="mt-1 text-[9px] font-black uppercase text-zinc-600 dark:text-zinc-400">
                    Words
                  </p>
                </div>
                <div className="rounded-xl border-2 border-black bg-white dark:bg-zinc-900 p-2 text-center shadow-[2px_2px_0px_#000000]">
                  <p className="font-fredoka text-base sm:text-lg font-black text-amber-500 leading-none">
                    4.9★
                  </p>
                  <p className="mt-1 text-[9px] font-black uppercase text-zinc-600 dark:text-zinc-400">
                    Rating
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Mini-Spelling Playground */}
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-fredoka text-xs font-bold text-black/70 dark:text-zinc-300">
                  Hear &amp; Spell Quick Word:
                </p>
                <button
                  type="button"
                  onClick={speakWord}
                  className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-amber-400 px-3 py-1 font-fredoka text-xs font-bold text-black shadow-[2px_2px_0px_#000000] hover:bg-amber-300 active:translate-x-[1px] active:translate-y-[1px]"
                >
                  <Volume2 className={`h-3.5 w-3.5 ${isSpeaking ? "animate-spin" : ""}`} />
                  Pronounce
                </button>
              </div>

              {/* Clue description */}
              <div className="rounded-xl border-2 border-black bg-white dark:bg-zinc-800 p-2.5 text-xs font-bold text-zinc-800 dark:text-zinc-200 shadow-[2px_2px_0px_#000000]">
                {SAMPLE_CLUE}
              </div>

              {/* Word Letter Slots */}
              <div className="flex items-center justify-center gap-1.5 py-1">
                {SAMPLE_WORD.split("").map((targetChar, index) => {
                  const typed = typedLetters[index]
                  const isMatch = typed === targetChar
                  return (
                    <div
                      key={index}
                      className={`flex h-10 w-9 sm:h-11 sm:w-10 items-center justify-center rounded-xl border-2 border-black font-fredoka text-base sm:text-lg font-black shadow-[2px_2px_0px_#000000] transition-transform ${
                        typed
                          ? isMatch
                            ? "bg-emerald-300 text-black scale-105"
                            : "bg-rose-300 text-black"
                          : "bg-[#FAF6ED] dark:bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {typed || "_"}
                    </div>
                  )
                })}
              </div>

              {/* Scrambled Clickable Letter Chips */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                {SCRAMBLED_LETTERS.map((letter, idx) => (
                  <button
                    key={`${letter}-${idx}`}
                    type="button"
                    onClick={() => handleLetterClick(letter)}
                    disabled={isWordComplete}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-white dark:bg-zinc-800 font-fredoka text-sm font-black text-black dark:text-white shadow-[2px_2px_0px_#000000] transition-all hover:bg-amber-300 active:translate-x-[1px] active:translate-y-[1px] disabled:opacity-50"
                  >
                    {letter}
                  </button>
                ))}
                {typedLetters.length > 0 && (
                  <button
                    type="button"
                    onClick={handleReset}
                    title="Reset word"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-zinc-200 text-black shadow-[2px_2px_0px_#000000]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Success Badge */}
              {isWordComplete && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-black bg-emerald-300 p-2 font-fredoka text-xs font-black text-black shadow-[2px_2px_0px_#000000]"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Brilliant! You spelled it right! ⭐
                </motion.div>
              )}
            </div>

            {/* Divider with Center Badge */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="w-full border-t-2 border-black dark:border-zinc-700" />
              <div className="absolute flex h-7 w-7 items-center justify-center rounded-full border-2 border-black bg-amber-400 text-black shadow-[1px_1px_0px_#000000]">
                <Volume2 className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Big Bold Orange CTA Button (Matching Screenshot "Buy Now" button style) */}
            <Link
              href="/categories"
              className="group flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-black bg-amber-400 py-3.5 px-6 font-fredoka text-base sm:text-lg font-black uppercase text-black shadow-[4px_4px_0px_#000000] transition-all hover:bg-amber-300 hover:shadow-[5px_5px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000000]"
            >
              Start Practice Adventure
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>

            {/* Safety & Trust Note */}
            <p className="mt-3 text-center font-fredoka text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
              ✓ 100% Free &amp; Kid Safe • No In-App Ads • Grade 1–8 Vocabulary
            </p>
          </motion.div>

          {/* Right Mascot Column */}
          <div className="order-3 flex justify-center lg:pt-10">
            <RightMascot />
          </div>

        </div>

      </div>
    </section>
  )
}
