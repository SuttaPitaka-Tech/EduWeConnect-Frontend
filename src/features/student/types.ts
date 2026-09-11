import type { LucideIcon } from 'lucide-react'

export interface StudentMenuItem {
  title: string
  to: string
  icon: LucideIcon
  badge?: string
}
