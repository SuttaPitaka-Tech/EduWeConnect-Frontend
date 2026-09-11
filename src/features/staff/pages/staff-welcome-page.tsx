import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import {
  User,
  Mail,
  Phone,
  Building2,
  BookOpen,
  ShieldCheck,
  KeyRound,
  Sparkles,
  Briefcase,
  CheckCircle2,
  LogOut,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react'
import { Button, Input, Dialog, DialogContent, DialogHeader, DialogFooter } from '@/components/ui'
import { toast } from 'sonner'

export default function StaffWelcomePage() {
  const { user, signOut, changePassword } = useAuth()
  const [changePassOpen, setChangePassOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passError, setPassError] = useState<string | null>(null)

  const employeeType = user?.employeeType || 'Teacher'
  const isTeacher = employeeType.toLowerCase().includes('teach')
  const isFinance = employeeType.toLowerCase().includes('finance')
  const isNonStaff = employeeType.toLowerCase().includes('non')

  // Dynamic welcome title as requested
  const welcomeTitle = isTeacher
    ? 'Welcome, Teacher!'
    : isFinance
    ? 'Welcome, Staff (Finance)!'
    : isNonStaff
    ? 'Welcome, Staff (Non-Staff)!'
    : 'Welcome, Staff Member!'

  const roleSubtitle = isTeacher
    ? 'Academic Faculty & Educator Portal'
    : isFinance
    ? 'Financial Management & Accounts Division'
    : isNonStaff
    ? 'Institutional Operations & Support Services'
    : 'Staff Member Portal'

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPassError(null)

    if (!currentPassword) {
      setPassError('Please enter your current password.')
      return
    }
    if (!newPassword || newPassword.length < 6) {
      setPassError('New password must be at least 6 characters.')
      return
    }
    if (newPassword === currentPassword) {
      setPassError('New password cannot be identical to current password.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPassError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)
    try {
      await changePassword(user?.email || '', currentPassword, newPassword)
      toast.success('Password updated successfully!')
      setChangePassOpen(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setPassError(err?.message || 'Failed to update password.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const fullName = `${user?.firstName || 'Staff'} ${user?.lastName || ''}`.trim()

  return (
    <div className="flex flex-col gap-8">
      {/* ── Banner / Hero ────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 md:p-10 border border-[var(--border)]/70 shadow-sm"
        style={{
          background: 'linear-gradient(135deg, #102A43 0%, #1E3A5F 60%, #243E63 100%)',
        }}
      >
        {/* Subtle decorative background ring */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[var(--gold)]/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-blue-400/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--gold)]/20 border border-[var(--gold)]/40 text-[var(--gold)] text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{roleSubtitle}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {welcomeTitle}
            </h1>
            <p className="text-sm md:text-base text-gray-200 font-medium max-w-xl">
              Glad to have you here, <span className="text-[var(--gold)] font-semibold">{fullName}</span>. You are signed in with institutional access to EduWeConnect.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setChangePassOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white border-white/25 rounded-xl text-xs font-semibold gap-2 cursor-pointer h-10 px-4"
            >
              <KeyRound className="w-4 h-4 text-[var(--gold)]" />
              <span>Change Password</span>
            </Button>
            <Button
              type="button"
              onClick={signOut}
              className="bg-rose-500/90 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold gap-2 cursor-pointer h-10 px-4 shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ── Profile & Details Grid ───────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Staff Identity */}
        <div className="bg-white rounded-2xl p-6 border border-[var(--border)]/70 shadow-2xs flex flex-col gap-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[var(--border)]/50">
            <div className="w-10 h-10 rounded-xl bg-[var(--cream)] border border-[var(--gold)]/30 flex items-center justify-center text-[var(--navy)]">
              <User className="w-5 h-5 text-[var(--gold)]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--navy)]">Staff Profile</h3>
              <p className="text-xs text-[var(--text-secondary)]">Your personal and contact information</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[var(--text-muted)] font-medium block">Full Name</span>
              <span className="text-[var(--navy)] font-bold text-sm">{fullName}</span>
            </div>

            <div>
              <span className="text-[var(--text-muted)] font-medium block">Official Email</span>
              <span className="text-[var(--navy)] font-semibold flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>{user?.email}</span>
              </span>
            </div>

            {user?.mobileNumber && (
              <div>
                <span className="text-[var(--text-muted)] font-medium block">Contact Number</span>
                <span className="text-[var(--navy)] font-semibold flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <span>{user.mobileNumber}</span>
                </span>
              </div>
            )}

            <div>
              <span className="text-[var(--text-muted)] font-medium block">Employee Classification</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 font-bold border border-purple-200 mt-1">
                <Briefcase className="w-3 h-3" />
                <span>{employeeType}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Institution Affiliation */}
        <div className="bg-white rounded-2xl p-6 border border-[var(--border)]/70 shadow-2xs flex flex-col gap-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[var(--border)]/50">
            <div className="w-10 h-10 rounded-xl bg-[var(--cream)] border border-[var(--gold)]/30 flex items-center justify-center text-[var(--navy)]">
              <Building2 className="w-5 h-5 text-[var(--gold)]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--navy)]">Institutional Mapping</h3>
              <p className="text-xs text-[var(--text-secondary)]">Affiliated educational organization</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[var(--text-muted)] font-medium block">Institution Name</span>
              <span className="text-[var(--navy)] font-bold text-sm">
                {user?.organizationName || user?.institutionName || 'EduWeConnect Institution'}
              </span>
            </div>

            <div>
              <span className="text-[var(--text-muted)] font-medium block">Account Status</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Active Staff Account</span>
              </span>
            </div>

            <div>
              <span className="text-[var(--text-muted)] font-medium block">Access Privilege</span>
              <span className="text-[var(--navy)] font-semibold block mt-0.5">
                Role: Staff ({employeeType})
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Subjects / Responsibilities */}
        <div className="bg-white rounded-2xl p-6 border border-[var(--border)]/70 shadow-2xs flex flex-col gap-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[var(--border)]/50">
            <div className="w-10 h-10 rounded-xl bg-[var(--cream)] border border-[var(--gold)]/30 flex items-center justify-center text-[var(--navy)]">
              <BookOpen className="w-5 h-5 text-[var(--gold)]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--navy)]">Academic &amp; Duties</h3>
              <p className="text-xs text-[var(--text-secondary)]">Assigned disciplines &amp; operations</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {isTeacher ? (
              <div>
                <span className="text-[var(--text-muted)] font-medium block mb-1.5">
                  Assigned Teaching Subjects
                </span>
                {Array.isArray(user?.subjects) && user.subjects.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {user.subjects.map((sub, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-[var(--cream)] text-[var(--navy)] border border-[var(--gold)]/30 font-semibold"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-[var(--text-secondary)] italic">
                    General curriculum or subjects will appear here once allocated.
                  </span>
                )}
              </div>
            ) : isFinance ? (
              <div>
                <span className="text-[var(--text-muted)] font-medium block mb-1">
                  Department Scope
                </span>
                <p className="text-[var(--navy)] font-semibold">
                  Fee Collection, Invoicing, Payroll &amp; Accounts Ledger Management.
                </p>
              </div>
            ) : (
              <div>
                <span className="text-[var(--text-muted)] font-medium block mb-1">
                  Operational Scope
                </span>
                <p className="text-[var(--navy)] font-semibold">
                  Facility Logistics, Institutional Records &amp; Student Welfare Assistance.
                </p>
              </div>
            )}

            <div className="pt-2 border-t border-[var(--border)]/40">
              <span className="text-[var(--text-muted)] font-medium block">Security Status</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Password Protected &amp; Verified</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Change Password Dialog ──────────────────────────────── */}
      <Dialog open={changePassOpen} onOpenChange={setChangePassOpen}>
        <DialogContent className="max-w-md p-6 bg-white rounded-2xl border border-[var(--border)] shadow-xl">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shrink-0">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--navy)]">Change Account Password</h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Update your security password for {user?.email}
                </p>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 mt-4">
            {passError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {passError}
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-[var(--navy)] block mb-1">
                Current Password
              </label>
              <div className="relative">
                <Input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                  className="pr-10 text-xs h-10 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[var(--navy)] block mb-1">
                New Password
              </label>
              <div className="relative">
                <Input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  className="pr-10 text-xs h-10 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[var(--navy)] block mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <Input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  className="pr-10 text-xs h-10 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <DialogFooter className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setChangePassOpen(false)}
                className="h-10 px-4 rounded-xl text-xs font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-10 px-5 rounded-xl bg-[var(--navy)] text-white hover:bg-[var(--deep-navy)] text-xs font-bold gap-2"
              >
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Save New Password</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
