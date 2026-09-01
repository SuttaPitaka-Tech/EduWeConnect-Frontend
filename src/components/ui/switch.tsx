import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, id, checked, defaultChecked, onChange, disabled, ...props }, ref) => (
    <label
      htmlFor={id}
      className={cn(
        'inline-flex cursor-pointer items-center gap-2 select-none',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      <div className="relative inline-flex items-center">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only peer"
          {...props}
        />
        {/* Track */}
        <div
          className={cn(
            'h-5 w-9 rounded-full transition-colors duration-200 ease-in-out',
            'bg-slate-200 border border-slate-300',
            'peer-checked:bg-[var(--light-gold,#D6A84F)] peer-checked:border-[var(--light-gold,#D6A84F)]',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--light-gold,#D6A84F)]/30',
            className,
          )}
        />
        {/* Thumb */}
        <div
          className={cn(
            'pointer-events-none absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ease-in-out',
            'peer-checked:translate-x-4',
          )}
        />
      </div>
      {label && (
        <span className="text-xs font-medium text-[var(--text-primary,#102A43)] leading-none">
          {label}
        </span>
      )}
    </label>
  ),
)

Switch.displayName = 'Switch'
