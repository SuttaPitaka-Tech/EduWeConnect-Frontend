import { useState } from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { AppHeader } from '@/components/app-header'
import { AppFooter } from '@/components/app-footer'
import { useAuth } from '@/contexts/auth-context'
import { UserRole } from '@/features/auth/enums/auth.enum'
import { getRoleHomeRoute } from '@/core/config/rbac.config'
import { StaffSidebar } from '@/features/staff/components/staff-sidebar'
import { Menu } from 'lucide-react'

/**
 * StaffLayout — dedicated shell for the Staff Portal.
 * Features fixed left sidebar navigation, top header with profile & notifications,
 * and responsive mobile drawer.
 */
export default function StaffLayout() {
  const { user } = useAuth()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const location = useLocation()
  const isChat = location.pathname.includes('/chat')
  const isCalendar = location.pathname.includes('/calendar')
  const isNoScroll = isChat || isCalendar

  // Non-staff roles route to their respective home portals
  if (user && user.role !== UserRole.Staff) {
    return <Navigate to={getRoleHomeRoute(user.role)} replace />
  }

  return (
    <div className="h-screen flex w-full font-sans bg-[var(--cream)] overflow-hidden">
      {/* Fixed Desktop Left Sidebar & Mobile Drawer */}
      <StaffSidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Right Column: Fixed Header + Internal Scrollable Content + Footer */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden transition-all duration-300">
        {/* Pinned Header */}
        <header className="relative shrink-0 z-30">
          <AppHeader hideLogo={true} />

          {/* Mobile Hamburger Button */}
          <div className="md:hidden absolute left-3 top-1/2 -translate-y-1/2 z-50">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-xl bg-white/80 border border-[var(--border)] text-[var(--navy)] hover:bg-[var(--gold)]/10 transition-colors shadow-sm cursor-pointer"
              aria-label="Open Staff Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className={`flex-1 min-h-0 flex flex-col ${isNoScroll ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          <div className={`flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col min-h-0 ${
            isChat ? 'py-4 md:py-6 h-full overflow-hidden' : isCalendar ? 'py-1 sm:py-2 md:py-3 h-full overflow-hidden justify-center' : 'py-6 md:py-8'
          }`}>
            <Outlet />
          </div>
        </main>

        {!isCalendar && <AppFooter />}
      </div>
    </div>
  )
}
