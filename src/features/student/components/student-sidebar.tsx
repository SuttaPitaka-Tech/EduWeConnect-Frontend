import { X } from 'lucide-react'
import { superadminLogo } from '@/assets/images'
import { StudentMenu } from './student-menu'

interface StudentSidebarProps {
  mobileOpen: boolean
  onCloseMobile: () => void
}

export function StudentSidebar({
  mobileOpen,
  onCloseMobile,
}: StudentSidebarProps) {
  return (
    <>
      {/* ── Desktop Fixed Left Sidebar ───────────────────────────────────── */}
      <aside className="hidden md:flex w-[260px] lg:w-[280px] h-full flex-col shadow-xl relative shrink-0 bg-[#0B1F33] overflow-hidden">
        <div className="relative z-10 flex flex-col h-full w-full">
          {/* Logo Area */}
          <div className="w-full flex justify-center items-center pt-2.5 pb-2 px-4 text-center">
            <img
              src={superadminLogo}
              alt="EduWeConnect Logo"
              className="w-[190px] h-auto object-contain mx-auto block drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
            />
          </div>

          {/* Navigation Menu */}
          <StudentMenu />
        </div>
      </aside>

      {/* ── Mobile Sidebar Drawer ────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Drawer Container */}
          <div className="relative w-[270px] max-w-[85vw] h-full flex flex-col shadow-2xl z-10 bg-[#0B1F33] overflow-hidden">
            <div className="relative z-10 flex flex-col h-full w-full">
              {/* Mobile Close Header */}
              <div className="flex items-center justify-between pt-2.5 pb-2 px-4 border-b border-white/10">
                <div className="flex-1 flex justify-center">
                  <img
                    src={superadminLogo}
                    alt="EduWeConnect Logo"
                    className="w-[150px] h-auto object-contain drop-shadow-md mx-auto block"
                  />
                </div>
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="p-1.5 rounded-lg bg-black/40 text-white/90 hover:text-white shrink-0 ml-2 cursor-pointer"
                  aria-label="Close Sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <StudentMenu onNavigate={onCloseMobile} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
