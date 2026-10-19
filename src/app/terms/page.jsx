import Link from "next/link"
import { ArrowLeft, BookCheck } from "lucide-react"

export const metadata = {
  title: "Terms of Service",
  description: "The short version of what you can expect from nexuset, and what it expects of you.",
}

const LAST_UPDATED = "18 October 2026"

export default function TermsPage() {
  return (
    <div className="min-h-[100dvh] bg-[#FAF6ED] dark:bg-zinc-950 text-black dark:text-white py-12 px-4 sm:px-6">
      <main id="main" className="mx-auto max-w-3xl rounded-[32px] border-[2.5px] border-black bg-white dark:bg-zinc-900 p-8 sm:p-12 shadow-[6px_6px_0px_#000000]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-amber-400 px-4 py-1.5 font-fredoka text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000000] hover:bg-amber-300 transition-all active:translate-x-[1px] active:translate-y-[1px]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mt-8 flex items-center gap-2">
          <BookCheck className="h-6 w-6 text-amber-500" />
          <h1 className="font-fredoka text-3xl sm:text-4xl font-black uppercase tracking-wide">
            Terms of Service
          </h1>
        </div>
        <p className="mt-1 font-fredoka text-xs font-bold text-zinc-500">Last updated: {LAST_UPDATED}</p>

        <div className="mt-8 space-y-6 font-fredoka text-sm font-semibold text-zinc-700 dark:text-zinc-300 leading-relaxed">
          <section className="space-y-2 rounded-2xl border-2 border-black bg-[#FAF6ED] dark:bg-zinc-800 p-5 shadow-[2px_2px_0px_#000000]">
            <h2 className="text-lg font-black text-black dark:text-white">
              Using the app
            </h2>
            <p>
              Nexuset is free to use for practice and vocabulary study. Keep one profile per learner,
              and enjoy the practice quests respectfully.
            </p>
          </section>

          <section className="space-y-2 rounded-2xl border-2 border-black bg-[#FAF6ED] dark:bg-zinc-800 p-5 shadow-[2px_2px_0px_#000000]">
            <h2 className="text-lg font-black text-black dark:text-white">
              What we provide
            </h2>
            <p>
              Nexuset provides interactive spelling questions, audio synthesis pronunciation, and
              progress tracking. We continuously improve word lists and features to make learning fun and effective.
            </p>
          </section>

          <section className="space-y-2 rounded-2xl border-2 border-black bg-[#FAF6ED] dark:bg-zinc-800 p-5 shadow-[2px_2px_0px_#000000]">
            <h2 className="text-lg font-black text-black dark:text-white">
              Content &amp; Accuracy
            </h2>
            <p>
              Definitions and word lists are curated for grade-level vocabulary learning. If you
              spot a typo or notice an audio pronunciation error, feel free to report it so we can improve it for everyone!
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
