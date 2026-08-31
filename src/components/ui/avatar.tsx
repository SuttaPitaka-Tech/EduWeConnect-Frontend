import { type HTMLAttributes, type ImgHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

interface AvatarImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string
}

const SIZES = { sm: 'h-7 w-7 text-xs', md: 'h-9 w-9 text-xs', lg: 'h-11 w-11 text-sm', xl: 'h-14 w-14 text-base' }

export function Avatar({ size = 'md', className, style, ...props }: AvatarProps) {
  return (
    <div
      className={cn('relative inline-flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold', SIZES[size], className)}
      style={{ background: 'var(--beige)', color: 'var(--navy)', ...style }}
      {...props}
    />
  )
}

export function AvatarImage({ src, alt, fallback, className }: AvatarImageProps) {
  if (!src) {
    return (
      <span className={cn('flex h-full w-full items-center justify-center', className)}>
        {fallback ?? '?'}
      </span>
    )
  }
  return (
    <img
      src={src}
      alt={alt ?? 'Avatar'}
      className={cn('h-full w-full object-cover', className)}
      onError={(e) => {
        const parent = e.currentTarget.parentElement
        if (parent && fallback) {
          e.currentTarget.style.display = 'none'
          parent.textContent = fallback
        }
      }}
    />
  )
}

/** Standalone initials avatar — pass name, auto extracts initials */
export function InitialsAvatar({ name, size = 'md', className }: { name: string; size?: AvatarProps['size']; className?: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('')
  return (
    <Avatar size={size} className={className}>
      <span>{initials}</span>
    </Avatar>
  )
}
