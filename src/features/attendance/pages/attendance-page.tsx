import { Plus } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { Button, MasterCodePagination, Spinner } from '@/components/ui'
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
import { useState } from 'react'

/** Route-level container — lazy-loaded in routes.tsx via lazyWithRetry() */
export default function AttendancePage() {
  // ── URL-driven table state (Rule §20 — useSearchParams, never useState for filters) ──
  const [searchParams, setSearchParams] = useSearchParams()
  const [createOpen, setCreateOpen]     = useState(false)

  const params: AttendanceListParams = {
    page:     Number(searchParams.get('page'))     || ATTENDANCE_DEFAULT_PAGE,
    pageSize: Number(searchParams.get('pageSize')) || ATTENDANCE_DEFAULT_PAGE_SIZE,
    classId:  searchParams.get('classId')  ?? undefined,
    date:     searchParams.get('date')     ?? undefined,
    status:   (searchParams.get('status')  ?? undefined) as AttendanceListParams['status'],
    type:     (searchParams.get('type')    ?? undefined) as AttendanceListParams['type'],
    session:  (searchParams.get('session') ?? undefined) as AttendanceListParams['session'],
    search:   searchParams.get('search')   ?? undefined,
  }

  const {
    rows,
    total,
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
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev)
      Object.entries(next).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') updated.set(k, String(v))
        else updated.delete(k)
      })
      updated.set('page', String(ATTENDANCE_DEFAULT_PAGE)) // reset to page 1 on every filter change
      return updated
    })
  }

  function handleClear() {
    setSearchParams({
      page:     String(ATTENDANCE_DEFAULT_PAGE),
      pageSize: String(ATTENDANCE_DEFAULT_PAGE_SIZE),
    })
  }

  function handleDelete(id: string) {
    remove(id)
  }

  function handlePageChange(page: number) {
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev)
      updated.set('page', String(page))
      return updated
    })
  }

  function handlePageSizeChange(pageSize: number) {
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev)
      updated.set('pageSize', String(pageSize))
      updated.set('page', String(ATTENDANCE_DEFAULT_PAGE))
      return updated
    })
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

  const currentPage = params.page ?? ATTENDANCE_DEFAULT_PAGE
  const currentPageSize = params.pageSize ?? ATTENDANCE_DEFAULT_PAGE_SIZE

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
          <Button
            variant="outline"
            onClick={() => window.location.assign('/ui-showcase')}
          >
            🎨 UI Showcase
          </Button>
          <Button
            variant="primary"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="size-3.5" aria-hidden />
            Mark Attendance
          </Button>
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
            page={currentPage}
            pageSize={currentPageSize}
            deletingId={deletingId}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* ── Pagination — MasterCodePagination (Rule: ZERO inline UI) ── */}
      {total > 0 && (
        <MasterCodePagination
          totalItems={total}
          currentPage={currentPage}
          pageSize={currentPageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      {/* Create Modal */}
      <CreateAttendanceModal
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
    </div>
  )
}
