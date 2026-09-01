import * as React from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string
  onChange?: (value: string) => void
  onClear?: () => void
  containerClassName?: string
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value = '',
      onChange,
      onClear,
      placeholder = 'Search...',
      className,
      containerClassName,
      disabled,
      ...props
    },
    ref,
  ) => {
    const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()
      onChange?.('')
      onClear?.()
    }

    return (
      <div className={cn('relative flex items-center', containerClassName)}>
        <Search
          className="pointer-events-none absolute left-2.5 size-3.5 opacity-50 text-[var(--navy,#102A43)]"
          aria-hidden
        />
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            'h-9 w-full rounded-lg border bg-white pl-8 pr-8 text-xs outline-none transition-colors select-none placeholder:text-slate-400 focus-visible:border-[var(--navy,#102A43)] focus-visible:ring-1 focus-visible:ring-[var(--navy,#102A43)]/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70',
            className,
          )}
          style={{
            borderColor: 'var(--border, #DED5C5)',
            color: 'var(--text-primary, #102A43)',
          }}
          {...props}
        />
        {value && !disabled && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={handleClear}
            className="absolute right-2 flex size-4 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="size-3" aria-hidden />
          </button>
        )}
      </div>
    )
  },
)

SearchInput.displayName = 'SearchInput'
