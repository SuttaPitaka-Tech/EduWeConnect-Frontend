import type { ChatContact } from './api/chat.api'

/**
 * Normalizes role strings to standard categories
 */
export const normalizeRole = (role?: string): 'super_admin' | 'institution_admin' | 'staff' | 'student' | 'other' => {
  if (!role) return 'other'
  const r = role.toLowerCase().trim().replace(/[_-]/g, ' ')
  if (r.includes('super')) return 'super_admin'
  if (
    r.includes('institution') ||
    r.includes('organization') ||
    (r.includes('admin') && !r.includes('super'))
  ) {
    return 'institution_admin'
  }
  if (r.includes('teacher') || r.includes('staff') || r.includes('faculty')) return 'staff'
  if (r.includes('student')) return 'student'
  return 'other'
}

/**
 * Weights determining the arrangement of members in the Members sidebar tab:
 * 1. Super Admin
 * 2. Organization (Institution Admin)
 * 3. Staff & Teachers
 * 4. Students
 */
export const ROLE_HIERARCHY_ORDER: Record<string, number> = {
  super_admin: 1,
  institution_admin: 2,
  staff: 3,
  student: 4,
  other: 5,
}

export const ROLE_SECTION_TITLES: Record<string, string> = {
  super_admin: 'Super Admin',
  institution_admin: 'Organization Heads',
  staff: 'Staff & Teachers',
  student: 'Students',
  other: 'Other Members',
}

/**
 * Sorts contacts strictly by the requested hierarchy:
 * Super Admin -> Organization -> Staff -> Students
 */
export const sortMembersByRoleHierarchy = (members: ChatContact[]): ChatContact[] => {
  return [...members].sort((a, b) => {
    const roleA = normalizeRole(a.role)
    const roleB = normalizeRole(b.role)
    const weightA = ROLE_HIERARCHY_ORDER[roleA] || 99
    const weightB = ROLE_HIERARCHY_ORDER[roleB] || 99

    if (weightA !== weightB) {
      return weightA - weightB
    }

    return (a.name || '').localeCompare(b.name || '')
  })
}

export interface MemberGroup {
  key: 'super_admin' | 'institution_admin' | 'staff' | 'student' | 'other'
  title: string
  members: ChatContact[]
}

/**
 * Groups members into sections in strict hierarchical order:
 * 1. Super Admin
 * 2. Organization
 * 3. Staff
 * 4. Students
 */
export const groupMembersByRole = (members: ChatContact[]): MemberGroup[] => {
  const groups: Record<string, ChatContact[]> = {
    super_admin: [],
    institution_admin: [],
    staff: [],
    student: [],
    other: [],
  }

  for (const m of members) {
    const roleCategory = normalizeRole(m.role)
    if (groups[roleCategory]) {
      groups[roleCategory].push(m)
    } else {
      groups.other.push(m)
    }
  }

  const order: Array<'super_admin' | 'institution_admin' | 'staff' | 'student' | 'other'> = [
    'super_admin',
    'institution_admin',
    'staff',
    'student',
    'other',
  ]

  return order
    .map((key) => ({
      key,
      title: ROLE_SECTION_TITLES[key],
      members: groups[key].sort((a, b) => (a.name || '').localeCompare(b.name || '')),
    }))
    .filter((g) => g.members.length > 0)
}
