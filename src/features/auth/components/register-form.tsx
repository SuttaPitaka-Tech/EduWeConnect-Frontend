import { Link } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, ArrowRight, ShieldCheck, Home, Building2, Phone, MapPin } from 'lucide-react'
import { Button, Input, Dropdown, Checkbox } from '@/components/ui'
import { registerSchema, type RegisterFormValues } from '@/features/auth'

// ── SVG Logos ────────────────────────────────────────────────────────────────

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.15v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.15C1.43 8.55 1 10.22 1 12s.43 3.45 1.15 4.93l3.69-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.15 7.07l3.69 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function MicrosoftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
      <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
      <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
    </svg>
  )
}

const ORGANIZATION_TYPE_OPTIONS = [
  { value: 'pre_school',     label: 'Pre School' },
  { value: 'school',         label: 'School' },
  { value: 'pre_university', label: 'Pre University' },
  { value: 'college',        label: 'College' },
  { value: 'university',     label: 'University' },
] as const

// ── Reusable field wrapper ────────────────────────────────────────────────────
function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
      {children}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export function RegisterForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver:      zodResolver(registerSchema),
    defaultValues: {
      organizationType:  '',
      organizationName:  '',
      organizationEmail: '',
      contactNumber:     '',
      address:           '',
      acceptTerms:       false,
    },
  })

  function onSubmit(_data: RegisterFormValues) {
    // TODO: wire to registerApi mutation
  }

  return (
    /**
     * Card shell — frosted glass over the background image.
     * bg-white/10 + backdrop-blur gives the glass look.
     * A fine white inner border + drop shadow add depth.
     */
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
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>

          {/* ── Organization Type ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-[var(--navy)] uppercase tracking-wider">
              Organization Type
            </label>
            <Controller
              name="organizationType"
              control={control}
              render={({ field }) => (
                <Dropdown
                  value={field.value}
                  onChange={field.onChange}
                  options={ORGANIZATION_TYPE_OPTIONS}
                  placeholder="Select organization type"
                  invalid={!!errors.organizationType}
                  className="h-[44px] rounded-xl"
                />
              )}
            />
            {errors.organizationType && (
              <p className="text-[11px] text-red-500 mt-0.5">{errors.organizationType.message}</p>
            )}
          </div>

          {/* ── Organization Name ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-[var(--navy)] uppercase tracking-wider">
              Organization Name
            </label>
            <div className="relative">
              <FieldIcon>
                <Building2 className="h-[15px] w-[15px] text-[var(--gold)]" strokeWidth={1.75} />
              </FieldIcon>
              <Input
                {...register('organizationName')}
                type="text"
                placeholder="Enter organization name"
                error={!!errors.organizationName}
                className="pl-10 h-[44px] rounded-xl text-[13px]"
                style={{
                  background: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(8px)',
                }}
              />
            </div>
            {errors.organizationName && (
              <p className="text-[11px] text-red-500 mt-0.5">{errors.organizationName.message}</p>
            )}
          </div>

          {/* ── Organization Email & Contact Number (Same Row) ─────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Organization Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-[var(--navy)] uppercase tracking-wider">
                Organization Email
              </label>
              <div className="relative">
                <FieldIcon>
                  <Mail className="h-[15px] w-[15px] text-[var(--gold)]" strokeWidth={1.75} />
                </FieldIcon>
                <Input
                  {...register('organizationEmail')}
                  type="email"
                  placeholder="organization@domain.com"
                  error={!!errors.organizationEmail}
                  className="pl-10 h-[44px] rounded-xl text-[13px]"
                  style={{
                    background: 'rgba(255,255,255,0.7)',
                    backdropFilter: 'blur(8px)',
                  }}
                />
              </div>
              {errors.organizationEmail && (
                <p className="text-[11px] text-red-500 mt-0.5">{errors.organizationEmail.message}</p>
              )}
            </div>

            {/* Contact Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-[var(--navy)] uppercase tracking-wider">
                Contact Number
              </label>
              <div className="relative">
                <FieldIcon>
                  <Phone className="h-[15px] w-[15px] text-[var(--gold)]" strokeWidth={1.75} />
                </FieldIcon>
                <Input
                  {...register('contactNumber')}
                  type="tel"
                  placeholder="Enter contact number"
                  error={!!errors.contactNumber}
                  className="pl-10 h-[44px] rounded-xl text-[13px]"
                  style={{
                    background: 'rgba(255,255,255,0.7)',
                    backdropFilter: 'blur(8px)',
                  }}
                />
              </div>
              {errors.contactNumber && (
                <p className="text-[11px] text-red-500 mt-0.5">{errors.contactNumber.message}</p>
              )}
            </div>
          </div>

          {/* ── Address ───────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-[var(--navy)] uppercase tracking-wider">
              Address
            </label>
            <div className="relative">
              <FieldIcon>
                <MapPin className="h-[15px] w-[15px] text-[var(--gold)]" strokeWidth={1.75} />
              </FieldIcon>
              <Input
                {...register('address')}
                type="text"
                placeholder="Enter organization address"
                error={!!errors.address}
                className="pl-10 h-[44px] rounded-xl text-[13px]"
                style={{
                  background: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(8px)',
                }}
              />
            </div>
            {errors.address && (
              <p className="text-[11px] text-red-500 mt-0.5">{errors.address.message}</p>
            )}
          </div>

          {/* ── Terms checkbox ────────────────────────────────────────────── */}
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-2.5">
              <Controller
                name="acceptTerms"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="acceptTerms"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-[2px] shrink-0"
                  />
                )}
              />
              <label
                htmlFor="acceptTerms"
                className="text-[11.5px] text-[var(--navy)]/80 font-medium leading-snug cursor-pointer"
              >
                I agree to the{' '}
                <a href="#" className="text-[var(--gold)] font-semibold hover:underline">
                  Terms & Conditions
                </a>
                {' '}and{' '}
                <a href="#" className="text-[var(--gold)] font-semibold hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>
            {errors.acceptTerms && (
              <p className="text-[11px] text-red-500 pl-[26px]">{errors.acceptTerms.message}</p>
            )}
          </div>

          {/* ── Submit — gold gradient button ─────────────────────────────── */}
          <Button
            type="submit"
            variant="gold"
            isLoading={isSubmitting}
            className="w-full h-[50px] rounded-xl font-bold text-[15px] mt-1 tracking-wide shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all group"
          >
            Register
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          {/* ── Divider ───────────────────────────────────────────────────── */}
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
            <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-widest shrink-0">
              or continue with
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
          </div>

          {/* ── Social Login — icon pill style ────────────────────────────── */}
          <div className="grid grid-cols-3 gap-2.5">

            {/* Google */}
            <button
              type="button"
              className="flex items-center justify-center gap-2 h-[42px] rounded-xl text-[12px] font-bold text-[var(--navy)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'rgba(255,255,255,0.8)',
                border:     '1px solid rgba(220,213,197,0.8)',
                boxShadow:  '0 2px 8px rgba(16,42,67,0.06)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <GoogleIcon className="w-4 h-4 shrink-0" />
              <span>Google</span>
            </button>

            {/* Microsoft */}
            <button
              type="button"
              className="flex items-center justify-center gap-2 h-[42px] rounded-xl text-[12px] font-bold text-[var(--navy)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'rgba(255,255,255,0.8)',
                border:     '1px solid rgba(220,213,197,0.8)',
                boxShadow:  '0 2px 8px rgba(16,42,67,0.06)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <MicrosoftIcon className="w-4 h-4 shrink-0" />
              <span>Microsoft</span>
            </button>

            {/* SSO */}
            <button
              type="button"
              className="flex items-center justify-center gap-2 h-[42px] rounded-xl text-[12px] font-bold text-[var(--navy)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'rgba(184,134,44,0.08)',
                border:     '1px solid rgba(184,134,44,0.3)',
                boxShadow:  '0 2px 8px rgba(184,134,44,0.08)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <ShieldCheck className="w-4 h-4 shrink-0 text-[var(--gold)]" strokeWidth={1.75} />
              <span>SSO</span>
            </button>

          </div>

          {/* ── Sign in link ──────────────────────────────────────────────── */}
          <p className="text-center text-[12px] text-[var(--text-secondary)] font-medium mt-1">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-[var(--gold)] font-bold hover:underline underline-offset-2"
            >
              Sign in here
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
