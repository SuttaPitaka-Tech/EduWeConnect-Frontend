import { Outlet } from 'react-router-dom'
import { AppHeader } from '@/components/app-header'
import { AppFooter } from '@/components/app-footer'

/**
 * DashboardLayout — shell for all authenticated app pages.
 * Composes:  <AppHeader /> → <Outlet /> → <AppFooter />
 *
 * Used in routes.tsx under /app/* (ProtectedRoute wraps this).
 */
export default function DashboardLayout() {
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