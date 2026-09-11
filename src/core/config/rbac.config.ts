import { UserRole } from '@/features/auth/enums/auth.enum'
import type { AuthUser } from '@/features/auth/types/types'

/**
 * Enterprise Role-Based Access Control (RBAC) & Navigation Registry
 *
 * Single Source of Truth for:
 * 1. O(1) Declarative Route Resolution
 * 2. Role Identity Metadata & Dynamic Welcome Messaging
 * 3. Scope Permissions & Allowed Route Namespaces
 *
 * Designed according to enterprise multi-tenant RBAC standards (zero fragile if/else ladders).
 */

export interface RolePolicy {
  readonly homeRoute: string
  readonly label: string
  readonly allowedPrefixes: readonly string[]
  readonly getWelcomeMessage: (user?: Partial<AuthUser> | null) => string
}

export const DEFAULT_UNAUTHENTICATED_ROUTE = '/login' as const
export const DEFAULT_APP_FALLBACK_ROUTE = '/app/attendance' as const

const STAFF_GREETING_MAP: Readonly<Record<string, string>> = {
  Teacher: 'Welcome, Teacher!',
  Finance: 'Welcome, Staff (Finance)!',
  'Non Staff': 'Welcome, Staff (Non-Staff)!',
}

export const ROLE_REGISTRY: Readonly<Record<string, RolePolicy>> = {
  [UserRole.SuperAdmin]: {
    homeRoute: '/superadmin/dashboard',
    label: 'Super Admin',
    allowedPrefixes: ['/superadmin'],
    getWelcomeMessage: () => 'Welcome, Super Admin!',
  },
  [UserRole.Organization]: {
    homeRoute: '/organization/dashboard',
    label: 'Organization',
    allowedPrefixes: ['/organization'],
    getWelcomeMessage: (user) => {
      const org = user?.organizationName || user?.institutionName || 'Organization'
      return `Welcome, ${org} (Org)!`
    },
  },
  [UserRole.Staff]: {
    homeRoute: '/staff/welcome',
    label: 'Staff',
    allowedPrefixes: ['/staff'],
    getWelcomeMessage: (user) => {
      const empType = user?.employeeType ?? ''
      return STAFF_GREETING_MAP[empType] ?? `Welcome, ${user?.firstName || 'Staff'}!`
    },
  },
  [UserRole.Students]: {
    homeRoute: '/student/welcome',
    label: 'Student',
    allowedPrefixes: ['/student'],
    getWelcomeMessage: (user) => `Welcome, ${user?.firstName || 'Student'}!`,
  },
  [UserRole.Parents]: {
    homeRoute: '/app/attendance',
    label: 'Parent',
    allowedPrefixes: ['/app'],
    getWelcomeMessage: (user) => `Welcome, ${user?.firstName || 'Parent'}!`,
  },
} as const

/**
 * Constant-time O(1) resolver for a role's designated home portal.
 */
export function getRoleHomeRoute(role?: string | null): string {
  if (!role) return DEFAULT_UNAUTHENTICATED_ROUTE
  return ROLE_REGISTRY[role]?.homeRoute ?? DEFAULT_APP_FALLBACK_ROUTE
}

/**
 * Constant-time O(1) resolver for dynamic role greetings.
 */
export function getRoleWelcomeMessage(user?: Partial<AuthUser> | null): string {
  if (!user?.role) return 'Welcome!'
  const policy = ROLE_REGISTRY[user.role]
  return policy ? policy.getWelcomeMessage(user) : `Welcome, ${user.firstName || 'User'}!`
}

/**
 * High-performance declarative access check for role permissions.
 */
export function isRoleAllowed(role: string | undefined | null, allowedRoles: readonly string[]): boolean {
  return Boolean(role && allowedRoles.includes(role))
}

