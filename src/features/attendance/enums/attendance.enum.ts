/**
 * Attendance Module Domain Enums
 * Values match backend DB enum columns exactly (lowercase).
 * NEVER use hardcoded string literals — always use these constants.
 */

export const AttendanceStatus = {
  PRESENT: 'present',
  ABSENT:  'absent',
  LATE:    'late',
  LEAVE:   'leave',
  HALFDAY: 'halfday',
} as const
export type AttendanceStatus = (typeof AttendanceStatus)[keyof typeof AttendanceStatus]

export const AttendanceType = {
  STUDENT: 'student',
  STAFF:   'staff',
} as const
export type AttendanceType = (typeof AttendanceType)[keyof typeof AttendanceType]

export const AttendanceSession = {
  MORNING:   'morning',
  AFTERNOON: 'afternoon',
  FULLDAY:   'fullday',
} as const
export type AttendanceSession = (typeof AttendanceSession)[keyof typeof AttendanceSession]
