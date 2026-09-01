import { Link } from 'react-router-dom'
import { registerBg, eduLogo, lotusLarge } from '@/assets/images'
import { 
  UserPlus, ChevronDown, User, Mail, Lock, Eye, ArrowRight,
  ShieldCheck, CheckCircle, Headphones, Users, UserCheck, Building
} from 'lucide-react'

// Simple SVG for Google
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

// Simple SVG for Microsoft
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

export default function RegisterPage() {
  return (
    <div className="relative flex flex-col min-h-screen w-full overflow-hidden bg-[var(--cream)]">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-no-repeat bg-center"
        style={{ 
          backgroundImage: `url(${registerBg})`,
          backgroundSize: '100% 100%'
        }}
      />
      
      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex items-center justify-center w-full px-4 py-8">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20 w-full max-w-[1100px]">
          
          {/* LEFT COLUMN: Branding & Info */}
          <div className="flex flex-col items-center text-center flex-1 max-w-[420px] pt-4 lg:pt-0">
            {/* Logo area */}
            <div className="mb-6 flex flex-col items-center w-full">
              {/* Either use the raw text structure or the logo if the user updated it */}
              <img src={eduLogo} alt="EduWeConnect Logo" className="h-[140px] md:h-[180px] w-auto object-contain drop-shadow-sm mb-4" />
              
              <div className="flex items-center gap-4 w-full mb-4">
                <div className="h-[1px] flex-1 bg-[var(--gold)]/40" />
                <span className="text-[var(--navy)] font-semibold text-[14px]">Education Management System</span>
                <div className="h-[1px] flex-1 bg-[var(--gold)]/40" />
              </div>
              
              <p className="text-[var(--navy)]/90 font-medium text-[14px] max-w-[320px]">
                Join a unified platform to learn, manage<br />and grow together.
              </p>
            </div>

            {/* Feature Icons Row */}
            <div className="flex items-start justify-center gap-4 w-full mb-8">
              <div className="flex flex-col items-center text-center w-[90px]">
                <Users className="w-6 h-6 text-[var(--navy)] mb-2" strokeWidth={1.5} />
                <h4 className="text-[var(--navy)] font-bold text-[13px] mb-1">Students</h4>
                <p className="text-[var(--navy)]/70 text-[11px] leading-snug">Learn. Explore.<br />Achieve.</p>
              </div>
              
              <div className="w-[1px] h-[50px] bg-[var(--navy)]/20 mt-2" />
              
              <div className="flex flex-col items-center text-center w-[90px]">
                <UserCheck className="w-6 h-6 text-[var(--navy)] mb-2" strokeWidth={1.5} />
                <h4 className="text-[var(--navy)] font-bold text-[13px] mb-1">Staff</h4>
                <p className="text-[var(--navy)]/70 text-[11px] leading-snug">Manage. Support.<br />Empower.</p>
              </div>

              <div className="w-[1px] h-[50px] bg-[var(--navy)]/20 mt-2" />

              <div className="flex flex-col items-center text-center w-[90px]">
                <Building className="w-6 h-6 text-[var(--navy)] mb-2" strokeWidth={1.5} />
                <h4 className="text-[var(--navy)] font-bold text-[13px] mb-1">Organizations</h4>
                <p className="text-[var(--navy)]/70 text-[11px] leading-snug">Collaborate.<br />Monitor. Excel.</p>
              </div>
            </div>

            {/* Quote */}
            <div className="relative mt-2 px-6">
              <span className="absolute top-0 left-0 text-3xl text-[var(--gold)] opacity-50 font-serif leading-none">"</span>
              <p className="text-[var(--navy)]/90 italic font-serif text-[15px] leading-relaxed">
                The goal of education is not just<br />knowledge, but character and purpose. <span className="text-[var(--gold)] opacity-50 font-serif text-xl leading-none">"</span>
              </p>
              <p className="text-[var(--navy)]/80 text-[12px] font-bold mt-2">— Buddha</p>
            </div>
            
            <img src={lotusLarge} alt="lotus" className="w-[36px] h-auto object-contain mt-6 opacity-70" />
          </div>

          {/* RIGHT COLUMN: Form Card */}
          <div className="w-full max-w-[480px]">
            <div className="bg-[#FFFDF8]/95 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border border-white/50">
              
              {/* Header */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-[var(--border)] mb-3">
                  <UserPlus className="w-5 h-5 text-[var(--navy)]" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-[var(--navy)] mb-1">Create Your Account</h3>
                <p className="text-[var(--text-secondary)] text-[13px] font-medium">Register to become a part of EduWeConnect</p>
                <img src={lotusLarge} alt="lotus divider" className="w-[30px] h-auto object-contain mt-3 opacity-60" />
              </div>

              {/* Form */}
              <form className="flex flex-col gap-4">
                {/* User Type */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-[var(--navy)]">User Type</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-[var(--text-secondary)]" strokeWidth={1.5} />
                    </div>
                    <select className="appearance-none w-full pl-10 pr-10 py-2.5 bg-transparent border border-[var(--border)] rounded-xl text-[13px] text-[var(--navy)] focus:outline-none focus:border-[var(--gold)] transition-colors cursor-pointer bg-white/50">
                      <option value="">Select User Type</option>
                      <option value="student">Student</option>
                      <option value="staff">Staff/Teacher</option>
                      <option value="admin">Administrator</option>
                      <option value="parent">Parent</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-[var(--text-secondary)]" />
                    </div>
                  </div>
                </div>

                {/* Name and Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-bold text-[var(--navy)]">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-[var(--text-secondary)]" strokeWidth={1.5} />
                      </div>
                      <input type="text" placeholder="Enter full name" className="w-full pl-10 pr-4 py-2.5 bg-transparent border border-[var(--border)] rounded-xl text-[13px] text-[var(--navy)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)] transition-colors bg-white/50" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-bold text-[var(--navy)]">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-[var(--text-secondary)]" strokeWidth={1.5} />
                      </div>
                      <input type="email" placeholder="Enter email address" className="w-full pl-10 pr-4 py-2.5 bg-transparent border border-[var(--border)] rounded-xl text-[13px] text-[var(--navy)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)] transition-colors bg-white/50" />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-[var(--navy)]">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-[var(--text-secondary)]" strokeWidth={1.5} />
                    </div>
                    <input type="password" placeholder="Create a strong password" className="w-full pl-10 pr-10 py-2.5 bg-transparent border border-[var(--border)] rounded-xl text-[13px] text-[var(--navy)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)] transition-colors bg-white/50" />
                    <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-secondary)] hover:text-[var(--navy)] transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-[var(--navy)]">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-[var(--text-secondary)]" strokeWidth={1.5} />
                    </div>
                    <input type="password" placeholder="Confirm your password" className="w-full pl-10 pr-10 py-2.5 bg-transparent border border-[var(--border)] rounded-xl text-[13px] text-[var(--navy)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)] transition-colors bg-white/50" />
                    <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-secondary)] hover:text-[var(--navy)] transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Checkbox */}
                <div className="flex items-start gap-2.5 mt-1">
                  <input type="checkbox" className="mt-[2px] h-3.5 w-3.5 rounded border-[var(--border)] text-[var(--navy)] focus:ring-[var(--gold)]" />
                  <label className="text-[11px] text-[var(--navy)] font-medium leading-tight">
                    I agree to the <a href="#" className="text-[var(--gold)] hover:underline">Terms & Conditions</a> and <a href="#" className="text-[var(--gold)] hover:underline">Privacy Policy</a>
                  </label>
                </div>

                {/* Submit Button */}
                <button type="button" className="w-full flex items-center justify-center gap-2 bg-[#102A43] hover:bg-[#0B1F33] text-white py-3 rounded-xl font-bold text-[14px] transition-all shadow-md mt-1 group">
                  Create Account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Divider */}
                <div className="relative flex items-center justify-center mt-2 mb-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[var(--border)]" />
                  </div>
                  <div className="relative bg-[#FFFDF8] px-3 text-[11px] font-medium text-[var(--text-secondary)]">
                    or register with
                  </div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-3 gap-3">
                  <button type="button" className="flex items-center justify-center gap-1.5 py-2.5 bg-white border border-[var(--border)] rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-[12px] font-bold text-[var(--navy)]">
                    <GoogleIcon className="w-3.5 h-3.5" /> Google
                  </button>
                  <button type="button" className="flex items-center justify-center gap-1.5 py-2.5 bg-white border border-[var(--border)] rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-[12px] font-bold text-[var(--navy)]">
                    <MicrosoftIcon className="w-3.5 h-3.5" /> Microsoft
                  </button>
                  <button type="button" className="flex items-center justify-center gap-1.5 py-2.5 bg-white border border-[var(--border)] rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-[12px] font-bold text-[var(--navy)]">
                    <ShieldCheck className="w-3.5 h-3.5 text-gray-700" strokeWidth={1.5} /> SSO
                  </button>
                </div>

                <div className="text-center mt-2">
                  <span className="text-[12px] text-[var(--text-secondary)] font-medium">
                    Already have an account? <Link to="/login" className="text-[var(--gold)] hover:underline font-bold">Login here</Link>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Footer Bar */}
      <div className="relative z-20 w-full bg-[#0B1F33] py-4 px-6 md:px-12 mt-auto">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[#F7F1E3]/70 text-[11.5px] font-medium">
          
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[var(--gold)]" /> Secure</span>
            <span className="w-px h-3 bg-[#F7F1E3]/20" />
            <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[var(--gold)]" /> Reliable</span>
            <span className="w-px h-3 bg-[#F7F1E3]/20" />
            <span className="flex items-center gap-1.5"><Headphones className="w-3.5 h-3.5 text-[var(--gold)]" /> 24/7 Support</span>
          </div>

          <div className="flex items-center gap-2 hidden lg:flex">
            <img src={lotusLarge} alt="lotus" className="w-3.5 h-3.5 brightness-0 invert opacity-60" />
            <span>Building a better future through knowledge and innovation.</span>
          </div>

          <div>
            © 2025 Sutta Pitaka Tech. All rights reserved.
          </div>
          
        </div>
      </div>
    </div>
  )
}
