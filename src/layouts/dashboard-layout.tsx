import { useState } from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { AppHeader } from '@/components/app-header'
import { AppFooter } from '@/components/app-footer'
import { useAuth } from '@/contexts/auth-context'
import { UserRole } from '@/features/auth/enums/auth.enum'
import { getRoleHomeRoute } from '@/core/config/rbac.config'
import { OrganizationSidebar } from '@/features/organization-menu'
import { Menu } from 'lucide-react'

/**
 * DashboardLayout — dedicated shell for Organization management portal.
 * Non-organization roles are automatically redirected to their designated home route via RBAC.
 */
export default function DashboardLayout() {
  const { user } = useAuth()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const location = useLocation()
  const isChat = location.pathname.includes('/chat')

  // Enterprise boundary: Non-organization roles route to their respective home portals
  if (user && user.role !== UserRole.Organization) {
    return <Navigate to={getRoleHomeRoute(user.role)} replace />
  }


  return (
    <div className="h-screen flex w-full font-sans bg-[var(--cream)] overflow-hidden">
      {/* Fixed Desktop Left Sidebar & Mobile Drawer */}
      <OrganizationSidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Right Column: Fixed Header + Internal Scrollable Content */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden transition-all duration-300">
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
        <main className={`flex-1 min-h-0 flex flex-col ${isChat ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          {isChat ? (
            <div className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 flex flex-col min-h-0 h-full overflow-hidden">
              <Outlet />
            </div>
          ) : (
            <Outlet />
          )}
        </main>

        <AppFooter />
      </div>
    </div>
  )
}