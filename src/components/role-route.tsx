import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'
import { PageSpinner } from '@/components/ui'
import { isRoleAllowed, getRoleHomeRoute } from '@/core/config/rbac.config'

interface RoleRouteProps {
  allowedRoles: string[]
  children: React.ReactNode
}

/**
 * RoleRoute — strictly ensures the authenticated user possesses one of the allowed roles.
 * If unauthorized, immediately redirects to their designated home portal via O(1) RBAC lookup.
 */
export function RoleRoute({ allowedRoles, children }: RoleRouteProps) {
  const { user, isAuthenticated, isInitialized } = useAuth()

  if (!isInitialized) {
    return <PageSpinner size={40} />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user && !isRoleAllowed(user.role, allowedRoles)) {
    return <Navigate to={getRoleHomeRoute(user.role)} replace />
  }

  return <>{children}</>
}

