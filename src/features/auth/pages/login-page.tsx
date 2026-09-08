import { useState } from 'react'
import { registerBg, eduLogo, lotusLarge } from '@/assets/images'
import { Users, UserCheck, Building, X, ShieldAlert, Eye, EyeOff } from 'lucide-react'
import { LoginForm } from '../components/login-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui'
import { API_GATEWAY_URL } from '@/config/api.config'

/**
 * LoginPage — same layout as RegisterPage.
 * Full-screen bg image + left branding column + right form card.
 */
export default function LoginPage() {
  const [isSuperAdminOpen, setIsSuperAdminOpen] = useState(false)
  const [superEmail, setSuperEmail] = useState('')
  const [superMobile, setSuperMobile] = useState('')
  const [superPassword, setSuperPassword] = useState('')
  const [superConfirmPassword, setSuperConfirmPassword] = useState('')
  const [showSuperPass, setShowSuperPass] = useState(false)
  const [showSuperConfirmPass, setShowSuperConfirmPass] = useState(false)

  const handleSuperAdminRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (superPassword !== superConfirmPassword) {
      toast.error("Passwords do not match!")
      return
    }

    try {
      const response = await fetch(`${API_GATEWAY_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: superEmail,
          password: superPassword,
          mobile_number: superMobile,
        })
      });
      if (!response.ok) throw new Error('Registration failed');

      setSuperEmail('')
      setSuperMobile('')
      setSuperPassword('')
      setSuperConfirmPassword('')
      setIsSuperAdminOpen(false)
      toast.success("Superadmin registered successfully! You can now log in.")
    } catch (err) {
      toast.error("Failed to register superadmin.")
    }
  }

  return (
    <div className="relative flex flex-col min-h-screen w-full overflow-hidden bg-[var(--cream)]">
      {/* Top Bar for Superadmin */}
      <div className="absolute top-4 right-4 z-50">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsSuperAdminOpen(true)}
          className="bg-white/80 backdrop-blur-md border-[var(--gold)]/50 text-[var(--navy)] hover:bg-[var(--gold)]/10 font-semibold text-xs h-8"
        >
          <ShieldAlert className="w-3.5 h-3.5 mr-1.5 text-[var(--gold)]" />
          Superadmin Register
        </Button>
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
      <div className="relative z-10 flex-1 flex items-start justify-center w-full px-4 pt-20 pb-6">
        <div className="flex flex-col lg:flex-row items-start justify-center gap-10 lg:gap-20 w-full max-w-[1100px]">

          {/* LEFT COLUMN: Branding & Info */}
          <div className="flex flex-col items-center text-center flex-1 max-w-[420px] pt-2 lg:pt-0">
            {/* Logo area */}
            <div className="flex flex-col items-center justify-center w-full mb-3">
              <img src={eduLogo} alt="EduWeConnect Logo" className="h-[120px] md:h-[150px] w-auto object-contain drop-shadow-sm" />
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
                Sign in to access your dashboard,<br />manage records and stay connected.
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
          <div className="w-full max-w-[420px] -mt-6 lg:-mt-8">

            {/* Card Header */}
            <div className="flex flex-col items-center text-center mb-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-[var(--border)] mb-1.5">
                <svg className="w-4 h-4 text-[var(--navy)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <h1 className="text-xl md:text-2xl font-serif font-bold text-[var(--navy)] mb-0.5">Welcome Back</h1>
              <p className="text-[var(--text-secondary)] text-[12.5px] font-medium">Sign in to your EduWeConnect account</p>
            </div>

            {/* Form component */}
            <LoginForm />
          </div>

        </div>
      </div>

      {/* Superadmin Register Modal */}
      {isSuperAdminOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-[var(--navy)]/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSuperAdminOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up border border-[var(--gold)]/20">
            {/* Header */}
            <div className="bg-[var(--navy)] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[var(--gold)]" />
                <h2 className="text-white font-bold text-lg">Superadmin Registration</h2>
              </div>
              <button 
                onClick={() => setIsSuperAdminOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-[13px] text-[var(--text-secondary)] mb-5">
                Register a new superadmin account. This action requires elevated privileges.
              </p>

              <form onSubmit={handleSuperAdminRegister} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-[var(--navy)] uppercase tracking-wider">
                    Email Address
                  </label>
                  <Input 
                    type="email" 
                    required
                    placeholder="superadmin@eduweconnect.com"
                    value={superEmail}
                    onChange={(e) => setSuperEmail(e.target.value)}
                    className="h-10 text-[13px]"
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-[var(--navy)] uppercase tracking-wider">
                    Mobile Number
                  </label>
                  <Input 
                    type="text" 
                    required
                    placeholder="Enter mobile number"
                    value={superMobile}
                    onChange={(e) => setSuperMobile(e.target.value)}
                    className="h-10 text-[13px]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-[var(--navy)] uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <Input 
                      type={showSuperPass ? 'text' : 'password'} 
                      required
                      placeholder="Enter secure password"
                      value={superPassword}
                      onChange={(e) => setSuperPassword(e.target.value)}
                      className="h-10 text-[13px] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSuperPass(!showSuperPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--gold)]"
                    >
                      {showSuperPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-[var(--gold)]" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-[var(--navy)] uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input 
                      type={showSuperConfirmPass ? 'text' : 'password'} 
                      required
                      placeholder="Confirm your password"
                      value={superConfirmPassword}
                      onChange={(e) => setSuperConfirmPassword(e.target.value)}
                      className="h-10 text-[13px] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSuperConfirmPass(!showSuperConfirmPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--gold)]"
                    >
                      {showSuperConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-[var(--gold)]" />}
                    </button>
                  </div>
                </div>

                <div className="mt-2 flex justify-end gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsSuperAdminOpen(false)}
                    className="text-[13px]"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="gold"
                    className="text-[13px] font-bold"
                  >
                    Register
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
