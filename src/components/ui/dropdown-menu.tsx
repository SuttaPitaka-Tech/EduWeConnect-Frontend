import { type ReactNode, useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DropdownItem {
  key:       string
  label:     string
  icon?:     ReactNode
  danger?:   boolean
  disabled?: boolean
  onClick?:  () => void
}

interface DropdownMenuProps {
  trigger:    ReactNode
  items:      DropdownItem[]
  align?:     'left' | 'right'
  className?: string
}

export function DropdownMenu({ trigger, items, align = 'right', className }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} className={cn('relative inline-block', className)}>
      <div onClick={() => setOpen((o) => !o)} className="cursor-pointer">
        {trigger}
      </div>

      {open && (
        <div
          className={cn(
            'absolute z-50 mt-1.5 min-w-[150px] rounded-xl border py-1 shadow-lg',
            align === 'right' ? 'right-0' : 'left-0',
          )}
          style={{ background: 'var(--warm-white)', borderColor: 'var(--border)', boxShadow: 'var(--card-shadow)' }}
        >
          {items.map((item) => (
            <button
              key={item.key}
              type="button"
              disabled={item.disabled}
              onClick={() => { item.onClick?.(); setOpen(false) }}
              className={cn(
                'flex w-full items-center gap-2 px-3 py-2 text-xs font-medium transition-colors',
                'disabled:pointer-events-none disabled:opacity-40',
                item.danger
                  ? 'text-red-600 hover:bg-red-50'
                  : 'hover:bg-[var(--cream)]',
              )}
              style={item.danger ? undefined : { color: 'var(--text-primary)' }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/** Simple trigger that shows a chevron icon — pass as trigger prop */
export function DropdownTrigger({ label, className }: { label: string; className?: string }) {
  return (
    <div className={cn('flex h-8 items-center gap-1.5 rounded-md border px-3 text-xs font-medium cursor-pointer', className)}
      style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', background: 'var(--input-bg)' }}
    >
      {label}
      <ChevronDown className="size-3.5" style={{ color: 'var(--text-muted)' }} aria-hidden />
    </div>
  )
}
