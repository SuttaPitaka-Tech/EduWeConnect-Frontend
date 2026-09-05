import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui'
import { heroBg, lotusLarge } from '@/assets/images'
import {
  MessageSquare, Calendar, Bell, FileText, CheckCircle, GraduationCap,
  FileSpreadsheet, UserPlus, Briefcase, IndianRupee, Camera, Gift,
} from 'lucide-react'

// ── Module catalogue ──────────────────────────────────────────────────────────
const MODULES = [
  { icon: MessageSquare,  title: 'Chat & calls',           desc: 'Message and call any student, teacher, or parent — no personal numbers required.',   category: 'Communication' },
  { icon: Calendar,       title: 'Calendar & scheduling',  desc: 'Every class, meeting, and exam date lives on one shared calendar.',                   category: 'Communication' },
  { icon: Bell,           title: 'Notifications',          desc: 'Announcements and updates reach the right people, instantly.',                         category: 'Communication' },
  { icon: FileText,       title: 'Notes, docs & recordings', desc: 'Class notes, resources, and recorded lessons, organized by subject.',               category: 'Teaching' },
  { icon: CheckCircle,    title: 'Attendance',             desc: "Mark attendance in seconds; parents see it the moment it's taken.",                    category: 'Teaching' },
  { icon: GraduationCap,  title: 'Marks & report cards',  desc: 'Grades update in real time, visible to students and parents alike.',                   category: 'Teaching' },
  { icon: FileSpreadsheet, title: 'Online tests',          desc: 'Schedule, run, and grade tests without leaving the platform.',                         category: 'Teaching' },
  { icon: UserPlus,       title: 'Admissions',             desc: 'A public application form, and one dashboard to review every applicant.',              category: 'Administration' },
  { icon: Briefcase,      title: 'Recruitment',            desc: 'Post openings and manage teaching and staff applications end to end.',                 category: 'Administration' },
  { icon: IndianRupee,    title: 'Finance',                desc: 'Track fees, dues, and receipts without a separate spreadsheet.',                       category: 'Administration' },
  { icon: Camera,         title: 'Celebrations',           desc: 'Share photos and mark the moments that matter to your campus.',                        category: 'Community' },
  { icon: Gift,           title: 'Birthdays',              desc: 'Never miss one — students, teachers, and staff alike.',                                 category: 'Community' },
]

function LotusDevider() {
  return (
    <div className="flex items-center justify-center py-6 mx-auto opacity-90">
      <img src={lotusLarge} alt="" className="w-[280px] md:w-[400px] h-auto object-contain" />
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col w-full overflow-hidden bg-[var(--cream)]">

        {/* Background image */}
        <div
          className="absolute inset-0 z-0 bg-no-repeat bg-cover bg-[center_right] md:bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />

        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-[var(--cream)] via-[var(--cream)]/50 to-transparent pointer-events-none md:w-[60%]" />

        {/* Hero content */}
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
              <Button
                onClick={() => navigate('/register')}
                variant="primary"
                size="lg"
                className="rounded-md font-semibold px-8 h-[52px] text-[15px] shadow-sm"
              >
                Get started
              </Button>
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                size="lg"
                className="rounded-md font-semibold px-8 h-[52px] text-[15px] bg-transparent border-[1.5px] border-[var(--navy)] text-[var(--navy)] transition-all"
              >
                Sign In
              </Button>
            </div>

            <div className="mt-14 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[var(--success)] shadow-sm" />
              <span className="text-[13px] font-semibold text-[var(--navy)] opacity-70 tracking-wide uppercase">
                Built for schools and colleges in India
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section id="features" className="bg-[var(--cream)] pt-2 pb-16">
        <LotusDevider />

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
                className="flex flex-col items-center text-center p-6 bg-[var(--beige)] rounded-2xl border border-[var(--border)]/70 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <mod.icon className="w-[30px] h-[30px] text-[var(--gold)] mb-5" strokeWidth={1.5} />
                <h3 className="font-bold text-[var(--navy)] text-[15px] leading-snug mb-3">{mod.title}</h3>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-6 flex-1 opacity-90">{mod.desc}</p>
                <span className="text-[11px] font-bold text-[var(--gold)] uppercase tracking-[0.08em]">{mod.category}</span>
              </div>
            ))}
          </div>
        </div>

        <LotusDevider />
      </section>
    </>
  )
}
