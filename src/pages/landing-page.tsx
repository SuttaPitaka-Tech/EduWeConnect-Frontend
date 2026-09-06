import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";
import { heroBg, lotusLarge } from "@/assets/images";
import {
  MessageSquare,
  Calendar,
  Bell,
  FileText,
  CheckCircle,
  GraduationCap,
  FileSpreadsheet,
  UserPlus,
  Briefcase,
  IndianRupee,
  Camera,
  Gift,
  MapPin,
  Mail,
  Phone,
  Clock,
  UserCheck,
  HeartHandshake,
  Sparkles,
  ShieldCheck,
  Quote,
} from "lucide-react";

// ── Module catalogue ──────────────────────────────────────────────────────────
const MODULES = [
  {
    icon: MessageSquare,
    title: "Chat & calls",
    desc: "Message and call any student, teacher, or parent — no personal numbers required.",
    category: "Communication",
  },
  {
    icon: Calendar,
    title: "Calendar & scheduling",
    desc: "Every class, meeting, and exam date lives on one shared calendar.",
    category: "Communication",
  },
  {
    icon: Bell,
    title: "Notifications",
    desc: "Announcements and updates reach the right people, instantly.",
    category: "Communication",
  },
  {
    icon: FileText,
    title: "Notes, docs & recordings",
    desc: "Class notes, resources, and recorded lessons, organized by subject.",
    category: "Teaching",
  },
  {
    icon: CheckCircle,
    title: "Attendance",
    desc: "Mark attendance in seconds; parents see it the moment it's taken.",
    category: "Teaching",
  },
  {
    icon: GraduationCap,
    title: "Marks & report cards",
    desc: "Grades update in real time, visible to students and parents alike.",
    category: "Teaching",
  },
  {
    icon: FileSpreadsheet,
    title: "Online tests",
    desc: "Schedule, run, and grade tests without leaving the platform.",
    category: "Teaching",
  },
  {
    icon: UserPlus,
    title: "Admissions",
    desc: "A public application form, and one dashboard to review every applicant.",
    category: "Administration",
  },
  {
    icon: Briefcase,
    title: "Recruitment",
    desc: "Post openings and manage teaching and staff applications end to end.",
    category: "Administration",
  },
  {
    icon: IndianRupee,
    title: "Finance",
    desc: "Track fees, dues, and receipts without a separate spreadsheet.",
    category: "Administration",
  },
  {
    icon: Camera,
    title: "Celebrations",
    desc: "Share photos and mark the moments that matter to your campus.",
    category: "Community",
  },
  {
    icon: Gift,
    title: "Birthdays",
    desc: "Never miss one — students, teachers, and staff alike.",
    category: "Community",
  },
];

// ── Daily Role Workflows ───────────────────────────────────────────────────────
const DAILY_WORKFLOWS = [
  {
    id: "admin",
    role: "Administrators & Principals",
    icon: ShieldCheck,
    tagline:
      "Real-time oversight and effortless campus governance from dawn to dusk.",
    steps: [
      {
        title: "Morning Roll-Call & Staff Attendance Sync",
        desc: "Review biometric & mobile attendance metrics across all departments in a single live dashboard.",
        badge: "Attendance",
      },
      {
        title: "Fee Collections & Financial Reconciliation",
        desc: "Automated receipt matching, pending due reminders, and instant financial health summaries.",
        badge: "Finance",
      },
      {
        title: "Admissions & Staff ATS Pipeline Review",
        desc: "Filter prospective student applications, schedule interviews, and issue digital offer letters.",
        badge: "Administration",
      },
      {
        title: "Campus-wide Circulars & Daily Audits",
        desc: "Broadcast emergency alerts or holiday schedules via push notifications, SMS, and WhatsApp.",
        badge: "Broadcast",
      },
    ],
  },
  {
    id: "faculty",
    role: "Teachers & Faculty",
    icon: UserCheck,
    tagline:
      "Spend less time on administrative paperwork and more time inspiring students.",
    steps: [
      {
        title: "Instant 10-Second Class Attendance",
        desc: "Mark presence with one tap; auto-notifies absent students’ parents in real time.",
        badge: "Daily Log",
      },
      {
        title: "Distribute Digital Study Notes & PDFs",
        desc: "Upload lecture slides, homework assignments, and video links organized cleanly by chapter.",
        badge: "Resources",
      },
      {
        title: "Publish Test Scores & Progress Insights",
        desc: "Input midterm grades with automated percentile calculations and instant report card generation.",
        badge: "Gradebook",
      },
      {
        title: "Parent-Teacher Communication & Messaging",
        desc: "Answer parent inquiries directly on EduWeConnect without sharing personal phone numbers.",
        badge: "Messaging",
      },
    ],
  },
  {
    id: "students",
    role: "Students",
    icon: GraduationCap,
    tagline:
      "A personalized academic companion to learn, organize, and achieve excellence.",
    steps: [
      {
        title: "Live Timetable & Room Schedules",
        desc: "Never miss a lecture with dynamic class schedules and real-time room change alerts.",
        badge: "Timetable",
      },
      {
        title: "Access Course Material & Video Archives",
        desc: "Review previous lecture notes, download revision papers, and prep for upcoming tests.",
        badge: "Academics",
      },
      {
        title: "Take Online Quizzes & Mock Assessments",
        desc: "Participate in practice tests with instant answer feedback and rank analytics.",
        badge: "Exams",
      },
      {
        title: "Campus Wishing Wall & Celebrations",
        desc: "Celebrate classmate birthdays, share sports milestones, and view event galleries.",
        badge: "Community",
      },
    ],
  },
  {
    id: "parents",
    role: "Parents & Guardians",
    icon: HeartHandshake,
    tagline:
      "Stay securely connected with your child’s educational journey every single day.",
    steps: [
      {
        title: "Campus Arrival & Attendance Alerts",
        desc: "Instant peace-of-mind notification when your child checks into school safely.",
        badge: "Safety",
      },
      {
        title: "Fee Dues & 1-Click Digital Payment",
        desc: "View tuition fee breakdown and settle payments securely with instant digital receipts.",
        badge: "Payments",
      },
      {
        title: "Daily Homework & Report Cards Access",
        desc: "Monitor test performance trends, teacher remarks, and upcoming project deadlines.",
        badge: "Academic Tracker",
      },
      {
        title: "Direct Teacher Inquiries & Announcements",
        desc: "Stay informed on parent-teacher meeting schedules, school events, and circulars.",
        badge: "Updates",
      },
    ],
  },
];

