import { eduLogo } from '@/assets/images'

/**
 * AppFooter — minimal navy footer for all authenticated app pages.
 * Used inside DashboardLayout.
 * Intentionally compact — does not repeat PublicFooter's full marketing layout.
 */
export function AppFooter() {
  return (
    <footer
      className="w-full shrink-0"
      style={{ background: 'var(--navy)' }}
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-8 h-[40px] flex items-center justify-between">

        {/* Left: branding */}
        <div className="flex items-center gap-2.5">
          <img
            src={eduLogo}
            alt="EduWeConnect"
            className="h-[22px] w-auto object-contain brightness-0 invert opacity-60"
          />
        </div>

        {/* Right: copyright */}
        <p className="text-[11px] font-medium" style={{ color: 'rgba(247,241,227,0.40)' }}>
          © 2026 Sutta Pitaka Tech. All rights reserved.
        </p>

      </div>
    </footer>
  )
}
