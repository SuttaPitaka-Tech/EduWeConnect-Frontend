import { Mail, Linkedin, Twitter, Youtube } from 'lucide-react'
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
  return (
    <footer className="relative w-full overflow-hidden bg-[var(--deep-navy)] text-[var(--cream)]">

      {/* Background image overlay — 100% crisp & clear */}
      <div
        className="absolute inset-0 z-0 bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: `url(${footerBg})` }}
      />

      {/* Content Container */}
      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6 lg:px-12 flex flex-col pt-10">

        {/* ── CTA Banner (Centered in the same row) ────────────────────── */}
        <div className="flex justify-center pb-8 w-full text-center">
          <div className="max-w-2xl text-center">
            <h2 className="text-3xl md:text-[2.5rem] font-serif font-bold text-[var(--cream)] mb-2.5 leading-tight">
              Bring your campus onto one system.
            </h2>
            <p className="text-[var(--cream)] opacity-90 font-medium leading-relaxed max-w-[540px] text-[15px] mx-auto">
              Start with a pilot for one class or department — most schools are fully onboarded within a few weeks.
            </p>
          </div>
        </div>

        {/* ── Horizontal rule ───────────────────────────────────────────── */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--light-gold)]/40 to-transparent my-2" />

        {/* ── Logo + Links (Centered row) ───────────────────────────────── */}
        <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-12 lg:gap-24 py-10 w-full max-w-[1000px] mx-auto">

          {/* Brand column */}
          <div className="max-w-[320px] flex flex-col items-center lg:items-start text-center lg:text-left">
            <img
              src={eduLogo}
              alt="EduWeConnect"
              className="h-[64px] md:h-[76px] w-auto object-contain mb-4 mt-1 brightness-0 invert opacity-95 -ml-2"
            />
            <p className="text-[var(--cream)] opacity-85 text-[13.5px] font-medium leading-[1.7] mb-6">
              A product by Sutta Pitaka Tech. One system for communication, academics, and administration — built for schools and colleges.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {SOCIAL_ICONS.map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="flex items-center justify-center w-[36px] h-[36px] rounded-full border border-[var(--light-gold)]/40 text-[var(--light-gold)] hover:bg-[var(--gold)] hover:text-white hover:border-[var(--gold)] transition-all"
                >
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 lg:gap-16 pt-2">

            <div className="flex flex-col gap-3">
              <h4 className="text-[var(--light-gold)] font-bold text-[13.5px] uppercase tracking-wider mb-2">Product</h4>
              {PRODUCT_LINKS.map((l) => (
                <a key={l.label} href={l.href} className="text-[var(--cream)] opacity-80 hover:opacity-100 hover:text-[var(--light-gold)] text-[14px] font-medium transition-all">
                  {l.label}
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-[var(--light-gold)] font-bold text-[13.5px] uppercase tracking-wider mb-2">Company</h4>
              {COMPANY_LINKS.map((l) => (
                <a key={l.label} href={l.href} className="text-[var(--cream)] opacity-80 hover:opacity-100 hover:text-[var(--light-gold)] text-[14px] font-medium transition-all">
                  {l.label}
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-[var(--light-gold)] font-bold text-[13.5px] uppercase tracking-wider mb-2">Legal</h4>
              {LEGAL_LINKS.map((l) => (
                <a key={l.label} href={l.href} className="text-[var(--cream)] opacity-80 hover:opacity-100 hover:text-[var(--light-gold)] text-[14px] font-medium transition-all">
                  {l.label}
                </a>
              ))}
            </div>

          </div>
        </div>

        {/* ── Copyright ─────────────────────────────────────────────────── */}
        <div className="border-t border-white/10 py-5 w-full">
          <p className="text-[var(--cream)] opacity-70 text-[12.5px] font-medium tracking-wide">
            © 2026 Sutta Pitaka Tech. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  )
}
