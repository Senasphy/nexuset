"use client"
import Link from 'next/link'
import { BookOpen, Sigma, FlaskConical, PenLine, Globe2, ArrowRight } from 'lucide-react'

const CategoryCard = ({ category }) => {
  const configMap = {
    General: { icon: BookOpen, tag: "Essential Words", bg: "bg-sky-300", accent: "text-sky-900" },
    Math: { icon: Sigma, tag: "Numbers & Logic", bg: "bg-amber-300", accent: "text-amber-900" },
    Science: { icon: FlaskConical, tag: "Discover & Space", bg: "bg-emerald-300", accent: "text-emerald-900" },
    English: { icon: PenLine, tag: "Grammar & Vocab", bg: "bg-purple-300", accent: "text-purple-900" },
    Geography: { icon: Globe2, tag: "World & Maps", bg: "bg-rose-300", accent: "text-rose-900" },
  }
  
  const config = configMap[category.name] || { icon: BookOpen, tag: "Word Quest", bg: "bg-amber-300", accent: "text-amber-900" }
  const Icon = config.icon

  return (
    <Link
      href={`/categories/${category.name.toLowerCase()}`}
      className="group relative flex h-full flex-col justify-between rounded-[28px] border-[2.5px] border-black bg-white dark:bg-zinc-900 p-6 sm:p-7 shadow-[5px_5px_0px_#000000] dark:shadow-[5px_5px_0px_#3f3f46] transition-all hover:-translate-y-1 hover:shadow-[7px_7px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000000]"
    >
      <div>
        <div className="flex items-center justify-between">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-black ${config.bg} shadow-[2px_2px_0px_#000000]`}>
            <Icon className="h-6 w-6 text-black" strokeWidth={2.5} />
          </div>
          <span className="inline-flex items-center rounded-full border-2 border-black bg-[#FAF6ED] dark:bg-zinc-800 px-3 py-1 font-fredoka text-[11px] font-black uppercase tracking-wider text-black dark:text-zinc-200 shadow-[1px_1px_0px_#000000]">
            {config.tag}
          </span>
        </div>

        <div className="mt-5 space-y-2">
          <h3 className="font-fredoka text-2xl font-black tracking-tight text-black dark:text-white">
            {category.name}
          </h3>
          <p className="font-fredoka text-sm font-semibold text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {category.description}
          </p>
        </div>
      </div>

      <div className="mt-7 flex items-center justify-between border-t-2 border-black/10 dark:border-white/10 pt-4">
        <span className="font-fredoka text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Ready to spell?
        </span>
        <div className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-amber-400 px-4 py-2 font-fredoka text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000000] transition-transform group-hover:bg-amber-300 group-hover:translate-x-0.5">
          Start Quest <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  )
}

export default CategoryCard
