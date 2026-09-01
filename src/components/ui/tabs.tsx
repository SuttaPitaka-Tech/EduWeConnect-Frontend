import { type ReactNode, useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface TabItem {
  key:      string
  label:    string
  disabled?: boolean
}

interface TabsProps {
  items:        TabItem[]
  activeKey:    string
  onChange:     (key: string) => void
  children?:    ReactNode
  className?:   string
}

interface TabPanelProps {
  tabKey:     string
  activeKey:  string
  children:   ReactNode
  className?: string
}

export function Tabs({ items, activeKey, onChange, className }: TabsProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })

  useEffect(() => {
    const container = ref.current
    if (!container) return
    const active = container.querySelector<HTMLButtonElement>(`[data-key="${activeKey}"]`)
    if (active) {
      setIndicatorStyle({ left: active.offsetLeft, width: active.offsetWidth })
    }
  }, [activeKey])

  return (
    <div
      ref={ref}
      role="tablist"
      className={cn('relative flex items-center gap-0 border-b', className)}
      style={{ borderColor: 'var(--border)' }}
    >
      {/* Sliding indicator */}
      <div
        className="absolute bottom-0 h-0.5 transition-all duration-200"
        style={{ left: indicatorStyle.left, width: indicatorStyle.width, background: 'var(--navy)' }}
      />
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          role="tab"
          data-key={item.key}
          aria-selected={item.key === activeKey}
          disabled={item.disabled}
          onClick={() => onChange(item.key)}
          className={cn(
            'relative px-4 py-2.5 text-xs font-semibold transition-colors',
            'disabled:pointer-events-none disabled:opacity-40',
            item.key === activeKey
              ? 'text-[var(--navy)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]',
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

export function TabPanel({ tabKey, activeKey, children, className }: TabPanelProps) {
  if (tabKey !== activeKey) return null
  return (
    <div role="tabpanel" className={cn('pt-4', className)}>
      {children}
    </div>
  )
}
