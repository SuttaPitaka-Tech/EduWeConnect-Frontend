import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AppHeader } from '@/components/app-header'
import { superadminSidebar, superadminLogo, lotusLarge } from '@/assets/images'
import { SuperAdminMenu } from '@/features/superadmin/components/superadmin-menu'
import { Menu, X } from 'lucide-react'

export default function SuperAdminLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="h-screen flex w-full font-sans bg-[var(--cream)] overflow-hidden">
      {/* Fixed Desktop Left Sidebar */}
      <aside 
        className="hidden md:flex w-[260px] lg:w-[280px] h-full flex-col shadow-2xl relative shrink-0 border-r border-[var(--gold)]/30 overflow-hidden"
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
          {/* Logo Area (Shifted higher up & centered) */}
          <div className="w-full flex justify-center items-center pt-2.5 pb-2 px-4 text-center">
            <img 
              src={superadminLogo} 
              alt="Super Admin Logo" 
              className="w-[190px] h-auto object-contain mx-auto block drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
            />
          </div>
          
          {/* Navigation Menu */}
          <SuperAdminMenu />
        </div>
      </aside>

      {/* Mobile Sidebar Overlay & Drawer */}
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
            <div className="absolute inset-0 bg-gradient-to-b from-[#081726]/70 via-transparent to-[#081726]/85 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col h-full w-full">
              <div className="flex items-center justify-between pt-2.5 pb-2 px-4">
                <div className="flex-1 flex justify-center">
                  <img src={superadminLogo} alt="Super Admin Logo" className="w-[150px] h-auto object-contain drop-shadow-md mx-auto block" />
                </div>
                <button 
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg bg-black/40 text-white/90 hover:text-white shrink-0 ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <SuperAdminMenu onNavigate={() => setMobileSidebarOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Right Column: Fixed Header + Internal Scrollable Content */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
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

        {/* ONLY this main area scrolls when details increase */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 flex flex-col">
          <div className="flex-1">
            <Outlet />
          </div>

          {/* Branded Footer */}
          <footer className="w-full px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-[var(--border)]/60 text-xs text-[var(--text-secondary)] font-medium mt-auto bg-white/30 shrink-0">
            <p>© 2026 Sutta Pitaka Tech. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <img src={lotusLarge} alt="Lotus" className="w-4 h-4 object-contain opacity-80" />
              <span className="text-[11px] font-medium text-[var(--text-secondary)]">Empowering Education. Enriching Lives.</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
