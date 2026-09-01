import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  width?:     string
  height?:    string
}

/** Skeleton loading placeholder — use while data is fetching for non-table areas */
export function Skeleton({ className, width, height }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md', className)}
      style={{ background: 'var(--beige)', width, height }}
    />
  )
}

/** Skeleton row — mimics a table row with n columns */
export function SkeletonRow({ cols = 4 }: { cols?: number }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-3 flex-1 rounded" />
      ))}
    </div>
  )
}

/** Skeleton card — mimics a stat card */
export function SkeletonCard() {
  return (
    <div className="rounded-xl border p-4" style={{ borderColor: 'var(--border)', background: 'var(--card-background)' }}>
      <Skeleton className="mb-2 h-3 w-20" />
      <Skeleton className="h-7 w-16" />
    </div>
  )
}
