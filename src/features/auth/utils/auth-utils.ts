import type { AuthUser } from '../types/types'
import type { UserRole } from '../enums/auth.enum'

/** Map a raw API user object → typed AuthUser */
export function mapToAuthUser(raw: {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  institutionId: string
  institutionName: string
  avatarUrl?: string
}): AuthUser {
  return {
    id:              raw.id,
    firstName:       raw.firstName,
    lastName:        raw.lastName,
    email:           raw.email,
    role:            raw.role as UserRole,
    institutionId:   raw.institutionId,
    institutionName: raw.institutionName,
    avatarUrl:       raw.avatarUrl,
  }
}

/** Full display name helper */
export function getDisplayName(user: AuthUser | null): string {
  if (!user) return ''
  return `${user.firstName} ${user.lastName}`.trim()
}

/** Role display label */
export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    super_admin: 'Super Admin',
    admin:       'Admin',
    principal:   'Principal',
    teacher:     'Teacher',
    student:     'Student',
    parent:      'Parent',
    staff:       'Staff',
  }
  return labels[role] ?? role
}
