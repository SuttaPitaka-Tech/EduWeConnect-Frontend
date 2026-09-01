import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { GraduationCap, KeyRound } from 'lucide-react'
import { Button, Input, Label, Spinner } from '@/components/ui'
import { useAuth } from '@/contexts/auth-context'
import { otpSchema } from '../schemas/schemas'
import { formatApiClientError } from '@/lib/api-client'
import type { OtpFormValues } from '../types/types'

export default function OtpPage() {
  const { verifyOtp } = useAuth()
  const navigate      = useNavigate()
  const location      = useLocation()

  // Email passed via router state from login-page
  const email = (location.state as { email?: string })?.email ?? ''

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OtpFormValues>({
    resolver:      zodResolver(otpSchema),
    defaultValues: { email },
  })

  const onSubmit = async (values: OtpFormValues) => {
    try {
      await verifyOtp(values.email, values.otp)
      toast.success('Verified! Welcome back.')
    } catch (error) {
      toast.error(formatApiClientError(error, 'Invalid OTP. Please try again.'))
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg"
            style={{ background: 'var(--primary)' }}
          >
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
        </div>

        <div
          className="rounded-2xl border p-8 shadow-lg"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div className="mb-6 flex flex-col items-center text-center">
            <div
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ background: 'var(--bg-secondary)' }}
            >
              <KeyRound className="h-6 w-6" style={{ color: 'var(--primary)' }} />
            </div>
            <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Enter verification code
            </h2>
            <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
              We sent a 6-digit code to <strong>{email}</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

            <input type="hidden" {...register('email')} />

            {/* OTP */}
            <div className="space-y-1.5">
              <Label htmlFor="otp" className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                Verification code
              </Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                autoComplete="one-time-code"
                className="text-center text-2xl tracking-[0.5em] font-mono"
                {...register('otp')}
              />
              {errors.otp && (
                <p className="text-xs text-center" style={{ color: 'var(--danger)' }}>
                  {errors.otp.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting} className="h-11 w-full font-semibold">
              {isSubmitting ? (
                <span className="flex items-center gap-2"><Spinner size={16} /> Verifying…</span>
              ) : (
                'Verify & continue'
              )}
            </Button>

            <button
              type="button"
              onClick={() => navigate('/login', { replace: true })}
              className="w-full text-center text-xs transition-opacity hover:opacity-70"
              style={{ color: 'var(--text-muted)' }}
            >
              ← Back to login
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}