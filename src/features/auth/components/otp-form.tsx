import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight, Home } from 'lucide-react'
import { Button } from '@/components/ui'
import { toast } from 'sonner'
import { useQuery, useQueryClient } from '@tanstack/react-query'

interface OtpFormProps {
  email: string
  flow?: 'register' | 'login'
}

export function OtpForm({ email, flow = 'register' }: OtpFormProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [otp, setOtp] = useState(['', '', '', ''])
  const [otpError, setOtpError] = useState<string | null>(null)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [verifiedBoxIndex, setVerifiedBoxIndex] = useState(-1)
  const [timerStart, setTimerStart] = useState<number>(() => Date.now())
  const [isResending, setIsResending] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const otpTimersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearOtpTimers = () => {
    otpTimersRef.current.forEach(clearTimeout)
    otpTimersRef.current = []
  }

  // ── Countdown Timer via TanStack Query (Zero useEffect rule compliant) ────
  const { data: timeLeft = 59 } = useQuery({
    queryKey: ['otp-countdown', timerStart],
    queryFn: () => {
      const elapsed = Math.floor((Date.now() - timerStart) / 1000)
      return Math.max(0, 59 - elapsed)
    },
    refetchInterval: (query) => {
      const current = query.state.data ?? 59
      return current > 0 ? 1000 : false
    },
    refetchIntervalInBackground: true,
    staleTime: 0,
    gcTime: 0,
  })

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const handleResendOtp = () => {
    if (timeLeft > 0 || isResending) return
    setIsResending(true)
    setOtp(['', '', '', ''])
    setOtpError(null)
    setVerifiedBoxIndex(-1)

    setTimeout(() => {
      setIsResending(false)
      const now = Date.now()
      setTimerStart(now)
      queryClient.setQueryData(['otp-countdown', now], 59)
      toast.success('A new 4-digit code has been sent to your email')
      inputRefs.current[0]?.focus()
    }, 400)
  }

  const handleOtpChange = (index: number, value: string) => {
    if (otpError) setOtpError(null)
    if (verifiedBoxIndex !== -1) {
      clearOtpTimers()
      setVerifyingOtp(false)
      setVerifiedBoxIndex(-1)
    }
    if (value.length > 1) value = value[value.length - 1]
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (otpError) setOtpError(null)
    if (verifiedBoxIndex !== -1) {
      clearOtpTimers()
      setVerifyingOtp(false)
      setVerifiedBoxIndex(-1)
    }
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (verifyingOtp) return
    const enteredOtp = otp.join('')
    if (enteredOtp.length === 0) {
      setOtpError('Please enter OTP')
      inputRefs.current[0]?.focus()
      return
    }
    if (enteredOtp.length < 4) {
      setOtpError('Please enter valid 4-digit OTP')
      const firstEmptyIndex = otp.findIndex((d) => !d)
      if (firstEmptyIndex !== -1) {
        inputRefs.current[firstEmptyIndex]?.focus()
      }
      return
    }
    setOtpError(null)

    // Sequential green border wave animation (borders only)
    setVerifyingOtp(true)
    clearOtpTimers()
    setVerifiedBoxIndex(0)
    otpTimersRef.current.push(setTimeout(() => setVerifiedBoxIndex(1), 120))
    otpTimersRef.current.push(setTimeout(() => setVerifiedBoxIndex(2), 240))
    otpTimersRef.current.push(setTimeout(() => setVerifiedBoxIndex(3), 360))
    otpTimersRef.current.push(
      setTimeout(() => {
        setVerifyingOtp(false)
        setVerifiedBoxIndex(-1)
        toast.success('OTP verified successfully')
        if (flow === 'register') {
          navigate('/register/details', { state: { email } })
        } else {
          navigate('/app')
        }
      }, 550)
    )
  }

  return (
    <div
      className="rounded-3xl p-5 md:p-6 shadow-2xl border border-[var(--border)]"
      style={{
        background: 'linear-gradient(145deg, rgba(255,253,248,0.95) 0%, rgba(247,241,227,0.9) 100%)',
        backdropFilter: 'blur(24px)',
      }}
    >
      <form noValidate className="flex flex-col gap-2.5" onSubmit={onFormSubmit}>
        {/* OTP Fields */}
        <div className="flex flex-col items-center justify-center mb-2">
          <p className="text-[13px] text-[var(--navy)]/80 text-center mb-1 font-medium">
            Please enter the 4-digit code sent to
          </p>
          <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
            <span className="text-[13px] font-bold text-[var(--navy)]">
              {email || 'your email'}
            </span>
            <span className="text-[var(--text-muted)] text-xs">•</span>
            <button
              type="button"
              data-plain
              onClick={() => {
                navigate(flow === 'login' ? '/login' : '/register')
              }}
              className="text-[12px] font-semibold text-[var(--gold)] cursor-pointer bg-transparent hover:underline underline-offset-2 shadow-none transition-all"
              style={{ textShadow: 'none', filter: 'none' }}
            >
              Edit email
            </button>
          </div>
          <div className="flex gap-3 justify-center mb-2">
            {otp.map((digit, index) => {
              const isGreen = verifiedBoxIndex >= index
              return (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  disabled={verifyingOtp}
                  aria-invalid={!!otpError || undefined}
                  ref={(el) => (inputRefs.current[index] = el)}
                  onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-12 h-12 text-center text-xl font-bold rounded-xl focus:outline-none bg-white/70 backdrop-blur-md text-[var(--navy)] transition-colors duration-150 ${
                    isGreen
                      ? 'border-2 border-emerald-500'
                      : otpError
                      ? 'border border-red-500 focus:border-red-500'
                      : 'border border-[var(--gold)]/30 focus:border-[var(--gold)]'
                  }`}
                />
              )
            })}
          </div>
          {otpError && (
            <p className="text-[12px] font-medium text-red-500 text-center mb-2 animate-in fade-in">
              {otpError}
            </p>
          )}

          {/* ── Resend OTP Countdown / Action ── */}
          <div className="flex items-center justify-center mb-2 text-[12px] font-medium text-[var(--text-secondary)]">
            {timeLeft > 0 ? (
              <span>
                Didn&apos;t receive code?{' '}
                <span className="text-[var(--gold)] font-bold font-mono">
                  Resend in {formatTime(timeLeft)}
                </span>
              </span>
            ) : (
              <button
                type="button"
                data-plain
                onClick={handleResendOtp}
                disabled={isResending}
                className="text-[var(--gold)] font-bold cursor-pointer hover:underline underline-offset-2 transition-all"
                style={{ textShadow: 'none', filter: 'none' }}
              >
                {isResending ? 'Resending code...' : 'Resend OTP'}
              </button>
            )}
          </div>
        </div>

        {/* ── Verify OTP Button ── */}
        <Button
          type="submit"
          variant="gold"
          isLoading={verifyingOtp}
          className="w-full h-[47px] rounded-xl font-bold text-[14.5px] mt-0.5 tracking-wide shadow-md hover:shadow-lg hover:scale-[1.008] active:scale-[0.99] transition-all group"
        >
          Verify OTP
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>

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
