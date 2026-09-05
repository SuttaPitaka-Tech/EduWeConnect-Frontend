import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * ScrollArea — styled scrollable container matching EduWeConnect design tokens.
 *
 * Uses CSS custom scrollbar styling consistent with the global index.css
 * scrollbar rules (cream track, sand thumb, gold hover).
 *
 * Usage:
 *   <ScrollArea className="h-[400px]">
 *     ...content...
 *   </ScrollArea>
 *
 *   <ScrollArea orientation="horizontal" className="w-full">
 *     ...content...
 *   </ScrollArea>
 */

interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  /** 'vertical' (default) | 'horizontal' | 'both' */
  orientation?: 'vertical' | 'horizontal' | 'both'
}

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ orientation = 'vertical', className, children, ...props }, ref) => {
    const overflowClass =
      orientation === 'vertical'   ? 'overflow-y-auto overflow-x-hidden' :
      orientation === 'horizontal' ? 'overflow-x-auto overflow-y-hidden' :
                                     'overflow-auto'

    return (
      <div
        ref={ref}
        className={cn(
          overflowClass,
          'scroll-smooth',
          // Custom scrollbar — matches global index.css tokens
          '[&::-webkit-scrollbar]:w-[5px]',
          '[&::-webkit-scrollbar]:h-[5px]',
          '[&::-webkit-scrollbar-track]:rounded-full',
          '[&::-webkit-scrollbar-thumb]:rounded-full',
          '[&::-webkit-scrollbar-thumb]:transition-colors',
          className,
        )}
        style={{
          // Scrollbar colors via CSS vars — design token compliant
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--sand) var(--beige)',
          ...props.style,
        }}
        {...props}
      >
        {children}
      </div>
    )
  },
)
ScrollArea.displayName = 'ScrollArea'
