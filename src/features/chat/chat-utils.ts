import type { PresenceStatus } from './types'

export const getInitials = (name?: string): string => {
  if (!name) return 'U'
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export interface RoleTheme {
  bg: string
  text: string
  badge: string
  ringBorder: string
  ringColorName: string
  roleName: string
}

export const ROLE_THEMES: Record<string, RoleTheme> = {
  // Student - Green as explicitly requested
  student: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    ringBorder: 'border-emerald-500',
    ringColorName: 'Emerald Green',
    roleName: 'Student',
  },
  students: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    ringBorder: 'border-emerald-500',
    ringColorName: 'Emerald Green',
    roleName: 'Student',
  },

  // Staff / Teacher - Sky Blue
  staff: {
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    badge: 'bg-sky-50 text-sky-700 border-sky-200',
    ringBorder: 'border-sky-500',
    ringColorName: 'Sky Blue',
    roleName: 'Staff',
  },
  teacher: {
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    badge: 'bg-sky-50 text-sky-700 border-sky-200',
    ringBorder: 'border-sky-500',
    ringColorName: 'Teacher / Staff Blue',
    roleName: 'Teacher',
  },

  // Organization / Institution Admin - EduWeConnect Royal Indigo/Purple
  organization: {
    bg: 'bg-[#F0F2FA]',
    text: 'text-[#5B5FC7]',
    badge: 'bg-[#F0F2FA] text-[#5B5FC7] border-[#5B5FC7]/30',
    ringBorder: 'border-[#5B5FC7]',
    ringColorName: 'EduWeConnect Indigo',
    roleName: 'Organization',
  },
  'institution admin': {
    bg: 'bg-[#F0F2FA]',
    text: 'text-[#5B5FC7]',
    badge: 'bg-[#F0F2FA] text-[#5B5FC7] border-[#5B5FC7]/30',
    ringBorder: 'border-[#5B5FC7]',
    ringColorName: 'EduWeConnect Indigo',
    roleName: 'Institution Admin',
  },
  institution_admin: {
    bg: 'bg-[#F0F2FA]',
    text: 'text-[#5B5FC7]',
    badge: 'bg-[#F0F2FA] text-[#5B5FC7] border-[#5B5FC7]/30',
    ringBorder: 'border-[#5B5FC7]',
    ringColorName: 'EduWeConnect Indigo',
    roleName: 'Institution Admin',
  },

  // Super Admin - Distinguished Amber Gold
  superadmin: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    ringBorder: 'border-amber-500',
    ringColorName: 'Amber Gold',
    roleName: 'Super Admin',
  },
  'super admin': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    ringBorder: 'border-amber-500',
    ringColorName: 'Amber Gold',
    roleName: 'Super Admin',
  },
  super_admin: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    ringBorder: 'border-amber-500',
    ringColorName: 'Amber Gold',
    roleName: 'Super Admin',
  },

  // Parent - Warm Coral Rose
  parent: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    ringBorder: 'border-rose-400',
    ringColorName: 'Coral Rose',
    roleName: 'Parent',
  },
  parents: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    ringBorder: 'border-rose-400',
    ringColorName: 'Coral Rose',
    roleName: 'Parent',
  },

  // Channel / Team
  channel: {
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    badge: 'bg-slate-50 text-slate-600 border-slate-200',
    ringBorder: 'border-slate-300',
    ringColorName: 'Slate Gray',
    roleName: 'Channel',
  },
}

const DEFAULT_THEME: RoleTheme = {
  bg: 'bg-slate-100',
  text: 'text-slate-700',
  badge: 'bg-slate-50 text-slate-700 border-slate-200',
  ringBorder: 'border-slate-300',
  ringColorName: 'Slate Gray',
  roleName: 'Member',
}

export const getAvatarStyle = (roleOrName?: string): RoleTheme => {
  if (!roleOrName) return DEFAULT_THEME
  const raw = roleOrName.toLowerCase().trim()
  const key = raw.replace(/[_-]/g, ' ')

  // Direct match
  if (ROLE_THEMES[raw]) return ROLE_THEMES[raw]
  if (ROLE_THEMES[key]) return ROLE_THEMES[key]

  // Intelligent role keyword matching
  if (key.includes('super')) return ROLE_THEMES['super admin']
  if (
    key.includes('institution') ||
    key.includes('organization') ||
    (key.includes('admin') && !key.includes('super'))
  ) {
    return ROLE_THEMES['institution admin']
  }
  if (key.includes('student')) return ROLE_THEMES['student']
  if (key.includes('teacher') || key.includes('staff') || key.includes('faculty')) {
    return ROLE_THEMES['teacher']
  }
  if (key.includes('parent')) return ROLE_THEMES['parent']
  if (key.includes('channel')) return ROLE_THEMES['channel']

  return DEFAULT_THEME
}

export const PRESENCE_COLORS: Record<PresenceStatus, string> = {
  online: 'bg-emerald-500',
  away: 'bg-amber-500',
  busy: 'bg-rose-500',
  offline: 'bg-slate-400',
}

/**
 * Formats a message timestamp into conversational day dividers:
 * - "Today"
 * - "Yesterday"
 * - "Monday", "Tuesday", etc. (if within last 7 days)
 * - "Monday, September 21" (if in current year)
 * - "September 21, 2025" (if in past year)
 */
export const formatChatDateDivider = (dateInput?: string | Date): string => {
  if (!dateInput) return 'Today'
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  if (isNaN(date.getTime())) return 'Today'

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  const diffTime = today.getTime() - msgDate.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays > 1 && diffDays < 7) {
    return date.toLocaleDateString(undefined, { weekday: 'long' })
  }
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })
  }
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

/**
 * Returns a unique day key (YYYY-MM-DD) for grouping messages by calendar date
 */
export const getMessageDayKey = (dateInput?: string | Date): string => {
  if (!dateInput) return ''
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  if (isNaN(date.getTime())) return ''
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

