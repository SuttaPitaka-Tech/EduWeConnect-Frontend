import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, ArrowRight, Home } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input, Label, FormError } from '@/components/ui'
import { useAuth } from '@/contexts/auth-context'
import { loginSchema } from '../schemas/schemas'
import type { LoginFormValues } from '../types/types'

/**
 * LoginForm — self-contained form component.
 * Calls signIn() from AuthContext, handles OTP redirect.
 * MNC Pattern: form logic in component, API in context, schema in schemas.ts.
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
        navigate('/app/attendance', { replace: true })
      }
    } catch {
      setServerError('Invalid credentials. Please check your email and password.')
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-2xl p-6 md:p-8 shadow-xl border space-y-4"
      style={{
        background:  'rgba(255,253,248,0.95)',
        borderColor: 'var(--border)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Server error */}
      {serverError && (
        <div
          className="rounded-lg px-4 py-3 text-[12.5px] font-medium border"
          style={{ background: '#fef2f2', borderColor: '#fecaca', color: '#b91c1c' }}
        >
          {serverError}
        </div>
      )}

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="login-email">Email / Username</Label>
        <Input
          id="login-email"
          type="text"
          placeholder="Enter your email or username"
          autoComplete="username"
          {...register('email')}
          aria-invalid={Boolean(errors.email)}
        />
        <FormError message={errors.email?.message} />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password">Password</Label>
          <Link
            to="/forgot-password"
            className="text-[11.5px] font-medium hover:underline"
            style={{ color: 'var(--gold)' }}
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="login-password"
            type={showPass ? 'text' : 'password'}
            placeholder="Enter your password"
            autoComplete="current-password"
            {...register('password')}
            aria-invalid={Boolean(errors.password)}
            className="pr-10"
          />
          <button
            type="button"
            data-plain
            onClick={() => setShowPass((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: 0 }}
            tabIndex={-1}
          >
            {showPass
              ? <EyeOff className="w-4 h-4" />
              : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <FormError message={errors.password?.message} />
      </div>

      {/* Submit — gold gradient, same as Register form */}
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
      <p className="text-center text-[12.5px]" style={{ color: 'var(--text-muted)' }}>
        Don&apos;t have an account?{' '}
        <Link
          to="/register"
          className="font-semibold hover:underline"
          style={{ color: 'var(--navy)' }}
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
  )
}
