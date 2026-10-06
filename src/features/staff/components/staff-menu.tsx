import { NavLink } from 'react-router-dom'
import { LayoutDashboard, MessageSquare } from 'lucide-react'
import type { StaffMenuItem } from '../types'
import { createCalendarMenuItem } from '@/features/calendar'
import { useAuth } from '@/contexts/auth-context'
import { useQuery } from '@tanstack/react-query'
import { API_GATEWAY_URL } from '@/config/api.config'
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
  const { user } = useAuth()
  
  const { data: permissions } = useQuery<Record<string, boolean>>({
    queryKey: ['permissions', user?.id],
    queryFn: async () => {
      const orgId = user?.institutionId || user?.id
      if (!orgId) return {}
      const res = await fetch(`${API_GATEWAY_URL}/menus/permissions/${orgId}`)
      if (!res.ok) throw new Error('Failed to fetch permissions')
      return res.json()
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  })

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center rounded-xl text-sm font-semibold transition-all duration-300 transform border ${
      isCollapsed ? 'justify-center p-3 w-12 h-12 mx-auto' : 'gap-3 px-4 py-3'
    } ${
      isActive
        ? 'bg-gradient-to-r from-[var(--gold)]/30 to-[var(--gold)]/15 text-[var(--warm-white)] border-[var(--gold)] shadow-[0_6px_22px_rgba(184,134,44,0.35)] scale-[1.02] backdrop-blur-md'
        : 'text-white/85 border-transparent bg-[#0B1F33]/35 backdrop-blur-sm hover:bg-white/15 hover:text-white hover:border-white/20 hover:scale-[1.01]'
    }`

  const filteredItems = STAFF_MENU_ITEMS.filter(item => {
    if (!permissions) return false
    
    // Schema uses 'Chat' for Staff role (matches item.title)
    return !!permissions[`Staff / Teachers-${item.title}`]
  })

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
