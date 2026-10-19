"use client"

import { motion } from "motion/react"

export function LeftMascot() {
  return (
    <div className="relative flex flex-col items-center">
      {/* Comic Thought Bubble */}
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative mb-3 max-w-[210px] rounded-3xl border-2 border-black bg-zinc-900 p-3.5 text-center text-white shadow-[3px_3px_0px_#000000]"
      >
        <p className="font-fredoka text-xs font-bold leading-tight">
          &ldquo;Hear the sounds, spell the letters! You got this!&rdquo; 🐸
        </p>
        {/* Thought bubble trail dots */}
        <div className="absolute -bottom-3 left-10 h-3 w-3 rounded-full border-2 border-black bg-zinc-900" />
        <div className="absolute -bottom-6 left-7 h-2 w-2 rounded-full border-2 border-black bg-zinc-900" />
      </motion.div>

      {/* Sombrero Frog Character (Inspired by the Screenshot Mascot) */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <svg
          viewBox="0 0 240 220"
          className="h-48 w-48 sm:h-56 sm:w-56 drop-shadow-[4px_6px_0px_rgba(0,0,0,0.15)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sombrero Brim (Large curved oval) */}
          <ellipse
            cx="120"
            cy="70"
            rx="110"
            ry="32"
            fill="#E11D48"
            stroke="#000000"
            strokeWidth="4"
          />
          {/* Sombrero Brim Inner Yellow Band */}
          <ellipse
            cx="120"
            cy="70"
            rx="96"
            ry="24"
            fill="#FBBF24"
            stroke="#000000"
            strokeWidth="3"
          />
          {/* Decorative Triangles on Brim */}
          <path
            d="M40 70 L50 64 L60 70 L70 64 L80 70 L90 64 L100 70 L110 64 L120 70 L130 64 L140 70 L150 64 L160 70 L170 64 L180 70 L190 64 L200 70"
            stroke="#000000"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Sombrero Crown (Cone) */}
          <path
            d="M85 64 C88 20, 152 20, 155 64 Z"
            fill="#E11D48"
            stroke="#000000"
            strokeWidth="4"
          />
          {/* Sombrero Crown Color Stripes */}
          <path
            d="M92 46 C105 38, 135 38, 148 46"
            stroke="#FBBF24"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M97 34 C107 28, 133 28, 143 34"
            stroke="#06B6D4"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Frog Body / Red Jacket */}
          <path
            d="M80 145 C65 170, 70 210, 120 210 C170 210, 175 170, 160 145 Z"
            fill="#E11D48"
            stroke="#000000"
            strokeWidth="4"
          />
          {/* Yellow Jacket Collar */}
          <path
            d="M100 145 L120 170 L140 145 Z"
            fill="#FBBF24"
            stroke="#000000"
            strokeWidth="3"
          />

          {/* Frog Head */}
          <ellipse
            cx="120"
            cy="120"
            rx="56"
            ry="40"
            fill="#22C55E"
            stroke="#000000"
            strokeWidth="4"
          />

          {/* Left Eye Dome */}
          <circle
            cx="96"
            cy="98"
            r="22"
            fill="#22C55E"
            stroke="#000000"
            strokeWidth="4"
          />
          {/* Right Eye Dome */}
          <circle
            cx="144"
            cy="98"
            r="22"
            fill="#22C55E"
            stroke="#000000"
            strokeWidth="4"
          />

          {/* Left Eye White & Big Pupil with Catchlights */}
          <circle cx="96" cy="98" r="16" fill="#FFFFFF" stroke="#000000" strokeWidth="3" />
          <circle cx="98" cy="98" r="11" fill="#000000" />
          <circle cx="95" cy="94" r="4.5" fill="#FFFFFF" />
          <circle cx="102" cy="101" r="2.5" fill="#FFFFFF" />

          {/* Right Eye White & Big Pupil with Catchlights */}
          <circle cx="144" cy="98" r="16" fill="#FFFFFF" stroke="#000000" strokeWidth="3" />
          <circle cx="142" cy="98" r="11" fill="#000000" />
          <circle cx="139" cy="94" r="4.5" fill="#FFFFFF" />
          <circle cx="146" cy="101" r="2.5" fill="#FFFFFF" />

          {/* Rosy Cheeks */}
          <ellipse cx="78" cy="126" rx="9" ry="6" fill="#F87171" opacity="0.75" />
          <ellipse cx="162" cy="126" rx="9" ry="6" fill="#F87171" opacity="0.75" />

          {/* Big Happy Smile */}
          <path
            d="M92 126 C105 146, 135 146, 148 126"
            stroke="#000000"
            strokeWidth="4"
            strokeLinecap="round"
            fill="#DC2626"
          />
          {/* Tongue */}
          <path
            d="M108 136 C115 144, 125 144, 132 136"
            fill="#F472B6"
          />

          {/* Left Hand: Holding Mug */}
          <g>
            {/* White Cocoa Mug */}
            <rect
              x="110"
              y="160"
              width="34"
              height="40"
              rx="6"
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth="3.5"
            />
            {/* Mug Handle */}
            <path
              d="M144 168 C155 168, 155 186, 144 186"
              stroke="#000000"
              strokeWidth="3.5"
              fill="none"
            />
            {/* Hot cocoa top */}
            <ellipse cx="127" cy="164" rx="13" ry="4" fill="#78350F" />
            {/* Curly Steam */}
            <path
              d="M123 154 C120 148, 126 142, 123 136"
              stroke="#F59E0B"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M131 152 C134 146, 129 140, 133 134"
              stroke="#F59E0B"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Frog Fingers holding cup */}
            <circle cx="112" cy="172" r="5" fill="#22C55E" stroke="#000000" strokeWidth="2.5" />
            <circle cx="112" cy="182" r="5" fill="#22C55E" stroke="#000000" strokeWidth="2.5" />
          </g>

          {/* Right Hand: "OK" / Thumbs up sign */}
          <g>
            <path
              d="M170 162 C178 152, 192 154, 186 166 C182 174, 174 176, 168 172 Z"
              fill="#22C55E"
              stroke="#000000"
              strokeWidth="3.5"
            />
            {/* Fingers circle */}
            <circle cx="186" cy="160" r="4.5" fill="#22C55E" stroke="#000000" strokeWidth="2.5" />
            <circle cx="192" cy="166" r="4" fill="#22C55E" stroke="#000000" strokeWidth="2" />
          </g>
        </svg>
      </motion.div>
    </div>
  )
}

