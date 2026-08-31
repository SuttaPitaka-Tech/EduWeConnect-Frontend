import { type ChangeEvent } from 'react'
import { cn } from '@/lib/utils'

export interface RadioOption {
  value:     string
  label:     string
  disabled?: boolean
}

export interface RadioGroupProps {
  name:       string
  options:    RadioOption[]
  value?:     string
  onChange?:  (value: string) => void
  direction?: 'row' | 'col'
  className?: string
}

export function RadioGroup({ name, options, value, onChange, direction = 'col', className }: RadioGroupProps) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange?.(e.target.value)
  }

  return (
    <div
      role="radiogroup"
      className={cn(
        'flex gap-3.5',
        direction === 'row' ? 'flex-row flex-wrap items-center' : 'flex-col',
        className,
      )}
    >
      {options.map((opt) => {
        const isChecked = value === opt.value
        return (
          <label
            key={opt.value}
            className={cn(
              'inline-flex cursor-pointer items-center gap-2 select-none outline-none',
              opt.disabled && 'pointer-events-none opacity-50',
            )}
          >
            <div className="relative flex h-4.5 w-4.5 shrink-0 items-center justify-center">
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={isChecked}
                onChange={handleChange}
                disabled={opt.disabled}
                className="sr-only peer"
              />
              {/* Outer circle — 100% clean light gold, zero blue glow/ring */}
              <div
                className={cn(
                  'h-4 w-4 rounded-full border-2 bg-white transition-colors outline-none shadow-none ring-0',
                )}
                style={{
                  borderColor: isChecked ? 'var(--light-gold, #D6A84F)' : 'var(--border, #DED5C5)',
                }}
              />
              {/* Inner dot — 100% clean light gold */}
              <div
                className={cn(
                  'absolute h-2 w-2 rounded-full transition-transform duration-150',
                  isChecked ? 'scale-100' : 'scale-0',
                )}
                style={{
                  backgroundColor: 'var(--light-gold, #D6A84F)',
                }}
              />
            </div>
            <span className="text-xs font-medium text-[var(--text-primary,#102A43)] leading-none">
              {opt.label}
            </span>
          </label>
        )
      })}
    </div>
  )
}
