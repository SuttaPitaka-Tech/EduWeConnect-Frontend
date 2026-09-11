import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  ShieldCheck,
  BookOpen,
  Award,
  KeyRound,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react'
import { Button, Input, Dialog, DialogContent, DialogHeader, DialogFooter } from '@/components/ui'
import { toast } from 'sonner'

export default function StudentProfilePage() {
  const { user } = useAuth()

  // Change password modal states
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submittingPassword, setSubmittingPassword] = useState(false)
  const [passwordChangedSuccess, setPasswordChangedSuccess] = useState(false)

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields')
      return
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    setSubmittingPassword(true)
    try {
      // Simulate API call
      await new Promise((r) => setTimeout(r, 900))
      setPasswordChangedSuccess(true)
      toast.success('Password updated successfully!')
      setTimeout(() => {
        setChangePasswordOpen(false)
        setPasswordChangedSuccess(false)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }, 1200)
    } catch {
      toast.error('Failed to change password. Please try again.')
    } finally {
      setSubmittingPassword(false)
    }
  }

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.firstName || user?.email?.split('@')[0] || 'Student User'
  const displayEmail = user?.email || 'student@eduweconnect.com'
  const displayRole = user?.role || 'STUDENT'

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B1F33] via-[#102A43] to-[#1A365D] p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-400 to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#B8862C] to-[#E2A93B] p-1 flex items-center justify-center shadow-lg shadow-amber-900/30">
              <div className="w-full h-full rounded-[14px] bg-[#0B1F33] flex items-center justify-center">
                <span className="text-3xl font-bold text-amber-300">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white tracking-tight">{displayName}</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Active
                </span>
              </div>
              <p className="text-white/70 text-sm mt-1 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                Class 10 - Section A • Roll No: #2024-1048
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setChangePasswordOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-sm backdrop-blur-sm transition-all"
            >
              <KeyRound className="w-4 h-4 mr-2 text-amber-400" />
              Change Password
            </Button>
          </div>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Details */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-[#B8862C]" />
            Personal Details
          </h2>
          <div className="space-y-3.5 text-sm">
            <div>
              <span className="text-slate-400 text-xs uppercase font-medium">Full Name</span>
              <p className="text-slate-700 font-medium">{displayName}</p>
            </div>
            <div>
              <span className="text-slate-400 text-xs uppercase font-medium">Email Address</span>
              <p className="text-slate-700 font-medium flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {displayEmail}
              </p>
            </div>
            <div>
              <span className="text-slate-400 text-xs uppercase font-medium">Portal Role</span>
              <p className="text-slate-700 font-medium uppercase">{displayRole}</p>
            </div>
            <div>
              <span className="text-slate-400 text-xs uppercase font-medium">Phone</span>
              <p className="text-slate-700 font-medium flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                +91 98765 43210
              </p>
            </div>
            <div>
              <span className="text-slate-400 text-xs uppercase font-medium">Address</span>
              <p className="text-slate-700 font-medium flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Bengaluru, Karnataka
              </p>
            </div>
          </div>
        </div>

        {/* Academic Details */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#B8862C]" />
            Academic Details
          </h2>
          <div className="space-y-3.5 text-sm">
            <div>
              <span className="text-slate-400 text-xs uppercase font-medium">Standard / Grade</span>
              <p className="text-slate-700 font-medium">Grade 10 (Secondary School)</p>
            </div>
            <div>
              <span className="text-slate-400 text-xs uppercase font-medium">Section</span>
              <p className="text-slate-700 font-medium">Section A (Science Stream)</p>
            </div>
            <div>
              <span className="text-slate-400 text-xs uppercase font-medium">Academic Year</span>
              <p className="text-slate-700 font-medium flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                2026 - 2027
              </p>
            </div>
            <div>
              <span className="text-slate-400 text-xs uppercase font-medium">Overall Performance</span>
              <p className="text-emerald-600 font-semibold flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                Top 5% (Avg: 91.6%)
              </p>
            </div>
            <div>
              <span className="text-slate-400 text-xs uppercase font-medium">Attendance Record</span>
              <p className="text-slate-700 font-medium">96.4% Attendance this term</p>
            </div>
          </div>
        </div>

        {/* Guardian & Support */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#B8862C]" />
            Guardian & Support
          </h2>
          <div className="space-y-3.5 text-sm">
            <div>
              <span className="text-slate-400 text-xs uppercase font-medium">Primary Guardian</span>
              <p className="text-slate-700 font-medium">Rajesh Kumar (Father)</p>
            </div>
            <div>
              <span className="text-slate-400 text-xs uppercase font-medium">Emergency Contact</span>
              <p className="text-slate-700 font-medium flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                +91 98450 12345
              </p>
            </div>
            <div>
              <span className="text-slate-400 text-xs uppercase font-medium">Class Teacher</span>
              <p className="text-slate-700 font-medium">Prof. Sharma (Mathematics)</p>
            </div>
            <div>
              <span className="text-slate-400 text-xs uppercase font-medium">Portal Security</span>
              <p className="text-slate-600 text-xs mt-0.5">
                Two-factor authentication and role-based access enabled.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
        <DialogContent className="max-w-md bg-white border border-slate-200 shadow-2xl rounded-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Change Password</h3>
                <p className="text-xs text-slate-500">Update your student portal account password</p>
              </div>
            </div>
          </DialogHeader>

          {passwordChangedSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-semibold text-slate-800">Password Changed!</h4>
              <p className="text-xs text-slate-500">Your password has been updated securely.</p>
            </div>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4 py-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <Input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <DialogFooter className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setChangePasswordOpen(false)}
                  disabled={submittingPassword}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submittingPassword}
                  className="bg-[#0B1F33] hover:bg-[#102A43] text-white"
                >
                  {submittingPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
