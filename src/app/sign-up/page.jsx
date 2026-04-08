'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import Cookies from 'js-cookie'

export default function SignupPage() {
  const { signUp, signInWithGoogle } = useAuth()
  const router = useRouter()
  
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    
    const username = formData.get('username')?.toString().trim()
    const email = formData.get('email')?.toString().trim()
    const password = formData.get('password')?.toString()

    // Basic client-side validation
    if (!username || username.length < 3) {
      setError('Username must be at least 3 characters')
      setIsLoading(false)
      return
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email')
      setIsLoading(false)
      return
    }
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters')
      setIsLoading(false)
      return
    }

    try {
      await signUp(email, password, username)

      Cookies.set('session', 'true', { expires: 7 })
      router.push('/categories')
    } catch (err) {
      setError(err.message || 'Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      await signInWithGoogle();

      Cookies.set('session', 'true', { expires: 7 })
      router.push('/categories');
    } catch (err) {
      setError("Failed to sign in with Google. Try again?");
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">

      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-0 py-0 sm:px-6 sm:py-16">
        <div className="w-full min-h-screen bg-[var(--bg-surface)] px-6 py-10 sm:min-h-0 sm:max-w-md sm:rounded-[20px] sm:border sm:border-[var(--border)] sm:px-8 sm:py-10 sm:shadow-[0_24px_60px_rgba(26,25,23,0.12)]">
          <div className="space-y-2 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">
              Start fresh
            </p>
            <h1 className="font-display text-3xl font-semibold text-[var(--landing-ink)]">
              Create your account
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Set up a profile and begin new spelling sessions in minutes.
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {error && (
              <p className="rounded-[12px] border border-[var(--wrong-border)] bg-[var(--wrong-bg)] px-4 py-2 text-center text-sm text-[var(--wrong)]">
                {error}
              </p>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[var(--text-secondary)]">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Choose a username"
                required
                className="mt-2 block w-full rounded-[12px] border border-[var(--border)] bg-[var(--bg-base)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--landing-amber)] focus:outline-none focus:ring-2 focus:ring-[var(--landing-amber)]/20"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)]">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                required
                className="mt-2 block w-full rounded-[12px] border border-[var(--border)] bg-[var(--bg-base)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--landing-amber)] focus:outline-none focus:ring-2 focus:ring-[var(--landing-amber)]/20"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--text-secondary)]">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Create a password"
                required
                className="mt-2 block w-full rounded-[12px] border border-[var(--border)] bg-[var(--bg-base)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--landing-amber)] focus:outline-none focus:ring-2 focus:ring-[var(--landing-amber)]/20"
              />
              <p className="mt-2 text-xs text-[var(--text-muted)]">Must be at least 8 characters.</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full rounded-[12px] bg-[var(--landing-amber)] py-3 text-sm font-semibold text-white transition-all ${
                isLoading ? "cursor-not-allowed opacity-70" : ""
              }`}
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <span className="h-px flex-1 bg-[var(--border)]" />
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">
              or
            </span>
            <span className="h-px flex-1 bg-[var(--border)]" />
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-[12px] border border-[var(--border)] bg-[var(--bg-base)] py-3 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--border-strong)] hover:bg-[var(--bg-elevated)]"
          >
            <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden>
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
            Sign up with Google
          </button>

          <p className="mt-8 text-center text-sm text-[var(--text-secondary)]">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[var(--landing-amber)] hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
