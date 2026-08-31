import { type ReactNode, useState, useRef } from 'react'
import { cn } from '@/lib/utils'

interface TooltipProps {
  content:    string
  children:   ReactNode
  side?:      'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const POSITION = {
    top:    '-top-8 left-1/2 -translate-x-1/2',
    bottom: '-bottom-8 left-1/2 -translate-x-1/2',
    left:   'top-1/2 -left-2 -translate-y-1/2 -translate-x-full',
    right:  'top-1/2 -right-2 -translate-y-1/2 translate-x-full',
  }

  return (
    <div
      ref={ref}
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          className={cn(
            'pointer-events-none absolute z-50 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium shadow-md',
            POSITION[side],
            className,
          )}
          style={{ background: 'var(--deep-navy)', color: 'var(--cream)' }}
        >
          {content}
        </div>
      )}
    </div>
  )
}
