import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { formatApiClientError } from '@/lib/api-client'
import { createAttendance as createAttendanceApi } from '../api/attendance.api'
import { attendanceKeys } from '../queries/keys'
import type { CreateAttendanceDto } from '../types/types'

export function useCreateAttendanceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateAttendanceDto) => createAttendanceApi(payload),
    onSuccess: async () => {
      toast.success('Attendance marked successfully!')
      await queryClient.invalidateQueries({ queryKey: attendanceKeys.all, refetchType: 'all' })
    },
    onError: (error: Error) => {
      toast.error(formatApiClientError(error, 'Failed to mark attendance. Please try again.'))
    },
  })
}
