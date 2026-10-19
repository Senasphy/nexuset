import Link from "next/link"
import { ArrowUp } from "lucide-react"

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
]

export default function Footer() {
  return (
    <footer className="border-t-2 border-black/10 dark:border-white/10 bg-[#FAF6ED] dark:bg-zinc-950 text-black dark:text-white py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 sm:px-6 md:flex-row md:justify-between">
        <div className="flex flex-col items-center gap-1.5 md:items-start text-center md:text-left">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-black bg-amber-400 text-black shadow-[1px_1px_0px_#000000]">
              <span className="font-fredoka text-xs font-black">N</span>
            </div>
            <span className="font-fredoka text-xl font-black tracking-tight text-black dark:text-white">
              nexus<span className="text-amber-500">et</span>
            </span>
          </Link>
          <p className="font-fredoka text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            &copy; {new Date().getFullYear()} Nexuset · Sound-first spelling practice for curious young minds.
          </p>
        </div>

        <nav className="flex items-center gap-4 font-fredoka text-xs font-bold uppercase tracking-wider" aria-label="Footer Navigation">
          {LEGAL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-zinc-600 dark:text-zinc-400 transition-colors hover:text-amber-500"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#top"
            className="inline-flex items-center gap-1 rounded-xl border-2 border-black bg-amber-400 px-3.5 py-1.5 font-fredoka text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000000] transition-all hover:bg-amber-300 active:translate-x-[1px] active:translate-y-[1px]"
          >
            Top <ArrowUp className="h-3.5 w-3.5" />
          </Link>
        </nav>
      </div>
    </footer>
  )
}
