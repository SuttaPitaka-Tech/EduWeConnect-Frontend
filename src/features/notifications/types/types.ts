export type NotificationType = 'registration' | 'documents' | 'approval' | 'update'

export interface NotificationItem {
  id: string
  title: string
  organizationName: string
  description: string
  timestamp: string
  isRead: boolean
  type?: NotificationType
  tag?: string
  link?: string
}

export interface NotificationDrawerProps {
  notifications?: NotificationItem[]
  onNotificationClick?: (item: NotificationItem) => void
  onClearAll?: () => void
  onMarkAllAsRead?: () => void
  className?: string
}
