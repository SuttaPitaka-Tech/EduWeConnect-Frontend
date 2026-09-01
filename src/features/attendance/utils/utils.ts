import { AttendanceStatus } from '../enums/attendance.enum'
import { ATTENDANCE_STATUS_BADGE } from '../constants/constants'
import type { AttendanceRecord } from '../types/types'

/** Format date string to dd MMM yyyy */
export function formatAttendanceDate(iso: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  }).format(new Date(iso))
}

/** Get badge config for a given status */
export function getAttendanceBadge(status: AttendanceStatus): { label: string; className: string } {
  return ATTENDANCE_STATUS_BADGE[status] ?? { label: status, className: '' }
}

/** Calculate attendance percentage from a list of records */
export function calcAttendancePercentage(records: AttendanceRecord[]): number {
  if (records.length === 0) return 0
  const present = records.filter((r) => r.status === AttendanceStatus.PRESENT).length
  return Math.round((present / records.length) * 100)
}
