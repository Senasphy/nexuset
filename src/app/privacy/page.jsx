import Link from "next/link"
import { ArrowLeft, ShieldCheck } from "lucide-react"

export const metadata = {
  title: "Privacy Policy",
  description: "What nexuset stores, why it stores it, and how to have it removed.",
}

const LAST_UPDATED = "18 October 2026"

export default function PrivacyPage() {
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
          <ShieldCheck className="h-6 w-6 text-emerald-500" />
          <h1 className="font-fredoka text-3xl sm:text-4xl font-black uppercase tracking-wide">
            Privacy Policy
          </h1>
        </div>
        <p className="mt-1 font-fredoka text-xs font-bold text-zinc-500">Last updated: {LAST_UPDATED}</p>

        <div className="mt-8 space-y-6 font-fredoka text-sm font-semibold text-zinc-700 dark:text-zinc-300 leading-relaxed">
          <section className="space-y-2 rounded-2xl border-2 border-black bg-[#FAF6ED] dark:bg-zinc-800 p-5 shadow-[2px_2px_0px_#000000]">
            <h2 className="text-lg font-black text-black dark:text-white">
              What gets stored
            </h2>
            <p>
              Accounts are handled by Firebase Authentication. If you sign up with email, that means
              your email address and a password hash that we never see. If you sign in with Google,
              we receive the name, email address, and profile photo on that Google account.
            </p>
            <p>
              When you finish a practice session, we save a record of it: the category, the
              difficulty, how long it took, how many questions you answered, and how many you got
              right. That record is tied to your account so the stats page can show your history.
            </p>
          </section>

          <section className="space-y-2 rounded-2xl border-2 border-black bg-[#FAF6ED] dark:bg-zinc-800 p-5 shadow-[2px_2px_0px_#000000]">
            <h2 className="text-lg font-black text-black dark:text-white">
              What it is used for
            </h2>
            <p>
              Session records exist to draw your own charts, badges, and streaks. They are never sold,
              shared with third-party advertisers, or used for tracking. A single session cookie ensures
              you stay signed in across practice runs.
            </p>
          </section>

          <section className="space-y-2 rounded-2xl border-2 border-black bg-[#FAF6ED] dark:bg-zinc-800 p-5 shadow-[2px_2px_0px_#000000]">
            <h2 className="text-lg font-black text-black dark:text-white">
              Children&apos;s Safety
            </h2>
            <p>
              Nexuset is built for young spellers. We do not show ads, collect unnecessary personal
              identifiers, or track kids across other websites. All learning content is family-friendly.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
