import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
  onClick?: () => void
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1.5', className)}>
      <Home className="size-3.5 flex-shrink-0 text-slate-400" aria-hidden />
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-1.5">
          <ChevronRight className="size-3 flex-shrink-0 text-slate-400" aria-hidden />
          {idx === items.length - 1 ? (
            <span
              className="text-xs font-semibold text-[var(--navy,#102A43)] select-none"
              aria-current="page"
            >
              {item.label}
            </span>
          ) : (
            <button
              type="button"
              data-dropdown-trigger="true"
              onClick={item.onClick}
              className="text-xs font-medium text-slate-600 transition-colors duration-150 !transform-none !shadow-none hover:text-[var(--gold,#B8862C)] hover:no-underline outline-none cursor-pointer"
            >
              {item.label}
            </button>
          )}
        </span>
      ))}
    </nav>
  )
}
