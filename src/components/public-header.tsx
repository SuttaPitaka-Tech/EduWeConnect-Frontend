import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui'
import { eduLogo } from '@/assets/images'

/**
 * PublicHeader — shared sticky header for all public-facing pages.
 * Used inside PublicLayout. Do NOT duplicate inside individual pages.
 * Design tokens only — zero hardcoded hex.
 */
export function PublicHeader() {
  const navigate = useNavigate()

  return (
    <header className="w-full bg-[var(--cream)] sticky top-0 z-50 shadow-sm">
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8 lg:px-10 flex items-center justify-between">

        {/* Logo — Left */}
        <div className="flex items-center justify-start flex-1 shrink-0">
          <Link to="/">
            <img src={eduLogo} alt="EduWeConnect Logo" className="h-[76px] w-auto object-contain" />
          </Link>
        </div>

        {/* Navigation — Center */}
        <div className="hidden lg:flex items-center justify-center flex-[2] shrink-0">
          <nav className="flex items-center gap-10">
            <a href="#features" className="text-[15px] font-semibold text-[var(--navy)] hover:opacity-70 transition-opacity">Features</a>
            <a href="#product"  className="text-[15px] font-semibold text-[var(--navy)] hover:opacity-70 transition-opacity">Product</a>
            <a href="#campus"   className="text-[15px] font-semibold text-[var(--navy)] hover:opacity-70 transition-opacity">For your campus</a>
            <a href="#contact"  className="text-[15px] font-semibold text-[var(--navy)] hover:opacity-70 transition-opacity">Contact</a>
          </nav>
        </div>

        {/* Actions — Right */}
        <div className="flex items-center justify-end flex-1 shrink-0 gap-8">
          <Link to="/login" className="text-[15px] font-semibold text-[var(--navy)] hover:opacity-70 transition-opacity">
            Sign in
          </Link>
          <Button
            onClick={() => navigate('/register')}
            variant="primary"
            size="lg"
            className="rounded-md font-semibold px-7 shadow-sm"
          >
            Get started
          </Button>
        </div>

      </div>
    </header>
  )
}
