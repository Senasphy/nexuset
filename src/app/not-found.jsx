import Link from "next/link"

export const metadata = {
  title: "Page not found",
}

const TILES = [
  { letter: "4", bg: "bg-amber-300" },
  { letter: "0", bg: "bg-rose-300" },
  { letter: "4", bg: "bg-emerald-300" },
]

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-[100dvh] flex-col items-center justify-center bg-[#FAF6ED] dark:bg-zinc-950 px-6 py-16 text-black dark:text-white antialiased">
      <div className="flex gap-3" aria-hidden>
        {TILES.map((tile, index) => (
          <span
            key={`${tile.letter}-${index}`}
            className={`flex h-20 w-16 items-center justify-center rounded-2xl border-[2.5px] border-black font-fredoka text-4xl font-black text-black shadow-[4px_4px_0px_#000000] ${tile.bg}`}
          >
            {tile.letter}
          </span>
        ))}
      </div>

      <h1 className="mt-8 max-w-lg text-center font-fredoka text-3xl sm:text-4xl font-black uppercase tracking-wide">
        That page wandered off!
      </h1>
      <p className="mt-2 max-w-md text-center font-fredoka text-sm font-semibold text-zinc-600 dark:text-zinc-300 leading-relaxed">
        We couldn&apos;t find that word quest. But lots of exciting spelling adventures are waiting!
      </p>

      <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:flex-row">
        <Link
          href="/categories"
          className="flex h-12 items-center justify-center rounded-2xl border-2 border-black bg-amber-400 px-8 font-fredoka text-xs font-black uppercase text-black shadow-[3px_3px_0px_#000000] hover:bg-amber-300 active:translate-x-[1px] active:translate-y-[1px]"
        >
          Explore Topics 🚀
        </Link>
        <Link
          href="/"
          className="flex h-12 items-center justify-center rounded-2xl border-2 border-black bg-white dark:bg-zinc-800 px-8 font-fredoka text-xs font-black uppercase text-black dark:text-white shadow-[3px_3px_0px_#000000] hover:bg-[#FAF6ED] active:translate-x-[1px] active:translate-y-[1px]"
        >
          Back to Home
        </Link>
      </div>
    </main>
  )
}
