import { useForm, useFieldArray, Controller, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import type { AttendanceFormProps, MarkAttendanceFormValues } from '../types/types'
import { AttendanceType, AttendanceStatus } from '../enums/attendance.enum'
import { markAttendanceFormSchema } from '../schemas/schemas'
import { useCreateAttendanceMutation } from '../mutations/create-attendance'
import {
  Button,
  ActionIconButton,
  Input,
  Label,
  Dropdown,
  type DropdownOption,
  Alert,
} from '@/components/ui'

const TYPE_OPTIONS: DropdownOption[] = [
  { value: AttendanceType.STUDENT, label: 'Student' },
  { value: AttendanceType.STAFF, label: 'Staff' },
]

const STATUS_OPTIONS: DropdownOption[] = [
  { value: AttendanceStatus.PRESENT, label: 'Present' },
  { value: AttendanceStatus.ABSENT, label: 'Absent' },
  { value: AttendanceStatus.LATE, label: 'Late' },
  { value: AttendanceStatus.LEAVE, label: 'Leave' },
  { value: AttendanceStatus.HALFDAY, label: 'Half Day' },
]

const DEFAULT_FORM_VALUES: MarkAttendanceFormValues = {
  classId: '',
  date: new Date().toISOString().split('T')[0],
  type: AttendanceType.STUDENT,
  records: [
    {
      memberId: 'STD-101',
      status: AttendanceStatus.PRESENT,
      remarks: '',
    },
  ],
}

/**
 * Pure Form Component — MNC Architecture Standard
 * Decoupled from Dialog/Modal container so it can be reused in:
 * 1. Desktop Dialog Modals
 * 2. Mobile Side Sheets / Bottom Drawers
 * 3. Dedicated Full Pages
 */
export function AttendanceForm({
  onSuccess,
  onCancel,
  defaultValues = DEFAULT_FORM_VALUES,
}: AttendanceFormProps) {
  const createMutation = useCreateAttendanceMutation()

  const methods = useForm<MarkAttendanceFormValues>({
    resolver: zodResolver(markAttendanceFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      ...DEFAULT_FORM_VALUES,
      ...defaultValues,
    },
  })

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = methods

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'records',
  })

  async function onSubmit(data: MarkAttendanceFormValues) {
    try {
      await createMutation.mutateAsync(
        {
          classId: data.classId,
          date: data.date,
          type: data.type,
          records: data.records.map((r) => ({
            memberId: r.memberId,
            status: r.status,
            remarks: r.remarks,
          })),
        },
        {
          onSuccess: () => {
            reset(DEFAULT_FORM_VALUES)
            onSuccess?.()
          },
          onError: (error: any) => {
            if (error?.response?.data?.errors) {
              Object.entries(error.response.data.errors).forEach(([field, msg]) => {
                setError(field as any, { type: 'server', message: String(msg) })
              })
            } else {
              setError('root.serverError' as any, {
                type: 'server',
                message: error?.message || 'Failed to save attendance records.',
              })
            }
          },
        },
      )
    } catch {
      // Handled in mutation onError
    }
  }

  const rootError = (errors as any)?.root?.serverError?.message

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 py-2">
        {/* Global Server Error Display */}
        {rootError && (
          <Alert variant="danger" title="Submission Error">
            {rootError}
          </Alert>
        )}

        {/* Top Grid: Class, Date, Type */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Class ID */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="classId">Class / Section *</Label>
            <Input
              id="classId"
              placeholder="e.g. Class 10 - A"
              {...register('classId')}
              error={Boolean(errors.classId)}
            />
            {errors.classId && (
              <p className="text-xs text-red-600">{errors.classId.message}</p>
            )}
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              {...register('date')}
              error={Boolean(errors.date)}
            />
            {errors.date && (
              <p className="text-xs text-red-600">{errors.date.message}</p>
            )}
          </div>

          {/* Attendee Type (Controlled Dropdown) */}
          <div className="flex flex-col gap-1.5">
            <Label>Attendee Type *</Label>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Dropdown
                  value={field.value}
                  onChange={field.onChange}
                  options={TYPE_OPTIONS}
                  clearable={false}
                />
              )}
            />
            {errors.type && (
              <p className="text-xs text-red-600">{errors.type.message}</p>
            )}
          </div>
        </div>

        {/* Dynamic Attendee Records (useFieldArray) */}
        <div className="flex flex-col gap-2 pt-2">
          <div className="flex items-center justify-between">
            <Label className="font-bold">Student / Staff Records *</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 text-xs gap-1"
              onClick={() =>
                append({
                  memberId: `STD-${100 + fields.length + 1}`,
                  status: AttendanceStatus.PRESENT,
                  remarks: '',
                })
              }
            >
              <Plus className="size-3" /> Add Row
            </Button>
          </div>

          {errors.records?.message && (
            <p className="text-xs text-red-600">{errors.records.message}</p>
          )}

          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
            {fields.map((item, index) => {
              const rowError = errors.records?.[index]
              return (
                <div
                  key={item.id}
                  className="flex items-start gap-2 p-2.5 rounded-[6px] border bg-[var(--input-bg)]"
                  style={{ borderColor: 'var(--border)' }}
                >
                  {/* Member ID */}
                  <div className="flex-1 flex flex-col gap-1">
                    <Input
                      placeholder="Member ID / Roll #"
                      className="h-8 text-xs"
                      {...register(`records.${index}.memberId` as const)}
                      error={Boolean(rowError?.memberId)}
                    />
                    {rowError?.memberId && (
                      <p className="text-[11px] text-red-600">
                        {rowError.memberId.message}
                      </p>
                    )}
                  </div>

                  {/* Status Dropdown */}
                  <div className="w-36 flex flex-col gap-1">
                    <Controller
                      control={control}
                      name={`records.${index}.status` as const}
                      render={({ field }) => (
                        <Dropdown
                          value={field.value}
                          onChange={field.onChange}
                          options={STATUS_OPTIONS}
                          clearable={false}
                          className="h-8 text-xs"
                        />
                      )}
                    />
                  </div>

                  {/* Remarks */}
                  <div className="flex-1 flex flex-col gap-1">
                    <Input
                      placeholder="Remarks (optional)"
                      className="h-8 text-xs"
                      {...register(`records.${index}.remarks` as const)}
                    />
                  </div>

                  {/* Delete Row */}
                  {fields.length > 1 && (
                    <ActionIconButton
                      variant="delete"
                      label="Remove Row"
                      className="mt-0.5"
                      onClick={() => remove(index)}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              disabled={createMutation.isPending || isSubmitting}
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            isLoading={createMutation.isPending || isSubmitting}
          >
            Save Attendance
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
