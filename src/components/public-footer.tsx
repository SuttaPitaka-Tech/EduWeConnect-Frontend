import { useNavigate } from 'react-router-dom'
import { ArrowRight, Mail, Linkedin, Twitter, Youtube } from 'lucide-react'
import { Button } from '@/components/ui'
import { eduLogo, footerBg } from '@/assets/images'

const PRODUCT_LINKS = [
  { label: 'Features',        href: '#features' },
  { label: 'Product tour',    href: '#product' },
  { label: 'For your campus', href: '#campus' },
]

const COMPANY_LINKS = [
  { label: 'About',    href: '#' },
  { label: 'Contact',  href: '#contact' },
  { label: 'Careers',  href: '#' },
]

const LEGAL_LINKS = [
  { label: 'Privacy policy',   href: '#' },
  { label: 'Terms of service', href: '#' },
]

const SOCIAL_ICONS = [Mail, Linkedin, Twitter, Youtube]

/**
 * PublicFooter — shared navy footer for all public-facing pages.
 * Used inside PublicLayout. Do NOT duplicate inside individual pages.
 * Design tokens only — zero hardcoded hex.
 */
export function PublicFooter() {
  const navigate = useNavigate()

  return (
    <footer className="relative w-full overflow-hidden bg-[var(--deep-navy)]">

      {/* Background image overlay */}
      <div
        className="absolute inset-0 z-0 bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: `url(${footerBg})` }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 lg:px-12 flex flex-col pt-8">

        {/* ── CTA Banner ───────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20 pb-6 md:px-24">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-3xl md:text-[2.5rem] font-serif font-bold text-[var(--footer-text)] mb-3">
              Bring your campus onto one system.
            </h2>
            <p className="text-[var(--footer-text)]/80 font-medium leading-relaxed max-w-[420px] text-[15px]">
              Start with a pilot for one class or department — most schools are fully onboarded within a few weeks.
            </p>
          </div>
          <Button
            variant="gold"
            onClick={() => navigate('/register')}
            className="rounded-md font-semibold px-8 h-[52px] text-[15px] shadow-md shrink-0"
          >
            Get started now <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        {/* ── Horizontal rule ───────────────────────────────────────────── */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--footer-accent)]/30 to-transparent my-2" />

        {/* ── Logo + Links ──────────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row justify-center lg:justify-between gap-12 py-8 md:px-24">

          {/* Brand column */}
          <div className="max-w-[280px]">
            <img
              src={eduLogo}
              alt="EduWeConnect"
              className="h-[64px] md:h-[76px] w-auto object-contain mb-4 mt-2 brightness-0 invert opacity-90 -ml-2"
            />
            <p className="text-[var(--footer-text)]/70 text-[13px] font-medium leading-[1.7] mb-8">
              A product by Sutta Pitaka Tech. One system for communication, academics, and administration — built for schools and colleges.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {SOCIAL_ICONS.map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="flex items-center justify-center w-[36px] h-[36px] rounded-full border border-[var(--footer-text)]/20 text-[var(--footer-text)]/80 hover:bg-[var(--footer-text)]/10 hover:text-white transition-all"
                >
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 lg:gap-20 pt-2">

            <div className="flex flex-col gap-3">
              <h4 className="text-white font-bold text-[15px] mb-2">Product</h4>
              {PRODUCT_LINKS.map((l) => (
                <a key={l.label} href={l.href} className="text-[var(--footer-text)]/70 hover:text-white text-[14px] font-medium transition-colors">
                  {l.label}
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-white font-bold text-[15px] mb-2">Company</h4>
              {COMPANY_LINKS.map((l) => (
                <a key={l.label} href={l.href} className="text-[var(--footer-text)]/70 hover:text-white text-[14px] font-medium transition-colors">
                  {l.label}
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-white font-bold text-[15px] mb-2">Legal</h4>
              {LEGAL_LINKS.map((l) => (
                <a key={l.label} href={l.href} className="text-[var(--footer-text)]/70 hover:text-white text-[14px] font-medium transition-colors">
                  {l.label}
                </a>
              ))}
            </div>

          </div>
        </div>

        {/* ── Copyright ─────────────────────────────────────────────────── */}
        <div className="border-t border-[var(--footer-text)]/10 py-4 text-center lg:text-left md:px-24">
          <p className="text-[var(--footer-text)]/40 text-[12px] font-medium tracking-wide">
            © 2026 Sutta Pitaka Tech. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  )
}
