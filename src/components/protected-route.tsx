import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'
import { Spinner } from '@/components/ui'

interface ProtectedRouteProps {
  children: React.ReactNode
}

/** Redirects to /login if user is not authenticated */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isInitialized } = useAuth()

  if (!isInitialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size={40} />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
