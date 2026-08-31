import { ActionIconButton } from '@/components/ui/action-icon-button'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'
import type { AttendanceTableProps } from '../types/types'
import { ATTENDANCE_STATUS_BADGE, ATTENDANCE_TABLE_COLUMNS } from '../constants/constants'

export function AttendanceTable({
  rows,
  isLoading,
  page,
  pageSize,
  deletingId,
  onDelete,
}: AttendanceTableProps) {
  if (isLoading && rows.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Spinner size={32} />
      </div>
    )
  }

  if (!isLoading && rows.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center gap-2">
        <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
          No attendance records found.
        </p>
      </div>
    )
  }

  return (
    <div className="relative overflow-x-auto">
      {/* Fetching overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
          <Spinner size={24} />
        </div>
      )}

      <table className="w-full text-left text-xs" style={{ color: 'var(--text-primary)' }}>
        <thead>
          <tr className="border-b" style={{ borderColor: 'var(--border)', background: 'var(--cream)' }}>
            <th className="px-4 py-2.5 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>#</th>
            {ATTENDANCE_TABLE_COLUMNS.map((col) => (
              <th
                key={col.key}
                className="px-4 py-2.5 text-xs font-semibold"
                style={{ color: 'var(--text-muted)' }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            const badge = ATTENDANCE_STATUS_BADGE[row.status]
            const rowNum = (page - 1) * pageSize + idx + 1
            return (
              <tr
                key={row.id}
                className="border-b transition-colors hover:bg-[var(--cream)]"
                style={{ borderColor: 'var(--border)' }}
              >
                <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-muted)' }}>{rowNum}</td>
                <td className="px-4 py-2.5 font-medium">{row.memberName}</td>
                <td className="px-4 py-2.5" style={{ color: 'var(--text-secondary)' }}>
                  {row.className ?? '—'}
                </td>
                <td className="px-4 py-2.5" style={{ color: 'var(--text-secondary)' }}>
                  {formatDate(row.date)}
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className={cn(
                      'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
                      badge?.className,
                    )}
                  >
                    {badge?.label ?? row.status}
                  </span>
                </td>
                <td className="px-4 py-2.5 capitalize" style={{ color: 'var(--text-secondary)' }}>
                  {row.type}
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-1">
                    <ActionIconButton
                      variant="delete"
                      isLoading={deletingId === row.id}
                      onClick={() => onDelete(row.id)}
                      label={`Delete attendance record for ${row.memberName}`}
                    />
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
