import { useCreateAttendanceMutation } from '../mutations/create-attendance'
import { useDeleteAttendanceMutation } from '../mutations/delete-attendance'
import { useUpdateAttendanceMutation } from '../mutations/update-attendance'
import { useGetAttendances } from '../queries/get-attendances'
import type { AttendanceListParams } from '../types/types'

/**
 * Master facade hook for attendance list pages.
 * Bundles query data + all mutations into one clean API.
 * Components import THIS — not individual query/mutation hooks directly.
 */
export function useAttendanceList(params: AttendanceListParams = {}) {
  const listQuery      = useGetAttendances(params)
  const createMutation = useCreateAttendanceMutation()
  const updateMutation = useUpdateAttendanceMutation()
  const deleteMutation = useDeleteAttendanceMutation()

  return {
    // ── List data ────────────────────────
    rows:       listQuery.data?.data ?? [],
    total:      listQuery.data?.total ?? 0,
    totalPages: listQuery.data?.totalPages ?? 1,
    page:       listQuery.data?.page ?? 1,
    pageSize:   listQuery.data?.pageSize ?? 20,
    isLoading:  listQuery.isLoading && !listQuery.data,
    isFetching: listQuery.isFetching,
    isError:    listQuery.isError,
    refetch:    listQuery.refetch,

    // ── Create ───────────────────────────
    create:      createMutation.mutate,
    createAsync: createMutation.mutateAsync,
    isCreating:  createMutation.isPending,

    // ── Update ───────────────────────────
    update:      updateMutation.mutate,
    isUpdating:  updateMutation.isPending,

    // ── Delete ───────────────────────────
    remove:      deleteMutation.mutate,
    deletingId:  deleteMutation.isPending ? (deleteMutation.variables ?? null) : null,
    isDeleting:  deleteMutation.isPending,
  }
}
