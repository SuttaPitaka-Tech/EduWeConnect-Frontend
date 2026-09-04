import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LogOut, User, Building2, Hash, ChevronDown,
} from 'lucide-react'
import { Button, InitialsAvatar, Separator } from '@/components/ui'
import { eduLogo } from '@/assets/images'
import { useAuth } from '@/contexts/auth-context'
import type { UserRole } from '@/features/auth/enums/auth.enum'

// ── Role display labels ───────────────────────────────────────────────────────
const ROLE_LABEL: Record<string, string> = {
  super_admin: 'Super Admin',
  admin:       'Admin',
  principal:   'Principal',
  teacher:     'Teacher',
  student:     'Student',
  parent:      'Parent',
  staff:       'Staff',
}

// ── Role badge color ──────────────────────────────────────────────────────────
function roleBadgeStyle(role: UserRole): React.CSSProperties {
  const map: Record<string, string> = {
    super_admin: 'var(--gold)',
    admin:       'var(--gold)',
    principal:   '#6366f1',
    teacher:     '#0ea5e9',
    student:     'var(--success)',
    parent:      '#f97316',
    staff:       '#8b5cf6',
  }
  return { background: map[role] ?? 'var(--navy)', color: '#fff' }
}

/**
 * AppHeader — compact navy header for all authenticated app pages.
 * Used inside DashboardLayout.
 * - Left:   EduWeConnect logo (small)
 * - Center: current page icon + label (auto-detected from route)
 * - Right:  user avatar → click → profile popover card
 */
export function AppHeader() {
  const { user, signOut } = useAuth()
  const [open, setOpen]   = useState(false)

  const fullName = user ? `${user.firstName} ${user.lastName}` : 'Guest'

  return (
    <header className="w-full bg-[var(--cream)] sticky top-0 z-50 shadow-sm border-b border-[var(--border)]/60">
      <div className="w-full px-3 md:px-5 h-[64px] flex items-center justify-between">

        {/* ── Left corner: Logo (Full left edge) ───────────────────────────── */}
        {user?.role !== 'superadmin' ? (
          <Link to="/app/attendance" className="flex items-center shrink-0 -ml-1">
            <img
              src={eduLogo}
              alt="EduWeConnect"
              className="h-[60px] w-auto object-contain"
            />
          </Link>
        ) : (
          <div className="flex-1"></div>
        )}

        {/* ── Right corner: User avatar + popover ──────────────────────────── */}
        <div className="relative flex items-center shrink-0">
          <button
            data-plain
            data-dropdown-trigger
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-3 p-1.5 px-3 rounded-xl bg-white/60 hover:bg-white/90 border border-[var(--border)]/70 shadow-sm cursor-pointer select-none transition-all"
          >
            <InitialsAvatar
              name={fullName}
              size="md"
              className="!bg-[var(--cream)] border border-[var(--sand)]"
            />
            <span className="hidden md:block text-[14px] font-semibold max-w-[150px] truncate text-[var(--navy)]">
              {fullName}
            </span>
            <ChevronDown
              className="w-4 h-4 text-[var(--navy)] transition-transform duration-150"
              style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>

          {/* ── Profile card popover ─────────────────────────────────────── */}
          {open && (
            <>
              {/* Click-away backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setOpen(false)}
              />

              <div
                className="absolute right-0 top-[calc(100%+8px)] z-50 w-[260px] rounded-2xl shadow-xl border overflow-hidden"
                style={{
                  background:   'var(--warm-white)',
                  borderColor:  'var(--border)',
                  boxShadow:    '0 12px 40px rgba(16,42,67,0.18)',
                }}
              >
                {/* Avatar + name block */}
                <div
                  className="flex flex-col items-center gap-2 px-5 py-5"
                  style={{ background: 'var(--navy)' }}
                >
                  <InitialsAvatar name={fullName} size="lg" />
                  <div className="text-center">
                    <p className="text-[14px] font-bold text-white leading-tight">{fullName}</p>
                    <p className="text-[11px] text-white/60 mt-0.5">{user?.email}</p>
                  </div>
                  {user?.role && (
                    <span
                      className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mt-1"
                      style={roleBadgeStyle(user.role)}
                    >
                      {ROLE_LABEL[user.role] ?? user.role}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="px-4 py-3 space-y-2.5">
                  {user?.id && (
                    <div className="flex items-start gap-2.5">
                      <Hash className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: 'var(--gold)' }} />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>User ID</p>
                        <p className="text-[12px] font-mono font-medium break-all" style={{ color: 'var(--navy)' }}>
                          {user.id.slice(0, 20)}…
                        </p>
                      </div>
                    </div>
                  )}

                  {user?.institutionName && (
                    <div className="flex items-start gap-2.5">
                      <Building2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: 'var(--gold)' }} />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Institution</p>
                        <p className="text-[12px] font-medium" style={{ color: 'var(--navy)' }}>{user.institutionName}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-2.5">
                    <User className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: 'var(--gold)' }} />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Role</p>
                      <p className="text-[12px] font-medium" style={{ color: 'var(--navy)' }}>
                        {user?.role ? (ROLE_LABEL[user.role] ?? user.role) : '—'}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Logout */}
                <div className="px-4 py-3">
                  <Button
                    variant="ghost"
                    className="w-full h-[36px] text-[13px] font-semibold gap-2 border-0 hover:text-red-600 hover:bg-red-50 transition-colors"
                    onClick={() => { setOpen(false); signOut() }}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </header>
  )
}
