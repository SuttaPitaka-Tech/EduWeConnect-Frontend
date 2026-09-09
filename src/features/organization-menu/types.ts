import type { LucideIcon } from 'lucide-react'

export interface OrganizationMenuItem {
  title: string
  to: string
  icon: LucideIcon
  badge?: string | number
  exact?: boolean
}
