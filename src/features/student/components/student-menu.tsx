import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CalendarDays, CalendarCheck } from 'lucide-react'
import type { StudentMenuItem } from '../types'

export const STUDENT_MENU_ITEMS: StudentMenuItem[] = [
  {
    title: 'Dashboard',
    to: '/student/welcome',
    icon: LayoutDashboard,
  },
  {
    title: 'Time Table',
    to: '/student/timetable',
    icon: CalendarDays,
  },
  {
    title: 'Attendance',
    to: '/student/attendance',
    icon: CalendarCheck,
  },
]

interface StudentMenuProps {
  onNavigate?: () => void
}

export function StudentMenu({ onNavigate }: StudentMenuProps) {
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform border ${
      isActive
        ? 'bg-gradient-to-r from-[var(--gold)]/30 to-[var(--gold)]/15 text-[var(--warm-white)] border-[var(--gold)] shadow-[0_6px_22px_rgba(184,134,44,0.35)] scale-[1.02] backdrop-blur-md'
        : 'text-white/85 border-transparent bg-[#0B1F33]/35 backdrop-blur-sm hover:bg-white/15 hover:text-white hover:border-white/20 hover:scale-[1.01]'
    }`

  return (
    <div className="flex-1 w-full flex flex-col px-4 py-3 overflow-y-auto">
      <nav className="flex flex-col gap-2.5">
        {STUDENT_MENU_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={getNavLinkClass}
              onClick={onNavigate}
            >
              <Icon className="w-5 h-5 text-[var(--gold)] shrink-0" />
              <span className="truncate">{item.title}</span>
              {item.badge && (
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
