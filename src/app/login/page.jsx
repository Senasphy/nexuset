'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import Cookies from 'js-cookie'

export default function LoginPage() {
  const { login, signInWithGoogle} = useAuth()
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

      Cookies.set('session', 'true', { expires: 7 })
      router.push('/categories')
    } catch (err) {
      setError(err.message || 'Invalid email or password')
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
    <div className="w-screen h-screen flex overflow-hidden bg-white dark:bg-[#0a0f1e]">
      {/* Image - hidden on mobile */}
      <div className="hidden md:block md:w-1/2 h-full">
        <img
          src="/girlbg.jpg"
          alt="Background"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white dark:bg-[#0a0f1e] overflow-y-auto">
        <div className="w-full max-w-md px-8 py-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white tracking-tight">
              Log In
            </h1>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <p className="text-red-600 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 py-2 rounded border dark:border-red-900/50">
                {error}
              </p>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-slate-400 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                required
                className="block w-full px-4 py-2 bg-white dark:bg-[#161b2c] border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 dark:text-slate-400 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                required
                className="block w-full px-4 py-2 bg-white dark:bg-[#161b2c] border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <p className="mt-1.5 text-xs text-gray-500 dark:text-slate-600 italic">
                Minimum 8 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 mt-2 bg-blue-600 text-white font-medium rounded-lg transition-colors
                ${isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-between">
            <span className="w-1/4 border-b border-gray-300 dark:border-white/5"></span>
            <span className="text-md text-gray-400 dark:text-slate-600   font-bold">or continue with</span>
            <span className="w-1/4 border-b border-gray-300 dark:border-white/5"></span>
          </div>

          <div className="mt-6 flex gap-4">
            <button 
              onClick={handleGoogleSignIn}
              className="w-full py-3 border border-gray-300 dark:border-white/10 rounded-lg font-medium flex items-center justify-center gap-3 bg-white dark:bg-[#161b2c] hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-white transition"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              <span>Google</span>
            </button>
          </div>

          <p className="mt-10 text-center text-md text-gray-600 dark:text-slate-500">
            Don't have an account?{' '}
            <Link href="/sign-up" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
