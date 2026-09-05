import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'
import { PageSpinner } from '@/components/ui'

interface ProtectedRouteProps {
  children: React.ReactNode
}

/** Redirects to /login if user is not authenticated */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isInitialized } = useAuth()

  if (!isInitialized) {
    return <PageSpinner size={40} />
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
