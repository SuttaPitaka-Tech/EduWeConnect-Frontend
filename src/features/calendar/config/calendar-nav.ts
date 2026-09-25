import { Calendar } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface CalendarNavItem {
  title: string
  to: string
  icon: LucideIcon
  badge?: string
}

/**
 * Single source of truth for the Calendar navigation configuration.
 * Generates the standardized menu item for any role-specific base path.
 */
export function createCalendarMenuItem(roleBasePath: string, badge?: string): CalendarNavItem {
  const normalizedBase = roleBasePath.replace(/\/+$/, '')
  return {
    title: 'Calendar',
    to: `${normalizedBase}/calendar`,
    icon: Calendar,
    badge,
  }
}
