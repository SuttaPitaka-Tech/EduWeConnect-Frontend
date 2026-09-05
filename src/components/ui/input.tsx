import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

/**
 * Brand input — ring-0, border-[var(--navy)] on focus, bg-[var(--input-bg)].
 * RULE: focus must NOT show browser default blue ring.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, style, ...props }, ref) => (
    <input
      ref={ref}
      aria-invalid={error || undefined}
      className={cn(
        'flex h-8 w-full rounded-md border px-3 text-xs transition-colors',
        'placeholder:text-[var(--text-muted)]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        // ring-0 enforced via global CSS, border-navy on focus
        error
          ? 'border-red-400 focus:border-red-500'
          : 'border-[var(--border)] focus:border-[var(--navy)]',
        className,
      )}
      style={{ background: 'var(--input-bg)', color: 'var(--text-primary)', ...style }}
      {...props}
    />
  ),
)
Input.displayName = 'Input'
