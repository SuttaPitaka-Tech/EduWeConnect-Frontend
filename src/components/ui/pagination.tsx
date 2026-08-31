import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Dropdown, type DropdownOption } from './dropdown'

/* -------------------------------------------------------------------------- */
/* MasterCodePagination Component (Using standard reusable <Dropdown />)       */
/* -------------------------------------------------------------------------- */

export interface MasterCodePaginationProps {
  totalItems: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  pageSizeOptions?: number[]
  className?: string
}

export function MasterCodePagination({
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
  className,
}: MasterCodePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  const pages: Array<number | 'ellipsis-left' | 'ellipsis-right'> = React.useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1)
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, 'ellipsis-right', totalPages]
    }
    if (currentPage >= totalPages - 3) {
      return [1, 'ellipsis-left', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    }
    return [
      1,
      'ellipsis-left',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      'ellipsis-right',
      totalPages,
    ]
  }, [currentPage, totalPages])

  const dropdownOptions: DropdownOption[] = React.useMemo(
    () =>
      pageSizeOptions.map((size) => ({
        value: String(size),
        label: `${size} / page`,
      })),
    [pageSizeOptions],
  )

  const startRecord = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endRecord = Math.min(currentPage * pageSize, totalItems)

  return (
    <div
      className={cn(
        'pagination-card mt-4 rounded-[6px] px-3 sm:px-5 py-2.5 sm:py-3 shadow-[0_4px_16px_rgba(16,24,40,0.12)]',
        className,
      )}
      style={{
        backgroundColor: 'var(--warm-white, #FFFDF8)',
      }}
    >
      <div className="flex items-center">
        <div className="ml-auto flex items-center gap-4">
          {/* Summary Text */}
          <p className="text-[12px] text-[#8f93a1] select-none">
            Showing {startRecord} – {endRecord} of {totalItems} items
          </p>

          {/* Numbers Navigation Toolbar */}
          <div className="flex items-center gap-2 text-xs">
            {/* Previous Page */}
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={(e) => {
                e.preventDefault()
                if (currentPage > 1) onPageChange(currentPage - 1)
              }}
              aria-label="Previous Page"
              className="inline-flex size-6 items-center justify-center rounded border border-transparent text-[#8f93a1] transition-colors hover:bg-[var(--cream,#F7F1E3)] disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronLeft className="size-3.5" />
            </button>

            {/* Page Buttons */}
            {pages.map((page, index) =>
              typeof page === 'number' ? (
                <button
                  key={page}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    onPageChange(page)
                  }}
                  className={cn(
                    'inline-flex size-7 items-center justify-center rounded border text-xs transition-colors select-none',
                    page === currentPage
                      ? 'border-[#d8dae3] bg-white font-medium text-[#1f2937] shadow-[0_1px_2px_rgba(16,24,40,0.05)]'
                      : 'border border-transparent text-[#8f93a1] hover:bg-[var(--cream,#F7F1E3)] hover:text-[#1f2937]',
                  )}
                >
                  {page}
                </button>
              ) : (
                <span
                  key={`${page}-${index}`}
                  className="inline-flex size-7 items-center justify-center text-xs text-[#8f93a1]"
                >
                  ...
                </span>
              ),
            )}

            {/* Next Page */}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={(e) => {
                e.preventDefault()
                if (currentPage < totalPages) onPageChange(currentPage + 1)
              }}
              aria-label="Next Page"
              className="inline-flex size-6 items-center justify-center rounded border border-transparent text-[#8f93a1] transition-colors hover:bg-[var(--cream,#F7F1E3)] disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>

          {/* Far Right: Reusable UI Dropdown for Page Size */}
          {onPageSizeChange && (
            <div className="ml-1 inline-block">
              <Dropdown
                options={dropdownOptions}
                value={String(pageSize)}
                onChange={(val) => onPageSizeChange(Number(val))}
                clearable={false}
                className="h-8 w-auto min-w-[105px] px-2.5 text-xs font-normal rounded-md border-[#d8dae3] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.03)]"
                contentClassName="w-[110px] min-w-[110px]"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const AppPagination = MasterCodePagination
export type AppPaginationProps = MasterCodePaginationProps

export interface PaginationProps {
  page?: number
  currentPage?: number
  totalPages?: number
  total?: number
  pageSize?: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  className?: string
}

export function Pagination({
  page,
  currentPage,
  totalPages = 1,
  total,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  className,
}: PaginationProps) {
  const activePage = currentPage ?? page ?? 1
  const computedTotal = total ?? totalPages * pageSize

  return (
    <MasterCodePagination
      totalItems={computedTotal}
      currentPage={activePage}
      pageSize={pageSize}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      className={className}
    />
  )
}
