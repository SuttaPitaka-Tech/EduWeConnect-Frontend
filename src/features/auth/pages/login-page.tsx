import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, GraduationCap } from 'lucide-react'
import { toast } from 'sonner'
import { Button, Input, Label, Spinner } from '@/components/ui'
import { useAuth } from '@/contexts/auth-context'
import { loginSchema } from '../schemas/schemas'
import { formatApiClientError } from '@/lib/api-client'
import type { LoginFormValues } from '../types/types'
import { AuthNextPage } from '../enums/auth.enum'

export default function LoginPage() {
  const { signIn }      = useAuth()
  const navigate        = useNavigate()
  const [showPwd, setShowPwd] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const result = await signIn(values.email, values.password)
      if (result.nextPage === AuthNextPage.Otp) {
        navigate('/otp', { state: { email: values.email }, replace: true })
        return
      }
      navigate('/attendance', { replace: true })
    } catch (error) {
      toast.error(formatApiClientError(error, 'Login failed. Please check your credentials.'))
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
          <div className="text-center">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              EduWeConnect
            </h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Unified School Management Platform
            </p>
          </div>
        </div>

        {/* Form card */}
        <div
          className="rounded-2xl border p-8 shadow-lg"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div className="mb-6">
            <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Sign in to your account
            </h2>
            <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
              Enter your institution email and password to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@institution.edu"
                autoComplete="email"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs" style={{ color: 'var(--danger)' }}>{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Password
                </Label>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-xs transition-opacity hover:opacity-70"
                  style={{ color: 'var(--primary)' }}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="pr-11"
                  {...register('password')}
                />
                <button
                  type="button"
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 rounded p-1 transition-opacity hover:opacity-70"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs" style={{ color: 'var(--danger)' }}>{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full text-base font-semibold"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Spinner size={16} /> Signing in…
                </span>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}