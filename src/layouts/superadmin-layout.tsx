import { Outlet } from 'react-router-dom'
import { AppHeader } from '@/components/app-header'
import { AppFooter } from '@/components/app-footer'
import { superadminSidebar, superadminLogo } from '@/assets/images'

export default function SuperAdminLayout() {
  return (
    <div className="min-h-screen flex flex-col w-full font-sans bg-[var(--cream)] overflow-hidden">
      
      {/* Top Section: Sidebar + Main Content */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Fixed Left Sidebar */}
        <div 
          className="hidden md:flex w-[220px] lg:w-[250px] flex-col bg-cover bg-center shadow-2xl relative border-r border-[var(--gold)]/20 shrink-0"
          style={{ backgroundImage: `url(${superadminSidebar})` }}
        >
          <div className="w-full flex justify-center pt-5">
            <img 
              src={superadminLogo} 
              alt="Super Admin Logo" 
              className="w-[195px] h-auto object-contain drop-shadow-md -ml-3"
            />
          </div>
        </div>

        {/* Main Content Area (Header + Main) */}
        <div className="flex-1 flex flex-col min-w-0 overflow-auto">
          <AppHeader />
          <main className="flex-1 flex flex-col">
            <Outlet />
          </main>
        </div>

      </div>

      {/* Global Footer (spans full width) */}
      <AppFooter />
      
    </div>
  )
}
