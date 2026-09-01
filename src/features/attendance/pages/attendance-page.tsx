import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { AttendanceStatsBar } from '../components/attendance-stats-bar'
import { AttendanceFilters } from '../components/attendance-filters'
import { AttendanceTable } from '../components/attendance-table'
import { CreateAttendanceModal } from '../components/create-attendance-modal'
import { useAttendanceList } from '../hooks/use-attendance-list'
import { useGetAttendanceStats } from '../queries/get-attendances'
import type { AttendanceListParams } from '../types/types'
import {
  ATTENDANCE_DEFAULT_PAGE,
  ATTENDANCE_DEFAULT_PAGE_SIZE,
} from '../constants/constants'

/** Route-level container — lazy-loaded in routes.tsx via lazyWithRetry() */
export default function AttendancePage() {
  const [params, setParams]         = useState<AttendanceListParams>({
    page:     ATTENDANCE_DEFAULT_PAGE,
    pageSize: ATTENDANCE_DEFAULT_PAGE_SIZE,
  })
  const [createOpen, setCreateOpen] = useState(false)

  const {
    rows,
    total,
    totalPages,
    isLoading,
    isFetching,
    isError,
    remove,
    deletingId,
  } = useAttendanceList(params)

  const statsQuery = useGetAttendanceStats({
    classId: params.classId,
    date:    params.date,
    type:    params.type,
  })

  function handleParamsChange(next: Partial<AttendanceListParams>) {
    setParams((p) => ({ ...p, ...next, page: ATTENDANCE_DEFAULT_PAGE }))
  }

  function handleClear() {
    setParams({ page: ATTENDANCE_DEFAULT_PAGE, pageSize: ATTENDANCE_DEFAULT_PAGE_SIZE })
  }

  function handleDelete(id: string) {
    remove(id)
  }

  // Full-page initial loading
  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Spinner size={40} />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Failed to load attendance records. Please refresh.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold" style={{ color: 'var(--navy)' }}>
            Attendance
          </h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {total} record{total !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/ui-showcase"
            className="flex h-8 items-center gap-1.5 rounded-md border bg-white px-3 text-xs font-semibold text-[var(--navy)] shadow-sm hover:bg-slate-50 transition-colors"
            style={{ borderColor: 'var(--border)' }}
          >
            🎨 UI Showcase
          </a>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="flex h-8 items-center gap-1.5 rounded-md px-3.5 text-xs font-semibold"
            style={{ background: 'var(--button-background)', color: 'var(--button-text)' }}
          >
            <Plus className="size-3.5" aria-hidden />
            Mark Attendance
          </button>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <AttendanceStatsBar stats={statsQuery.data} isLoading={statsQuery.isLoading} />

      {/* ── Main Card (no overflow-hidden on outer card so dropdowns never get clipped) ── */}
      <div
        className="relative rounded-xl border"
        style={{
          background:  'var(--card-background)',
          boxShadow:   'var(--card-shadow)',
          borderColor: 'var(--border)',
        }}
      >
        {/* Filters — elevated z-index so dropdowns render smoothly above table */}
        <div className="relative z-20">
          <AttendanceFilters
            params={params}
            onParamsChange={handleParamsChange}
            onClear={handleClear}
          />
        </div>

        {/* Table */}
        <div className="relative z-10 overflow-hidden rounded-b-xl">
          <AttendanceTable
            rows={rows}
            isLoading={isFetching}
            page={params.page ?? ATTENDANCE_DEFAULT_PAGE}
            pageSize={params.pageSize ?? ATTENDANCE_DEFAULT_PAGE_SIZE}
            deletingId={deletingId}
            onDelete={handleDelete}
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="flex items-center justify-between border-t px-4 py-3"
            style={{ borderColor: 'var(--border)' }}
          >
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Page {params.page ?? 1} of {totalPages}
            </p>
            <div className="flex gap-1.5">
              <button
                type="button"
                disabled={(params.page ?? 1) <= 1}
                onClick={() => setParams((p) => ({ ...p, page: (p.page ?? 1) - 1 }))}
                className="h-7 rounded-md border px-3 text-xs font-medium disabled:opacity-40"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                Prev
              </button>
              <button
                type="button"
                disabled={(params.page ?? 1) >= totalPages}
                onClick={() => setParams((p) => ({ ...p, page: (p.page ?? 1) + 1 }))}
                className="h-7 rounded-md border px-3 text-xs font-medium disabled:opacity-40"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <CreateAttendanceModal
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
    </div>
  )
}
