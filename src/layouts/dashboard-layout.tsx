import { Outlet, Navigate } from 'react-router-dom'
import { AppHeader } from '@/components/app-header'
import { AppFooter } from '@/components/app-footer'
import { useAuth } from '@/contexts/auth-context'
import { UserRole } from '@/features/auth/enums/auth.enum'

/**
 * DashboardLayout — shell for standard authenticated app pages (staff, students, organizations).
 * If a Super Admin enters here, automatically redirects to /superadmin/dashboard.
 */
export default function DashboardLayout() {
  const { user } = useAuth()

  if (user?.role === UserRole.SuperAdmin) {
    return <Navigate to="/superadmin/dashboard" replace />
  }

  return (
    <div
      className="min-h-screen flex flex-col font-sans"
      style={{ background: 'var(--cream)' }}
    >
      <AppHeader />
      <main className="flex-1 flex flex-col overflow-auto">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  )
}