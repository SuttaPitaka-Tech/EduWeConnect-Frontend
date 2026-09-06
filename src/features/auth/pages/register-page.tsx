import { registerBg, eduLogo, lotusLarge } from '@/assets/images'
import { Users, UserCheck, Building } from 'lucide-react'
import { RegisterForm } from '../components/register-form'


export default function RegisterPage() {
  return (
    <div className="relative flex flex-col min-h-screen w-full overflow-hidden bg-[var(--cream)]">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-no-repeat bg-center blur-[2px] scale-105"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.15)), url(${registerBg})`,
          backgroundSize: '100% 100%'
        }}
      />

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex items-center justify-center w-full px-4 py-4 md:py-6">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20 w-full max-w-[1100px]">

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
                Join a unified platform to learn, manage<br />and grow together.
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

          {/* RIGHT COLUMN: Form Card — thin container only */}
          <div className="w-full max-w-[456px] -mt-6 md:-mt-10">

            {/* Card Header */}
            <div className="flex flex-col items-center text-center mb-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-[var(--border)] mb-1.5">
                <svg className="w-4 h-4 text-[var(--navy)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h1 className="text-xl md:text-2xl font-serif font-bold text-[var(--navy)] mb-0.5">Create Your Account</h1>
              <p className="text-[var(--text-secondary)] text-[12.5px] font-medium">Register to become a part of EduWeConnect</p>
            </div>

            {/* Pure form component */}
            <RegisterForm />
          </div>

        </div>
      </div>
    </div>
  )
}
