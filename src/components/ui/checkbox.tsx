import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string
}

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, label, id, ...props }, ref) => {
  const checkboxElement = (
    <CheckboxPrimitive.Root
      ref={ref}
      id={id}
      className={cn(
        'peer flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[6px] border bg-white transition-all outline-none',
        'border-[var(--border,#DED5C5)] hover:border-[var(--light-gold,#D6A84F)]',
        'focus-visible:ring-2 focus-visible:ring-[var(--light-gold,#D6A84F)]/30',
        'data-[state=checked]:border-[var(--light-gold,#D6A84F)] data-[state=checked]:bg-[var(--light-gold,#D6A84F)]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
        <Check className="size-3.5 text-white" strokeWidth={3.5} aria-hidden />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )

  if (!label) {
    return checkboxElement
  }

  return (
    <div className="inline-flex items-center gap-2 select-none cursor-pointer">
      {checkboxElement}
      <label
        htmlFor={id}
        className="cursor-pointer text-xs font-medium text-[var(--text-primary,#102A43)] leading-none"
      >
        {label}
      </label>
    </div>
  )
})

Checkbox.displayName = CheckboxPrimitive.Root.displayName
