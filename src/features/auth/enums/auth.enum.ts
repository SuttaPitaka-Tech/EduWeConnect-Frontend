/**
 * auth.enum.ts — All auth-related enums.
 * Zero hardcoded strings — always reference these enums.
 */

export const AuthJourney = {
  Login:         'login',
  Otp:           'otp',
  ForgotPassword:'forgot-password',
  Dashboard:     'dashboard',
} as const
export type AuthJourney = (typeof AuthJourney)[keyof typeof AuthJourney]

export const AuthNextPage = {
  Otp:       'otp',
  Dashboard: 'dashboard',
} as const
export type AuthNextPage = (typeof AuthNextPage)[keyof typeof AuthNextPage]

export const UserRole = {
  SuperAdmin: 'super_admin',
  Admin:      'admin',
  Principal:  'principal',
  Teacher:    'teacher',
  Student:    'student',
  Parent:     'parent',
  Staff:      'staff',
} as const
export type UserRole = (typeof UserRole)[keyof typeof UserRole]
