import { registerBg, eduLogo, lotusLarge } from '@/assets/images'
import { Users, UserCheck, Building } from 'lucide-react'
import { RegisterForm } from '../components/register-form'


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
      <div className="relative z-10 flex-1 flex items-center justify-center w-full px-4 py-4 md:py-6">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20 w-full max-w-[1100px]">

          {/* LEFT COLUMN: Branding & Info */}
          <div className="flex flex-col items-center text-center flex-1 max-w-[420px] pt-2 lg:pt-0">
            {/* Logo area */}
            <div className="mb-5 flex flex-col items-center w-full">
              <img src={eduLogo} alt="EduWeConnect Logo" className="h-[130px] md:h-[160px] w-auto object-contain drop-shadow-sm mb-3" />

              <div className="flex items-center gap-4 w-full mb-3">
                <div className="h-[1px] flex-1 bg-[var(--gold)]/40" />
                <span className="text-[var(--navy)] font-semibold text-[14px]">Education Management System</span>
                <div className="h-[1px] flex-1 bg-[var(--gold)]/40" />
              </div>

              <p className="text-[var(--navy)]/90 font-medium text-[14px] max-w-[320px]">
                Join a unified platform to learn, manage<br />and grow together.
              </p>
            </div>

            {/* Feature Icons Row */}
            <div className="flex items-start justify-center gap-4 w-full mb-6">
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
            <div className="relative mt-1 px-6">
              <span className="absolute top-0 left-0 text-3xl text-[var(--gold)] opacity-50 font-serif leading-none">"</span>
              <p className="text-[var(--navy)]/90 italic font-serif text-[14px] leading-relaxed">
                The goal of education is not just<br />knowledge, but character and purpose.{' '}
                <span className="text-[var(--gold)] opacity-50 font-serif text-xl leading-none">"</span>
              </p>
              <p className="text-[var(--navy)]/80 text-[12px] font-bold mt-1.5">— Buddha</p>
            </div>

            <img src={lotusLarge} alt="lotus" className="w-[32px] h-auto object-contain mt-4 opacity-70" />
          </div>

          {/* RIGHT COLUMN: Form Card — thin container only */}
          <div className="w-full max-w-[480px]">

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
