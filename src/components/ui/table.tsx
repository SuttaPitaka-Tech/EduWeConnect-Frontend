import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Table = forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="w-full overflow-x-auto">
      <table ref={ref} className={cn('w-full text-left text-xs', className)} {...props} />
    </div>
  ),
)
Table.displayName = 'Table'

export const TableHead = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, style, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn('border-b', className)}
      style={{
        background: 'var(--cream, #F7F1E3)',
        borderColor: 'var(--border, #DED5C5)',
        ...style,
      }}
      {...props}
    />
  ),
)
TableHead.displayName = 'TableHead'

export const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, style, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn('divide-y', className)}
      style={{
        backgroundColor: 'var(--warm-white, #FFFDF8)',
        borderColor: 'var(--border, #DED5C5)',
        ...style,
      }}
      {...props}
    />
  ),
)
TableBody.displayName = 'TableBody'

export const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
  ({ className, style, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn('border-b transition-colors duration-150 hover:bg-[#F7F1E3]', className)}
      style={{ borderColor: 'var(--border, #DED5C5)', ...style }}
      {...props}
    />
  ),
)
TableRow.displayName = 'TableRow'

export const TableHeader = forwardRef<HTMLTableCellElement, HTMLAttributes<HTMLTableCellElement>>(
  ({ className, style, ...props }, ref) => (
    <th
      ref={ref}
      className={cn('px-4 py-2.5 text-xs font-bold uppercase tracking-wider', className)}
      style={{ color: 'var(--navy, #102A43)', ...style }}
      {...props}
    />
  ),
)
TableHeader.displayName = 'TableHeader'

export const TableCell = forwardRef<HTMLTableCellElement, HTMLAttributes<HTMLTableCellElement>>(
  ({ className, style, ...props }, ref) => (
    <td
      ref={ref}
      className={cn('px-4 py-2.5 text-xs', className)}
      style={{ color: 'var(--text-primary, #102A43)', ...style }}
      {...props}
    />
  ),
)
TableCell.displayName = 'TableCell'
