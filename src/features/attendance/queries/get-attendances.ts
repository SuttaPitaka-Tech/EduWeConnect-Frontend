import { keepPreviousData, queryOptions, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAttendances, getAttendanceById, getAttendanceStats } from '../api/attendance.api'
import type { AttendanceListParams } from '../types/types'
import { attendanceKeys } from './keys'

// ── List query options ────────────────────────────────────────────
export const attendanceListQueryOptions = (params: AttendanceListParams = {}) =>
  queryOptions({
    queryKey:        attendanceKeys.list(params),
    queryFn:         () => getAttendances(params),
    placeholderData: keepPreviousData,
    staleTime:       0,               // MANDATORY — no stale data across navigations
  })

// ── Detail query options ──────────────────────────────────────────
export const attendanceDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: attendanceKeys.detail(id),
    queryFn:  () => getAttendanceById(id),
    enabled:  Boolean(id),
    staleTime: 0,
  })

// ── Hooks ────────────────────────────────────────────────────────
export function useGetAttendances(
  params: AttendanceListParams = {},
  options?: { enabled?: boolean },
) {
  return useQuery({
    ...attendanceListQueryOptions(params),
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
  })
}

export function useGetAttendanceDetail(id: string | null) {
  return useQuery({
    ...attendanceDetailQueryOptions(id ?? ''),
    enabled: Boolean(id),
  })
}

export function useGetAttendanceStats(
  params: Pick<AttendanceListParams, 'classId' | 'date' | 'type'>,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: attendanceKeys.stats(),
    queryFn:  () => getAttendanceStats(params),
    staleTime: 0,
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
  })
}

/** Invalidate all attendance queries — used after mutations */
export function useInvalidateAttendance() {
  const queryClient = useQueryClient()
  return async () =>
    queryClient.invalidateQueries({ queryKey: attendanceKeys.all, refetchType: 'all' })
}
