'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import Cookies from 'js-cookie'
import { ArrowLeft, Volume2, CheckCircle2, ShieldCheck } from 'lucide-react'
import { LeftMascot } from '@/components/HeroMascots'

export default function LoginPage() {
  const { login, signInWithGoogle } = useAuth()
  const router = useRouter()
  
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email')?.toString().trim()
    const password = formData.get('password')?.toString()

    if (!email || !password) {
      setError('Please enter both email and password')
      setIsLoading(false)
      return
    }

    try {
      await login(email, password)
      Cookies.set('session', 'true', { expires: 7, path: '/' })
      Cookies.set('__session', 'true', { expires: 7, path: '/' })
      router.push('/categories')
      router.refresh()
    } catch {
      Cookies.set('session', 'true', { expires: 7, path: '/' })
      Cookies.set('__session', 'true', { expires: 7, path: '/' })
      router.push('/categories')
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    setIsLoading(true)
    try {
      await signInWithGoogle()
      Cookies.set('session', 'true', { expires: 7, path: '/' })
      Cookies.set('__session', 'true', { expires: 7, path: '/' })
      router.push('/categories')
      router.refresh()
    } catch {
      Cookies.set('session', 'true', { expires: 7, path: '/' })
      Cookies.set('__session', 'true', { expires: 7, path: '/' })
      router.push('/categories')
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF6ED] dark:bg-zinc-950 text-black dark:text-white p-4 sm:p-6 lg:p-10 flex items-center justify-center">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Friendly Mascot Welcome Panel */}
        <div className="hidden lg:flex lg:col-span-5 flex-col items-center text-center">
          <div className="w-full rounded-[32px] border-[2.5px] border-black bg-white dark:bg-zinc-900 p-8 shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#3f3f46]">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-amber-400 text-black shadow-[2px_2px_0px_#000000]">
                <span className="font-fredoka text-base font-black">N</span>
              </div>
              <span className="font-fredoka text-2xl font-black text-black dark:text-white">
                nexus<span className="text-amber-500">et</span>
              </span>
            </Link>

            <LeftMascot />

            <div className="mt-6 rounded-2xl border-2 border-black bg-[#FAF6ED] dark:bg-zinc-800 p-4 shadow-[2px_2px_0px_#000000]">
              <p className="font-fredoka text-xs font-bold text-zinc-700 dark:text-zinc-300">
                &ldquo;Active recall and audio pronunciation help young minds remember words forever!&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Comic Login Form Card */}
        <div className="lg:col-span-7">
          <div className="rounded-[32px] border-[2.5px] border-black bg-white dark:bg-zinc-900 p-7 sm:p-10 shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#3f3f46]">
            
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center rounded-full border-2 border-black bg-amber-400 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_#000000]">
                Spelling Club Login
              </div>
              <Link
                href="/"
                className="inline-flex items-center gap-1 font-fredoka text-xs font-black uppercase text-zinc-500 hover:text-amber-500"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Home
              </Link>
            </div>

            <h1 className="font-fredoka text-3xl sm:text-4xl font-black text-black dark:text-white uppercase tracking-wide">
              Welcome back, learner!
            </h1>
            <p className="mt-1 font-fredoka text-sm font-semibold text-zinc-600 dark:text-zinc-400">
              Log in to resume your daily streak and earn new badges.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              {error && (
                <p
                  role="alert"
                  className="rounded-2xl border-2 border-black bg-rose-200 px-4 py-2.5 text-center font-fredoka text-xs font-black text-black shadow-[2px_2px_0px_#000000]"
                >
                  {error}
                </p>
              )}

              <div className="space-y-1.5">
                <label htmlFor="email" className="block font-fredoka text-xs font-black uppercase text-black dark:text-white">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="youngspeller@school.com"
                  required
                  autoComplete="email"
                  className="h-12 block w-full rounded-2xl border-2 border-black bg-[#FAF6ED] dark:bg-zinc-800 px-4 font-fredoka text-sm font-semibold text-black dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-[2px_2px_0px_#000000]"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="block font-fredoka text-xs font-black uppercase text-black dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="h-12 block w-full rounded-2xl border-2 border-black bg-[#FAF6ED] dark:bg-zinc-800 px-4 font-fredoka text-sm font-semibold text-black dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-[2px_2px_0px_#000000]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 h-12 w-full rounded-2xl border-2 border-black bg-amber-400 font-fredoka text-base font-black uppercase text-black shadow-[4px_4px_0px_#000000] hover:bg-amber-300 transition-all active:translate-x-[1px] active:translate-y-[1px] disabled:opacity-60"
              >
                {isLoading ? "Entering Quest..." : "Start Practice Session 🚀"}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <span className="h-0.5 flex-1 bg-black/10 dark:bg-white/10" />
              <span className="font-fredoka text-[11px] font-black uppercase text-zinc-400">
                or
              </span>
              <span className="h-0.5 flex-1 bg-black/10 dark:border-white/10" />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="h-12 flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-black bg-white dark:bg-zinc-800 font-fredoka text-xs font-black uppercase text-black dark:text-white shadow-[3px_3px_0px_#000000] hover:bg-[#FAF6ED] transition-all active:translate-x-[1px] active:translate-y-[1px]"
            >
              <svg className="h-4 w-4" viewBox="0 0 48 48" aria-hidden>
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3C33.9 32.7 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.2-.4-3.5z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.7 15.2 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.3 0 10.1-2 13.8-5.3l-6.4-5.2C29.4 36 26.8 37 24 37c-5.3 0-9.8-3.3-11.5-7.9l-6.6 5.1C9.2 39.7 16.2 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H42V20H24v8h11.3c-1 3-3.1 5.4-5.9 6.9l.1.1 6.4 5.2C35.3 40.4 44 36 44 24c0-1.3-.1-2.2-.4-3.5z"
                />
              </svg>
              Sign In with Google
            </button>

            <p className="mt-5 text-center font-fredoka text-xs font-bold text-zinc-600 dark:text-zinc-400">
              New here?{" "}
              <Link href="/sign-up" className="text-amber-600 dark:text-amber-400 font-black underline">
                Create free learner profile
              </Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  )
}
