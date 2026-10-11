import { useState } from 'react'
import { ShieldAlert, RefreshCw, LogOut, Clock, Building2, UserCheck } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { usePermissions } from '@/hooks/use-permissions'
import { toast } from 'sonner'

interface AccessPendingViewProps {
  customTitle?: string
  customMessage?: string
}

export function AccessPendingView({
  customTitle,
  customMessage,
}: AccessPendingViewProps) {
  const { user, signOut } = useAuth()
  const { refetch, isFetching } = usePermissions()
  const [isChecking, setIsChecking] = useState(false)

  const orgDisplayName =
    user?.organizationName || user?.institutionName || user?.firstName || 'Organization'

  const roleName = user?.role ? user.role.toUpperCase() : 'USER'

  const handleRefresh = async () => {
    setIsChecking(true)
    try {
      const result = await refetch()
      const data = result.data || {}
      const hasPermissions = Object.values(data).some(Boolean)

      if (hasPermissions) {
        toast.success('Permissions granted! Unlocking your portal...')
        // Force state update by reloading slightly or query will trigger re-render
      } else {
        toast.info('Super Admin has not yet assigned permissions. Please wait or check again later.')
      }
    } catch {
      toast.error('Unable to verify permissions. Please try again.')
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className="flex-1 w-full min-h-[75vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fadeIn">
      <div className="w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-3xl border border-[var(--border)] shadow-[0_20px_60px_rgba(16,42,67,0.12)] p-6 sm:p-10 flex flex-col items-center text-center relative overflow-hidden">
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[var(--gold)] via-[var(--light-gold)] to-[var(--navy)]" />

        {/* Ambient Glow */}
        <div className="absolute -top-24 -left-24 w-52 h-52 bg-[var(--gold)]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-52 h-52 bg-[var(--navy)]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Status Icon Badge */}
        <div className="relative mb-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-[#FDF9F0] to-[#F5EEDB] border-2 border-[#E5DEC9] flex items-center justify-center shadow-lg relative z-10">
            <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-[var(--gold)] animate-pulse" strokeWidth={1.8} />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[var(--navy)] text-white flex items-center justify-center border-2 border-white shadow-md z-20">
            <ShieldAlert className="w-4 h-4 text-[var(--gold)]" />
          </div>
        </div>

        {/* Pending Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30 mb-4 tracking-wide uppercase">
          <span className="w-2 h-2 rounded-full bg-[var(--gold)] animate-ping" />
          <span>Access Pending</span>
        </div>

        {/* Primary Heading */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[var(--navy)] tracking-tight leading-snug max-w-xl">
          {customTitle || 'Please wait, Super Admin will give you access to use this application'}
        </h1>

        {/* Sub-Headline / Message */}
        <p className="mt-3 text-sm sm:text-base text-[var(--text-secondary)] font-medium max-w-lg leading-relaxed">
          {customMessage || 'Super Admin has not yet given you permission to access the application. Your account is verified, but permissions have not been configured yet.'}
        </p>

        {/* Organization / User Context Box */}
        <div className="w-full mt-6 p-4 sm:p-5 rounded-2xl bg-[#F7F4EE]/80 border border-[var(--border)] text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white border border-[var(--border)] flex items-center justify-center text-[var(--navy)] shrink-0 shadow-sm">
              <Building2 className="w-5 h-5 text-[var(--gold)]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Organization / Account
              </p>
              <p className="text-sm font-bold text-[var(--navy)] truncate mt-0.5">
                {orgDisplayName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 bg-white px-3 py-1.5 rounded-xl border border-[var(--border)] shadow-sm">
            <UserCheck className="w-4 h-4 text-[var(--gold)]" />
            <span className="text-xs font-semibold text-[var(--navy)]">
              Role: <span className="text-[var(--gold)]">{roleName}</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isChecking || isFetching}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--navy)] text-white font-semibold text-sm hover:bg-[var(--deep-navy)] transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking || isFetching ? 'animate-spin text-[var(--gold)]' : ''}`} />
            <span>{isChecking || isFetching ? 'Checking Permissions...' : 'Check Access Status'}</span>
          </button>

          <button
            type="button"
            onClick={() => signOut()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border border-[var(--border)] text-[var(--navy)] font-semibold text-sm hover:bg-[#F7F4EE] transition-colors shadow-sm cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-[var(--text-secondary)]" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Footer Support Tip */}
        <p className="mt-6 text-xs text-[var(--text-secondary)]">
          Need urgent access? Contact your institution administrator or Super Admin.
        </p>
      </div>
    </div>
  )
}
