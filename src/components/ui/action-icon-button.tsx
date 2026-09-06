import { type ButtonHTMLAttributes } from 'react'
import { Loader2, Eye, Pencil, Trash2, Download, X, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Spinner } from './spinner'

export type ActionVariant = 'view' | 'edit' | 'delete' | 'download' | 'close' | 'custom'

export interface ActionIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ActionVariant
  isLoading?: boolean
  icon?: LucideIcon
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

const VARIANT_MAP: Record<ActionVariant, { icon: LucideIcon; label: string; className: string }> = {
  view:     { icon: Eye,      label: 'View',     className: 'text-[var(--gold)] hover:text-[#8f641a] bg-[var(--gold)]/10 hover:bg-[var(--gold)]/20 shadow-2xs' },
  edit:     { icon: Pencil,   label: 'Edit',     className: 'text-[var(--gold)] hover:text-[#8f641a] bg-[var(--gold)]/10 hover:bg-[var(--gold)]/20 shadow-2xs' },
  delete:   { icon: Trash2,   label: 'Delete',   className: 'text-red-600 hover:bg-red-50 shadow-2xs' },
  download: { icon: Download, label: 'Download', className: 'text-[var(--gold)] hover:text-[#8f641a] bg-[var(--gold)]/10 hover:bg-[var(--gold)]/20 shadow-2xs' },
  close:    { icon: X,        label: 'Remove',   className: 'text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50' },
  custom:   { icon: Eye,      label: 'Action',   className: 'text-[var(--gold)] hover:bg-[var(--gold)]/15' },
}

const SIZE_MAP = {
  sm: 'h-6 w-6 rounded-md',
  md: 'h-7 w-7 rounded-lg',
  lg: 'h-8 w-8 rounded-xl',
}

/**
 * Universal action icon button across the application (View / Edit / Delete / Download / Close).
 * Shows <Spinner /> or <Loader2 /> while isLoading=true — NEVER plain text.
 */
export function ActionIconButton({
  variant = 'custom',
  isLoading = false,
  icon: IconOverride,
  label,
  size = 'md',
  className,
  title,
  disabled,
  ...props
}: ActionIconButtonProps) {
  const { icon: DefaultIcon, label: defaultLabel, className: variantClass } = VARIANT_MAP[variant]
  const Icon = IconOverride ?? DefaultIcon
  const ariaLabel = label ?? defaultLabel
  const tooltipTitle = title ?? ariaLabel

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      title={tooltipTitle}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center transition-all cursor-pointer select-none',
        'disabled:pointer-events-none disabled:opacity-40',
        SIZE_MAP[size],
        variantClass,
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="size-3.5 animate-spin" aria-hidden />
      ) : (
        <Icon className="size-3.5" aria-hidden />
      )}
    </button>
  )
}

export { Spinner }
