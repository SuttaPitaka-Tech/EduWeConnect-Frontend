import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number | string
  color?: string
  className?: string
  fullPage?: boolean
  center?: boolean
}

const SPOKES = [
  { rotate: 0,   opacity: 0.12, brandColor: 'var(--gold, #B8862C)' },
  { rotate: 30,  opacity: 0.20, brandColor: 'var(--gold, #B8862C)' },
  { rotate: 60,  opacity: 0.28, brandColor: 'var(--gold, #B8862C)' },
  { rotate: 90,  opacity: 0.38, brandColor: 'var(--gold, #B8862C)' },
  { rotate: 120, opacity: 0.48, brandColor: 'var(--gold, #B8862C)' },
  { rotate: 150, opacity: 0.58, brandColor: 'var(--gold, #B8862C)' },
  { rotate: 180, opacity: 0.68, brandColor: 'var(--light-gold, #D6A84F)' },
  { rotate: 210, opacity: 0.76, brandColor: 'var(--light-gold, #D6A84F)' },
  { rotate: 240, opacity: 0.84, brandColor: 'var(--light-gold, #D6A84F)' },
  { rotate: 270, opacity: 0.90, brandColor: 'var(--light-gold, #D6A84F)' },
  { rotate: 300, opacity: 0.95, brandColor: 'var(--light-gold, #D6A84F)' },
  { rotate: 330, opacity: 1.00, brandColor: 'var(--light-gold, #D6A84F)' },
]

/**
 * Signature Gold & Deep Gold Radial Flower Spinner
 * Uses Gold (#B8862C) and Light/Deep Gold (#D6A84F) with progressive opacity.
 */
export function Spinner({
  size = 20,
  color,
  className,
  style,
  fullPage,
  center,
  ...props
}: SpinnerProps) {
  const svg = (
    <svg
      className={cn('animate-spin shrink-0', className)}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-label="Loading"
      role="status"
      style={style}
      {...props}
    >
      {SPOKES.map(({ rotate, opacity, brandColor }) => (
        <rect
          key={rotate}
          x="11"
          y="1.5"
          width="2"
          height="5.5"
          rx="1"
          fill={color || brandColor}
          opacity={opacity}
          transform={`rotate(${rotate} 12 12)`}
        />
      ))}
    </svg>
  )

  if (fullPage) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        {svg}
      </div>
    )
  }

  if (center) {
    return (
      <div className="flex flex-1 min-h-[60vh] w-full items-center justify-center">
        {svg}
      </div>
    )
  }

  return svg
}

/**
 * Full page centered spinner helper for route and page level loading states
 */
export function PageSpinner({ size = 36, ...props }: SpinnerProps) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Spinner size={size} {...props} />
    </div>
  )
}

