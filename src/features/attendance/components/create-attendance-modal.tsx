import { useState } from 'react'
import type { CreateAttendanceModalProps, MarkAttendanceFormValues } from '../types/types'
import { AttendanceType, AttendanceStatus } from '../enums/attendance.enum'
import { useCreateAttendanceMutation } from '../mutations/create-attendance'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
  Label,
  Dropdown,
  type DropdownOption,
  Spinner,
} from '@/components/ui'

const TYPE_OPTIONS: DropdownOption[] = [
  { value: AttendanceType.STUDENT, label: 'Student' },
  { value: AttendanceType.STAFF, label: 'Staff' },
]

export function CreateAttendanceModal({ open, onOpenChange }: CreateAttendanceModalProps) {
  const createMutation = useCreateAttendanceMutation()

  const [form, setForm] = useState<Partial<MarkAttendanceFormValues>>({
    type: AttendanceType.STUDENT,
    date: new Date().toISOString().split('T')[0],
    classId: '',
    records: [
      {
        memberId: 'mem_001',
        status: AttendanceStatus.PRESENT,
        remarks: '',
      },
    ],
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.classId || !form.date || !form.type || !form.records?.length) return
    createMutation.mutate(
      {
        classId: form.classId,
        date:    form.date,
        type:    form.type,
        records: form.records.map((r) => ({
          memberId: r.memberId ?? '',
          status:   r.status ?? AttendanceStatus.PRESENT,
          remarks:  r.remarks,
        })),
      },
      {
        onSuccess: () => onOpenChange(false),
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Mark Attendance</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          {/* Class ID */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="classId">Class / Section</Label>
            <Input
              id="classId"
              type="text"
              placeholder="e.g. Class 10 - A"
              value={form.classId ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, classId: e.target.value }))}
              required
            />
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="att-date">Date</Label>
            <Input
              id="att-date"
              type="date"
              value={form.date ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              required
            />
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1.5">
            <Label>Attendee Type</Label>
            <Dropdown
              value={form.type}
              onChange={(val) => setForm((f) => ({ ...f, type: val as AttendanceType }))}
              options={TYPE_OPTIONS}
              clearable={false}
            />
          </div>

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending && <Spinner size={14} className="mr-2" />}
              Save Attendance
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
