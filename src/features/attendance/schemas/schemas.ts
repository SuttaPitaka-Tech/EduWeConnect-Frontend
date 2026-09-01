import { z } from 'zod'

// ── Enum schemas ──────────────────────────────────────────────────
export const attendanceStatusSchema = z.enum(['present', 'absent', 'late', 'leave', 'halfday'])
export const attendanceTypeSchema   = z.enum(['student', 'staff'])
export const attendanceSessionSchema = z.enum(['morning', 'afternoon', 'fullday'])

// ── Entity schema ─────────────────────────────────────────────────
export const attendanceRecordSchema = z.object({
  id:          z.string(),
  memberId:    z.string(),
  memberName:  z.string(),
  classId:     z.string().optional(),
  className:   z.string().optional(),
  date:        z.string(),
  status:      attendanceStatusSchema,
  type:        attendanceTypeSchema,
  session:     attendanceSessionSchema.optional(),
  remarks:     z.string().optional(),
  markedById:  z.string(),
  createdAt:   z.string(),
  updatedAt:   z.string(),
})

// ── List response schema ─────────────────────────────────────────
export const attendanceListResponseSchema = z.object({
  data:       z.array(attendanceRecordSchema),
  total:      z.number(),
  page:       z.number(),
  pageSize:   z.number(),
  totalPages: z.number(),
  message:    z.string().optional(),
})

// ── Stats schema ──────────────────────────────────────────────────
export const attendanceStatsSchema = z.object({
  totalPresent: z.number(),
  totalAbsent:  z.number(),
  totalLate:    z.number(),
  totalLeave:   z.number(),
  percentage:   z.number(),
})

// ── Form schemas (React Hook Form + zodResolver) ──────────────────
export const markAttendanceFormSchema = z.object({
  classId: z.string().min(1, 'Class is required'),
  date:    z.string().min(1, 'Date is required'),
  type:    attendanceTypeSchema,
  records: z.array(z.object({
    memberId: z.string().min(1),
    status:   attendanceStatusSchema,
    remarks:  z.string().optional(),
  })).min(1, 'At least one record is required'),
})
