"use client"
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Sidebar from '@/components/sidebar'
import { Menu, LogOut } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'
import useQuizStore from '@/stores/quizStore'
import categories from './categoryList'
import CategoryCard from '@/components/category-card'

const CategoryPage = () => {
  const { username, logout } = useAuth()
  const router = useRouter()

  const { setIsSidebarOpen, isSidebarOpen, } = useQuizStore(
    useShallow((state) => ({
      setIsSidebarOpen: state.setIsSidebarOpen,
      isSidebarOpen: state.isSidebarOpen,
      setCategory: state.setCategory,
      category: state.category
    }))
  )

  const handleSignOut = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (err) {
      console.error('Error signing out:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-black relative overflow-hidden">
      {/* Sidebar mobile backdrop – NO BLUR */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/45 z-30 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Header - glassmorphism */}
      <header className="sticky flex items-between w-full top-0 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/30 shadow-sm">
        <div className=" w-full mx-auto px-5 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={handleSignOut}
            className="group flex items-center gap-2.5 text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 transition-all font-medium"
          >
            <LogOut size={18} />
            <span className="text-base sm:text-lg">Sign out</span>
          </button>


          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-600/40 hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all shadow-sm"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-7 w-7 text-neutral-700 dark:text-neutral-300" strokeWidth={2.2} />
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Greeting */}
        <div className="text-center mb-14 md:mb-20 space-y-4 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-5 dark:opacity-8 pointer-events-none">
            <div className="w-64 h-64 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight relative">
            Welcome{username ? `, ${username}` : ''}
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Choose your practice category and let's sharpen those spelling skills
          </p>
        </div>

        {/* Categories */}
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3  ">
          {categories.map((item) => (
            <CategoryCard category={item} key={item.description} />
          ))}
        </div>
      </main>

      <Sidebar />
    </div>
  )
}

export default CategoryPage
