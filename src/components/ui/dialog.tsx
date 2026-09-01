import { type ReactNode, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DialogProps {
  open:           boolean
  onOpenChange:   (open: boolean) => void
  children:       ReactNode
  className?:     string
}

interface DialogContentProps {
  children:   ReactNode
  className?: string
  maxWidth?:  string
}

interface DialogHeaderProps   { children: ReactNode; className?: string }
interface DialogTitleProps    { children: ReactNode; className?: string }
interface DialogDescProps     { children: ReactNode; className?: string }
interface DialogFooterProps   { children: ReactNode; className?: string }

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onOpenChange(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onOpenChange])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onOpenChange(false) }}
      role="dialog"
      aria-modal
    >
      {children}
    </div>
  )
}

export function DialogContent({ children, className, maxWidth = 'max-w-md' }: DialogContentProps) {
  return (
    <div
      className={cn('relative w-full rounded-2xl p-6 shadow-2xl', maxWidth, className)}
      style={{ background: 'var(--card-background)', boxShadow: 'var(--card-shadow)' }}
    >
      {children}
    </div>
  )
}

export function DialogClose({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      className="absolute right-4 top-4 rounded-md p-1 transition-colors hover:bg-[var(--beige)]"
      aria-label="Close dialog"
    >
      <X className="size-4" style={{ color: 'var(--text-muted)' }} />
    </button>
  )
}

export function DialogHeader({ children, className }: DialogHeaderProps) {
  return <div className={cn('mb-4 flex flex-col gap-1', className)}>{children}</div>
}

export function DialogTitle({ children, className }: DialogTitleProps) {
  return (
    <h2 className={cn('text-base font-bold', className)} style={{ color: 'var(--navy)' }}>
      {children}
    </h2>
  )
}

export function DialogDescription({ children, className }: DialogDescProps) {
  return (
    <p className={cn('text-xs leading-relaxed', className)} style={{ color: 'var(--text-muted)' }}>
      {children}
    </p>
  )
}

export function DialogFooter({ children, className }: DialogFooterProps) {
  return (
    <div className={cn('mt-5 flex items-center justify-end gap-2.5', className)}>
      {children}
    </div>
  )
}
