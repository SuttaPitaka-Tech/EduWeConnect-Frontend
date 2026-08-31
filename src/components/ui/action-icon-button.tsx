import { type ButtonHTMLAttributes } from 'react'
import { Loader2, Eye, Pencil, Trash2, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Spinner } from './spinner'

type ActionVariant = 'view' | 'edit' | 'delete' | 'custom'

interface ActionIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ActionVariant
  isLoading?: boolean
  icon?: LucideIcon
  label?: string
}

const VARIANT_MAP: Record<ActionVariant, { icon: LucideIcon; label: string; className: string }> = {
  view:   { icon: Eye,     label: 'View',   className: 'text-[var(--navy)] hover:bg-[var(--beige)]' },
  edit:   { icon: Pencil,  label: 'Edit',   className: 'text-[var(--gold)] hover:bg-amber-50' },
  delete: { icon: Trash2,  label: 'Delete', className: 'text-red-600 hover:bg-red-50' },
  custom: { icon: Eye,     label: 'Action', className: 'text-[var(--text-secondary)] hover:bg-[var(--beige)]' },
}

/**
 * Universal action icon button for tables (View / Edit / Delete).
 * Shows <Spinner /> while isLoading=true — NEVER plain text.
 */
export function ActionIconButton({
  variant = 'custom',
  isLoading = false,
  icon: IconOverride,
  label,
  className,
  disabled,
  ...props
}: ActionIconButtonProps) {
  const { icon: DefaultIcon, label: defaultLabel, className: variantClass } = VARIANT_MAP[variant]
  const Icon = IconOverride ?? DefaultIcon
  const ariaLabel = label ?? defaultLabel

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors',
        'disabled:pointer-events-none disabled:opacity-40',
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
