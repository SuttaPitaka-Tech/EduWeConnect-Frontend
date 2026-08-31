import { cn } from '@/lib/utils'

interface ProgressProps {
  value:       number   // 0–100
  className?:  string
  showLabel?:  boolean
  color?:      'navy' | 'gold' | 'success' | 'danger'
}

const COLORS = {
  navy:    'var(--navy)',
  gold:    'var(--gold)',
  success: 'var(--success)',
  danger:  '#dc2626',
}

export function Progress({ value, className, showLabel = false, color = 'navy' }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, value))
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className="h-2 flex-1 overflow-hidden rounded-full"
        style={{ background: 'var(--beige)' }}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: COLORS[color] }}
        />
      </div>
      {showLabel && (
        <span className="min-w-[2.5rem] text-right text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
          {pct}%
        </span>
      )}
    </div>
  )
}
