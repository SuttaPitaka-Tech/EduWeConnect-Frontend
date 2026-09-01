import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

/** Section divider with centered label */
export function Divider({ label, className }: { label?: string; className?: string }) {
  if (!label) {
    return <div className={cn('h-px w-full', className)} style={{ background: 'var(--border)' }} />
  }
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
      <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
    </div>
  )
}

/** Stat / KPI card — icon + label + value */
interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  label:      string
  value:      string | number
  icon?:      React.ReactNode
  trend?:     'up' | 'down' | 'neutral'
  trendValue?: string
}

export function StatCard({ label, value, icon, trend, trendValue, className, style, ...props }: StatCardProps) {
  const TREND_COLOR = { up: 'text-green-600', down: 'text-red-600', neutral: 'text-[var(--text-muted)]' }
  return (
    <div
      className={cn('flex flex-col gap-2 rounded-xl border p-4', className)}
      style={{ background: 'var(--card-background)', boxShadow: 'var(--card-shadow)', borderColor: 'var(--border)', ...style }}
      {...props}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{label}</p>
        {icon && <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'var(--beige)' }}>{icon}</div>}
      </div>
      <p className="text-2xl font-bold" style={{ color: 'var(--navy)' }}>{value}</p>
      {trend && trendValue && (
        <p className={cn('text-xs font-medium', TREND_COLOR[trend])}>{trendValue}</p>
      )}
    </div>
  )
}

/** Empty state — centered icon + message + optional action */
export function EmptyState({ icon, title, description, action }: {
  icon?:        React.ReactNode
  title:        string
  description?: string
  action?:      React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      {icon && <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: 'var(--beige)' }}>{icon}</div>}
      <div>
        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</p>
        {description && <p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>{description}</p>}
      </div>
      {action}
    </div>
  )
}
