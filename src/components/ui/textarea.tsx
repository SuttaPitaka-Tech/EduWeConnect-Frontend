import { type TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, style, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-[80px] w-full rounded-md border px-3 py-2 text-xs transition-colors resize-y',
        'placeholder:text-[var(--text-muted)]',
        'disabled:cursor-not-allowed disabled:opacity-50',
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
Textarea.displayName = 'Textarea'
