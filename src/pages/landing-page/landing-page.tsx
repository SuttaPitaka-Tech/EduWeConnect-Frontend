import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'
import { eduLogo, heroBg, lotusLarge, footerBg } from '@/assets/images'
import { 
  MessageSquare, Calendar, Bell, FileText, CheckCircle, GraduationCap, 
  FileSpreadsheet, UserPlus, Briefcase, IndianRupee, Camera, Gift,
  ArrowRight, Mail, Linkedin, Twitter, Youtube
} from 'lucide-react'

const MODULES = [
  { icon: MessageSquare, title: 'Chat & calls', desc: 'Message and call any student, teacher, or parent — no personal numbers required.', category: 'Communication' },
  { icon: Calendar, title: 'Calendar & scheduling', desc: 'Every class, meeting, and exam date lives on one shared calendar.', category: 'Communication' },
  { icon: Bell, title: 'Notifications', desc: 'Announcements and updates reach the right people, instantly.', category: 'Communication' },
  { icon: FileText, title: 'Notes, docs & recordings', desc: 'Class notes, resources, and recorded lessons, organized by subject.', category: 'Teaching' },
  { icon: CheckCircle, title: 'Attendance', desc: 'Mark attendance in seconds; parents see it the moment it\'s taken.', category: 'Teaching' },
  { icon: GraduationCap, title: 'Marks & report cards', desc: 'Grades update in real time, visible to students and parents alike.', category: 'Teaching' },
  { icon: FileSpreadsheet, title: 'Online tests', desc: 'Schedule, run, and grade tests without leaving the platform.', category: 'Teaching' },
  { icon: UserPlus, title: 'Admissions', desc: 'A public application form, and one dashboard to review every applicant.', category: 'Administration' },
  { icon: Briefcase, title: 'Recruitment', desc: 'Post openings and manage teaching and staff applications end to end.', category: 'Administration' },
  { icon: IndianRupee, title: 'Finance', desc: 'Track fees, dues, and receipts without a separate spreadsheet.', category: 'Administration' },
  { icon: Camera, title: 'Celebrations', desc: 'Share photos and mark the moments that matter to your campus.', category: 'Community' },
  { icon: Gift, title: 'Birthdays', desc: 'Never miss one — students, teachers, and staff alike.', category: 'Community' }
]

