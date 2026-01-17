"use client"
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const CategoryCard = ({ category }) => {
  return (
    <div className="
      relative h-full min-h-[220px] sm:min-h-[260px] 
      rounded-2xl shadow-lg overflow-hidden 
      flex flex-col justify-between
      transition-all duration-500 hover:shadow-2xl
      w-full bg-slate-900 group
    ">
      
      {/* --- Background Image Layer --- */}
      <div 
        className="absolute inset-0 z-0 transition-transform duration-1000 ease-out group-hover:scale-105"
        style={{ 
          backgroundImage: `url(/${category.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      {/* --- Dark Scrim Overlays --- */}
      <div className="absolute inset-0 z-10 bg-black/40 group-hover:bg-black/45 transition-colors duration-500" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-transparent to-black/30" />

      {/* --- Content Layer --- */}
      <div className="relative z-20 flex flex-col h-full text-white">
        
        {/* Top - Name + Rating */}
        <div className="px-5 sm:px-7 pt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight drop-shadow-md">
              {category.name}
            </h3>
            <span className="
              bg-white/10 backdrop-blur-md text-white px-2.5 py-1 
              text-xs font-bold rounded-full border border-white/20
            ">
              <span className="text-amber-400 mr-1">★</span> {category.rating || 4.8}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="px-5 sm:px-7 pb-4 flex-grow">
          <p className="
            text-sm sm:text-base
            font-medium leading-relaxed
            text-slate-200/90
            line-clamp-2
          ">
            {category.description}
          </p>
        </div>

        {/* Bottom - Stats & Action */}
        <div className="
          px-5 sm:px-7 py-5 
          flex items-center justify-between
          bg-gradient-to-t from-black/50 to-transparent
        ">
          {/* High Score - Bottom Left (Subtle) */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Best Score</span>
            <span className="text-sm font-bold text-white">{category.highScore || 45}</span>
          </div>

          {/* Squircle Action Button - Bottom Right */}
          <Link 
            href={`/categories/${category.name.toLowerCase()}`}
            className="
              flex items-center gap-2 px-5 py-2.5 
              bg-white text-black rounded-md 
              text-[11px] font-black uppercase tracking-tight
              transition-all duration-300
              hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-500/30
              active:scale-95
            "
          >
            Start  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CategoryCard