// ── Daily Impact Metrics ───────────────────────────────────────────────────────
const IMPACT_METRICS = [
  {
    value: "2+ Hours",
    label: "Saved Daily per Teacher",
    desc: "Zero manual attendance registers or repetitive paper record keeping.",
  },
  {
    value: "100%",
    label: "Parent Engagement",
    desc: "Real-time updates on attendance, tests, and campus announcements.",
  },
  {
    value: "95%",
    label: "Paperless Administration",
    desc: "Digital admissions, hall tickets, fee receipts, and grade reports.",
  },
  {
    value: "99.9%",
    label: "Cloud Uptime & Security",
    desc: "Bank-grade enterprise data safety built on modern infrastructure.",
  },
];

function LotusDevider() {
  return (
    <div className="flex items-center justify-center py-6 mx-auto opacity-90">
      <img
        src={lotusLarge}
        alt=""
        className="w-[280px] md:w-[400px] h-auto object-contain"
      />
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState(0);

  const currentWorkflow = DAILY_WORKFLOWS[activeRole];

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
              <span className="font-serif italic text-[var(--gold)] font-medium">
                one calm place.
              </span>
            </h1>

            <p className="mt-8 text-base md:text-lg text-[var(--navy)] opacity-90 leading-relaxed max-w-xl font-medium">
              EduWeConnect brings attendance, admissions, exams, finance, and
              everyday conversation into a single system – so your staff spend
              less time switching between tools and more time teaching.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button
                onClick={() => navigate("/register")}
                variant="primary"
                size="lg"
                className="rounded-md font-semibold px-8 h-[52px] text-[15px] shadow-sm"
              >
                Get started
              </Button>
              <Button
                onClick={() => navigate("/login")}
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

      {/* ── Features ────*/}
      <section className="bg-[var(--cream)] pt-2 pb-12">
        <LotusDevider />

        <div
          id="features"
          className="text-center max-w-3xl mx-auto px-6 mb-8 mt-2 scroll-mt-24 md:scroll-mt-24"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[var(--navy)] mb-3">
            Everything your campus runs on.
          </h2>
          <p className="text-[var(--text-secondary)] font-medium leading-relaxed">
            Twelve modules, one login, one shared source of truth – for
            students, teachers, parents, and administrators alike.
          </p>
        </div>

        <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-12 mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {MODULES.map((mod, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center p-6 bg-[var(--beige)] rounded-2xl border border-[var(--border)]/70 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <mod.icon
                  className="w-[30px] h-[30px] text-[var(--gold)] mb-5"
                  strokeWidth={1.5}
                />
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

        <LotusDevider />
      </section>

      {/* ── Daily Campus Flow: How EduWeConnect Runs Your Day ─────────────── */}
      <section
        id="campus"
        className="bg-[var(--cream)] py-12 scroll-mt-24 md:scroll-mt-28"
      >
        <div className="mx-auto w-full max-w-[1240px] px-6 lg:px-12">
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/30 text-[var(--gold)] text-[12px] font-bold tracking-wider uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Daily Campus Operations
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[var(--navy)] mb-3">
              A Typical Day with EduWeConnect
            </h2>
            <p className="text-[var(--text-secondary)] font-medium text-[15px] leading-relaxed">
              Explore how EduWeConnect seamlessly synchronizes morning
              roll-calls, afternoon assessments, fee dues, and evening
              announcements across every role on campus.
            </p>
          </div>

          {/* Role Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
            {DAILY_WORKFLOWS.map((w, idx) => {
              const Icon = w.icon;
              const isActive = activeRole === idx;
              return (
                <button
                  key={w.id}
                  onClick={() => setActiveRole(idx)}
                  className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold text-[13.5px] transition-all cursor-pointer ${
                    isActive
                      ? "bg-[var(--navy)] text-white shadow-md"
                      : "bg-[var(--warm-white)] text-[var(--navy)]/80 hover:bg-[var(--beige)] border border-[var(--border)]"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${isActive ? "text-[var(--gold)]" : "text-[var(--navy)]/60"}`}
                  />
                  {w.role}
                </button>
              );
            })}
          </div>

          {/* Active Role Content Card */}
          <div className="bg-[var(--warm-white)] rounded-2xl border border-[var(--border)] shadow-sm p-6 md:p-10 mb-14">
            {/* Role Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-[var(--border)]">
              <div>
                <span className="text-[12px] font-bold uppercase tracking-wider text-[var(--gold)]">
                  Role Journey
                </span>
                <h3 className="text-2xl font-serif font-bold text-[var(--navy)] mt-0.5">
                  {currentWorkflow.role}
                </h3>
                <p className="text-[14px] text-[var(--text-secondary)] font-medium mt-1">
                  {currentWorkflow.tagline}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/register")}
                className="self-start md:self-auto border-[var(--navy)] text-[var(--navy)] hover:bg-[var(--navy)] hover:text-white"
              >
                Experience This Flow
              </Button>
            </div>

            {/* Daily Timeline Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentWorkflow.steps.map((step, sIdx) => (
                <div
                  key={sIdx}
                  className="relative flex flex-col p-5 bg-[var(--cream)]/60 rounded-xl border border-[var(--border)]/70 hover:border-[var(--gold)]/50 transition-all shadow-2xs hover:shadow-sm"
                >
                  {/* Step Header: Step Number on Left, Category Badge on Right */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-[var(--border)] text-[var(--navy)] font-bold text-[11.5px] shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
                      <span>Step 0{sIdx + 1}</span>
                    </div>
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-[var(--gold)] bg-[var(--gold)]/10 px-2.5 py-1 rounded-md border border-[var(--gold)]/20">
                      {step.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h4 className="font-bold text-[14.5px] text-[var(--navy)] leading-snug mb-2">
                    {step.title}
                  </h4>
                  <p className="text-[12.5px] text-[var(--text-secondary)] leading-relaxed flex-1">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Impact Stats Grid with Modern Sans Numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
            {IMPACT_METRICS.map((metric, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-6 bg-[var(--warm-white)] rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="text-3xl sm:text-4xl font-extrabold font-sans text-[var(--navy)] tracking-tight tabular-nums mb-2">
                  {metric.value}
                </div>
                <h4 className="text-[14px] font-bold text-[var(--gold)] mb-1.5">
                  {metric.label}
                </h4>
                <p className="text-[12.5px] text-[var(--text-secondary)] leading-relaxed">
                  {metric.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Daily Thought / Wisdom Inspiration Card */}
          <div className="relative overflow-hidden flex flex-col md:flex-row items-center justify-between p-8 md:p-10 bg-gradient-to-r from-[var(--deep-navy)] to-[var(--navy)] rounded-2xl shadow-md text-white gap-6">
            <div className="max-w-2xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-[var(--light-gold)] text-[12px] font-bold uppercase tracking-wider mb-2">
                <Quote className="w-4 h-4" />
                Daily Campus Thought & Philosophy
              </div>
              <p className="text-lg md:text-xl font-serif italic text-[var(--cream)] leading-relaxed mb-2">
                &ldquo;Live as if you were to die tomorrow. Learn as if you were
                to live forever.&rdquo;
              </p>
              <p className="text-[13px] text-[var(--light-gold)] font-semibold">
                — Mahatma Gandhi · Shared across EduWeConnect daily morning
                broadcasts
              </p>
            </div>
            <div className="shrink-0">
              <Button
                variant="gold"
                size="lg"
                onClick={() => navigate("/register")}
                className="font-bold px-7 shadow-sm"
              >
                Start Free Campus Pilot
              </Button>
            </div>
          </div>
        </div>
      </section>

      <LotusDevider />

      {/* ── Contact Details: Sutta Pitaka Tech (Above Footer) ─────────────── */}
      <section
        id="contact"
        className="bg-[var(--cream)] pb-16 pt-2 scroll-mt-24 md:scroll-mt-28"
      >
        <div className="mx-auto w-full max-w-[1200px] px-6 lg:px-12">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[var(--navy)] mb-3">
              Contact Details
            </h2>
            <p className="text-[var(--text-secondary)] font-medium text-[14.5px] leading-relaxed">
              Connect directly with our institutional support and implementation
              team.
            </p>
          </div>

          {/* Contact Information Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {/* Card 1: Office Address */}
            <div className="flex flex-col items-center text-center p-6 bg-[var(--warm-white)] rounded-xl border border-[var(--border)] shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-[var(--cream)] flex items-center justify-center text-[var(--navy)] mb-4 border border-[var(--border)]">
                <MapPin
                  className="w-5 h-5 text-[var(--gold)]"
                  strokeWidth={1.75}
                />
              </div>
              <h3 className="font-bold text-[var(--navy)] text-[14.5px] mb-1.5">
                Registered Office
              </h3>
              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                Sutta Pitaka Tech Pvt. Ltd.
                <br />
                Bengaluru, Karnataka, India
              </p>
            </div>

            {/* Card 2: Email */}
            <div className="flex flex-col items-center text-center p-6 bg-[var(--warm-white)] rounded-xl border border-[var(--border)] shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-[var(--cream)] flex items-center justify-center text-[var(--navy)] mb-4 border border-[var(--border)]">
                <Mail
                  className="w-5 h-5 text-[var(--gold)]"
                  strokeWidth={1.75}
                />
              </div>
              <h3 className="font-bold text-[var(--navy)] text-[14.5px] mb-1.5">
                Email Support
              </h3>
              <a
                href="mailto:contact@suttapitaka.tech"
                className="text-[13px] text-[var(--navy)] font-semibold hover:text-[var(--gold)] transition-colors"
              >
                contact@suttapitaka.tech
              </a>
              <p className="text-[12px] text-[var(--text-muted)] mt-1">
                support@eduweconnect.com
              </p>
            </div>

            {/* Card 3: Phone */}
            <div className="flex flex-col items-center text-center p-6 bg-[var(--warm-white)] rounded-xl border border-[var(--border)] shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-[var(--cream)] flex items-center justify-center text-[var(--navy)] mb-4 border border-[var(--border)]">
                <Phone
                  className="w-5 h-5 text-[var(--gold)]"
                  strokeWidth={1.75}
                />
              </div>
              <h3 className="font-bold text-[var(--navy)] text-[14.5px] mb-1.5">
                Helpline
              </h3>
              <a
                href="tel:+918001234567"
                className="text-[13px] text-[var(--navy)] font-semibold hover:text-[var(--gold)] transition-colors"
              >
                +91 (080) 4123-4567
              </a>
              <p className="text-[12px] text-[var(--text-muted)] mt-1">
                Mon – Sat: 9:00 AM – 6:00 PM IST
              </p>
            </div>

            {/* Card 4: Operating Hours */}
            <div className="flex flex-col items-center text-center p-6 bg-[var(--warm-white)] rounded-xl border border-[var(--border)] shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-[var(--cream)] flex items-center justify-center text-[var(--navy)] mb-4 border border-[var(--border)]">
                <Clock
                  className="w-5 h-5 text-[var(--gold)]"
                  strokeWidth={1.75}
                />
              </div>
              <h3 className="font-bold text-[var(--navy)] text-[14.5px] mb-1.5">
                Platform Support
              </h3>
              <p className="text-[13px] text-[var(--text-secondary)] font-medium leading-relaxed">
                24/7 Cloud Infrastructure
              </p>
              <p className="text-[12px] text-[var(--text-muted)] mt-1">
                Dedicated Campus Onboarding
              </p>
            </div>
          </div>

          {/* Schedule Demo CTA Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-6 sm:p-8 bg-gradient-to-r from-[var(--warm-white)] via-[var(--warm-white)] to-[var(--beige)] rounded-2xl border border-[var(--border)] shadow-sm gap-6">
            <div className="text-center sm:text-left">
              <h3 className="text-lg md:text-xl font-serif font-bold text-[var(--navy)] mb-1">
                Ready to transform your educational campus?
              </h3>
              <p className="text-[13px] md:text-[13.5px] text-[var(--text-secondary)] font-medium">
                Reach out to Sutta Pitaka Tech team for institutional
                integration and customized onboarding.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="primary"
                onClick={() => navigate("/register")}
                className="font-semibold px-6 shadow-sm"
              >
                Schedule a Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
