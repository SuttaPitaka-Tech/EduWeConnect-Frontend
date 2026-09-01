import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Spinner } from './spinner'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold'
type ButtonSize    = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:   ButtonVariant
  size?:      ButtonSize
  isLoading?: boolean
  fullWidth?: boolean
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary:   'bg-[var(--button-background)] text-[var(--button-text)] hover:bg-[var(--button-hover)] border border-transparent',
  secondary: 'bg-[var(--cream)] text-[var(--text-primary)] hover:bg-[var(--beige)] border border-[var(--border)]',
  outline:   'bg-transparent text-[var(--navy)] border border-[var(--navy)] hover:bg-[var(--cream)]',
  ghost:     'bg-transparent text-[var(--text-secondary)] border border-transparent hover:bg-[var(--cream)]',
  danger:    'bg-red-600 text-white border border-transparent hover:bg-red-700',
  gold:      'border border-transparent text-white',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-7  px-3   text-xs  rounded-md  gap-1',
  md: 'h-9  px-4   text-xs  rounded-md  gap-1.5',
  lg: 'h-10 px-5   text-sm  rounded-lg  gap-2',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', size = 'md', isLoading = false, fullWidth = false,
      className, disabled, children, style, ...props },
    ref,
  ) => {
    const spinnerColor =
      variant === 'outline' || variant === 'ghost' || variant === 'secondary'
        ? 'var(--navy, #102A43)'
        : '#FFFFFF'

    const goldStyle =
      variant === 'gold' ? { background: 'var(--gold-gradient)', ...style } : style

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-all',
          'disabled:pointer-events-none disabled:opacity-50',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--navy)]/20',
          VARIANTS[variant],
          SIZES[size],
          fullWidth && 'w-full',
          className,
        )}
        style={goldStyle}
        {...props}
      >
        {children}
        {isLoading && <Spinner size={14} color={spinnerColor} className="ml-1.5" />}
      </button>
    )
  },
)
Button.displayName = 'Button'
