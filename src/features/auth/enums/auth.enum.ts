/**
 * auth.enum.ts — All auth-related enums.
 * Roles strictly match the MySQL `user_roles` table `role_name` enum:
 * enum('super_admin','organization','staff','students','parents')
 */

export const AuthJourney = {
  Login:          'login',
  Otp:            'otp',
  ForgotPassword: 'forgot-password',
  Dashboard:      'dashboard',
} as const
export type AuthJourney = (typeof AuthJourney)[keyof typeof AuthJourney]

export const AuthNextPage = {
  Otp:       'otp',
  Dashboard: 'dashboard',
} as const
export type AuthNextPage = (typeof AuthNextPage)[keyof typeof AuthNextPage]

export const UserRole = {
  SuperAdmin:   'super_admin',
  Organization: 'organization',
  Staff:        'staff',
  Students:     'students',
  Parents:      'parents',
} as const
export type UserRole = (typeof UserRole)[keyof typeof UserRole]
