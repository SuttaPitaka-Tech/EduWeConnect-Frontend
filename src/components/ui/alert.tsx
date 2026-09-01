import { type ReactNode } from 'react'
import { AlertTriangle, CheckCircle2, Info, XCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type AlertVariant = 'info' | 'success' | 'warning' | 'danger'

interface AlertProps {
  variant?:     AlertVariant
  title?:       string
  children:     ReactNode
  onDismiss?:   () => void
  className?:   string
}

const VARIANTS: Record<AlertVariant, { icon: typeof Info; className: string }> = {
  info:    { icon: Info,           className: 'bg-blue-50 border-blue-200 text-blue-800' },
  success: { icon: CheckCircle2,   className: 'bg-green-50 border-green-200 text-green-800' },
  warning: { icon: AlertTriangle,  className: 'bg-amber-50 border-amber-200 text-amber-800' },
  danger:  { icon: XCircle,        className: 'bg-red-50 border-red-200 text-red-800' },
}

export function Alert({ variant = 'info', title, children, onDismiss, className }: AlertProps) {
  const { icon: Icon, className: variantClass } = VARIANTS[variant]
  return (
    <div
      role="alert"
      className={cn('flex gap-3 rounded-xl border p-3.5', variantClass, className)}
    >
      <Icon className="mt-0.5 size-4 flex-shrink-0" aria-hidden />
      <div className="flex-1 text-xs">
        {title && <p className="mb-0.5 font-semibold">{title}</p>}
        <div className="leading-relaxed opacity-90">{children}</div>
      </div>
      {onDismiss && (
        <button type="button" onClick={onDismiss} className="flex-shrink-0 opacity-60 hover:opacity-100" aria-label="Dismiss alert">
          <X className="size-3.5" />
        </button>
      )}
    </div>
  )
}
