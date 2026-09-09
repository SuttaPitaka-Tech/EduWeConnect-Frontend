import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, ArrowRight, ArrowLeft, Home, Mail, Lock, KeyRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button, Input, FormError } from '@/components/ui'
import { useAuth } from '@/contexts/auth-context'
import { loginSchema } from '../schemas/schemas'
import type { LoginFormValues } from '../types/types'
import { UserRole } from '../enums/auth.enum'

function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
      {children}
    </div>
  )
}

/**
 * LoginForm — styled to match RegisterForm frosted glass card design.
 * Calls signIn() from AuthContext, handles OTP redirect and first-time mandatory password change.
 */
export function LoginForm() {
  const { signIn, changePassword, isLoading } = useAuth()
  const navigate              = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  // ── First-time password change state ──
  const [isMustChangePassword, setIsMustChangePassword] = useState(false)
  const [pendingEmail, setPendingEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPass, setShowCurrentPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [changePassLoading, setChangePassLoading] = useState(false)
  const [changePassError, setChangePassError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null)
    try {
      const result = await signIn(values.email, values.password)
      
      // If user must change default password on first login
      if (result.mustChangePassword) {
        setPendingEmail(values.email)
        setCurrentPassword(values.password)
        setIsMustChangePassword(true)
        return
      }

      if (result.nextPage === 'otp') {
        navigate('/otp', { state: { email: values.email } })
      } else {
        const role = result.user?.role
        if (role === UserRole.SuperAdmin) {
          navigate('/superadmin/dashboard', { replace: true })
        } else {
          if (role === UserRole.Organization) {
            const orgName = result.user?.organizationName || result.organizationName || 'Organization'
            toast.success(`Welcome ${orgName} (Org)!`)
          }
          navigate(role === UserRole.Organization ? '/organization/dashboard' : '/app/attendance', { replace: true })
        }
      }
    } catch (err: any) {
      setServerError(err?.message || 'Invalid credentials. Please check your email and password.')
    }
  }

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setChangePassError(null)

    if (!currentPassword) {
      setChangePassError('Please enter your current password.')
      return
    }
    if (!newPassword || newPassword.length < 6) {
      setChangePassError('New password must be at least 6 characters long.')
      return
    }
    if (newPassword === currentPassword) {
      setChangePassError('New password cannot be the same as your current password.')
      return
    }
    if (newPassword !== confirmPassword) {
      setChangePassError('Passwords do not match. Please re-enter.')
      return
    }

    setChangePassLoading(true)
    try {
      const result = await changePassword(pendingEmail, currentPassword, newPassword)
      const role = result.user?.role
      const orgName = result.user?.organizationName || result.organizationName || 'Organization'
      const welcomeMsg = role === UserRole.Organization
        ? `Welcome ${orgName} (Org)!`
        : `Welcome ${result.user?.firstName || 'User'}!`
      toast.success(welcomeMsg)

      if (role === UserRole.SuperAdmin) {
        navigate('/superadmin/dashboard', { replace: true })
      } else {
        navigate(role === UserRole.Organization ? '/organization/dashboard' : '/app/attendance', { replace: true })
      }
    } catch (err: any) {
      setChangePassError(err?.message || 'Failed to update password. Please try again.')
    } finally {
      setChangePassLoading(false)
    }
  }

  return (
    <div
      className="relative rounded-3xl overflow-hidden"
      style={{
        background:   'linear-gradient(145deg, rgba(255,253,248,0.92) 0%, rgba(247,241,227,0.88) 100%)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow:    '0 32px 80px rgba(16,42,67,0.22), inset 0 1px 0 rgba(255,255,255,0.7)',
        border:       '1px solid rgba(255,255,255,0.55)',
      }}
    >
      <div className="p-6 md:p-8">
        {isMustChangePassword ? (
          /* ── Change Password View ── */
          <form
            onSubmit={handleChangePasswordSubmit}
            noValidate
            className="flex flex-col gap-4"
          >
            {/* Header Info */}
            <div className="flex items-center gap-3 pb-3 border-b border-[var(--sand)]">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 shadow-sm">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-[var(--navy)]">Change Password</h3>
                <p className="text-[12px] text-[var(--text-muted)] leading-tight">
                  First-time login requires changing your temporary password.
                </p>
              </div>
            </div>

            {/* Error alert */}
            {changePassError && (
              <div
                className="rounded-xl px-4 py-3 text-[12.5px] font-medium border"
                style={{ background: '#fef2f2', borderColor: '#fecaca', color: '#b91c1c' }}
              >
                {changePassError}
              </div>
            )}

            {/* Account info pill */}
            <div className="text-[12px] text-[var(--text-secondary)] font-medium bg-white/60 px-3.5 py-2 rounded-xl border border-[var(--border)]/60">
              Account: <strong className="text-[var(--navy)]">{pendingEmail}</strong>
            </div>

            {/* Current Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="change-current-password"
                className="text-[12px] font-semibold text-[var(--navy)] uppercase tracking-wider"
              >
                Current Password
              </label>
              <div className="relative">
                <FieldIcon>
                  <Lock className="h-[15px] w-[15px] text-[var(--gold)]" strokeWidth={1.75} />
                </FieldIcon>
                <Input
                  id="change-current-password"
                  type={showCurrentPass ? 'text' : 'password'}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="pl-10 pr-11 h-[44px] rounded-xl text-[13px]"
                  style={{
                    background: 'rgba(255,255,255,0.7)',
                    backdropFilter: 'blur(8px)',
                  }}
                />
                <button
                  type="button"
                  data-plain
                  onClick={() => setShowCurrentPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--gold)] cursor-pointer transition-colors"
                  style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: 0 }}
                  tabIndex={-1}
                >
                  {showCurrentPass
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4 text-[var(--gold)]" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="change-new-password"
                className="text-[12px] font-semibold text-[var(--navy)] uppercase tracking-wider"
              >
                New Password
              </label>
              <div className="relative">
                <FieldIcon>
                  <Lock className="h-[15px] w-[15px] text-[var(--gold)]" strokeWidth={1.75} />
                </FieldIcon>
                <Input
                  id="change-new-password"
                  type={showNewPass ? 'text' : 'password'}
                  placeholder="Enter new password (min. 6 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 pr-11 h-[44px] rounded-xl text-[13px]"
                  style={{
                    background: 'rgba(255,255,255,0.7)',
                    backdropFilter: 'blur(8px)',
                  }}
                />
                <button
                  type="button"
                  data-plain
                  onClick={() => setShowNewPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--gold)] cursor-pointer transition-colors"
                  style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: 0 }}
                  tabIndex={-1}
                >
                  {showNewPass
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4 text-[var(--gold)]" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="change-confirm-password"
                className="text-[12px] font-semibold text-[var(--navy)] uppercase tracking-wider"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <FieldIcon>
                  <Lock className="h-[15px] w-[15px] text-[var(--gold)]" strokeWidth={1.75} />
                </FieldIcon>
                <Input
                  id="change-confirm-password"
                  type={showConfirmPass ? 'text' : 'password'}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-11 h-[44px] rounded-xl text-[13px]"
                  style={{
                    background: 'rgba(255,255,255,0.7)',
                    backdropFilter: 'blur(8px)',
                  }}
                />
                <button
                  type="button"
                  data-plain
                  onClick={() => setShowConfirmPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--gold)] cursor-pointer transition-colors"
                  style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: 0 }}
                  tabIndex={-1}
                >
                  {showConfirmPass
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4 text-[var(--gold)]" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              isLoading={changePassLoading}
              className="w-full h-[50px] rounded-xl font-bold text-[15px] mt-2 tracking-wide shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all group"
            >
              Update Password & Login
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            {/* Back to Login link */}
            <div className="flex justify-center mt-1">
              <button
                type="button"
                data-plain
                onClick={() => {
                  setIsMustChangePassword(false)
                  setChangePassError(null)
                }}
                className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--navy)] hover:text-[var(--gold)] transition-colors cursor-pointer"
                style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: 0 }}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Cancel & back to login
              </button>
            </div>
          </form>
        ) : (
          /* ── Standard Sign In Form ── */
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-4"
          >
            {/* Server error */}
            {serverError && (
              <div
                className="rounded-xl px-4 py-3 text-[12.5px] font-medium border"
                style={{ background: '#fef2f2', borderColor: '#fecaca', color: '#b91c1c' }}
              >
                {serverError}
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="login-email"
                className="text-[12px] font-semibold text-[var(--navy)] uppercase tracking-wider"
              >
                Email / Username
              </label>
              <div className="relative">
                <FieldIcon>
                  <Mail className="h-[15px] w-[15px] text-[var(--gold)]" strokeWidth={1.75} />
                </FieldIcon>
                <Input
                  id="login-email"
                  type="text"
                  placeholder="Enter your email or username"
                  autoComplete="username"
                  {...register('email')}
                  error={Boolean(errors.email)}
                  className="pl-10 h-[44px] rounded-xl text-[13px]"
                  style={{
                    background: 'rgba(255,255,255,0.7)',
                    backdropFilter: 'blur(8px)',
                  }}
                />
              </div>
              <FormError message={errors.email?.message} />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="text-[12px] font-semibold text-[var(--navy)] uppercase tracking-wider"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11.5px] font-medium hover:underline"
                  style={{ color: 'var(--gold)' }}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <FieldIcon>
                  <Lock className="h-[15px] w-[15px] text-[var(--gold)]" strokeWidth={1.75} />
                </FieldIcon>
                <Input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  {...register('password')}
                  error={Boolean(errors.password)}
                  className="pl-10 pr-11 h-[44px] rounded-xl text-[13px]"
                  style={{
                    background: 'rgba(255,255,255,0.7)',
                    backdropFilter: 'blur(8px)',
                  }}
                />
                <button
                  type="button"
                  data-plain
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--gold)] cursor-pointer transition-colors"
                  style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: 0 }}
                  tabIndex={-1}
                >
                  {showPass
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4 text-[var(--gold)]" />}
                </button>
              </div>
              <FormError message={errors.password?.message} />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full h-[50px] rounded-xl font-bold text-[15px] mt-1 tracking-wide shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all group"
            >
              Sign In
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            {/* Register link */}
            <p className="text-center text-[12px] text-[var(--text-secondary)] font-medium mt-1">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                data-plain
                className="text-[var(--gold)] font-bold hover:underline underline-offset-2 transition-all"
              >
                Register
              </Link>
            </p>

            {/* Home link */}
            <div className="flex justify-center mt-1">
              <Link
                to="/"
                data-plain
                className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--gold)] hover:underline underline-offset-2 transition-all"
                style={{ textShadow: 'none', filter: 'none' }}
              >
                <Home className="w-3.5 h-3.5" />
                Home
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
