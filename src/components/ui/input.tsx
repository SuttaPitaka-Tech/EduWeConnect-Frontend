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
  ({ className, error, style, disabled, readOnly, ...props }, ref) => {
    const isBlocked = disabled || readOnly
    return (
      <input
        ref={ref}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={error || undefined}
        className={cn(
          'flex h-8 w-full rounded-md border px-3 text-xs font-medium placeholder:font-normal transition-colors',
          'placeholder:text-[var(--text-muted)]',
          isBlocked
            ? 'cursor-not-allowed bg-[var(--cream)] opacity-90'
            : 'bg-white',
          'disabled:cursor-not-allowed disabled:bg-[var(--cream)] disabled:opacity-90 read-only:cursor-not-allowed read-only:bg-[var(--cream)]',
          // ring-0 enforced via global CSS, border-navy on focus
          error
            ? 'border-red-400 focus:border-red-500'
            : 'border-[var(--border)] focus:border-[var(--navy)]',
          className,
        )}
        style={{
          backgroundColor: isBlocked ? 'var(--cream, #F7F1E3)' : '#FFFFFF',
          cursor: isBlocked ? 'not-allowed' : undefined,
          color: 'var(--text-primary)',
          ...style,
        }}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'
