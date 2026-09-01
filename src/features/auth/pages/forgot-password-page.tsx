import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { GraduationCap, Mail } from 'lucide-react'
import { Button, Input, Label, Spinner } from '@/components/ui'
import { forgotPasswordApi } from '../api/auth.api'
import { forgotPasswordSchema } from '../schemas/schemas'
import { formatApiClientError } from '@/lib/api-client'
import type { ForgotPasswordFormValues } from '../types/types'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await forgotPasswordApi(values.email)
      // isSubmitSuccessful = true → success state shown
    } catch (error) {
      toast.error(formatApiClientError(error, 'Could not send reset email. Try again.'))
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
          {isSubmitSuccessful ? (
            /* ── Success state ── */
            <div className="flex flex-col items-center gap-4 text-center">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ background: 'var(--bg-secondary)' }}
              >
                <Mail className="h-6 w-6" style={{ color: 'var(--success)' }} />
              </div>
              <div>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Check your email
                </h2>
                <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                  We've sent a password reset link. Check your inbox and follow the instructions.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/login', { replace: true })}
                className="w-full"
              >
                Back to login
              </Button>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Forgot your password?
                </h2>
                <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <div className="space-y-1.5">
                  <Label htmlFor="fp-email" className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Email address
                  </Label>
                  <Input
                    id="fp-email"
                    type="email"
                    placeholder="you@institution.edu"
                    autoComplete="email"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-xs" style={{ color: 'var(--danger)' }}>{errors.email.message}</p>
                  )}
                </div>

                <Button type="submit" disabled={isSubmitting} className="h-11 w-full font-semibold">
                  {isSubmitting ? (
                    <span className="flex items-center gap-2"><Spinner size={16} /> Sending…</span>
                  ) : (
                    'Send reset link'
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}