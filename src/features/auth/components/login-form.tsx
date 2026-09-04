import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, ArrowRight, Home, Mail, Lock } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input, FormError } from '@/components/ui'
import { useAuth } from '@/contexts/auth-context'
import { loginSchema } from '../schemas/schemas'
import type { LoginFormValues } from '../types/types'

function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
      {children}
    </div>
  )
}

/**
 * LoginForm — styled to match RegisterForm frosted glass card design.
 * Calls signIn() from AuthContext, handles OTP redirect.
 */
export function LoginForm() {
  const { signIn, isLoading } = useAuth()
  const navigate              = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

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
      if (result.nextPage === 'otp') {
        navigate('/otp', { state: { email: values.email } })
      } else {
        if (result.user?.role === 'superadmin') {
          navigate('/app/superadmin', { replace: true })
        } else {
          navigate('/app/attendance', { replace: true })
        }
      }
    } catch {
      setServerError('Invalid credentials. Please check your email and password.')
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
              className="text-[12px] font-bold text-[var(--navy)] uppercase tracking-wider"
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
                className="text-[12px] font-bold text-[var(--navy)] uppercase tracking-wider"
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
            variant="gold"
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
              className="text-[var(--gold)] font-bold hover:underline underline-offset-2"
            >
              Register
            </Link>
          </p>

          {/* Home link */}
          <div className="flex justify-center mt-1">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-[12px] font-medium hover:underline"
              style={{ color: 'var(--gold)' }}
            >
              <Home className="w-3.5 h-3.5" />
              Home
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
