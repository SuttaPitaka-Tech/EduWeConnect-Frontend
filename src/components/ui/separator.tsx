import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Separator = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { orientation?: 'horizontal' | 'vertical' }>(
  ({ orientation = 'horizontal', className, style, ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      className={cn(
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
      style={{ background: 'var(--border)', ...style }}
      {...props}
    />
  ),
)
Separator.displayName = 'Separator'
