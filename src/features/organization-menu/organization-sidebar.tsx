import { X, Lock, Unlock } from 'lucide-react'
import { superadminLogo, lotusLarge } from '@/assets/images'
import { OrganizationMenu } from './organization-menu'
import { useCollapsibleSidebar } from '@/hooks/use-collapsible-sidebar'

interface OrganizationSidebarProps {
  mobileOpen: boolean
  onCloseMobile: () => void
}

export function OrganizationSidebar({
  mobileOpen,
  onCloseMobile,
}: OrganizationSidebarProps) {
  const {
    isLocked,
    isExpanded,
    toggleLock,
    handleMouseEnter,
    handleMouseLeave,
  } = useCollapsibleSidebar()

  return (
    <>
      {/* ── Desktop Collapsible & Expandable Left Sidebar ─────────────────── */}
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`hidden md:flex flex-col shadow-2xl relative shrink-0 bg-[#0B1F33] border-r border-white/10 overflow-hidden transition-all duration-300 ease-in-out z-30 ${
          isExpanded ? 'w-[260px] lg:w-[280px]' : 'w-[74px]'
        }`}
      >
        <div className="relative z-10 flex flex-col h-full w-full">
          {/* Logo Area & Lock Toggle Header */}
          <div className="w-full pt-3 pb-2 px-3 border-b border-white/10 flex items-center min-h-[64px]">
            {isExpanded ? (
              <div className="w-full flex items-center justify-between gap-2 animate-in fade-in duration-200">
                <div className="flex-1 flex items-center justify-center pl-4">
                  <img
                    src={superadminLogo}
                    alt="EduWeConnect Logo"
                    className="w-[155px] h-auto object-contain mx-auto block drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
                  />
                </div>
                <button
                  type="button"
                  onClick={toggleLock}
                  title={
                    isLocked
                      ? 'Sidebar is Locked (Always Open). Click to Unlock'
                      : 'Sidebar is Unlocked (Auto-closes on mouse leave). Click to Lock'
                  }
                  className={`p-2 rounded-xl transition-all cursor-pointer shrink-0 ${
                    isLocked
                      ? 'bg-[var(--gold)] text-[#0B1F33] shadow-md hover:bg-[var(--light-gold)]'
                      : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'
                  }`}
                  aria-label={isLocked ? 'Unlock Sidebar' : 'Lock Sidebar'}
                >
                  {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </button>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center justify-center mx-auto animate-in fade-in duration-200">
                <img
                  src={lotusLarge}
                  alt="EduWeConnect Logo"
                  className="w-9 h-9 object-contain drop-shadow-md mx-auto"
                />
              </div>
            )}
          </div>

          {/* Navigation Menu */}
          <OrganizationMenu isCollapsed={!isExpanded} />

          {/* Bottom Lock / Mode Indicator */}
          {isExpanded ? (
            <div className="mt-auto px-4 py-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/70 bg-black/20">
              <span className="flex items-center gap-1.5 font-medium">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isLocked ? 'bg-emerald-400' : 'bg-[var(--gold)]'
                  }`}
                />
                {isLocked ? 'Sidebar Locked' : 'Hover Expand Mode'}
              </span>
              <button
                type="button"
                onClick={toggleLock}
                className="text-[var(--gold)] hover:underline font-bold cursor-pointer"
              >
                {isLocked ? 'Unlock' : 'Lock'}
              </button>
            </div>
          ) : (
            <div className="mt-auto py-3 border-t border-white/10 flex justify-center bg-black/20">
              <button
                type="button"
                onClick={toggleLock}
                title={isLocked ? 'Sidebar is Locked' : 'Click to Lock Sidebar open'}
                className="p-2 rounded-xl text-white/60 hover:text-[var(--gold)] hover:bg-white/10 transition-colors cursor-pointer"
                aria-label={isLocked ? 'Unlock Sidebar' : 'Lock Sidebar'}
              >
                {isLocked ? (
                  <Lock className="w-4 h-4 text-[var(--gold)]" />
                ) : (
                  <Unlock className="w-4 h-4" />
                )}
              </button>
            </div>
          )}
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
              <div className="flex items-center justify-between pt-3 pb-2 px-4 border-b border-white/10">
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

              <OrganizationMenu onNavigate={onCloseMobile} isCollapsed={false} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
