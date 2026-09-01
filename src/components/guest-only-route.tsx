import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'

interface GuestOnlyRouteProps {
  children: React.ReactNode
}

/** Redirects authenticated users away from login/forgot-password pages */
export function GuestOnlyRoute({ children }: GuestOnlyRouteProps) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
