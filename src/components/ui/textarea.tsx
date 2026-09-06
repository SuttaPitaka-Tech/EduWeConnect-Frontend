import { type TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, style, disabled, readOnly, ...props }, ref) => {
    const isBlocked = disabled || readOnly
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={error || undefined}
        className={cn(
          'flex min-h-[80px] w-full rounded-md border px-3 py-2 text-xs font-medium placeholder:font-normal transition-colors resize-y',
          'placeholder:text-[var(--text-muted)]',
          isBlocked
            ? 'cursor-not-allowed bg-[var(--cream)] opacity-90'
            : 'bg-white',
          'disabled:cursor-not-allowed disabled:bg-[var(--cream)] disabled:opacity-90 read-only:cursor-not-allowed read-only:bg-[var(--cream)]',
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
Textarea.displayName = 'Textarea'
