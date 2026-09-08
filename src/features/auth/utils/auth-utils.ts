import type { AuthUser } from '../types/types'
import { UserRole } from '../enums/auth.enum'

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
    [UserRole.SuperAdmin]:   'Super Admin',
    [UserRole.Organization]: 'Organization',
    [UserRole.Staff]:        'Staff',
    [UserRole.Students]:     'Students',
    [UserRole.Parents]:      'Parents',
  }
  return labels[role] ?? role
}
