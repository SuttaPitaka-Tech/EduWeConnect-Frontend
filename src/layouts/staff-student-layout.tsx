import { Outlet } from 'react-router-dom'
import { AppHeader } from '@/components/app-header'
import { AppFooter } from '@/components/app-footer'

/**
 * StaffStudentLayout — clean, focused shell for authenticated Staff and Students.
 * Features the top header with user profile & notifications, and footer, without administrative sidebar.
 */
export default function StaffStudentLayout() {
  return (
    <div className="min-h-screen flex flex-col w-full font-sans bg-[var(--cream)] selection:bg-[var(--gold)]/20 selection:text-[var(--navy)]">
      {/* Pinned Top Navigation */}
      <AppHeader />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <AppFooter />
    </div>
  )
}
