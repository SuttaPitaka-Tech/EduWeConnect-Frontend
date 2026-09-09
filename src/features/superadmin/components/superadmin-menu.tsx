import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ClipboardCheck, Building2 } from 'lucide-react'

export function SuperAdminMenu({ onNavigate }: { onNavigate?: () => void }) {
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform border ${
      isActive 
        ? 'bg-gradient-to-r from-[var(--gold)]/30 to-[var(--gold)]/15 text-[var(--warm-white)] border-[var(--gold)] shadow-[0_6px_22px_rgba(184,134,44,0.35)] scale-[1.02] backdrop-blur-md' 
        : 'text-white/85 border-transparent bg-[#0B1F33]/35 backdrop-blur-sm hover:bg-white/15 hover:text-white hover:border-white/20 hover:scale-[1.01]'
    }`

  return (
    <div className="flex-1 w-full flex flex-col px-4 py-4">
      <nav className="flex flex-col gap-3">
        <NavLink 
          to="/superadmin/dashboard" 
          className={getNavLinkClass}
          onClick={onNavigate}
        >
          <LayoutDashboard className="w-5 h-5 text-[var(--gold)]" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink 
          to="/superadmin/approval" 
          className={getNavLinkClass}
          onClick={onNavigate}
        >
          <ClipboardCheck className="w-5 h-5 text-[var(--gold)]" />
          <span>Approval</span>
        </NavLink>

        <NavLink 
          to="/superadmin/organization-management" 
          className={getNavLinkClass}
          onClick={onNavigate}
        >
          <Building2 className="w-5 h-5 text-[var(--gold)]" />
          <span>Organization Management</span>
        </NavLink>
      </nav>
    </div>
  )
}
