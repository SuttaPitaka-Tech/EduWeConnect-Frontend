/**
 * Attendance domain — 100% of TypeScript types live here.
 * ZERO inline interfaces allowed in component files.
 */
import type { z } from 'zod'
import type {
  attendanceRecordSchema,
  attendanceListResponseSchema,
  attendanceStatsSchema,
  markAttendanceFormSchema,
} from '../schemas/schemas'
import type { AttendanceStatus, AttendanceType, AttendanceSession } from '../enums/attendance.enum'

// ── Inferred types from Zod schemas ──────────────────────────────
export type AttendanceRecord       = z.infer<typeof attendanceRecordSchema>
export type AttendanceListResponse = z.infer<typeof attendanceListResponseSchema>
export type AttendanceStats        = z.infer<typeof attendanceStatsSchema>
export type MarkAttendanceFormValues = z.infer<typeof markAttendanceFormSchema>

// ── API DTOs ──────────────────────────────────────────────────────
export interface CreateAttendanceDto {
  classId:  string
  date:     string
  type:     AttendanceType
  records:  { memberId: string; status: AttendanceStatus; remarks?: string }[]
}

export interface UpdateAttendanceDto {
  status:   AttendanceStatus
  remarks?: string
}

// ── Query params ─────────────────────────────────────────────────
export interface AttendanceListParams {
  page?:     number
  pageSize?: number
  search?:   string
  classId?:  string
  date?:     string
  status?:   AttendanceStatus
  type?:     AttendanceType
  session?:  AttendanceSession
}

// ── Component prop interfaces ─────────────────────────────────────
export interface AttendanceTableProps {
  rows:        AttendanceRecord[]
  isLoading:   boolean
  page:        number
  pageSize:    number
  deletingId:  string | null
  onDelete:    (id: string) => void
}

export interface AttendanceFiltersProps {
  params:          AttendanceListParams
  onParamsChange:  (next: Partial<AttendanceListParams>) => void
  onClear:         () => void
}

export interface AttendanceStatsBarProps {
  stats:     AttendanceStats | undefined
  isLoading: boolean
}

export interface CreateAttendanceModalProps {
  open:          boolean
  onOpenChange:  (open: boolean) => void
}

export interface AttendanceFormProps {
  onSuccess?:     () => void
  onCancel?:      () => void
  defaultValues?: Partial<MarkAttendanceFormValues>
}
