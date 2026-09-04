import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, ArrowRight, Home } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { z } from 'zod'

const registerEmailSchema = z.object({
  organizationEmail: z
    .string()
    .trim()
    .min(1, 'Organization email is required')
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Enter a valid email containing "@" and "." (e.g. name@domain.com)',
    ),
})

type RegisterEmailValues = z.infer<typeof registerEmailSchema>

// ── SVG Logos ────────────────────────────────────────────────────────────────

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
    </svg>
  )
}

function MicrosoftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="1" y="1" width="9" height="9" fill="#f25022" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
      <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
      <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
    </svg>
  )
}

export function RegisterForm() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<RegisterEmailValues>({
    resolver: zodResolver(registerEmailSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      organizationEmail: '',
    },
  })

  const onSubmit = (values: RegisterEmailValues) => {
    navigate('/otp', { state: { email: values.organizationEmail, flow: 'register' } })
  }

  return (
    <div
      className="rounded-3xl p-5 md:p-6 shadow-2xl border border-[var(--border)]"
      style={{
        background: 'linear-gradient(145deg, rgba(255,253,248,0.95) 0%, rgba(247,241,227,0.9) 100%)',
        backdropFilter: 'blur(24px)',
      }}
    >
      <form noValidate className="flex flex-col gap-2.5" onSubmit={handleSubmit(onSubmit)}>
        {/* ORGANIZATION EMAIL */}
        <div>
          <label className="block text-[10.5px] font-bold tracking-wider text-[var(--navy)] uppercase mb-1">
            Organization Email
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--gold)]">
              <Mail className="w-4 h-4" />
            </div>
            <Input
              type="email"
              placeholder="organization@domain.com"
              {...register('organizationEmail', {
                onChange: () => {
                  if (errors.organizationEmail) clearErrors('organizationEmail')
                },
              })}
              error={Boolean(errors.organizationEmail)}
              className="pl-10 h-[42px] rounded-xl text-[13px]"
              style={{
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(8px)',
              }}
            />
          </div>
          {errors.organizationEmail && (
            <p className="text-[12px] font-medium text-red-500 mt-1">{errors.organizationEmail.message}</p>
          )}
        </div>

        {/* ── Submit — gold gradient button ─────────────────────────────── */}
        <Button
          type="submit"
          variant="gold"
          isLoading={isSubmitting}
          className="w-full h-[47px] rounded-xl font-bold text-[14.5px] mt-0.5 tracking-wide shadow-md hover:shadow-lg hover:scale-[1.008] active:scale-[0.99] transition-all group"
        >
          Send OTP
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>

        {/* ── Divider ───────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 my-0.5 mt-2">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
          <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-widest shrink-0">
            or continue with
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
        </div>

        {/* ── Social Login ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            className="flex items-center justify-center gap-2 h-[40px] rounded-xl text-[12px] font-bold text-[var(--navy)] transition-all hover:scale-[1.01] active:scale-[0.98]"
            style={{
              background: 'rgba(255,255,255,0.8)',
              border: '1px solid rgba(220,213,197,0.8)',
              boxShadow: '0 2px 8px rgba(16,42,67,0.06)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <GoogleIcon className="w-4 h-4 shrink-0" />
            <span>Google</span>
          </button>

          <button
            type="button"
            className="flex items-center justify-center gap-2 h-[40px] rounded-xl text-[12px] font-bold text-[var(--navy)] transition-all hover:scale-[1.01] active:scale-[0.98]"
            style={{
              background: 'rgba(255,255,255,0.8)',
              border: '1px solid rgba(220,213,197,0.8)',
              boxShadow: '0 2px 8px rgba(16,42,67,0.06)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <MicrosoftIcon className="w-4 h-4 shrink-0" />
            <span>Microsoft</span>
          </button>
        </div>

        {/* Sign In link */}
        <p className="text-center text-[12px] text-[var(--text-secondary)] font-medium mt-1">
          Already have an account?{' '}
          <Link
            to="/login"
            data-plain
            className="text-[var(--gold)] font-bold hover:underline underline-offset-2 transition-all"
          >
            Sign In
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
    </div>
  )
}
