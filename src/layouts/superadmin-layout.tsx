import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AppHeader } from '@/components/app-header'
import { superadminSidebar, superadminLogo, lotusLarge } from '@/assets/images'
import { SuperAdminMenu } from '@/features/superadmin/components/superadmin-menu'
import { Menu, X, Lock, Unlock } from 'lucide-react'
import { useCollapsibleSidebar } from '@/hooks/use-collapsible-sidebar'

export default function SuperAdminLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const {
    isLocked,
    isExpanded,
    toggleLock,
    handleMouseEnter,
    handleMouseLeave,
  } = useCollapsibleSidebar()
  const location = useLocation()
  const isChat = location.pathname.includes('/chat')

  return (
    <div className="h-screen flex w-full font-sans bg-[var(--cream)] overflow-hidden">
      {/* ── Fixed Desktop Collapsible Left Sidebar ────────────────────────── */}
      <aside 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`hidden md:flex flex-col shadow-2xl relative shrink-0 border-r border-[var(--gold)]/30 overflow-hidden transition-all duration-300 ease-in-out z-30 ${
          isExpanded ? 'w-[260px] lg:w-[280px]' : 'w-[74px]'
        }`}
        style={{ 
          backgroundImage: `url(${superadminSidebar})`,
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Subtle Dark Luxury Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#081726]/60 via-transparent to-[#081726]/80 pointer-events-none" />

        {/* Sidebar Content */}
        <div className="relative z-10 flex flex-col h-full w-full">
          {/* Logo Area & Lock Toggle Header */}
          <div className="w-full pt-3 pb-2 px-3 border-b border-white/10 flex items-center min-h-[64px]">
            {isExpanded ? (
              <div className="w-full flex items-center justify-between gap-2 animate-in fade-in duration-200">
                <div className="flex-1 flex items-center justify-center pl-4">
                  <img 
                    src={superadminLogo} 
                    alt="Super Admin Logo" 
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
          
          {/* Navigation Menu (Icon-only when collapsed) */}
          <SuperAdminMenu isCollapsed={!isExpanded} />

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

      {/* ── Mobile Sidebar Overlay & Drawer ───────────────────────────────── */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-[100] md:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />

          {/* Mobile Drawer */}
          <div 
            className="relative w-[270px] max-w-[85vw] h-full flex flex-col shadow-2xl z-10 border-r border-[var(--gold)]/40 overflow-hidden"
            style={{ 
              backgroundImage: `url(${superadminSidebar})`,
              backgroundSize: 'cover',
              backgroundPosition: 'top center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#081726]/60 via-transparent to-[#081726]/80 pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full w-full">
              {/* Mobile Close Header */}
              <div className="flex items-center justify-between pt-3 pb-2 px-4 border-b border-white/10">
                <div className="flex-1 flex justify-center">
                  <img 
                    src={superadminLogo} 
                    alt="Super Admin Logo" 
                    className="w-[150px] h-auto object-contain drop-shadow-md mx-auto block"
                  />
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg bg-black/40 text-white/90 hover:text-white shrink-0 ml-2"
                  aria-label="Close Sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <SuperAdminMenu onNavigate={() => setMobileSidebarOpen(false)} isCollapsed={false} />
            </div>
          </div>
        </div>
      )}

      {/* ── Right Column: Fixed Header + Internal Scrollable Content + Footer ── */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden transition-all duration-300">
        {/* Pinned Header */}
        <header className="relative shrink-0 z-30">
          <AppHeader hideLogo={true} />

          {/* Mobile Hamburger Button */}
          <div className="md:hidden absolute left-3 top-1/2 -translate-y-1/2 z-50">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-xl bg-white/80 border border-[var(--border)] text-[var(--navy)] hover:bg-[var(--gold)]/10 transition-colors shadow-sm"
              aria-label="Open Super Admin Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className={`flex-1 min-h-0 flex flex-col ${isChat ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden'}`}>
          <div className={`flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col min-h-0 ${
            isChat ? 'py-4 md:py-6 h-full overflow-hidden' : 'py-6 md:py-8'
          }`}>
            <Outlet />
          </div>

          {/* Branded Footer */}
          {!isChat && (
            <footer className="w-full px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-[var(--border)]/60 text-xs text-[var(--text-secondary)] font-medium mt-auto bg-white/30 shrink-0">
              <p>© 2026 Sutta Pitaka Tech. All rights reserved.</p>
              <div className="flex items-center gap-2">
                <img src={lotusLarge} alt="Lotus" className="w-4 h-4 object-contain opacity-80" />
                <span className="text-[11px] font-medium text-[var(--text-secondary)]">Empowering Education. Enriching Lives.</span>
              </div>
            </footer>
          )}
        </main>
      </div>
    </div>
  );
}
