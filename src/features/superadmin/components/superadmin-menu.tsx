import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ClipboardCheck, Building2, MessageSquare } from 'lucide-react'

interface SuperAdminMenuProps {
  onNavigate?: () => void
  isCollapsed?: boolean
}

export function SuperAdminMenu({ onNavigate, isCollapsed = false }: SuperAdminMenuProps) {
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center rounded-xl text-sm font-semibold transition-all duration-300 transform border ${
      isCollapsed ? 'justify-center p-3 w-12 h-12 mx-auto' : 'gap-3 px-4 py-3'
    } ${
      isActive 
        ? 'bg-gradient-to-r from-[var(--gold)]/30 to-[var(--gold)]/15 text-[var(--warm-white)] border-[var(--gold)] shadow-[0_6px_22px_rgba(184,134,44,0.35)] scale-[1.02] backdrop-blur-md' 
        : 'text-white/85 border-transparent bg-[#0B1F33]/35 backdrop-blur-sm hover:bg-white/15 hover:text-white hover:border-white/20 hover:scale-[1.01]'
    }`

  return (
    <div className={`flex-1 w-full flex flex-col py-3 overflow-y-auto ${isCollapsed ? 'px-2' : 'px-4'}`}>
      <nav className="flex flex-col gap-2.5">
        <NavLink 
          to="/superadmin/dashboard" 
          title={isCollapsed ? 'Dashboard' : undefined}
          className={getNavLinkClass}
          onClick={onNavigate}
        >
          <LayoutDashboard className="w-5 h-5 text-[var(--gold)] shrink-0" />
          {!isCollapsed && <span className="truncate">Dashboard</span>}
        </NavLink>

        <NavLink 
          to="/superadmin/approval" 
          title={isCollapsed ? 'Approval' : undefined}
          className={getNavLinkClass}
          onClick={onNavigate}
        >
          <ClipboardCheck className="w-5 h-5 text-[var(--gold)] shrink-0" />
          {!isCollapsed && <span className="truncate">Approval</span>}
        </NavLink>

        <NavLink 
          to="/superadmin/organization-management" 
          title={isCollapsed ? 'Organization Management' : undefined}
          className={getNavLinkClass}
          onClick={onNavigate}
        >
          <Building2 className="w-5 h-5 text-[var(--gold)] shrink-0" />
          {!isCollapsed && <span className="truncate">Organization Management</span>}
        </NavLink>

        <NavLink 
          to="/superadmin/chat" 
          title={isCollapsed ? 'Chat' : undefined}
          className={getNavLinkClass}
          onClick={onNavigate}
        >
          <MessageSquare className="w-5 h-5 text-[var(--gold)] shrink-0" />
          {!isCollapsed && <span className="truncate">Chat</span>}
        </NavLink>
      </nav>
    </div>
  )
}
