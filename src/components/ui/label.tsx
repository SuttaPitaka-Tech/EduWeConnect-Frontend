import { type LabelHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Brand Label — MANDATORY text-xs (12px) font-semibold.
 * RULE: Labels and form errors are ALWAYS 12px — NEVER text-sm.
 */
export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, style, ...props }, ref) => (
    <label
      ref={ref}
      className={cn('text-xs font-semibold leading-none', className)}
      style={{ color: 'var(--text-primary)', ...style }}
      {...props}
    />
  ),
)
Label.displayName = 'Label'

/** Error message helper — always 12px, text-muted red */
export function FormError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="text-xs text-red-600">{message}</p>
  )
}
