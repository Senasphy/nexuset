"use client"
import Link from 'next/link'

const CategoryCard = ({ category }) => {
  return (
    <Link 
      href={`/categories/${category.name.toLowerCase()}`} 
      style={{ textDecoration: 'none' }}
      className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500/50 rounded-2xl"
    >
      <div
        className={`
          rounded-3xl shadow-lg overflow-hidden
          flex flex-col justify-between
          transition-all duration-300
          hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1
          active:scale-[0.99]
          h-full min-h-[220px] sm:min-h-[260px]
          text-neutral-950 dark:text-neutral-950
          w-full
        `}
        style={{ backgroundColor: category.background }}
      >
        {/* Top - Name + Rating */}
        <div className="px-5 sm:px-7 pt-6 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              {category.name}
            </h3>
            <span className="
              bg-white/95 px-3 py-1 
              text-sm font-semibold rounded-full 
              shadow-sm
            ">
              ★ {category.rating || 4.8}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="px-5 sm:px-7 pb-6 flex-grow">
          <p className="
            text-base sm:text-lg 
            leading-relaxed
          ">
            {category.description}
          </p>
        </div>

        {/* Bottom - High Score */}
        <div className="
          px-5 sm:px-7 py-4 
          bg-black/8
          border-t border-black/10
        ">
          <p className="text-sm sm:text-base font-medium">
            High Score: <span className="font-bold">{category.highScore || 45}</span>
          </p>
        </div>
      </div>
    </Link>
  )
}

export default CategoryCard
