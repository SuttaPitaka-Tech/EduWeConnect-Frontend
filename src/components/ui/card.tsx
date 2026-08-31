import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-xl border', className)}
      style={{ background: 'var(--card-background)', boxShadow: 'var(--card-shadow)', borderColor: 'var(--border)', ...style }}
      {...props}
    />
  ),
)
Card.displayName = 'Card'

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, style, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center justify-between border-b px-5 py-4', className)} style={{ borderColor: 'var(--border)', ...style }} {...props} />
  ),
)
CardHeader.displayName = 'CardHeader'

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, style, ...props }, ref) => (
    <h2 ref={ref} className={cn('text-sm font-bold', className)} style={{ color: 'var(--navy)', ...style }} {...props} />
  ),
)
CardTitle.displayName = 'CardTitle'

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('p-5', className)} {...props} />,
)
CardContent.displayName = 'CardContent'

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, style, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center border-t px-5 py-3', className)} style={{ borderColor: 'var(--border)', ...style }} {...props} />
  ),
)
CardFooter.displayName = 'CardFooter'
