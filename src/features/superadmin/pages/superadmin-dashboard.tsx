import { useAuth } from '@/contexts/auth-context'
import { ShieldAlert } from 'lucide-react'

export default function SuperAdminDashboard() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 bg-[var(--navy)]/10 rounded-full flex items-center justify-center mb-6 border border-[var(--gold)]/20 shadow-sm">
        <ShieldAlert className="w-10 h-10 text-[var(--gold)]" />
      </div>
      <h1 className="text-3xl md:text-4xl font-serif font-bold text-[var(--navy)] mb-3">
        Welcome, Super Admin!
      </h1>
      <p className="text-[var(--text-secondary)] text-lg max-w-xl">
        This is your central command center. You have elevated privileges to oversee organizations, staff, and system configurations.
      </p>

      {user && (
        <div className="mt-8 px-6 py-3 bg-white border border-[var(--border)] rounded-xl shadow-sm text-sm text-[var(--navy)]">
          <span className="font-semibold mr-2">Logged in as:</span>
          {user.email}
        </div>
      )}
    </div>
  )
}
