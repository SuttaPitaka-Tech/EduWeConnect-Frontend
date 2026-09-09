import { useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { AppHeader } from '@/components/app-header'
import { AppFooter } from '@/components/app-footer'
import { useAuth } from '@/contexts/auth-context'
import { UserRole } from '@/features/auth/enums/auth.enum'
import { OrganizationSidebar } from '@/features/organization-menu'
import { Menu } from 'lucide-react'

/**
 * DashboardLayout — shell for authenticated app pages (organizations, staff, students).
 * If a Super Admin enters here, automatically redirects to /superadmin/dashboard.
 * Includes OrganizationSidebar for organizations with responsive mobile drawer.
 */
export default function DashboardLayout() {
  const { user } = useAuth()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  if (user?.role === UserRole.SuperAdmin) {
    return <Navigate to="/superadmin/dashboard" replace />
  }

  return (
    <div className="h-screen flex w-full font-sans bg-[var(--cream)] overflow-hidden">
      {/* Fixed Desktop Left Sidebar & Mobile Drawer */}
      <OrganizationSidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Right Column: Fixed Header + Internal Scrollable Content */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Pinned Header */}
        <header className="relative shrink-0 z-30">
          <AppHeader hideLogo={true} />

          {/* Mobile Hamburger Button */}
          <div className="md:hidden absolute left-3 top-1/2 -translate-y-1/2 z-50">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-xl bg-white/80 border border-[var(--border)] text-[var(--navy)] hover:bg-[var(--gold)]/10 transition-colors shadow-sm cursor-pointer"
              aria-label="Open Organization Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto min-h-0 flex flex-col">
          <Outlet />
        </main>

        <AppFooter />
      </div>
    </div>
  )
}