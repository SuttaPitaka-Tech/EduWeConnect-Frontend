import { type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SheetProps {
  open:           boolean
  onOpenChange:   (open: boolean) => void
  children:       ReactNode
  side?:          'right' | 'left'
  width?:         string
}

interface SheetContentProps { children: ReactNode; className?: string }
interface SheetHeaderProps  { children: ReactNode; className?: string }
interface SheetTitleProps   { children: ReactNode; className?: string }
interface SheetFooterProps  { children: ReactNode; className?: string }

export function Sheet({ open, onOpenChange, children, side = 'right', width = 'max-w-sm' }: SheetProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      {/* Panel */}
      <div
        className={cn(
          'relative ml-auto flex h-full flex-col shadow-2xl w-full',
          width,
          side === 'left' && 'ml-0 mr-auto',
        )}
        style={{ background: 'var(--warm-white)', borderLeft: side === 'right' ? `1px solid var(--border)` : undefined, borderRight: side === 'left' ? `1px solid var(--border)` : undefined }}
      >
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-md p-1 hover:bg-[var(--beige)] transition-colors"
          aria-label="Close panel"
        >
          <X className="size-4" style={{ color: 'var(--text-muted)' }} />
        </button>
        {children}
      </div>
    </div>
  )
}

export function SheetContent({ children, className }: SheetContentProps) {
  return <div className={cn('flex-1 overflow-y-auto p-5', className)}>{children}</div>
}

export function SheetHeader({ children, className }: SheetHeaderProps) {
  return <div className={cn('border-b px-5 py-4 pr-12', className)} style={{ borderColor: 'var(--border)' }}>{children}</div>
}

export function SheetTitle({ children, className }: SheetTitleProps) {
  return <h2 className={cn('text-sm font-bold', className)} style={{ color: 'var(--navy)' }}>{children}</h2>
}

export function SheetFooter({ children, className }: SheetFooterProps) {
  return <div className={cn('border-t px-5 py-3', className)} style={{ borderColor: 'var(--border)' }}>{children}</div>
}
