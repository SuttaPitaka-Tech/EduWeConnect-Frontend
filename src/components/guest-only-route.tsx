import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'
import { getRoleHomeRoute } from '@/core/config/rbac.config'

interface GuestOnlyRouteProps {
  children: React.ReactNode
}

/** 
 * Redirects authenticated users away from guest-only pages (login, registration, etc.)
 * directly to their designated enterprise home portal via O(1) RBAC lookup.
 */
export function GuestOnlyRoute({ children }: GuestOnlyRouteProps) {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={getRoleHomeRoute(user?.role)} replace />
  }

  return <>{children}</>
}