function Divider() {
  return (
    <div className="flex items-center justify-center py-6 mx-auto opacity-90">
      <img src={lotusLarge} alt="Divider" className="w-[280px] md:w-[400px] h-auto object-contain" />
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--cream)] flex flex-col font-sans">
      {/* Header */}
      <header className="w-full bg-[var(--cream)] sticky top-0 z-50 shadow-sm relative">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8 lg:px-10 py-0 flex items-center justify-between">
          
          {/* 1. Logo - Left */}
          <div className="flex items-center justify-start flex-1 shrink-0">
            <img src={eduLogo} alt="EduWeConnect Logo" className="h-[76px] w-auto object-contain" />
          </div>

          {/* 2. Navigation - Center */}
          <div className="hidden lg:flex items-center justify-center flex-[2] shrink-0">
            <nav className="flex items-center gap-10">
              <a href="#features" className="text-[15px] font-semibold text-[var(--navy)] hover:opacity-70 transition-opacity">Features</a>
              <a href="#product" className="text-[15px] font-semibold text-[var(--navy)] hover:opacity-70 transition-opacity">Product</a>
              <a href="#campus" className="text-[15px] font-semibold text-[var(--navy)] hover:opacity-70 transition-opacity">For your campus</a>
              <a href="#contact" className="text-[15px] font-semibold text-[var(--navy)] hover:opacity-70 transition-opacity">Contact</a>
            </nav>
          </div>

          {/* 3. Actions - Right */}
          <div className="flex items-center justify-end flex-1 shrink-0 gap-8">
            <Link to="/login" className="text-[15px] font-semibold text-[var(--navy)] hover:opacity-70 transition-opacity">
              Sign in
            </Link>
            <Button variant="primary" size="lg" className="rounded-md font-semibold px-7 shadow-sm">
              Get started
            </Button>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <main className="relative flex-1 flex flex-col w-full overflow-hidden bg-[var(--cream)]">
        {/* Background Image Layer */}
        <div 
          className="absolute inset-0 z-0 bg-no-repeat bg-cover bg-[center_right] md:bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        
        {/* Subtle Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#F7F1E3] via-[#F7F1E3]/50 to-transparent pointer-events-none md:w-[60%]" />

        {/* Hero Content Layer */}
        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 md:px-12 lg:px-20 pt-16 pb-20 md:pt-20 md:pb-24 lg:pt-24 lg:pb-32 flex items-center">
          
          <div className="max-w-2xl text-left">
            <h1 className="text-[2.75rem] md:text-5xl lg:text-[4rem] font-bold text-[var(--navy)] leading-[1.1] tracking-tight">
              The whole campus, <br /> running from <br />
              <span className="font-serif italic text-[var(--gold)] font-medium">one calm place.</span>
            </h1>
            
            <p className="mt-8 text-base md:text-lg text-[var(--navy)] opacity-90 leading-relaxed max-w-xl font-medium">
              EduWeConnect brings attendance, admissions, exams, finance, and everyday conversation into a single system – so your staff spend less time switching between tools and more time teaching.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button variant="primary" size="lg" className="rounded-md font-semibold px-8 h-[52px] text-[15px] shadow-sm">
                Get started
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-md font-semibold px-8 h-[52px] text-[15px] bg-transparent border-[1.5px] border-[var(--sand)] hover:bg-[var(--sand)]/10 text-[var(--navy)] transition-all"
              >
                See a walkthrough
              </Button>
            </div>

            <div className="mt-14 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#4a6b51] shadow-sm"></span>
              <span className="text-[13px] font-semibold text-[var(--navy)] opacity-70 tracking-wide uppercase">
                Built for schools and colleges in India
              </span>
            </div>
          </div>
          
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="bg-[var(--cream)] pt-2 pb-16">
        <Divider />
        
        <div className="text-center max-w-3xl mx-auto px-6 mb-12 mt-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[var(--navy)] mb-4">
            Everything your campus runs on.
          </h2>
          <p className="text-[var(--text-secondary)] font-medium leading-relaxed">
            Twelve modules, one login, one shared source of truth – for students, teachers, parents, and administrators alike.
          </p>
        </div>

        <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-12 mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {MODULES.map((mod, i) => (
              <div 
                key={i} 
                className="flex flex-col items-center text-center p-6 bg-[#f2ebd9] rounded-2xl border border-[var(--border)]/70 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <mod.icon className="w-[30px] h-[30px] text-[var(--gold)] mb-5" strokeWidth={1.5} />
                <h3 className="font-bold text-[var(--navy)] text-[15px] leading-snug mb-3">
                  {mod.title}
                </h3>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-6 flex-1 opacity-90">
                  {mod.desc}
                </p>
                <span className="text-[11px] font-bold text-[var(--gold)] uppercase tracking-[0.08em]">
                  {mod.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Divider />
      </section>

      {/* Footer Section */}
      <footer className="relative w-full overflow-hidden bg-[#0A1A2F]">
        {/* Background Image Layer */}
        <div 
          className="absolute inset-0 z-0 bg-no-repeat bg-cover bg-center"
          style={{ backgroundImage: `url(${footerBg})` }}
        />
        
        {/* Content Layer */}
        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 lg:px-12 flex flex-col pt-8">
          
          {/* Top CTA Section */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20 pb-6 md:px-24 z-20">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="text-3xl md:text-[2.5rem] font-serif font-bold text-[#F7F1E3] mb-3">
                Bring your campus onto one system.
              </h2>
              <p className="text-[#F7F1E3]/80 font-medium leading-relaxed max-w-[420px] text-[15px]">
                Start with a pilot for one class or department — most schools are fully onboarded within a few weeks.
              </p>
            </div>
            
            <Button className="bg-[#B8862C] hover:bg-[#a67725] text-white rounded-md font-semibold px-8 h-[52px] text-[15px] border-none shadow-md shrink-0 transition-colors z-20">
              Get started now <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          {/* Divider Line */}
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#c4a260]/30 to-transparent my-2" />

          {/* Links and Logo Section */}
          <div className="flex flex-col lg:flex-row justify-center lg:justify-between gap-12 py-8 md:px-24 z-20">
            
            {/* Logo and Description */}
            <div className="max-w-[280px]">
              <img src={eduLogo} alt="EduWeConnect" className="h-[64px] md:h-[76px] w-auto object-contain mb-4 mt-2 brightness-0 invert opacity-90 -ml-2" />
              
              <p className="text-[#F7F1E3]/70 text-[13px] font-medium leading-[1.7] mb-8">
                A product by Sutta Pitaka Tech. One system for communication, academics, and administration — built for schools and colleges.
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-3">
                {[Mail, Linkedin, Twitter, Youtube].map((Icon, idx) => (
                  <a key={idx} href="#" className="flex items-center justify-center w-[36px] h-[36px] rounded-full border border-[#F7F1E3]/20 text-[#F7F1E3]/80 hover:bg-[#F7F1E3]/10 hover:text-white transition-all">
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-10 lg:gap-20 pt-2">
              
              {/* Product */}
              <div className="flex flex-col gap-3">
                <h4 className="text-white font-bold text-[15px] mb-2">Product</h4>
                <a href="#" className="text-[#F7F1E3]/70 hover:text-white text-[14px] font-medium transition-colors">Features</a>
                <a href="#" className="text-[#F7F1E3]/70 hover:text-white text-[14px] font-medium transition-colors">Product tour</a>
                <a href="#" className="text-[#F7F1E3]/70 hover:text-white text-[14px] font-medium transition-colors">For your campus</a>
              </div>

              {/* Company */}
              <div className="flex flex-col gap-3">
                <h4 className="text-white font-bold text-[15px] mb-2">Company</h4>
                <a href="#" className="text-[#F7F1E3]/70 hover:text-white text-[14px] font-medium transition-colors">About</a>
                <a href="#" className="text-[#F7F1E3]/70 hover:text-white text-[14px] font-medium transition-colors">Contact</a>
                <a href="#" className="text-[#F7F1E3]/70 hover:text-white text-[14px] font-medium transition-colors">Careers</a>
              </div>

              {/* Legal */}
              <div className="flex flex-col gap-3">
                <h4 className="text-white font-bold text-[15px] mb-2">Legal</h4>
                <a href="#" className="text-[#F7F1E3]/70 hover:text-white text-[14px] font-medium transition-colors">Privacy policy</a>
                <a href="#" className="text-[#F7F1E3]/70 hover:text-white text-[14px] font-medium transition-colors">Terms of service</a>
              </div>

            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="border-t border-[#F7F1E3]/10 py-4 text-center lg:text-left md:px-24 z-20">
            <p className="text-[#F7F1E3]/40 text-[12px] font-medium tracking-wide">
              © 2026 Sutta Pitaka Tech. All rights reserved.
            </p>
          </div>
          
        </div>
      </footer>
    </div>
  )
}
