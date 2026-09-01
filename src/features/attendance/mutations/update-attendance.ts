import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { formatApiClientError } from '@/lib/api-client'
import { updateAttendance as updateAttendanceApi } from '../api/attendance.api'
import { attendanceKeys } from '../queries/keys'
import type { UpdateAttendanceDto } from '../types/types'

export function useUpdateAttendanceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAttendanceDto }) =>
      updateAttendanceApi(id, payload),
    onSuccess: async () => {
      toast.success('Attendance updated successfully!')
      await queryClient.invalidateQueries({ queryKey: attendanceKeys.all, refetchType: 'all' })
    },
    onError: (error: Error) => {
      toast.error(formatApiClientError(error, 'Failed to update attendance.'))
    },
  })
}
