import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { formatApiClientError } from '@/lib/api-client'
import { deleteAttendance as deleteAttendanceApi } from '../api/attendance.api'
import { attendanceKeys } from '../queries/keys'

export function useDeleteAttendanceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAttendanceApi(id),
    onSuccess: async () => {
      toast.success('Attendance record deleted.')
      await queryClient.invalidateQueries({ queryKey: attendanceKeys.all, refetchType: 'all' })
    },
    onError: (error: Error) => {
      toast.error(formatApiClientError(error, 'Failed to delete attendance record.'))
    },
  })
}
