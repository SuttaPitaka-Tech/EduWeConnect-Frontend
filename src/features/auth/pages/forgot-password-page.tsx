import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  Users,
  UserCheck,
  Building,
  Home,
  RotateCcw,
} from 'lucide-react'
import { Button, Input, toast } from '@/components/ui'
import { registerBg, eduLogo, lotusLarge } from '@/assets/images'
import { forgotPasswordApi } from '../api/auth.api'
import { forgotPasswordSchema } from '../schemas/schemas'
import { formatApiClientError } from '@/lib/api-client'
import type { ForgotPasswordFormValues } from '../types/types'

function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
      {children}
    </div>
  )
}

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [submittedEmail, setSubmittedEmail] = useState<string>('')
  const [serverError, setServerError] = useState<string | null>(null)
  const [isResending, setIsResending] = useState(false)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setServerError(null)
    try {
      await forgotPasswordApi(values.email)
      setSubmittedEmail(values.email)
      toast.success('Reset link dispatched! Check your email inbox.')
    } catch (error) {
      const msg = formatApiClientError(error, 'Could not send reset email. Please try again.')
      setServerError(msg)
      toast.error(msg)
    }
  }

  const handleResend = async () => {
    const email = submittedEmail || getValues('email')
    if (!email) return
    setIsResending(true)
    try {
      await forgotPasswordApi(email)
      toast.success('Password reset link resent successfully!')
    } catch (error) {
      toast.error(formatApiClientError(error, 'Failed to resend reset link.'))
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="relative flex flex-col min-h-screen w-full overflow-hidden bg-[var(--cream)]">
      {/* Home Navigation Button */}
      <div className="absolute top-4 left-4 z-50">
        <Link
          to="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 backdrop-blur-md border border-[var(--border)] text-[var(--navy)] hover:bg-[var(--gold)]/10 font-semibold text-xs shadow-xs transition-all"
        >
          <Home className="w-3.5 h-3.5 text-[var(--gold)]" />
          Home
        </Link>
      </div>

      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-no-repeat bg-center blur-[2px] scale-105"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.15)), url(${registerBg})`,
          backgroundSize: '100% 100%',
        }}
      />

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex items-center justify-center w-full px-4 py-8">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20 w-full max-w-[1100px]">

          {/* LEFT COLUMN: Branding & Info */}
          <div className="flex flex-col items-center text-center flex-1 max-w-[420px] pt-2 lg:pt-0">
            {/* Logo area */}
            <div className="flex flex-col items-center justify-center w-full mb-3">
              <img
                src={eduLogo}
                alt="EduWeConnect Logo"
                className="h-[120px] md:h-[150px] w-auto object-contain drop-shadow-sm"
              />
            </div>

            {/* Symmetrical Centered Content */}
            <div className="flex flex-col items-center justify-center w-full">
              <div className="flex items-center justify-center gap-3 w-full max-w-[340px] mb-2.5">
                <div className="h-[1px] flex-1 bg-[var(--gold)]/40" />
                <span className="text-[var(--navy)] font-semibold text-[13.5px] whitespace-nowrap tracking-wide">
                  Education Management System
                </span>
                <div className="h-[1px] flex-1 bg-[var(--gold)]/40" />
              </div>

              <p className="text-[var(--navy)]/90 font-medium text-[13.5px] text-center max-w-[320px] leading-relaxed mb-5">
                Secure Account Recovery.<br />Reset your password to regain access.
              </p>

              {/* Feature Icons Row */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 w-full mb-5">
                <div className="flex flex-col items-center text-center">
                  <Users className="w-5 h-5 text-[var(--navy)] mb-1" strokeWidth={1.5} />
                  <h4 className="text-[var(--navy)] font-bold text-[12.5px] mb-0.5">Students</h4>
                  <p className="text-[var(--navy)]/70 text-[10.5px] whitespace-nowrap">Learn. Explore. Achieve.</p>
                </div>

                <div className="w-[1px] h-[36px] bg-[var(--navy)]/20 mx-0.5" />

                <div className="flex flex-col items-center text-center">
                  <UserCheck className="w-5 h-5 text-[var(--navy)] mb-1" strokeWidth={1.5} />
                  <h4 className="text-[var(--navy)] font-bold text-[12.5px] mb-0.5">Staff</h4>
                  <p className="text-[var(--navy)]/70 text-[10.5px] whitespace-nowrap">Manage. Support. Empower.</p>
                </div>

                <div className="w-[1px] h-[36px] bg-[var(--navy)]/20 mx-0.5" />

                <div className="flex flex-col items-center text-center">
                  <Building className="w-5 h-5 text-[var(--navy)] mb-1" strokeWidth={1.5} />
                  <h4 className="text-[var(--navy)] font-bold text-[12.5px] mb-0.5">Organizations</h4>
                  <p className="text-[var(--navy)]/70 text-[10.5px] whitespace-nowrap">Collaborate. Monitor. Excel.</p>
                </div>
              </div>

              {/* Quote */}
              <div className="flex flex-col items-center text-center max-w-[340px] px-2">
                <p className="text-[var(--navy)]/90 italic font-serif text-[13.5px] leading-relaxed">
                  &ldquo;The goal of education is not just knowledge, but character and purpose.&rdquo;
                </p>
                <p className="text-[var(--navy)]/80 text-[11.5px] font-bold mt-1 tracking-wide">— Buddha</p>
                <img src={lotusLarge} alt="lotus" className="w-[28px] h-auto object-contain mt-3 opacity-70" />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Form Card */}
          <div className="w-full max-w-[440px] -mt-4 lg:-mt-6">
            {/* Card Header Badge */}
            <div className="flex flex-col items-center text-center mb-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xs border border-[var(--border)] mb-1.5">
                <KeyRound className="w-4 h-4 text-[var(--navy)]" />
              </div>
              <h1 className="text-xl md:text-2xl font-serif font-bold text-[var(--navy)] mb-0.5">
                {isSubmitSuccessful ? 'Check Your Email' : 'Forgot Password?'}
              </h1>
              <p className="text-[var(--text-secondary)] text-[12.5px] font-medium">
                {isSubmitSuccessful
                  ? 'We have sent password recovery instructions'
                  : 'Enter your email to receive a password reset link'}
              </p>
            </div>

            {/* Glassmorphic Luxury Card */}
            <div
              className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/60"
              style={{
                background:
                  'linear-gradient(145deg, rgba(255,253,248,0.94) 0%, rgba(247,241,227,0.90) 100%)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                boxShadow:
                  '0 32px 80px rgba(16,42,67,0.22), inset 0 1px 0 rgba(255,255,255,0.7)',
              }}
            >
              <div className="p-6 md:p-8">
                {isSubmitSuccessful ? (
                  /* ── Success State ── */
                  <div className="flex flex-col items-center text-center gap-4 animate-fadeIn">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-[var(--navy)]">
                        Reset Link Sent!
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-[320px]">
                        We’ve dispatched a password reset link to{' '}
                        <span className="font-semibold text-[var(--navy)]">
                          {submittedEmail || 'your email'}
                        </span>
                        . Please follow the instructions to set a new password.
                      </p>
                    </div>

                    <div className="w-full pt-2 flex flex-col gap-2.5">
                      <Button
                        type="button"
                        variant="primary"
                        onClick={() => navigate('/login', { replace: true })}
                        className="w-full h-[42px] rounded-xl font-bold text-xs shadow-md"
                      >
                        Return to Login
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        isLoading={isResending}
                        onClick={handleResend}
                        className="w-full h-[40px] rounded-xl text-xs font-semibold border-[var(--border)] text-[var(--navy)] hover:bg-[var(--beige)]"
                      >
                        <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                        Resend Reset Link
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* ── Form State ── */
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    className="flex flex-col gap-4 animate-fadeIn"
                  >
                    {/* Server Error Alert */}
                    {serverError && (
                      <div className="rounded-xl px-4 py-3 text-[12px] font-medium border bg-red-50 border-red-200 text-red-700">
                        {serverError}
                      </div>
                    )}

                    {/* Email Input Field */}
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="fp-email"
                        className="text-[11px] font-semibold text-[var(--navy)] uppercase tracking-wider"
                      >
                        Email Address *
                      </label>
                      <div className="relative">
                        <FieldIcon>
                          <Mail className="h-[15px] w-[15px] text-[var(--gold)]" strokeWidth={1.75} />
                        </FieldIcon>
                        <Input
                          id="fp-email"
                          type="email"
                          placeholder="you@institution.edu"
                          autoComplete="email"
                          {...register('email')}
                          className="h-[42px] pl-10 pr-3 rounded-xl text-[13px] bg-white border-[var(--border)] focus:border-[var(--navy)]"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-[11px] font-medium text-red-500 mt-0.5">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Submit CTA */}
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={isSubmitting}
                      className="h-[42px] w-full rounded-xl font-bold text-[13.5px] shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-1"
                    >
                      Send Reset Link <ArrowRight className="w-4 h-4" />
                    </Button>

                    {/* Back to Login Link */}
                    <div className="pt-2 border-t border-[var(--border)]/60 flex items-center justify-center">
                      <Link
                        to="/login"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--navy)] hover:text-[var(--gold)] transition-colors py-1"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back to Login
                      </Link>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}