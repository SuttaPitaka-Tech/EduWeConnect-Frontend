import { useState } from 'react'
import { Bell, Building2, CheckCircle2, Clock, FileText, Check, ShieldCheck, Trash2, ArrowRight } from 'lucide-react'
import { Button } from './button'
import { Sheet, SheetContent, SheetHeader, SheetFooter } from './sheet'

export interface NotificationItem {
  id: string
  title: string
  organizationName: string
  description: string
  timestamp: string
  isRead: boolean
  type?: 'registration' | 'documents' | 'approval' | 'update'
  tag?: string
  link?: string
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'New Organization Registration',
    organizationName: 'St. Xavier International School',
    description: 'Applied for organization account and completed Step 1 profile.',
    timestamp: '5 min ago',
    isRead: false,
    type: 'registration',
    tag: 'New Registration',
  },
  {
    id: '2',
    title: 'Documents Awaiting Verification',
    organizationName: 'Nalanda Global Academy',
    description: 'Uploaded PAN Card and Registration Certificate for superadmin review.',
    timestamp: '42 min ago',
    isRead: false,
    type: 'documents',
    tag: 'Pending Review',
  },
  {
    id: '3',
    title: 'Head of Organization Updated',
    organizationName: 'Delhi Public School',
    description: 'Updated head administrator credentials and submitted Aadhar card.',
    timestamp: '2 hours ago',
    isRead: false,
    type: 'update',
    tag: 'Org Head',
  },
  {
    id: '4',
    title: 'Organization Account Approved',
    organizationName: 'Vidya Mandir PU College',
    description: 'Organization onboarding application verified and approved successfully.',
    timestamp: 'Yesterday',
    isRead: true,
    type: 'approval',
    tag: 'Approved',
  },
]

export interface NotificationDrawerProps {
  notifications?: NotificationItem[]
  onNotificationClick?: (item: NotificationItem) => void
  onClearAll?: () => void
  onMarkAllAsRead?: () => void
  className?: string
}

export function NotificationDrawer({
  notifications: initialNotifications = DEFAULT_NOTIFICATIONS,
  onNotificationClick,
  onClearAll,
  onMarkAllAsRead,
  className = '',
}: NotificationDrawerProps) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    onMarkAllAsRead?.()
  }

  const handleItemClick = (item: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
    )
    onNotificationClick?.(item)
  }

  const handleClearAll = () => {
    setNotifications([])
    onClearAll?.()
  }

  const filteredNotifications = filter === 'unread'
    ? notifications.filter((n) => !n.isRead)
    : notifications

  return (
    <>
      {/* Trigger Bell Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`relative flex items-center justify-center w-10 h-10 rounded-xl bg-white/60 hover:bg-white/95 border border-[var(--border)]/70 shadow-sm cursor-pointer select-none transition-all text-[var(--navy)] hover:border-[var(--gold)]/50 focus:outline-none ${className}`}
        aria-label="View notifications"
      >
        <Bell className="w-4.5 h-4.5 text-[var(--navy)]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center px-1 rounded-full bg-[var(--navy)] text-white text-[10.5px] font-bold border-2 border-white shadow-sm animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Right-Side Slide-Over Sheet */}
      <Sheet open={open} onOpenChange={setOpen} side="right" width="max-w-md w-full sm:w-[420px]">
        {/* Header */}
        <SheetHeader className="bg-[var(--navy)] border-b border-[var(--gold)]/30 pr-12 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--gold)]/20 flex items-center justify-center shrink-0 border border-[var(--gold)]/30">
              <Bell className="w-4.5 h-4.5 text-[var(--gold)]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-white text-base font-bold tracking-tight">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center rounded-md bg-[var(--gold)] text-white text-[11px] font-bold px-2 py-0.5 shadow-xs">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <p className="text-[12px] text-white/70 mt-0.5">Organization activity & alerts</p>
            </div>
          </div>
        </SheetHeader>

        {/* Filter Toolbar */}
        <div className="px-4 py-2.5 bg-[var(--cream)]/60 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-[var(--navy)] text-white shadow-xs'
                  : 'bg-white/80 text-[var(--text-secondary)] hover:bg-white'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filter === 'unread'
                  ? 'bg-[var(--navy)] text-white shadow-xs'
                  : 'bg-white/80 text-[var(--text-secondary)] hover:bg-white'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-7 text-[11.5px] text-[var(--gold)] hover:text-[var(--navy)] hover:bg-[var(--gold)]/10 font-bold gap-1 px-2"
            >
              <Check className="w-3.5 h-3.5" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <SheetContent className="p-3.5 space-y-2.5 bg-[var(--warm-white)]">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16 px-4">
              <div className="w-12 h-12 rounded-full bg-[var(--cream)] border border-[var(--border)] flex items-center justify-center mb-3">
                <Bell className="w-6 h-6 text-[var(--text-muted)] opacity-60" />
              </div>
              <h4 className="text-sm font-bold text-[var(--navy)] mb-1">No notifications yet</h4>
              <p className="text-xs text-[var(--text-secondary)] max-w-[240px]">
                {filter === 'unread'
                  ? "You're all caught up! No unread organization notifications."
                  : 'When organizations register or update their profiles, alerts will appear here.'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleItemClick(notif)}
                className={`relative group rounded-xl p-3.5 border transition-all cursor-pointer ${
                  notif.isRead
                    ? 'bg-white border-[var(--border)]/70 hover:border-[var(--border)]'
                    : 'bg-white border-[var(--gold)]/50 shadow-xs ring-1 ring-[var(--gold)]/20 hover:border-[var(--gold)]'
                }`}
              >
                {/* Unread indicator dot */}
                {!notif.isRead && (
                  <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-[var(--gold)] animate-pulse" />
                )}

                <div className="flex items-start gap-3">
                  {/* Category Icon */}
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      notif.type === 'registration'
                        ? 'bg-[var(--gold)]/15 text-[var(--gold)]'
                        : notif.type === 'documents'
                        ? 'bg-blue-50 text-blue-600'
                        : notif.type === 'approval'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-purple-50 text-purple-600'
                    }`}
                  >
                    {notif.type === 'registration' && <Building2 className="w-4.5 h-4.5" />}
                    {notif.type === 'documents' && <FileText className="w-4.5 h-4.5" />}
                    {notif.type === 'approval' && <ShieldCheck className="w-4.5 h-4.5" />}
                    {notif.type === 'update' && <CheckCircle2 className="w-4.5 h-4.5" />}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--navy)]">
                        {notif.organizationName}
                      </span>
                      {notif.tag && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[var(--cream)] text-[var(--navy)] font-semibold border border-[var(--border)]/50">
                          {notif.tag}
                        </span>
                      )}
                    </div>

                    <h5 className="text-[12.5px] font-bold text-[var(--navy)] leading-snug">
                      {notif.title}
                    </h5>

                    <p className="text-[11.5px] text-[var(--text-secondary)] mt-1 leading-relaxed">
                      {notif.description}
                    </p>

                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[var(--border)]/40">
                      <span className="text-[10.5px] text-[var(--text-muted)] flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" />
                        {notif.timestamp}
                      </span>

                      <span className="text-[11px] font-bold text-[var(--gold)] group-hover:underline flex items-center gap-0.5">
                        View <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </SheetContent>

        {/* Footer */}
        {notifications.length > 0 && (
          <SheetFooter className="bg-[var(--cream)]/60 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-xs text-[var(--text-secondary)] hover:text-red-600 gap-1.5 h-8"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear all
            </Button>
          </SheetFooter>
        )}
      </Sheet>
    </>
  )
}
