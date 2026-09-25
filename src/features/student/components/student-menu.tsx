import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CalendarDays, CalendarCheck, NotebookPen, MessageSquare } from 'lucide-react'
import type { StudentMenuItem } from '../types'
import { createCalendarMenuItem } from '@/features/calendar'

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
  {
    title: 'Notes',
    to: '/student/notes',
    icon: NotebookPen,
  },
  createCalendarMenuItem('/student'),
  {
    title: 'Chat',
    to: '/student/chat',
    icon: MessageSquare,
  },
]

interface StudentMenuProps {
  onNavigate?: () => void
  isCollapsed?: boolean
}

export function StudentMenu({ onNavigate, isCollapsed = false }: StudentMenuProps) {
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
        {STUDENT_MENU_ITEMS.map((item) => {
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
