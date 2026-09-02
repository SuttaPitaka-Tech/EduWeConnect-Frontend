import type { CreateAttendanceModalProps } from '../types/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui'
import { AttendanceForm } from './attendance-form'

/**
 * Modal Container — Decoupled from pure form logic
 * Simply wraps the reusable <AttendanceForm /> in a Radix Dialog.
 */
export function CreateAttendanceModal({ open, onOpenChange }: CreateAttendanceModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Mark Attendance</DialogTitle>
        </DialogHeader>

        <AttendanceForm
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
