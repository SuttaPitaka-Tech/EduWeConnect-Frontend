import { AttendanceStatus } from '../enums/attendance.enum'

// ── Routes ────────────────────────────────────────────────────────
export const ATTENDANCE_ROUTES = {
  list: '/attendance',
} as const

// ── Pagination defaults ───────────────────────────────────────────
export const ATTENDANCE_DEFAULT_PAGE      = 1
export const ATTENDANCE_DEFAULT_PAGE_SIZE = 20

// ── Table column headers ──────────────────────────────────────────
export const ATTENDANCE_TABLE_COLUMNS = [
  { key: 'memberName', label: 'Name' },
  { key: 'className',  label: 'Class' },
  { key: 'date',       label: 'Date' },
  { key: 'status',     label: 'Status' },
  { key: 'type',       label: 'Type' },
  { key: 'actions',    label: '' },
] as const

// ── Status badge styling map ─────────────────────────────────────
export const ATTENDANCE_STATUS_BADGE: Record<string, { label: string; className: string }> = {
  [AttendanceStatus.PRESENT]: { label: 'Present', className: 'bg-green-50 text-green-700 border-green-200' },
  [AttendanceStatus.ABSENT]:  { label: 'Absent',  className: 'bg-red-50 text-red-700 border-red-200' },
  [AttendanceStatus.LATE]:    { label: 'Late',    className: 'bg-amber-50 text-amber-700 border-amber-200' },
  [AttendanceStatus.LEAVE]:   { label: 'Leave',   className: 'bg-blue-50 text-blue-700 border-blue-200' },
  [AttendanceStatus.HALFDAY]: { label: 'Half Day', className: 'bg-purple-50 text-purple-700 border-purple-200' },
}
