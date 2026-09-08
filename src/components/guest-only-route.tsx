import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'
import { UserRole } from '@/features/auth/enums/auth.enum'

interface GuestOnlyRouteProps {
  children: React.ReactNode
}

/** Redirects authenticated users away from login/forgot-password pages */
export function GuestOnlyRoute({ children }: GuestOnlyRouteProps) {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated) {
    if (user?.role === UserRole.SuperAdmin) {
      return <Navigate to="/superadmin/dashboard" replace />
    }
    return <Navigate to="/app/attendance" replace />
  }

  return <>{children}</>
}
