import { NavLink } from 'react-router-dom'
import { LayoutDashboard, MessageSquare, Lock, Clock } from 'lucide-react'
import type { StaffMenuItem } from '../types'
import { createCalendarMenuItem } from '@/features/calendar'
import { usePermissions } from '@/hooks/use-permissions'

export const STAFF_MENU_ITEMS: StaffMenuItem[] = [
  {
    title: 'Dashboard',
    to: '/staff/welcome',
    icon: LayoutDashboard,
  },
  createCalendarMenuItem('/staff'),
  {
    title: 'Chat',
    to: '/staff/chat',
    icon: MessageSquare,
  },
]

interface StaffMenuProps {
  onNavigate?: () => void
  isCollapsed?: boolean
}

export function StaffMenu({ onNavigate, isCollapsed = false }: StaffMenuProps) {
  const { permissions, isLoading, hasAnyRolePermission } = usePermissions()

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center rounded-xl text-sm font-semibold transition-all duration-300 transform border ${
      isCollapsed ? 'justify-center p-3 w-12 h-12 mx-auto' : 'gap-3 px-4 py-3'
    } ${
      isActive
        ? 'bg-gradient-to-r from-[var(--gold)]/30 to-[var(--gold)]/15 text-[var(--warm-white)] border-[var(--gold)] shadow-[0_6px_22px_rgba(184,134,44,0.35)] scale-[1.02] backdrop-blur-md'
        : 'text-white/85 border-transparent bg-[#0B1F33]/35 backdrop-blur-sm hover:bg-white/15 hover:text-white hover:border-white/20 hover:scale-[1.01]'
    }`

  const filteredItems = STAFF_MENU_ITEMS.filter(item => {
    if (!permissions || isLoading) return false
    
    // Schema uses 'Chat' for Staff role (matches item.title)
    return Boolean(permissions[`Staff / Teachers-${item.title}`])
  })

  if (!hasAnyRolePermission && !isLoading) {
    if (isCollapsed) {
      return (
        <div className="flex-1 w-full flex flex-col items-center py-6">
          <div
            title="Awaiting Super Admin access permissions"
            className="p-3 rounded-xl bg-white/5 border border-white/10 text-[var(--gold)]"
          >
            <Lock className="w-5 h-5" />
          </div>
        </div>
      )
    }

    return (
      <div className="flex-1 w-full flex flex-col py-6 px-4">
        <div className="rounded-2xl p-4 bg-white/5 border border-white/10 text-center flex flex-col items-center">
          <div className="w-10 h-10 rounded-xl bg-[var(--gold)]/20 border border-[var(--gold)]/30 flex items-center justify-center text-[var(--gold)] mb-2.5">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <p className="text-xs font-semibold text-white/90">
            Access Pending
          </p>
          <p className="text-[11px] text-white/60 mt-1 leading-relaxed">
            Super Admin will grant you access to application modules.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex-1 w-full flex flex-col py-3 overflow-y-auto ${isCollapsed ? 'px-2' : 'px-4'}`}>
      <nav className="flex flex-col gap-2.5">
        {filteredItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              title={isCollapsed ? item.title : undefined}
              className={getNavLinkClass}
              onClick={onNavigate}
            >
              <Icon className="w-5 h-5 text-[var(--gold)] shrink-0" />
              {!isCollapsed && <span className="truncate">{item.title}</span>}
              {!isCollapsed && item.badge && (
                <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/30">
                  {item.badge}
                </span>
              )}
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}
