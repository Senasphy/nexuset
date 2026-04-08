"use client"
import Link from 'next/link'
import { BookOpen, Sigma, FlaskConical, PenLine, Globe2 } from 'lucide-react'

const CategoryCard = ({ category }) => {
  const iconMap = {
    General: BookOpen,
    Math: Sigma,
    Science: FlaskConical,
    English: PenLine,
    Geography: Globe2,
  }
  const Icon = iconMap[category.name] || BookOpen

  return (
    <Link
      href={`/categories/${category.name.toLowerCase()}`}
      className="group flex h-full flex-col justify-between rounded-[10px] border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-5 transition-all duration-200 ease active:scale-[0.995] sm:min-h-[220px] sm:rounded-[12px] sm:px-7 sm:py-8 sm:hover:border-[var(--border-strong)] sm:hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] sm:active:scale-[0.98]"
    >
      <div className="flex items-start">
        <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[var(--bg-elevated)] text-[var(--text-primary)]">
          <Icon className="h-7 w-7" strokeWidth={1.6} />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <h3 className="text-2xl-display text-[var(--text-primary)]">
          <span className="relative inline-block group-hover:italic group-focus-visible:italic group-active:italic after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[var(--accent)] after:transition-[width] after:duration-150 after:ease-out group-hover:after:w-full group-focus-visible:after:w-full group-active:after:w-full">
            {category.name}
          </span>
        </h3>
        <p className="text-sm-body text-[var(--text-secondary)]">{category.description}</p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="group/button flex items-center gap-2 rounded-[999px] border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-all duration-200 hover:-translate-y-[1px] hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white hover:shadow-[0_2px_6px_rgba(217,119,87,0.12)]">
          Practice
          <span className="text-[1rem] transition-transform duration-200 group-hover/button:translate-x-1">→</span>
        </div>
      </div>
    </Link>
  )
}

export default CategoryCard
