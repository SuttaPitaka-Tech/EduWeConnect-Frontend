import { useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/contexts/auth-context'
import { UserRole } from '@/features/auth/enums/auth.enum'
import { API_GATEWAY_URL } from '@/config/api.config'

export interface UsePermissionsResult {
  permissions: Record<string, boolean>
  isLoading: boolean
  isFetching: boolean
  hasAnyRolePermission: boolean
  canAccessRoute: (pathname: string) => boolean
  canAccessModule: (moduleName: string) => boolean
  firstAllowedRoute: string | null
  refetch: () => Promise<any>
}

// Module to route mapping for Organization
const ORG_ROUTE_MODULE_MAP: Record<string, string> = {
  '/organization/dashboard': 'Dashboard',
  '/organization/create-users': 'Create Users',
  '/organization/calendar': 'Attendance and Calendar',
  '/organization/chat': 'Chats',
}

// Module to route mapping for Staff
const STAFF_ROUTE_MODULE_MAP: Record<string, string> = {
  '/staff/welcome': 'Dashboard',
  '/staff/dashboard': 'Dashboard',
  '/staff/calendar': 'Attendance and Calendar',
  '/staff/chat': 'Chat',
}

// Module to route mapping for Students
const STUDENT_ROUTE_MODULE_MAP: Record<string, string> = {
  '/student/welcome': 'Dashboard',
  '/student/dashboard': 'Dashboard',
  '/student/timetable': 'Time Table',
  '/student/attendance': 'Attendance',
  '/student/notes': 'Notes',
  '/student/calendar': 'Attendance and Calendar',
  '/student/chat': 'Chats',
}

export function usePermissions(): UsePermissionsResult {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const orgId = user?.institutionId || user?.id

  // SuperAdmin has unrestricted access to all SuperAdmin features
  const isSuperAdmin = user?.role === UserRole.SuperAdmin

  const {
    data: permissions = {},
    isLoading,
    isFetching,
    refetch: queryRefetch,
  } = useQuery<Record<string, boolean>>({
    queryKey: ['permissions', orgId],
    queryFn: async () => {
      if (!orgId) return {}
      const res = await fetch(`${API_GATEWAY_URL}/menus/permissions/${orgId}`, {
        cache: 'no-store',
      })
      if (!res.ok) throw new Error('Failed to fetch permissions')
      return res.json()
    },
    enabled: Boolean(user && orgId && !isSuperAdmin),
    staleTime: 30 * 1000, // 30 seconds
  })

  const refetch = async () => {
    if (orgId) {
      await queryClient.invalidateQueries({ queryKey: ['permissions', orgId] })
    }
    return queryRefetch()
  }

  // Determine role-specific prefix and route map
  const { rolePrefix, routeModuleMap, orderedRoutes } = useMemo(() => {
    if (user?.role === UserRole.Organization) {
      return {
        rolePrefix: 'Organization',
        routeModuleMap: ORG_ROUTE_MODULE_MAP,
        orderedRoutes: [
          '/organization/dashboard',
          '/organization/create-users',
          '/organization/calendar',
          '/organization/chat',
        ],
      }
    }
    if (user?.role === UserRole.Staff) {
      return {
        rolePrefix: 'Staff / Teachers',
        routeModuleMap: STAFF_ROUTE_MODULE_MAP,
        orderedRoutes: [
          '/staff/welcome',
          '/staff/calendar',
          '/staff/chat',
        ],
      }
    }
    if (user?.role === UserRole.Students) {
      return {
        rolePrefix: 'Students',
        routeModuleMap: STUDENT_ROUTE_MODULE_MAP,
        orderedRoutes: [
          '/student/welcome',
          '/student/timetable',
          '/student/attendance',
          '/student/notes',
          '/student/calendar',
          '/student/chat',
        ],
      }
    }
    return {
      rolePrefix: '',
      routeModuleMap: {},
      orderedRoutes: [],
    }
  }, [user?.role])

  // Check if current role has ANY permission granted
  const hasAnyRolePermission = useMemo(() => {
    if (isSuperAdmin) return true
    if (!rolePrefix || !permissions) return false
    
    // Check if at least one permission starting with the role prefix is true
    return Object.entries(permissions).some(([key, val]) => 
      key.startsWith(`${rolePrefix}-`) && Boolean(val)
    )
  }, [isSuperAdmin, rolePrefix, permissions])

  const canAccessModule = useMemo(() => {
    return (moduleName: string): boolean => {
      if (isSuperAdmin) return true
      if (!rolePrefix || !permissions) return false
      return Boolean(permissions[`${rolePrefix}-${moduleName}`])
    }
  }, [isSuperAdmin, rolePrefix, permissions])

  const canAccessRoute = useMemo(() => {
    return (pathname: string): boolean => {
      if (isSuperAdmin) return true
      if (!rolePrefix || !permissions) return false

      // Match path exactly or prefix
      const matchedEntry = Object.entries(routeModuleMap).find(([route]) =>
        pathname === route || pathname.startsWith(`${route}/`)
      )

      if (!matchedEntry) return true // Allow unmapped auxiliary pages within the role layout

      const [, moduleName] = matchedEntry
      return Boolean(permissions[`${rolePrefix}-${moduleName}`])
    }
  }, [isSuperAdmin, rolePrefix, routeModuleMap, permissions])

  const firstAllowedRoute = useMemo(() => {
    if (isSuperAdmin) return '/superadmin/dashboard'
    if (!hasAnyRolePermission) return null

    for (const route of orderedRoutes) {
      const moduleName = routeModuleMap[route]
      if (moduleName && permissions[`${rolePrefix}-${moduleName}`]) {
        return route
      }
    }
    return null
  }, [isSuperAdmin, hasAnyRolePermission, orderedRoutes, routeModuleMap, permissions, rolePrefix])

  return {
    permissions,
    isLoading: !isSuperAdmin && isLoading,
    isFetching,
    hasAnyRolePermission,
    canAccessRoute,
    canAccessModule,
    firstAllowedRoute,
    refetch,
  }
}
