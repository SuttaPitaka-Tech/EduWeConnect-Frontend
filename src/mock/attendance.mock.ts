/**
 * mock/attendance.mock.ts
 * Mock data for attendance module — used until backend is integrated.
 * Remove VITE_USE_MOCK=true from .env.local when backend is ready.
 *
 * Shape matches attendanceRecordSchema + attendanceStatsSchema exactly.
 */

import type { AttendanceRecord, AttendanceListResponse, AttendanceStats } from '@/features/attendance/types/types'
import { AttendanceStatus, AttendanceType, AttendanceSession } from '@/features/attendance/enums/attendance.enum'

// ── Mock records ───────────────────────────────────────────────────────────

export const MOCK_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  {
    id:          'att_001',
    memberId:    'mem_001',
    memberName:  'Aarav Sharma',
    classId:     'cls_001',
    className:   'Class 10 - A',
    date:        '2026-08-31',
    status:      AttendanceStatus.PRESENT,
    type:        AttendanceType.STUDENT,
    session:     AttendanceSession.FULLDAY,
    remarks:     '',
    markedById:  'usr_001',
    createdAt:   '2026-08-31T07:00:00Z',
    updatedAt:   '2026-08-31T07:00:00Z',
  },
  {
    id:          'att_002',
    memberId:    'mem_002',
    memberName:  'Priya Nair',
    classId:     'cls_001',
    className:   'Class 10 - A',
    date:        '2026-08-31',
    status:      AttendanceStatus.ABSENT,
    type:        AttendanceType.STUDENT,
    session:     AttendanceSession.FULLDAY,
    remarks:     'Sick leave',
    markedById:  'usr_001',
    createdAt:   '2026-08-31T07:00:00Z',
    updatedAt:   '2026-08-31T07:00:00Z',
  },
  {
    id:          'att_003',
    memberId:    'mem_003',
    memberName:  'Rohan Patel',
    classId:     'cls_001',
    className:   'Class 10 - A',
    date:        '2026-08-31',
    status:      AttendanceStatus.LATE,
    type:        AttendanceType.STUDENT,
    session:     AttendanceSession.MORNING,
    remarks:     'Arrived 20 minutes late',
    markedById:  'usr_001',
    createdAt:   '2026-08-31T07:00:00Z',
    updatedAt:   '2026-08-31T07:00:00Z',
  },
  {
    id:          'att_004',
    memberId:    'mem_004',
    memberName:  'Sneha Reddy',
    classId:     'cls_002',
    className:   'Class 9 - B',
    date:        '2026-08-31',
    status:      AttendanceStatus.PRESENT,
    type:        AttendanceType.STUDENT,
    session:     AttendanceSession.FULLDAY,
    remarks:     '',
    markedById:  'usr_001',
    createdAt:   '2026-08-31T07:00:00Z',
    updatedAt:   '2026-08-31T07:00:00Z',
  },
  {
    id:          'att_005',
    memberId:    'stf_001',
    memberName:  'Mr. Rajesh Kumar',
    classId:     'cls_001',
    className:   'Class 10 - A',
    date:        '2026-08-31',
    status:      AttendanceStatus.PRESENT,
    type:        AttendanceType.STAFF,
    session:     AttendanceSession.FULLDAY,
    remarks:     '',
    markedById:  'usr_001',
    createdAt:   '2026-08-31T07:00:00Z',
    updatedAt:   '2026-08-31T07:00:00Z',
  },
  {
    id:          'att_006',
    memberId:    'mem_005',
    memberName:  'Ananya Singh',
    classId:     'cls_002',
    className:   'Class 9 - B',
    date:        '2026-08-31',
    status:      AttendanceStatus.LEAVE,
    type:        AttendanceType.STUDENT,
    session:     AttendanceSession.FULLDAY,
    remarks:     'Medical leave approved',
    markedById:  'usr_001',
    createdAt:   '2026-08-31T07:00:00Z',
    updatedAt:   '2026-08-31T07:00:00Z',
  },
]

// ── Mock paginated response ────────────────────────────────────────────────

export const MOCK_ATTENDANCE_LIST_RESPONSE: AttendanceListResponse = {
  data:       MOCK_ATTENDANCE_RECORDS,
  total:      6,
  page:       1,
  pageSize:   10,
  totalPages: 1,
}

// ── Mock stats (matches attendanceStatsSchema exactly) ────────────────────

export const MOCK_ATTENDANCE_STATS: AttendanceStats = {
  totalPresent: 3,
  totalAbsent:  1,
  totalLate:    1,
  totalLeave:   1,
  percentage:   50,
}