export function RightMascot() {
  return (
    <div className="relative flex flex-col items-center">
      {/* Retro Cartoon Screen / Speech Bubble Box (from Screenshot) */}
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative mb-3 w-[220px] rounded-2xl border-2 border-black bg-sky-100 dark:bg-sky-950 p-3 text-center shadow-[4px_4px_0px_#000000]"
      >
        {/* Antenna */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1">
          <div className="h-3 w-1 bg-black" />
          <div className="h-2 w-2 rounded-full border border-black bg-amber-400" />
        </div>

        <div className="flex items-center justify-center gap-1 text-amber-500 font-black text-sm">
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
        </div>
        <p className="mt-1 font-fredoka text-xs font-bold text-black dark:text-white leading-tight">
          &ldquo;10 in a row! You&rsquo;re a Spelling Champion!&rdquo; 🏆
        </p>
        <p className="mt-1 text-[10px] font-extrabold uppercase text-amber-600 dark:text-amber-400">
          Level 5 Master Streak
        </p>

        {/* Speech tail */}
        <div className="absolute -bottom-2.5 right-12 h-0 w-0 border-x-8 border-x-transparent border-t-8 border-t-black" />
        <div className="absolute -bottom-2 right-12 h-0 w-0 border-x-8 border-x-transparent border-t-8 border-t-sky-100 dark:border-t-sky-950" />
      </motion.div>

      {/* Cheering Buddy Character (Ecstatic Monkey / Puppy celebrating) */}
      <motion.div
        animate={{ y: [0, -5, 0], rotate: [0, 1.5, 0, -1.5, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <svg
          viewBox="0 0 220 210"
          className="h-44 w-44 sm:h-52 sm:w-52 drop-shadow-[4px_6px_0px_rgba(0,0,0,0.15)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Body */}
          <ellipse
            cx="110"
            cy="165"
            rx="52"
            ry="40"
            fill="#92400E"
            stroke="#000000"
            strokeWidth="4"
          />
          {/* Tummy */}
          <ellipse cx="110" cy="170" rx="34" ry="26" fill="#FDE68A" />

          {/* Left Paws Up in Excitement */}
          <path
            d="M60 155 C45 130, 48 105, 65 100 C75 97, 85 110, 80 135 Z"
            fill="#92400E"
            stroke="#000000"
            strokeWidth="3.5"
          />
          {/* Right Paws Up in Excitement */}
          <path
            d="M160 155 C175 130, 172 105, 155 100 C145 97, 135 110, 140 135 Z"
            fill="#92400E"
            stroke="#000000"
            strokeWidth="3.5"
          />

          {/* Ears */}
          <circle cx="58" cy="85" r="22" fill="#92400E" stroke="#000000" strokeWidth="4" />
          <circle cx="58" cy="85" r="13" fill="#FDE68A" />
          <circle cx="162" cy="85" r="22" fill="#92400E" stroke="#000000" strokeWidth="4" />
          <circle cx="162" cy="85" r="13" fill="#FDE68A" />

          {/* Head */}
          <ellipse
            cx="110"
            cy="95"
            rx="50"
            ry="44"
            fill="#92400E"
            stroke="#000000"
            strokeWidth="4"
          />
          {/* Face mask / Muzzle */}
          <ellipse cx="110" cy="105" rx="38" ry="32" fill="#FDE68A" stroke="#000000" strokeWidth="3" />

          {/* Big Wide Excited Open Mouth */}
          <path
            d="M86 106 C86 136, 134 136, 134 106 Z"
            fill="#DC2626"
            stroke="#000000"
            strokeWidth="3.5"
          />
          {/* Tongue in mouth */}
          <path
            d="M96 126 C104 134, 116 134, 124 126"
            fill="#F472B6"
          />

          {/* Big Cute Happy Eyes with Stars! */}
          {/* Left Eye */}
          <circle cx="94" cy="85" r="12" fill="#000000" />
          <circle cx="92" cy="82" r="4.5" fill="#FFFFFF" />
          <circle cx="97" cy="88" r="2" fill="#FFFFFF" />

          {/* Right Eye */}
          <circle cx="126" cy="85" r="12" fill="#000000" />
          <circle cx="124" cy="82" r="4.5" fill="#FFFFFF" />
          <circle cx="129" cy="88" r="2" fill="#FFFFFF" />

          {/* Cute Nose */}
          <ellipse cx="110" cy="98" rx="6" ry="4" fill="#000000" />

          {/* Rosy Cheeks */}
          <circle cx="80" cy="102" r="7" fill="#F87171" opacity="0.8" />
          <circle cx="140" cy="102" r="7" fill="#F87171" opacity="0.8" />
        </svg>
      </motion.div>
    </div>
  )
}
