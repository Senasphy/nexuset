"use client"

import { Globe, Send, Linkedin, Instagram, Github, UserCheck } from "lucide-react"

const DEVELOPER_NAME = "Sena Abebe"
const DEVELOPER_TITLE = "Full Stack Developer & Educator"

const SOCIAL_LINKS = {
  portfolio: "https://sena-works.vercel.app",
  telegram: "https://t.me/SM10AR",
  linkedin: "https://www.linkedin.com/in/sena-abebe-430460289",
  instagram: "https://www.instagram.com/senasphy?igsh=MTEzejc1anI2YmlqdQ==",
  github: "https://github.com/Senasphy",
}

const SOCIAL_ITEMS = [
  { label: "Portfolio", icon: Globe, href: SOCIAL_LINKS.portfolio },
  { label: "Telegram", icon: Send, href: SOCIAL_LINKS.telegram },
  { label: "LinkedIn", icon: Linkedin, href: SOCIAL_LINKS.linkedin },
  { label: "Instagram", icon: Instagram, href: SOCIAL_LINKS.instagram },
  { label: "GitHub", icon: Github, href: SOCIAL_LINKS.github },
]

export default function AboutSection() {
  return (
    <section id="about" className="py-20 border-t-2 border-black/10 dark:border-white/10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Narrative (Left) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-amber-400 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_#000000]">
              <UserCheck className="h-3.5 w-3.5" />
              Why I Built This
            </div>

            <h2 className="font-fredoka text-[clamp(2.2rem,4.5vw,3.4rem)] font-black uppercase tracking-wide text-black dark:text-white drop-shadow-[2px_2px_0px_#f59e0b] leading-tight">
              Built so kids truly love learning to spell
            </h2>

            <div className="space-y-4 font-fredoka text-base font-semibold text-black/80 dark:text-zinc-300 leading-relaxed">
              <p>
                Most spelling tools are either dry flashcards or noisy casino-like games. I wanted
                a warm, encouraging place in the middle that feels delightfully playful, calm, and rewarding.
              </p>
              <p>
                Nexuset started as a passion project to give young learners an audio-first recall experience that builds real vocabulary that stays with them forever.
              </p>
            </div>
          </div>

          {/* Developer Card (Right - Collector / Comic Trading Card) */}
          <div className="lg:col-span-5">
            <div className="rounded-[32px] border-[2.5px] border-black bg-white dark:bg-zinc-900 p-6 sm:p-7 shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#3f3f46]">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-black bg-amber-400 text-black font-fredoka text-xl font-black shadow-[3px_3px_0px_#000000]">
                  SA
                </div>
                <div>
                  <h3 className="font-fredoka text-xl font-black text-black dark:text-white">
                    {DEVELOPER_NAME}
                  </h3>
                  <p className="font-fredoka text-xs font-bold text-zinc-600 dark:text-zinc-400">
                    {DEVELOPER_TITLE}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border-2 border-black bg-[#FAF6ED] dark:bg-zinc-800 p-4 shadow-[2px_2px_0px_#000000]">
                <p className="font-fredoka text-xs sm:text-sm font-semibold text-black dark:text-zinc-100 leading-relaxed italic">
                  &ldquo;Active recall, sound-first practice, and clean feedback loops make learning feel like second nature.&rdquo;
                </p>
              </div>

              <div className="mt-5 pt-4 border-t-2 border-black/10 dark:border-white/10">
                <p className="font-fredoka text-xs font-black uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-3">
                  Connect &amp; Say Hello
                </p>
                <div className="flex flex-wrap gap-2">
                  {SOCIAL_ITEMS.map((item) => {
                    const Icon = item.icon
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-amber-400 px-3 py-1.5 font-fredoka text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000000] transition-all hover:bg-amber-300 hover:shadow-[3px_3px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px]"
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {item.label}
                      </a>
                    )
                  })}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
