import * as React from 'react'
import { ChevronDown, Check, Plus, X, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Spinner } from './spinner'
import type { DropdownOption, DropdownFooterAction } from './dropdown'

export interface SearchDropdownProps {
  value?: string
  onChange?: (value: string) => void
  options: readonly DropdownOption[]
  placeholder?: string
  searchPlaceholder?: string
  disabled?: boolean
  isLoading?: boolean
  invalid?: boolean
  className?: string
  contentClassName?: string
  clearable?: boolean
  footerAction?: DropdownFooterAction
  onOpenChange?: (open: boolean) => void
  onOpen?: () => void
}

export function SearchDropdown({
  value,
  onChange,
  options,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search options...',
  disabled = false,
  isLoading = false,
  invalid = false,
  className,
  contentClassName,
  clearable = true,
  footerAction,
  onOpenChange,
  onOpen,
}: SearchDropdownProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const containerRef = React.useRef<HTMLDivElement>(null)
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen)
      if (nextOpen) {
        setQuery('')
        onOpen?.()
        setTimeout(() => searchInputRef.current?.focus(), 50)
      }
      onOpenChange?.(nextOpen)
    },
    [onOpenChange, onOpen],
  )

  // Click outside listener
  React.useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleOpenChange(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open, handleOpenChange])

  const selectedOption = React.useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value],
  )

  const filteredOptions = React.useMemo(() => {
    if (!query.trim()) return options
    const q = query.toLowerCase()
    return options.filter((opt) => opt.label.toLowerCase().includes(q))
  }, [options, query])

  const hasSelection =
    selectedOption != null &&
    selectedOption.value !== '' &&
    selectedOption.value !== '__none__' &&
    selectedOption.value !== 'none'

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue)
    handleOpenChange(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onChange?.('')
    handleOpenChange(false)
  }

  return (
    <div ref={containerRef} className="relative inline-block w-full">
      {/* Trigger Button */}
      <button
        type="button"
        data-dropdown-trigger="true"
        disabled={disabled || isLoading}
        aria-expanded={open}
        aria-invalid={invalid || undefined}
        onClick={() => handleOpenChange(!open)}
        className={cn(
          'flex h-9 w-full items-center justify-between gap-1.5 rounded-lg border bg-white px-3 text-xs font-normal text-slate-800 transition-colors outline-none select-none hover:border-slate-400 focus:border-[var(--navy,#102A43)] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60',
          invalid && 'border-red-500!',
          className,
        )}
        style={{
          borderColor: invalid ? 'var(--danger, #ef4444)' : 'var(--border, #DED5C5)',
        }}
      >
        <span
          className={cn(
            'truncate leading-none',
            hasSelection ? 'font-medium text-[var(--navy,#102A43)]' : 'text-slate-500',
          )}
        >
          {isLoading ? 'Loading...' : selectedOption?.label || placeholder}
        </span>

        {isLoading ? (
          <Spinner size={14} />
        ) : clearable && hasSelection ? (
          <span
            role="button"
            tabIndex={0}
            aria-label="Clear selection"
            className="ml-1 flex size-4 shrink-0 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            onClick={handleClear}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleClear(e as unknown as React.MouseEvent)
              }
            }}
          >
            <X className="size-3" aria-hidden />
          </span>
        ) : (
          <ChevronDown
            className={cn(
              'ml-1 size-3.5 shrink-0 text-slate-400 transition-transform duration-150',
              open && 'rotate-180',
            )}
          />
        )}
      </button>

      {/* Dropdown Menu with Search Input */}
      {open && (
        <div
          className={cn(
            'absolute left-0 top-full z-50 mt-1 w-full min-w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl outline-none',
            contentClassName,
          )}
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: 'var(--border, #DED5C5)',
            boxShadow: '0 10px 25px -5px rgba(16, 42, 67, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Internal Search Header */}
          <div className="border-b border-slate-100 p-1.5">
            <div className="relative flex items-center">
              <Search className="pointer-events-none absolute left-2 size-3.5 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-8 w-full rounded-md border bg-slate-50 pl-7 pr-7 text-xs outline-none transition-colors placeholder:text-slate-400 focus:border-[var(--navy,#102A43)] focus:bg-white"
                style={{ borderColor: 'var(--border, #DED5C5)' }}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-1.5 flex size-4 items-center justify-center rounded text-slate-400 hover:text-slate-700"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-56 overflow-y-auto space-y-0.5 p-1 bg-white">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 py-4 text-xs text-slate-500">
                <Spinner size={14} />
                <span>Loading options...</span>
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-500">
                No matching options found.
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value
                return (
                  <button
                    key={opt.key || opt.value}
                    type="button"
                    disabled={opt.disabled}
                    onClick={() => !opt.disabled && handleSelect(opt.value)}
                    className={cn(
                      'relative flex w-full cursor-pointer select-none items-center rounded-md py-1.5 pl-7 pr-2.5 text-xs outline-none transition-colors hover:bg-slate-100',
                      isSelected
                        ? 'bg-slate-100 font-semibold text-[var(--navy,#102A43)]'
                        : 'text-slate-700 font-normal',
                      opt.disabled && 'cursor-not-allowed opacity-40',
                    )}
                  >
                    <span className="absolute left-2 flex size-3.5 items-center justify-center">
                      {isSelected && (
                        <Check className="size-3.5 text-[var(--navy,#102A43)]" strokeWidth={2.5} />
                      )}
                    </span>
                    <span className="truncate">{opt.label}</span>
                  </button>
                )
              })
            )}
          </div>

          {footerAction ? (
            <div className="border-t border-slate-100 p-1">
              <button
                type="button"
                disabled={footerAction.disabled}
                className="flex h-8 w-full items-center justify-start gap-1.5 rounded-md px-2 text-xs font-semibold text-[var(--navy,#102A43)] hover:bg-slate-50 transition-colors"
                onClick={() => {
                  handleOpenChange(false)
                  footerAction.onClick()
                }}
              >
                <Plus className="size-3.5 shrink-0" aria-hidden />
                {footerAction.label}
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
