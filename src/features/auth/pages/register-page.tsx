import { registerBg, eduLogo } from '@/assets/images'
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

          </div>

          {/* RIGHT COLUMN: Form Card — thin container only */}
          <div className="w-full max-w-[456px] -mt-10 md:-mt-14">

            {/* Card Header */}
            <div className="flex flex-col items-center text-center mb-2">
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
