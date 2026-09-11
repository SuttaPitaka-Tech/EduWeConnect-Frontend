import { useState, useEffect } from 'react'
import {
  CalendarDays,
  User,
  MapPin,
  Clock,
  Sparkles,
  Layers,
  Coffee,
  BookOpen,
  Download,
  Bell,
  Printer,
  Calculator,
  Atom,
  FlaskConical,
  Code2,
  Landmark,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { Dialog, DialogContent, DialogHeader, DialogFooter, Button } from '@/components/ui'
import { toast } from 'sonner'

export type SubjectName =
  | 'Mathematics'
  | 'Physics'
  | 'Chemistry'
  | 'Literature'
  | 'History'
  | 'Computer Science'

interface ClassItem {
  id: string
  periodNumber: number
  subject: SubjectName
  startTime: string
  endTime: string
  teacher: string
  room: string
  color: string
  bgLight: string
  topic: string
  building: string
  syllabusModule: string
  status?: 'completed' | 'in-progress' | 'upcoming'
}

interface DaySchedule {
  day: string
  fullDay: string
  date: string
  classesCount: number
  isToday?: boolean
  classes: ClassItem[]
}

const SUBJECT_CONFIG: Record<
  SubjectName,
  {
    icon: React.ElementType
    color: string
    bgLight: string
    border: string
    text: string
  }
> = {
  Mathematics: {
    icon: Calculator,
    color: '#1D4E89',
    bgLight: '#EFF6FF',
    border: '#BFDBFE',
    text: '#1E40AF',
  },
  Physics: {
    icon: Atom,
    color: '#D97706',
    bgLight: '#FFFBEB',
    border: '#FDE68A',
    text: '#B45309',
  },
  Chemistry: {
    icon: FlaskConical,
    color: '#0D9488',
    bgLight: '#F0FDFA',
    border: '#99F6E4',
    text: '#0F766E',
  },
  Literature: {
    icon: BookOpen,
    color: '#9333EA',
    bgLight: '#FAF5FF',
    border: '#E9D5FF',
    text: '#7E22CE',
  },
  History: {
    icon: Landmark,
    color: '#B8862C',
    bgLight: '#FFFDF5',
    border: '#FDE68A',
    text: '#92400E',
  },
  'Computer Science': {
    icon: Code2,
    color: '#059669',
    bgLight: '#ECFDF5',
    border: '#A7F3D0',
    text: '#047857',
  },
}

const TIMETABLE_DATA: DaySchedule[] = [
  {
    day: 'Mon',
    fullDay: 'Monday',
    date: 'Mar 15',
    classesCount: 4,
    classes: [
      {
        id: 'm1',
        periodNumber: 1,
        subject: 'Chemistry',
        startTime: '08:00',
        endTime: '09:00',
        teacher: 'Dr. H. Tan',
        room: 'Room 302',
        color: '#0D9488',
        bgLight: '#F0FDFA',
        topic: 'Chemical Equilibrium & Reaction Rates',
        building: 'Science & Research Block',
        syllabusModule: 'Module 4 • Physical Chemistry',
        status: 'completed',
      },
      {
        id: 'm2',
        periodNumber: 2,
        subject: 'Mathematics',
        startTime: '09:15',
        endTime: '10:15',
        teacher: 'Ms. M. Rivera',
        room: 'Room 118',
        color: '#1D4E89',
        bgLight: '#EFF6FF',
        topic: 'Differential Calculus & Chain Rule',
        building: 'Main Academic Wing',
        syllabusModule: 'Module 3 • Advanced Calculus',
        status: 'completed',
      },
      {
        id: 'm3',
        periodNumber: 3,
        subject: 'Computer Science',
        startTime: '10:45',
        endTime: '12:45',
        teacher: 'Mr. S. Kovac',
        room: 'Studio 2',
        color: '#059669',
        bgLight: '#ECFDF5',
        topic: 'Binary Search Trees & Heap Sort Lab',
        building: 'Turing Technology Center',
        syllabusModule: 'Module 5 • Data Structures',
        status: 'completed',
      },
      {
        id: 'm4',
        periodNumber: 4,
        subject: 'Literature',
        startTime: '14:00',
        endTime: '15:00',
        teacher: "Ms. J. O'Sullivan",
        room: 'Room 207',
        color: '#9333EA',
        bgLight: '#FAF5FF',
        topic: '20th Century World Poetry & Sonnets',
        building: 'Humanities Hall',
        syllabusModule: 'Module 2 • Modernist Poetry',
        status: 'completed',
      },
    ],
  },
  {
    day: 'Tue',
    fullDay: 'Tuesday',
    date: 'Mar 16',
    classesCount: 4,
    classes: [
      {
        id: 't1',
        periodNumber: 1,
        subject: 'Physics',
        startTime: '08:00',
        endTime: '09:00',
        teacher: 'Mr. R. Okonkwo',
        room: 'Room 214',
        color: '#D97706',
        bgLight: '#FFFBEB',
        topic: 'Electromagnetic Waves & Induction',
        building: 'Science Block B',
        syllabusModule: 'Module 6 • Electromagnetism',
        status: 'completed',
      },
      {
        id: 't2',
        periodNumber: 2,
        subject: 'Chemistry',
        startTime: '09:15',
        endTime: '11:15',
        teacher: 'Ms. L. Beaumont',
        room: 'Lab B',
        color: '#0D9488',
        bgLight: '#F0FDFA',
        topic: 'Organic Synthesis: Aldehydes & Ketones',
        building: 'Central Chemistry Lab',
        syllabusModule: 'Practical Lab Experiment #7',
        status: 'completed',
      },
      {
        id: 't3',
        periodNumber: 3,
        subject: 'Mathematics',
        startTime: '11:30',
        endTime: '12:30',
        teacher: 'Mr. P. Nadir',
        room: 'Room 120',
        color: '#1D4E89',
        bgLight: '#EFF6FF',
        topic: 'Hyperbolic Functions & Trigonometry',
        building: 'Main Academic Wing',
        syllabusModule: 'Module 4 • Analytic Geometry',
        status: 'completed',
      },
      {
        id: 't4',
        periodNumber: 4,
        subject: 'History',
        startTime: '14:00',
        endTime: '15:00',
        teacher: 'Dr. S. Marchetti',
        room: 'Room 18',
        color: '#B8862C',
        bgLight: '#FFFDF5',
        topic: 'Industrial Revolution & European Trade',
        building: 'Heritage Building',
        syllabusModule: 'Module 3 • World History',
        status: 'completed',
      },
    ],
  },
  {
    day: 'Wed',
    fullDay: 'Wednesday',
    date: 'Mar 17',
    classesCount: 4,
    classes: [
      {
        id: 'w1',
        periodNumber: 1,
        subject: 'Physics',
        startTime: '08:00',
        endTime: '09:00',
        teacher: 'Mr. R. Okonkwo',
        room: 'Room 214',
        color: '#D97706',
        bgLight: '#FFFBEB',
        topic: 'Optics: Interference & Young Slits',
        building: 'Science Block B',
        syllabusModule: 'Module 7 • Wave Optics',
        status: 'completed',
      },
      {
        id: 'w2',
        periodNumber: 2,
        subject: 'Literature',
        startTime: '09:15',
        endTime: '10:15',
        teacher: "Ms. J. O'Sullivan",
        room: 'Room 207',
        color: '#9333EA',
        bgLight: '#FAF5FF',
        topic: 'Dramatic Irony & Analysis in Hamlet',
        building: 'Humanities Hall',
        syllabusModule: 'Module 3 • Classical Drama',
        status: 'completed',
      },
      {
        id: 'w3',
        periodNumber: 3,
        subject: 'History',
        startTime: '10:45',
        endTime: '11:45',
        teacher: 'Dr. Chen',
        room: 'Room 108',
        color: '#B8862C',
        bgLight: '#FFFDF5',
        topic: 'Maritime Silk Routes & Asian Dynasties',
        building: 'Heritage Building',
        syllabusModule: 'Module 1 • Asian Civilizations',
        status: 'completed',
      },
      {
        id: 'w4',
        periodNumber: 4,
        subject: 'Computer Science',
        startTime: '13:00',
        endTime: '15:00',
        teacher: 'Mr. S. Kovac',
        room: 'Studio 2',
        color: '#059669',
        bgLight: '#ECFDF5',
        topic: 'REST API Design & SQL Indices Workshop',
        building: 'Turing Technology Center',
        syllabusModule: 'Module 6 • Backend Engineering',
        status: 'completed',
      },
    ],
  },
  {
    day: 'Thu',
    fullDay: 'Thursday',
    date: 'Mar 18',
    classesCount: 4,
    classes: [
      {
        id: 'th1',
        periodNumber: 1,
        subject: 'Chemistry',
        startTime: '08:00',
        endTime: '09:00',
        teacher: 'Ms. L. Beaumont',
        room: 'Lab B',
        color: '#0D9488',
        bgLight: '#F0FDFA',
        topic: 'Coordination Chemistry & Isomerism',
        building: 'Central Chemistry Lab',
        syllabusModule: 'Module 5 • Inorganic Chemistry',
        status: 'completed',
      },
      {
        id: 'th2',
        periodNumber: 2,
        subject: 'Mathematics',
        startTime: '09:15',
        endTime: '10:15',
        teacher: 'Ms. M. Rivera',
        room: 'Room 118',
        color: '#1D4E89',
        bgLight: '#EFF6FF',
        topic: 'Vector Cross Products & 3D Planes',
        building: 'Main Academic Wing',
        syllabusModule: 'Module 5 • Vector Geometry',
        status: 'completed',
      },
      {
        id: 'th3',
        periodNumber: 3,
        subject: 'Physics',
        startTime: '10:45',
        endTime: '11:45',
        teacher: 'Mr. R. Okonkwo',
        room: 'Room 214',
        color: '#D97706',
        bgLight: '#FFFBEB',
        topic: 'Thermodynamic Laws & Entropy Equations',
        building: 'Science Block B',
        syllabusModule: 'Module 4 • Thermal Physics',
        status: 'completed',
      },
      {
        id: 'th4',
        periodNumber: 4,
        subject: 'Computer Science',
        startTime: '14:00',
        endTime: '15:00',
        teacher: 'Mr. S. Kovac',
        room: 'Studio 1',
        color: '#059669',
        bgLight: '#ECFDF5',
        topic: 'RSA Cryptography & Public Key Ciphers',
        building: 'Turing Technology Center',
        syllabusModule: 'Module 7 • Cybersecurity',
        status: 'completed',
      },
    ],
  },
  {
    day: 'Fri',
    fullDay: 'Friday',
    date: 'Mar 19',
    classesCount: 4,
    isToday: true,
    classes: [
      {
        id: 'f1',
        periodNumber: 1,
        subject: 'Mathematics',
        startTime: '08:00',
        endTime: '09:00',
        teacher: 'Mr. P. Nadir',
        room: 'Room 120',
        color: '#1D4E89',
        bgLight: '#EFF6FF',
        topic: 'Normal Distribution & Hypothesis Tests',
        building: 'Main Academic Wing',
        syllabusModule: 'Module 6 • Applied Statistics',
        status: 'completed',
      },
      {
        id: 'f2',
        periodNumber: 2,
        subject: 'Literature',
        startTime: '09:15',
        endTime: '10:15',
        teacher: "Ms. J. O'Sullivan",
        room: 'Room 207',
        color: '#9333EA',
        bgLight: '#FAF5FF',
        topic: 'Rhetorical Stylistics & Literary Prose',
        building: 'Humanities Hall',
        syllabusModule: 'Module 4 • Critical Essay Composition',
        status: 'completed',
      },
      {
        id: 'f3',
        periodNumber: 3,
        subject: 'Chemistry',
        startTime: '10:45',
        endTime: '11:45',
        teacher: 'Dr. H. Tan',
        room: 'Room 302',
        color: '#0D9488',
        bgLight: '#F0FDFA',
        topic: 'Electrochemistry: Nernst Equations & Fuel Cells',
        building: 'Science & Research Block',
        syllabusModule: 'Module 8 • Analytical Electrochemistry',
        status: 'in-progress',
      },
      {
        id: 'f4',
        periodNumber: 4,
        subject: 'Physics',
        startTime: '13:00',
        endTime: '14:00',
        teacher: 'Mr. R. Okonkwo',
        room: 'Room 214',
        color: '#D97706',
        bgLight: '#FFFBEB',
        topic: 'Photoelectric Effect & Quantum Hypotheses',
        building: 'Science Block B',
        syllabusModule: 'Module 9 • Modern Quantum Physics',
        status: 'upcoming',
      },
    ],
  },
]

export default function StudentTimetablePage() {
  const { user } = useAuth()
  const [currentTime, setCurrentTime] = useState('10:42:15')
  const [activeSubject, setActiveSubject] = useState<SubjectName | null>(null)
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null)
  const [viewMode, setViewMode] = useState<'week' | 'today'>('week')
  const [activeMobileDay, setActiveMobileDay] = useState('Fri')

  // Live ticking clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const timeStr = now.toTimeString().split(' ')[0]
      setCurrentTime(timeStr)
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const institutionName = user?.organizationName || user?.institutionName || 'Aurel High'
  const studentStandard = user?.standard || 'Pre School / Grade 10-A'

  // Today's classes
  const todaySchedule = TIMETABLE_DATA.find((d) => d.isToday) || TIMETABLE_DATA[4]
  const nextUpClass = todaySchedule.classes.find((c) => c.status === 'in-progress') || todaySchedule.classes[2]

  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    toast.success('Timetable routine downloaded as PDF!')
  }

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-12 font-sans">
      {/* ── Top Header Toolbar ────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]/70">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[var(--navy)] text-[var(--gold)] flex items-center justify-center shadow-md shrink-0">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[var(--navy)] tracking-tight">
                Academic Timetable
              </h1>
              <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30 uppercase tracking-wider">
                {studentStandard}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              {institutionName} • Term 2 (Academic Year 2026)
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {/* Week Selector pill */}
          <div className="flex items-center bg-white border border-[var(--border)] rounded-2xl px-3 py-1.5 shadow-2xs text-xs font-semibold text-[var(--navy)]">
            <button
              type="button"
              className="p-1 hover:text-[var(--gold)] transition-colors cursor-pointer"
              onClick={() => toast.info('Viewing current week')}
              title="Previous Week"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2">Week 24 (Mar 15 – 19)</span>
            <button
              type="button"
              className="p-1 hover:text-[var(--gold)] transition-colors cursor-pointer"
              onClick={() => toast.info('Next week schedule published')}
              title="Next Week"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Live Clock Pill */}
          <span className="px-3 py-1.5 rounded-2xl bg-white border border-[var(--border)] text-xs font-mono font-bold text-[var(--navy)] flex items-center gap-2 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {currentTime}
          </span>

          {/* View Mode Toggle */}
          <div className="bg-[var(--cream)] p-1 rounded-2xl border border-[var(--border)] flex items-center gap-1 shadow-inner">
            <button
              type="button"
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'week'
                  ? 'bg-[var(--navy)] text-white shadow-xs'
                  : 'text-gray-600 hover:text-[var(--navy)]'
              }`}
            >
              Week Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode('today')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'today'
                  ? 'bg-[var(--navy)] text-white shadow-xs'
                  : 'text-gray-600 hover:text-[var(--navy)]'
              }`}
            >
              Today's Focus
            </button>
          </div>

          {/* Export & Print */}
          <button
            type="button"
            onClick={handleExport}
            className="p-2 rounded-2xl bg-white hover:bg-gray-50 border border-[var(--border)] text-gray-600 hover:text-[var(--navy)] transition-colors shadow-2xs cursor-pointer"
            title="Download Schedule PDF"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="p-2 rounded-2xl bg-white hover:bg-gray-50 border border-[var(--border)] text-gray-600 hover:text-[var(--navy)] transition-colors shadow-2xs cursor-pointer"
            title="Print Timetable"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Status Banner: Active Period & Next Up ──────────────────── */}
      <div
        className="relative overflow-hidden rounded-3xl p-5 sm:p-6 text-white shadow-lg border border-[var(--gold)]/20"
        style={{
          background: 'linear-gradient(135deg, #0B2545 0%, #102A43 50%, #134074 100%)',
        }}
      >
        <div className="absolute right-0 top-0 w-96 h-96 rounded-full bg-[var(--gold)]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Left info */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-extrabold tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Period Status
              </span>
              <span className="text-xs text-white/70 font-medium">
                Friday, Mar 19 • Mid-Morning Interval
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>Free Period / Self Study</span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-lg bg-white/10 text-sky-200 border border-white/15">
                  10:15 - 10:45 AM
                </span>
              </h2>
              <p className="text-xs text-sky-100/90 font-medium mt-1">
                Next upcoming class: <strong className="text-[var(--gold)] font-bold">{nextUpClass.subject}</strong> with {nextUpClass.teacher} in <strong className="text-white">{nextUpClass.room}</strong>.
              </p>
            </div>
          </div>

          {/* Right action button */}
          <div className="flex items-center gap-3">
            <Button
              type="button"
              onClick={() => setSelectedClass(nextUpClass)}
              className="bg-gradient-to-r from-[var(--gold)] to-[var(--light-gold)] hover:opacity-95 text-[var(--deep-navy)] font-extrabold text-xs h-11 px-5 rounded-2xl shadow-md gap-2 cursor-pointer border border-[var(--gold)]"
            >
              <BookOpen className="w-4 h-4" />
              <span>Preview Next Lesson ({nextUpClass.subject})</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ── Subject Filter Bar ──────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSubject(null)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border ${
              activeSubject === null
                ? 'bg-[var(--navy)] text-white border-[var(--navy)] shadow-xs scale-102'
                : 'bg-white text-gray-600 border-[var(--border)] hover:bg-[var(--gold)]/10 hover:text-[var(--navy)]'
            }`}
          >
            All Subjects (20)
          </button>

          {(Object.keys(SUBJECT_CONFIG) as SubjectName[]).map((subjName) => {
            const conf = SUBJECT_CONFIG[subjName]
            const Icon = conf.icon
            const isSelected = activeSubject === subjName

            return (
              <button
                key={subjName}
                type="button"
                onClick={() => setActiveSubject(isSelected ? null : subjName)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer border ${
                  isSelected
                    ? 'text-white shadow-sm scale-105'
                    : 'bg-white text-gray-700 border-[var(--border)] hover:bg-white hover:border-gray-400 hover:scale-102'
                }`}
                style={{
                  backgroundColor: isSelected ? conf.color : undefined,
                  borderColor: isSelected ? conf.color : undefined,
                }}
              >
                <Icon
                  className="w-3.5 h-3.5"
                  style={{ color: isSelected ? '#FFFFFF' : conf.color }}
                />
                <span>{subjName}</span>
              </button>
            )
          })}
        </div>

        {activeSubject && (
          <button
            type="button"
            onClick={() => setActiveSubject(null)}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* ── View Mode: Weekly Grid (5 Columns) ──────────────────────── */}
      {viewMode === 'week' ? (
        <div className="space-y-4">
          {/* Mobile day switch tabs */}
          <div className="flex md:hidden items-center gap-2 overflow-x-auto pb-1">
            {TIMETABLE_DATA.map((day) => (
              <button
                key={day.day}
                type="button"
                onClick={() => setActiveMobileDay(day.day)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                  activeMobileDay === day.day
                    ? 'bg-[var(--navy)] text-white border-[var(--navy)] shadow-sm'
                    : 'bg-white text-gray-700 border-[var(--border)]'
                }`}
              >
                {day.day} {day.isToday ? '• Today' : ''}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {TIMETABLE_DATA.map((dayData) => {
              const isToday = dayData.isToday
              const isHiddenOnMobile = activeMobileDay !== dayData.day

              return (
                <div
                  key={dayData.day}
                  className={`relative rounded-3xl p-4 sm:p-5 flex flex-col transition-all duration-300 ${
                    isHiddenOnMobile ? 'hidden md:flex' : 'flex'
                  } ${
                    isToday
                      ? 'bg-white border-2 border-[var(--navy)] shadow-md ring-4 ring-[var(--gold)]/10'
                      : 'bg-white/90 border border-[var(--border)]/80 hover:bg-white hover:border-[var(--gold)]/40 hover:shadow-xs'
                  }`}
                >
                  {/* Today Pill */}
                  {isToday && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                      <span className="px-3 py-0.5 rounded-full bg-[var(--navy)] text-[var(--gold)] text-[10px] font-black tracking-widest uppercase shadow-sm border border-[var(--gold)]/40 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        TODAY
                      </span>
                    </div>
                  )}

                  {/* Day Header */}
                  <div className="flex items-start justify-between pb-3 border-b border-gray-100">
                    <div>
                      <h3 className="text-lg font-black text-[var(--navy)] leading-none">
                        {dayData.day}
                      </h3>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-1 block">
                        {dayData.classesCount} Classes
                      </span>
                    </div>
                    <span className="text-xs font-bold text-gray-500 font-mono">
                      {dayData.date}
                    </span>
                  </div>

                  {/* Periods in this Day */}
                  <div className="flex flex-col gap-3 mt-4 flex-1">
                    {dayData.classes.map((cls) => {
                      const conf = SUBJECT_CONFIG[cls.subject]
                      const Icon = conf.icon
                      const isDimmed = activeSubject && activeSubject !== cls.subject
                      const isUpcoming = cls.status === 'in-progress'

                      return (
                        <div
                          key={cls.id}
                          onClick={() => setSelectedClass(cls)}
                          className={`group relative rounded-2xl p-3.5 border transition-all duration-200 cursor-pointer flex flex-col gap-2.5 ${
                            isDimmed
                              ? 'opacity-30 scale-[0.98] bg-gray-50 border-gray-100'
                              : isUpcoming && isToday
                              ? 'bg-gradient-to-br from-amber-50/70 via-white to-white border-amber-300 shadow-sm ring-2 ring-amber-400/30'
                              : 'bg-[#FAF8F5] border-gray-200/90 hover:bg-white hover:border-[var(--gold)] hover:shadow-md hover:-translate-y-1'
                          }`}
                          style={{
                            borderLeftWidth: '4px',
                            borderLeftColor: conf.color,
                          }}
                        >
                          {/* Timing & Status Top Row */}
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-mono font-extrabold text-[var(--navy)] group-hover:text-black">
                              {cls.startTime} - {cls.endTime}
                            </span>
                            {isToday && cls.status === 'completed' && (
                              <span className="text-[9px] font-bold text-gray-400 flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Done
                              </span>
                            )}
                            {isToday && cls.status === 'in-progress' && (
                              <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-md uppercase tracking-wider animate-pulse">
                                Up Next
                              </span>
                            )}
                          </div>

                          {/* Subject with Icon */}
                          <div className="flex items-center gap-2">
                            <div
                              className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                              style={{ backgroundColor: conf.bgLight, color: conf.color }}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs font-extrabold text-[var(--navy)] truncate group-hover:text-[var(--gold)] transition-colors">
                                {cls.subject}
                              </h4>
                              <p className="text-[10px] text-gray-500 truncate mt-0.5">
                                {cls.topic}
                              </p>
                            </div>
                          </div>

                          {/* Instructor & Room Info */}
                          <div className="pt-2 border-t border-gray-100/90 flex items-center justify-between text-[10px] text-gray-500 font-medium">
                            <span className="flex items-center gap-1 truncate max-w-[110px]">
                              <User className="w-3 h-3 text-gray-400 shrink-0" />
                              <span className="truncate">{cls.teacher}</span>
                            </span>
                            <span className="flex items-center gap-1 font-bold text-[var(--navy)] shrink-0">
                              <MapPin className="w-3 h-3 text-[var(--gold)] shrink-0" />
                              <span>{cls.room}</span>
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        /* ── View Mode: Today's Focus Detailed Timeline ─────────────── */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[var(--border)] shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <span className="text-[10px] font-bold text-[var(--gold)] uppercase tracking-widest">
                Focused Daily View
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-[var(--navy)]">
                Friday, Mar 19 • 4 Classes Scheduled
              </h3>
            </div>
            <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              Active Term
            </span>
          </div>

          {/* Timeline Stack */}
          <div className="space-y-4 mt-6">
            {todaySchedule.classes.map((cls, idx) => {
              const conf = SUBJECT_CONFIG[cls.subject]
              const Icon = conf.icon
              const isCurrent = cls.status === 'in-progress'
              const isDone = cls.status === 'completed'

              return (
                <div
                  key={cls.id}
                  onClick={() => setSelectedClass(cls)}
                  className={`rounded-2xl p-5 border transition-all duration-200 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isCurrent
                      ? 'bg-gradient-to-r from-amber-50/60 via-white to-white border-amber-300 shadow-md ring-2 ring-amber-400/20'
                      : isDone
                      ? 'bg-gray-50/70 border-gray-200 opacity-80'
                      : 'bg-white border-[var(--border)] hover:border-[var(--gold)] hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start md:items-center gap-4">
                    {/* Period badge */}
                    <div className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center bg-[var(--cream)] border border-[var(--border)] text-[var(--navy)] font-black shrink-0">
                      <span className="text-[9px] uppercase font-bold text-gray-400">P{idx + 1}</span>
                      <span className="text-xs">{cls.startTime.slice(0, 5)}</span>
                    </div>

                    {/* Subject Icon & Title */}
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs"
                        style={{ backgroundColor: conf.bgLight, color: conf.color }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-extrabold text-[var(--navy)]">
                            {cls.subject}
                          </h4>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[9px] font-bold uppercase animate-pulse">
                              Up Next
                            </span>
                          )}
                          {isDone && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                              Completed ✓
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 font-medium mt-0.5">
                          {cls.topic}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Room & Teacher Meta */}
                  <div className="flex items-center gap-6 text-xs text-gray-500 font-medium">
                    <span className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-gray-400" />
                      <strong className="text-[var(--navy)]">{cls.teacher}</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[var(--gold)]" />
                      <span className="font-semibold text-[var(--navy)]">{cls.room}</span>
                    </span>
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-xl bg-[var(--cream)] hover:bg-[var(--gold)]/10 text-[var(--navy)] font-bold text-xs border border-[var(--border)] transition-colors cursor-pointer"
                    >
                      View Notes
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Bottom KPI Metric Cards ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
        <div
          onClick={() => toast.info('20 total academic periods scheduled this week.')}
          className="bg-white rounded-3xl p-5 border border-[var(--border)] shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 group"
        >
          <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wide">
            <span className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[var(--navy)] group-hover:text-[var(--gold)] transition-colors" />
              <span>THIS WEEK</span>
            </span>
            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">100% Active</span>
          </div>
          <div>
            <p className="text-3xl font-black text-[var(--navy)] tracking-tight group-hover:text-[var(--gold)] transition-colors">20</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">classes total</p>
          </div>
        </div>

        <div
          onClick={() => toast.info('Total on-campus learning: 23 contact hours.')}
          className="bg-white rounded-3xl p-5 border border-[var(--border)] shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 group"
        >
          <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wide">
            <span className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-[var(--navy)] group-hover:text-[var(--gold)] transition-colors" />
              <span>CLASS TIME</span>
            </span>
            <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-bold">Campus Hours</span>
          </div>
          <div>
            <p className="text-3xl font-black text-[var(--navy)] tracking-tight group-hover:text-[var(--gold)] transition-colors">23h</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">on campus learning</p>
          </div>
        </div>

        <div
          onClick={() => toast.info('Monday has the highest curriculum density.')}
          className="bg-white rounded-3xl p-5 border border-[var(--border)] shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 group"
        >
          <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wide">
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>LONGEST DAY</span>
            </span>
            <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-bold">4 Modules</span>
          </div>
          <div>
            <p className="text-3xl font-black text-[var(--navy)] tracking-tight group-hover:text-[var(--gold)] transition-colors">Mon</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">most classes</p>
          </div>
        </div>

        <div
          onClick={() => toast.info('6 free periods allocated for self-study and revision.')}
          className="bg-[var(--navy)] text-white rounded-3xl p-5 border border-[var(--navy)] shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 group"
        >
          <div className="flex items-center justify-between text-xs font-bold text-gray-300 uppercase tracking-wide">
            <span className="flex items-center gap-2">
              <Coffee className="w-3.5 h-3.5 text-[var(--gold)] group-hover:scale-110 transition-transform" />
              <span>FREE PERIODS</span>
            </span>
            <span className="text-[10px] text-[var(--gold)] bg-white/10 px-2 py-0.5 rounded-full font-bold">Recharge</span>
          </div>
          <div>
            <p className="text-3xl font-black text-white tracking-tight group-hover:text-[var(--gold)] transition-colors">6</p>
            <p className="text-xs text-gray-300 font-medium mt-0.5">to study or rest</p>
          </div>
        </div>
      </div>

      {/* ── Sub-Footer Info ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between text-xs text-gray-400 font-medium pt-2 border-t border-[var(--border)]/60">
        <span>Week 24 • 20 classes • Term 2</span>
        <span>Campus Timetable</span>
      </div>

      {/* ── Class Details Modal Dialog ──────────────────────────────── */}
      <Dialog open={Boolean(selectedClass)} onOpenChange={(open) => !open && setSelectedClass(null)}>
        <DialogContent className="max-w-md p-6 bg-white rounded-3xl border border-[var(--border)] shadow-2xl">
          {selectedClass && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xs font-bold text-lg shrink-0"
                      style={{ backgroundColor: selectedClass.color }}
                    >
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${selectedClass.color}15`,
                          color: selectedClass.color,
                        }}
                      >
                        {selectedClass.subject}
                      </span>
                      <h3 className="text-base font-bold text-[var(--navy)] mt-1">
                        {selectedClass.subject} Period
                      </h3>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              {/* Class Body Details */}
              <div className="space-y-3.5 my-3 text-xs">
                {/* Time & Room Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-[var(--cream)]/60 border border-[var(--border)]/60">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase block mb-1">
                      Scheduled Time
                    </span>
                    <p className="font-mono font-bold text-[var(--navy)] text-sm flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[var(--gold)]" />
                      {selectedClass.startTime} – {selectedClass.endTime}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-[var(--cream)]/60 border border-[var(--border)]/60">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase block mb-1">
                      Room & Location
                    </span>
                    <p className="font-bold text-[var(--navy)] text-sm flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[var(--gold)]" />
                      {selectedClass.room}
                    </p>
                  </div>
                </div>

                {/* Faculty Instructor */}
                <div className="p-3.5 rounded-2xl bg-white border border-[var(--border)] shadow-2xs space-y-1">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase block">
                    Assigned Faculty Instructor
                  </span>
                  <p className="font-bold text-[var(--navy)] text-sm flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>{selectedClass.teacher}</span>
                  </p>
                  <p className="text-[11px] text-gray-500 font-medium">
                    Department of {selectedClass.subject} • {selectedClass.building}
                  </p>
                </div>

                {/* Lesson & Curriculum Module */}
                <div className="p-3.5 rounded-2xl bg-white border border-[var(--border)] shadow-2xs space-y-1">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase block">
                    Current Syllabus Topic
                  </span>
                  <p className="font-bold text-[var(--navy)]">
                    {selectedClass.topic}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {selectedClass.syllabusModule}
                  </p>
                </div>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    toast.success(`Class materials downloaded for ${selectedClass.subject}!`)
                  }}
                  className="w-full sm:w-auto rounded-xl text-xs font-bold gap-1.5 h-10 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Notes</span>
                </Button>

                <Button
                  type="button"
                  onClick={() => {
                    toast.success(`Reminder set for ${selectedClass.subject} at ${selectedClass.startTime}!`)
                    setSelectedClass(null)
                  }}
                  className="w-full sm:w-auto rounded-xl text-xs font-bold gap-1.5 h-10 bg-[var(--navy)] hover:bg-[var(--deep-navy)] text-white cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <span>Set Class Reminder</span>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
