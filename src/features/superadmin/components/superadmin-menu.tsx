import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ClipboardCheck } from 'lucide-react'

export function SuperAdminMenu() {
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform border-2 ${
      isActive 
        ? 'bg-[var(--gold)]/10 text-[var(--gold)] border-[var(--gold)] shadow-[0_4px_20px_rgba(184,134,44,0.25)] scale-[1.02]' 
        : 'text-white/80 border-transparent hover:bg-white/10 hover:text-white hover:scale-[1.02] hover:shadow-lg'
    }`

  return (
    <nav className="flex-1 w-full mt-8 px-4 flex flex-col gap-3">
      <NavLink to="/app/superadmin/dashboard" className={getNavLinkClass}>
        <LayoutDashboard className="w-5 h-5" />
        Dashboard
      </NavLink>

      <NavLink to="/app/superadmin/approvals" className={getNavLinkClass}>
        <ClipboardCheck className="w-5 h-5" />
        Approvals
      </NavLink>
    </nav>
  )
}
