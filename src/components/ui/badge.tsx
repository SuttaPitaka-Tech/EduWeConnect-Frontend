import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'gold' | 'outline'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const BADGE_VARIANTS: Record<BadgeVariant, string> = {
  default: 'bg-[var(--beige)] text-[var(--text-primary)] border-[var(--border)]',
  success: 'bg-green-50 text-green-700 border-green-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger:  'bg-red-50 text-red-700 border-red-200',
  gold:    'bg-amber-50 text-[var(--gold)] border-amber-200',
  outline: 'bg-transparent text-[var(--text-secondary)] border-[var(--border)]',
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
        BADGE_VARIANTS[variant],
        className,
      )}
      {...props}
    />
  ),
)
Badge.displayName = 'Badge'
