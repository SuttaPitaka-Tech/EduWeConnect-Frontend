/**
 * Attendance Feature — Public Barrel (index.ts)
 * THE ONLY index.ts in this feature.
 * All external consumers import from '@/features/attendance' — NEVER from internal paths.
 */

// Types
export type {
  AttendanceRecord,
  AttendanceListResponse,
  AttendanceStats,
  AttendanceListParams,
  CreateAttendanceDto,
  UpdateAttendanceDto,
  MarkAttendanceFormValues,
  AttendanceTableProps,
  AttendanceFiltersProps,
  AttendanceStatsBarProps,
  CreateAttendanceModalProps,
  AttendanceFormProps,
} from './types/types'

// Enums
export { AttendanceStatus, AttendanceType, AttendanceSession } from './enums/attendance.enum'

// Schemas
export {
  attendanceRecordSchema,
  attendanceListResponseSchema,
  markAttendanceFormSchema,
} from './schemas/schemas'

// Query keys
export { attendanceKeys } from './queries/keys'

// Query hooks
export {
  attendanceListQueryOptions,
  useGetAttendances,
  useGetAttendanceDetail,
  useGetAttendanceStats,
  useInvalidateAttendance,
} from './queries/get-attendances'

// Mutation hooks
export { useCreateAttendanceMutation } from './mutations/create-attendance'
export { useUpdateAttendanceMutation } from './mutations/update-attendance'
export { useDeleteAttendanceMutation } from './mutations/delete-attendance'

// Facade hook
export { useAttendanceList } from './hooks/use-attendance-list'

// Components (pages are NOT exported here — lazy-imported in routes.tsx)
export { AttendanceTable }        from './components/attendance-table'
export { AttendanceFilters }      from './components/attendance-filters'
export { AttendanceStatsBar }     from './components/attendance-stats-bar'
export { AttendanceForm }         from './components/attendance-form'
export { CreateAttendanceModal }   from './components/create-attendance-modal'
