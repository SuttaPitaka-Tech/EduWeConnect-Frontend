import type { AttendanceListParams } from '../types/types'

/** Central Query Key Factory for the attendance domain */
export const attendanceKeys = {
  all:     ['attendance'] as const,
  lists:   () => [...attendanceKeys.all, 'list'] as const,
  list:    (params: AttendanceListParams) => [...attendanceKeys.lists(), params] as const,
  details: () => [...attendanceKeys.all, 'detail'] as const,
  detail:  (id: string) => [...attendanceKeys.details(), id] as const,
  stats:   () => [...attendanceKeys.all, 'stats'] as const,
}
