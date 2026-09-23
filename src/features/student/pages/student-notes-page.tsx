import { useState, useMemo } from 'react'
import {
  NotebookPen,
  CalendarDays,
  Search,
  Plus,
  Pin,
  Star,
  CheckCircle2,
  Clock,
  User,
  Download,
  Copy,
  AlertCircle,
  FileText,
  BookOpen,
  Sparkles,
  Calculator,
  Atom,
  FlaskConical,
  Code2,
  Printer,
  Filter,
  Paperclip,
  Check,
} from 'lucide-react'
import {
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui'
import { toast } from 'sonner'

// ── Types ───────────────────────────────────────────────────────────────────
export type NotePriority = 'high' | 'medium' | 'normal'
export type NoteCategory = 'lecture' | 'homework' | 'exam-prep' | 'announcement'

export interface DailyNoteItem {
  id: string
  dateKey: string // YYYY-MM-DD
  periodNumber: number
  time: string
  subject: string
  teacher: string
  title: string
  summary: string
  keyPoints: string[]
  teacherRemark?: string
  priority: NotePriority
  category: NoteCategory
  isPinned?: boolean
  isBookmarked?: boolean
  isCompleted?: boolean
  tags: string[]
  attachments?: {
    name: string
    size: string
    type: 'pdf' | 'doc' | 'image'
  }[]
}

// ── Subject Visual Config ───────────────────────────────────────────────────
const SUBJECT_THEMES: Record<
  string,
  {
    badgeBg: string
    badgeText: string
    border: string
    icon: typeof Calculator
    accent: string
  }
> = {
  Mathematics: {
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    badgeText: 'text-indigo-700',
    border: 'border-indigo-100 hover:border-indigo-300',
    icon: Calculator,
    accent: '#4F46E5',
  },
  Physics: {
    badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
    badgeText: 'text-sky-700',
    border: 'border-sky-100 hover:border-sky-300',
    icon: Atom,
    accent: '#0284C7',
  },
  Chemistry: {
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badgeText: 'text-emerald-700',
    border: 'border-emerald-100 hover:border-emerald-300',
    icon: FlaskConical,
    accent: '#059669',
  },
  'Computer Science': {
    badgeBg: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    badgeText: 'text-cyan-800',
    border: 'border-cyan-100 hover:border-cyan-300',
    icon: Code2,
    accent: '#0891B2',
  },
  English: {
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    badgeText: 'text-amber-800',
    border: 'border-amber-100 hover:border-amber-300',
    icon: BookOpen,
    accent: '#D97706',
  },
  'General Notice': {
    badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
    badgeText: 'text-purple-800',
    border: 'border-purple-100 hover:border-purple-300',
    icon: AlertCircle,
    accent: '#9333EA',
  },
}

// ── Initial Mock Data for Day-by-Day Notes ──────────────────────────────────
const INITIAL_NOTES: DailyNoteItem[] = [
  // Friday Sep 18, 2026 (Today)
  {
    id: 'note-101',
    dateKey: '2026-09-18',
    periodNumber: 1,
    time: '09:00 AM - 09:50 AM',
    subject: 'Mathematics',
    teacher: 'Dr. Robert Vance',
    title: 'Quadratic Equations & Discriminant Nature of Roots',
    summary:
      'Completed derivation of quadratic formula and analyzed conditions for real, distinct, repeated, and imaginary complex roots.',
    keyPoints: [
      'Standard Form: ax² + bx + c = 0 (where a ≠ 0)',
      'Discriminant Formula: Δ = b² - 4ac',
      'If Δ > 0: Two distinct real roots; If Δ = 0: Two equal real roots (perfect square)',
      'If Δ < 0: Complex conjugate roots with no real intercepts on the cartesian graph',
      'Homework: Complete Exercise 4.2 Questions 1 through 14 before Monday morning roll-call',
    ],
    teacherRemark:
      'Crucial for upcoming mid-term exams. Remember to verify values of a, b, c with their negative signs.',
    priority: 'high',
    category: 'exam-prep',
    isPinned: true,
    isBookmarked: true,
    isCompleted: false,
    tags: ['Algebra', 'QuadraticFormula', 'MidTermExam', 'Homework'],
    attachments: [
      { name: 'Quadratic_Formula_Handout_Sheet.pdf', size: '1.4 MB', type: 'pdf' },
      { name: 'Exercise_4_2_Practice_Hints.doc', size: '420 KB', type: 'doc' },
    ],
  },
  {
    id: 'note-102',
    dateKey: '2026-09-18',
    periodNumber: 2,
    time: '10:00 AM - 10:50 AM',
    subject: 'Physics',
    teacher: 'Prof. Marcus Chen',
    title: "Electromagnetic Induction & Faraday's Experimental Laws",
    summary:
      "Explored magnetic flux variations through a coil and Lenz's law establishing conservation of energy in induced current directions.",
    keyPoints: [
      'Magnetic Flux (Φ) = B · A · cos(θ), measured in Webers (Wb)',
      'Faraday’s Law: Induced EMF ε = -N · (dΦ / dt)',
      'Lenz’s Law: The direction of induced current opposes the change in magnetic flux producing it',
      'Laboratory practical on Thursday requires all students to bring safety goggles & pre-lab report',
    ],
    teacherRemark:
      'Please revise right-hand grip rule and Fleming’s right-hand generator rule before the lab session.',
    priority: 'medium',
    category: 'lecture',
    isPinned: false,
    isBookmarked: false,
    isCompleted: false,
    tags: ['Physics', 'Electromagnetism', 'FaradayLaw', 'LabPrep'],
    attachments: [
      { name: 'Faraday_Lenz_Diagrams_SlideDeck.pdf', size: '2.8 MB', type: 'pdf' },
    ],
  },
  {
    id: 'note-103',
    dateKey: '2026-09-18',
    periodNumber: 4,
    time: '12:00 PM - 12:50 PM',
    subject: 'Computer Science',
    teacher: 'Mr. Alex Turner',
    title: 'Stack Data Structure Applications: Infix to Postfix Evaluation',
    summary:
      'Studied LIFO principle, algorithmic flow of operator stack precedence handling, and parenthesis parsing.',
    keyPoints: [
      'LIFO (Last In First Out) behavior implemented with array and pointer top',
      'Operator Precedence: ^ (highest, right-to-left) > *, / > +, - (lowest, left-to-right)',
      'Parenthesis: Push "(" to stack; Pop until "(" is found when matching ")"',
      'Coding Lab Assignment: Implement Infix to Postfix converter in Python / C++ by Sunday midnight',
    ],
    teacherRemark:
      'Do not forget edge case handling when parenthesis are unbalanced in the input arithmetic expression.',
    priority: 'high',
    category: 'homework',
    isPinned: true,
    isBookmarked: true,
    isCompleted: false,
    tags: ['DataStructures', 'Stacks', 'CodingLab', 'Python'],
    attachments: [
      { name: 'Stack_Infix_Postfix_Algorithm.pdf', size: '950 KB', type: 'pdf' },
      { name: 'sample_testcases_stack.doc', size: '120 KB', type: 'doc' },
    ],
  },
  {
    id: 'note-104',
    dateKey: '2026-09-18',
    periodNumber: 6,
    time: '02:45 PM - 03:30 PM',
    subject: 'General Notice',
    teacher: 'Mrs. Priya Sharma (Class Teacher)',
    title: 'Upcoming Science Fair Registration & Mid-Term Timetable Release',
    summary:
      'Official announcements regarding team submissions for inter-school science symposium and distribution of exam hall permits.',
    keyPoints: [
      'Science symposium project abstracts must be submitted to Room 204 by Sep 25',
      'Max 3 members per project team across Grade 10 and 11',
      'Official hall tickets for Mid-Term Exams will be available from the portal next Tuesday',
    ],
    teacherRemark:
      'Ensure parent consent slips for field visit are submitted by this Saturday morning.',
    priority: 'normal',
    category: 'announcement',
    isPinned: false,
    isBookmarked: false,
    isCompleted: true,
    tags: ['Announcements', 'ScienceFair', 'Exams', 'CampusNotice'],
  },

  // Thursday Sep 17, 2026
  {
    id: 'note-201',
    dateKey: '2026-09-17',
    periodNumber: 1,
    time: '09:00 AM - 09:50 AM',
    subject: 'Chemistry',
    teacher: 'Dr. Eleanor Smith',
    title: "Coordination Compounds & Werner's Coordination Theory",
    summary:
      "Covered postulates of Werner's theory explaining primary (ionizable) and secondary (non-ionizable) valencies in transition metal complexes.",
    keyPoints: [
      'Primary Valency: Satisfied by negative ions; corresponds to oxidation state of central metal atom',
      'Secondary Valency: Satisfied by neutral molecules or anions; corresponds to coordination number',
      'Geometry is strictly defined by secondary valencies (Octahedral, Tetrahedral, Square Planar)',
      'Memorize IUPAC nomenclature prefixes: aqua, ammine, chlorido, oxalato',
    ],
    teacherRemark:
      'Practice drawing 3D spatial representations of optical and geometrical isomers.',
    priority: 'high',
    category: 'exam-prep',
    isPinned: true,
    isBookmarked: true,
    isCompleted: true,
    tags: ['Chemistry', 'CoordinationCompounds', 'WernerTheory'],
    attachments: [
      { name: 'IUPAC_Complexes_Nomenclature_Guide.pdf', size: '1.1 MB', type: 'pdf' },
    ],
  },
  {
    id: 'note-202',
    dateKey: '2026-09-17',
    periodNumber: 3,
    time: '11:00 AM - 11:50 AM',
    subject: 'English',
    teacher: 'Ms. Sarah Jenkins',
    title: 'Literary Devices & Character Arc Analysis in "The Merchant of Venice"',
    summary:
      'Deep dive into the trial scene (Act IV Scene 1). Analysis of Portia’s "Quality of Mercy" monologue and dramatic irony.',
    keyPoints: [
      'Key Theme: Justice vs. Mercy, Divine Law vs. Rigid Legalism',
      'Monologue Analysis: "The quality of mercy is not strain’d, It droppeth as the gentle rain from heaven"',
      'Essay Prompt: Write a 500-word critical evaluation of Shylock’s motivations and societal context',
    ],
    teacherRemark: 'Essays will be peer-reviewed in Monday’s literature seminar.',
    priority: 'normal',
    category: 'homework',
    isPinned: false,
    isBookmarked: false,
    isCompleted: false,
    tags: ['English', 'Literature', 'Shakespeare', 'EssayWriting'],
  },

  // Wednesday Sep 16, 2026
  {
    id: 'note-301',
    dateKey: '2026-09-16',
    periodNumber: 2,
    time: '10:00 AM - 10:50 AM',
    subject: 'Mathematics',
    teacher: 'Dr. Robert Vance',
    title: 'Arithmetic Progressions & Sum of First N Terms Formula',
    summary:
      'Formula derivation for Sn = n/2 [2a + (n-1)d] and practical word problems on financial progressions.',
    keyPoints: [
      'nth term: an = a + (n-1)d',
      'Sum formula: Sn = n/2 [a + l] when first and last terms are known',
      'Solved 6 board exam previous year questions during the session',
    ],
    teacherRemark: 'Excellent participation by everyone in class during rapid fire problems.',
    priority: 'medium',
    category: 'lecture',
    isPinned: false,
    isBookmarked: false,
    isCompleted: true,
    tags: ['Maths', 'ArithmeticProgression', 'Formulas'],
  },
  {
    id: 'note-302',
    dateKey: '2026-09-16',
    periodNumber: 5,
    time: '01:30 PM - 02:20 PM',
    subject: 'Physics',
    teacher: 'Prof. Marcus Chen',
    title: 'Alternating Current - RMS Values & AC Generator Working Mechanism',
    summary:
      'Derivation of peak voltage (V0) vs root mean square voltage (Vrms = V0 / √2) and sinusoidal waveforms.',
    keyPoints: [
      'Vrms = 0.707 * V0; Irms = 0.707 * I0',
      'Phase difference between current and voltage in purely inductive vs capacitive circuits',
    ],
    teacherRemark: 'Review vector phasor diagrams thoroughly.',
    priority: 'high',
    category: 'exam-prep',
    isPinned: false,
    isBookmarked: true,
    isCompleted: true,
    tags: ['Physics', 'AlternatingCurrent', 'Generators'],
  },
]

// ── Available Subjects for Filter & Creation ────────────────────────────────
const AVAILABLE_SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Computer Science',
  'English',
  'General Notice',
]

// ── Date Generator Helper for the Current Week Strip ────────────────────────
function getDaysAroundDate(baseDate: Date) {
  const days = []
  // Show 7 days around Sep 18 (e.g. Sep 14 to Sep 20)
  for (let offset = -4; offset <= 2; offset++) {
    const d = new Date(baseDate)
    d.setDate(baseDate.getDate() + offset)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const dateKey = `${year}-${month}-${day}`

    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' })
    const monthName = d.toLocaleDateString('en-US', { month: 'short' })
    const isToday = offset === 0

    days.push({
      dateKey,
      dayName,
      monthName,
      dayNumber: d.getDate(),
      fullDateStr: d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      isToday,
    })
  }
  return days
}

export default function StudentNotesPage() {
  // Base reference date: Friday Sep 18, 2026
  const baseDate = useMemo(() => new Date(2026, 8, 18), [])
  const daysList = useMemo(() => getDaysAroundDate(baseDate), [baseDate])

  // Current State
  const [selectedDateKey, setSelectedDateKey] = useState<string>('2026-09-18')
  const [notes, setNotes] = useState<DailyNoteItem[]>(INITIAL_NOTES)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('All')
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState('All')
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All')

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [detailModalNote, setDetailModalNote] = useState<DailyNoteItem | null>(null)

  // New Note Form State
  const [newTitle, setNewTitle] = useState('')
  const [newSubject, setNewSubject] = useState('Mathematics')
  const [newPeriod, setNewPeriod] = useState(1)
  const [newTime, setNewTime] = useState('09:00 AM - 09:50 AM')
  const [newTeacher, setNewTeacher] = useState('')
  const [newPriority, setNewPriority] = useState<NotePriority>('normal')
  const [newCategory, setNewCategory] = useState<NoteCategory>('lecture')
  const [newSummary, setNewSummary] = useState('')
  const [newKeyPointsText, setNewKeyPointsText] = useState('')
  const [newTeacherRemark, setNewTeacherRemark] = useState('')
  const [newTagsText, setNewTagsText] = useState('')
  const [newIsPinned, setNewIsPinned] = useState(false)

  // Selected Day Details
  const selectedDayInfo = useMemo(() => {
    return daysList.find((d) => d.dateKey === selectedDateKey) || {
      dateKey: selectedDateKey,
      fullDateStr: selectedDateKey,
      isToday: selectedDateKey === '2026-09-18',
    }
  }, [daysList, selectedDateKey])

  // Count notes for each date in the strip
  const dateNoteCounts = useMemo(() => {
    const counts: Record<string, { total: number; highPriority: number }> = {}
    notes.forEach((note) => {
      if (!counts[note.dateKey]) {
        counts[note.dateKey] = { total: 0, highPriority: 0 }
      }
      counts[note.dateKey].total += 1
      if (note.priority === 'high') {
        counts[note.dateKey].highPriority += 1
      }
    })
    return counts
  }, [notes])

  // Filtered notes for currently selected date and search/filter controls
  const filteredNotes = useMemo(() => {
    return notes
      .filter((n) => {
        // Date Match
        if (n.dateKey !== selectedDateKey) return false

        // Subject Match
        if (selectedSubjectFilter !== 'All' && n.subject !== selectedSubjectFilter) {
          return false
        }

        // Priority Match
        if (selectedPriorityFilter !== 'All' && n.priority !== selectedPriorityFilter) {
          return false
        }

        // Category Match
        if (selectedCategoryFilter !== 'All' && n.category !== selectedCategoryFilter) {
          return false
        }

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const matchTitle = n.title.toLowerCase().includes(q)
          const matchSubject = n.subject.toLowerCase().includes(q)
          const matchTeacher = n.teacher.toLowerCase().includes(q)
          const matchSummary = n.summary.toLowerCase().includes(q)
          const matchTags = n.tags.some((t) => t.toLowerCase().includes(q))
          const matchPoints = n.keyPoints.some((p) => p.toLowerCase().includes(q))
          return matchTitle || matchSubject || matchTeacher || matchSummary || matchTags || matchPoints
        }

        return true
      })
      .sort((a, b) => {
        // Pinned notes come first, then periodNumber
        if (a.isPinned && !b.isPinned) return -1
        if (!a.isPinned && b.isPinned) return 1
        return a.periodNumber - b.periodNumber
      })
  }, [
    notes,
    selectedDateKey,
    selectedSubjectFilter,
    selectedPriorityFilter,
    selectedCategoryFilter,
    searchQuery,
  ])

  // Selected Day Stats
  const dayStats = useMemo(() => {
    const dayNotes = notes.filter((n) => n.dateKey === selectedDateKey)
    const total = dayNotes.length
    const high = dayNotes.filter((n) => n.priority === 'high').length
    const completed = dayNotes.filter((n) => n.isCompleted).length
    const attachmentsCount = dayNotes.reduce(
      (acc, curr) => acc + (curr.attachments?.length || 0),
      0
    )
    return { total, high, completed, attachmentsCount }
  }, [notes, selectedDateKey])

  // Actions
  const handleTogglePin = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setNotes((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isPinned: !item.isPinned } : item
      )
    )
    toast.success('Note pin status updated')
  }

  const handleToggleBookmark = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setNotes((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item
      )
    )
    toast.success('Note saved to bookmarks')
  }

  const handleToggleComplete = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setNotes((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      )
    )
  }

  const handleCopyNote = (note: DailyNoteItem, e?: React.MouseEvent) => {
    e?.stopPropagation()
    const textToCopy = `📌 [${note.subject}] ${note.title}\nTime: ${note.time}\nTeacher: ${note.teacher}\n\nSummary:\n${note.summary}\n\nKey Points:\n${note.keyPoints.map((p) => `• ${p}`).join('\n')}\n${note.teacherRemark ? `\nTeacher Tip: ${note.teacherRemark}` : ''}`
    navigator.clipboard.writeText(textToCopy)
    toast.success('Note copied to clipboard!')
  }

  const handleDownloadAttachment = (filename: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    toast.info(`Downloading resource: ${filename}`, {
      description: 'Document ready for offline revision.',
    })
  }

  const handleCreateNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newSummary.trim()) {
      toast.error('Please enter a note title and summary.')
      return
    }

    const points = newKeyPointsText
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean)

    const tags = newTagsText
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean)

    const newNoteItem: DailyNoteItem = {
      id: `note-${Date.now()}`,
      dateKey: selectedDateKey,
      periodNumber: Number(newPeriod),
      time: newTime.trim() || 'Class Hours',
      subject: newSubject,
      teacher: newTeacher.trim() || 'Subject Faculty',
      title: newTitle.trim(),
      summary: newSummary.trim(),
      keyPoints: points.length > 0 ? points : [newSummary.trim()],
      teacherRemark: newTeacherRemark.trim() || undefined,
      priority: newPriority,
      category: newCategory,
      isPinned: newIsPinned,
      isBookmarked: false,
      isCompleted: false,
      tags: tags.length > 0 ? tags : [newSubject.replace(/\s+/g, '')],
    }

    setNotes((prev) => [newNoteItem, ...prev])
    toast.success('New daily note created successfully!', {
      description: `Added to ${selectedDayInfo.fullDateStr}`,
    })

    // Reset Form
    setNewTitle('')
    setNewSummary('')
    setNewKeyPointsText('')
    setNewTeacherRemark('')
    setNewTagsText('')
    setNewIsPinned(false)
    setCreateModalOpen(false)
  }

  return (
    <div className="w-full flex flex-col gap-6 pb-12">
      {/* ── Page Header & Action Bar ────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0B1F33] flex items-center justify-center text-[var(--gold)] shadow-md shrink-0">
            <NotebookPen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-[#0B1F33]">
                Daily Notes & Class Highlights
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Day-by-Day Revision
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Review important daily lecture takeaways, key formulas, teacher instructions, and homework assignments.
            </p>
          </div>
        </div>

        {/* Top Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              window.print()
            }}
            className="flex items-center gap-2 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold h-10 px-4"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print Notes</span>
          </Button>

          <Button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 bg-[#102A43] hover:bg-[#0B1F33] text-white rounded-xl text-xs sm:text-sm font-semibold h-10 px-5 shadow-sm"
          >
            <Plus className="w-4 h-4 text-[var(--gold)]" />
            <span>Add Personal Note</span>
          </Button>
        </div>
      </div>

      {/* ── Day-by-Day Horizontal Date Selector ─────────────────────────────── */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-[var(--gold)]" />
            <span className="text-xs font-bold text-[#0B1F33] uppercase tracking-wider">
              Select Day
            </span>
            <span className="text-xs text-slate-500 font-medium">
              (September 2026)
            </span>
          </div>

          <button
            type="button"
            onClick={() => setSelectedDateKey('2026-09-18')}
            className="text-xs font-bold text-[#0B1F33] hover:text-[var(--gold)] hover:underline flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Jump to Today</span>
          </button>
        </div>

        {/* Date Tiles Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
          {daysList.map((day) => {
            const isSelected = day.dateKey === selectedDateKey
            const counts = dateNoteCounts[day.dateKey] || { total: 0, highPriority: 0 }

            return (
              <button
                key={day.dateKey}
                type="button"
                onClick={() => setSelectedDateKey(day.dateKey)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 cursor-pointer text-center relative ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#0B1F33] to-[#102A43] text-white border-[#0B1F33] shadow-lg shadow-[#0B1F33]/20 scale-[1.02]'
                    : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100 hover:border-slate-300 text-slate-700'
                }`}
              >
                {/* Today Pill */}
                {day.isToday && (
                  <span
                    className={`absolute -top-2 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${
                      isSelected
                        ? 'bg-[var(--gold)] text-[#0B1F33]'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    TODAY
                  </span>
                )}

                <span
                  className={`text-[11px] font-bold uppercase tracking-wider ${
                    isSelected ? 'text-[var(--gold)]' : 'text-slate-400'
                  }`}
                >
                  {day.dayName}
                </span>

                <span
                  className={`text-xl sm:text-2xl font-black mt-0.5 ${
                    isSelected ? 'text-white' : 'text-[#0B1F33]'
                  }`}
                >
                  {day.dayNumber}
                </span>

                {/* Note Count Badge */}
                <div className="mt-2 flex items-center gap-1">
                  {counts.total > 0 ? (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {counts.total} {counts.total === 1 ? 'note' : 'notes'}
                    </span>
                  ) : (
                    <span
                      className={`text-[10px] ${
                        isSelected ? 'text-white/60' : 'text-slate-400'
                      }`}
                    >
                      No notes
                    </span>
                  )}

                  {counts.highPriority > 0 && (
                    <span
                      title={`${counts.highPriority} Important note(s)`}
                      className="w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse"
                    />
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Active Day Banner & Day KPI Stats ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Selected Date Summary Card */}
        <div className="md:col-span-4 bg-gradient-to-r from-[#0B1F33] via-[#102A43] to-[#1D3B5C] rounded-3xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--gold)] uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              Day Schedule Focus
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mt-1 text-white">
              {selectedDayInfo.fullDateStr}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              {dayStats.total > 0
                ? `You have ${dayStats.total} key lectures and announcements recorded for this day. Review formulas and marked homework items.`
                : 'No formal lecture notes currently posted for this day. You can record a personal revision note using the button above.'}
            </p>
          </div>

          {/* KPI Strip */}
          <div className="relative z-10 flex items-center gap-3 flex-wrap sm:flex-nowrap">
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15 text-center min-w-[90px]">
              <span className="block text-2xl font-extrabold text-[var(--gold)]">
                {dayStats.total}
              </span>
              <span className="text-[11px] text-slate-300 font-medium uppercase tracking-wider">
                Total Notes
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15 text-center min-w-[90px]">
              <span className="block text-2xl font-extrabold text-rose-400">
                {dayStats.high}
              </span>
              <span className="text-[11px] text-slate-300 font-medium uppercase tracking-wider">
                Important
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15 text-center min-w-[90px]">
              <span className="block text-2xl font-extrabold text-emerald-400">
                {dayStats.completed}
              </span>
              <span className="text-[11px] text-slate-300 font-medium uppercase tracking-wider">
                Completed
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15 text-center min-w-[90px]">
              <span className="block text-2xl font-extrabold text-sky-400">
                {dayStats.attachmentsCount}
              </span>
              <span className="text-[11px] text-slate-300 font-medium uppercase tracking-wider">
                Handouts
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filters & Search Toolbar ────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search notes by formula, topic, teacher, tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 h-10 rounded-xl bg-slate-50/70 border-slate-200 text-xs sm:text-sm focus:bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Badges & Dropdowns */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          {/* Subject Filter */}
          <select
            value={selectedSubjectFilter}
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
            className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50/80 text-xs font-semibold text-[#0B1F33] cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <option value="All">All Subjects</option>
            {AVAILABLE_SUBJECTS.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriorityFilter}
            onChange={(e) => setSelectedPriorityFilter(e.target.value)}
            className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50/80 text-xs font-semibold text-[#0B1F33] cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <option value="All">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="normal">Normal</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50/80 text-xs font-semibold text-[#0B1F33] cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <option value="All">All Categories</option>
            <option value="exam-prep">Exam Prep</option>
            <option value="homework">Homework / Tasks</option>
            <option value="lecture">Class Lecture</option>
            <option value="announcement">School Announcement</option>
          </select>

          {(selectedSubjectFilter !== 'All' ||
            selectedPriorityFilter !== 'All' ||
            selectedCategoryFilter !== 'All' ||
            searchQuery) && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setSelectedSubjectFilter('All')
                setSelectedPriorityFilter('All')
                setSelectedCategoryFilter('All')
                setSearchQuery('')
              }}
              className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-10 rounded-xl"
            >
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {/* ── Day-by-Day Notes Timeline / List ─────────────────────────────────── */}
      {filteredNotes.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200/90 shadow-sm text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[var(--gold)] flex items-center justify-center mb-4">
            <NotebookPen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#0B1F33]">
            No Notes Found for This Day
          </h3>
          <p className="text-sm text-slate-500 max-w-md mt-1 mb-6">
            {searchQuery || selectedSubjectFilter !== 'All' || selectedPriorityFilter !== 'All'
              ? 'No notes match your current search and filter settings. Try resetting filters.'
              : `There are no lecture notes or teacher announcements saved for ${selectedDayInfo.fullDateStr}.`}
          </p>
          <Button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="bg-[#102A43] hover:bg-[#0B1F33] text-white rounded-xl text-xs sm:text-sm font-semibold px-5 h-10 flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-[var(--gold)]" />
            <span>Create a Note for This Day</span>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredNotes.map((note) => {
            const theme = SUBJECT_THEMES[note.subject] || SUBJECT_THEMES['Mathematics']
            const SubjectIcon = theme.icon

            return (
              <div
                key={note.id}
                onClick={() => setDetailModalNote(note)}
                className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer relative flex flex-col gap-4 ${
                  note.isPinned
                    ? 'border-[var(--gold)]/50 bg-gradient-to-b from-amber-50/20 to-white ring-1 ring-[var(--gold)]/20'
                    : 'border-slate-200/90 hover:border-slate-300'
                }`}
              >
                {/* Top Strip: Period, Subject, Priority, Pin/Bookmark */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Period Badge */}
                    <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Period {note.periodNumber} • {note.time}
                    </span>

                    {/* Subject Badge */}
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${theme.badgeBg}`}
                    >
                      <SubjectIcon className="w-3.5 h-3.5" />
                      {note.subject}
                    </span>

                    {/* Priority Badge */}
                    {note.priority === 'high' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />
                        Important / Exam Prep
                      </span>
                    )}

                    {note.category === 'homework' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        Homework / Task
                      </span>
                    )}

                    {note.isPinned && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-[var(--navy)] border border-amber-300 flex items-center gap-1">
                        <Pin className="w-3 h-3 fill-current text-[var(--gold)]" />
                        Pinned to Top
                      </span>
                    )}
                  </div>

                  {/* Actions right */}
                  <div className="flex items-center gap-1.5 ml-auto">
                    {/* Mark Complete Checkbox */}
                    <button
                      type="button"
                      title={note.isCompleted ? 'Mark as Pending' : 'Mark as Reviewed'}
                      onClick={(e) => handleToggleComplete(note.id, e)}
                      className={`p-2 rounded-xl transition-all ${
                        note.isCompleted
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100/80 text-slate-400 hover:text-slate-600 hover:bg-slate-200/70'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>

                    {/* Copy Note */}
                    <button
                      type="button"
                      title="Copy Note Text"
                      onClick={(e) => handleCopyNote(note, e)}
                      className="p-2 rounded-xl bg-slate-100/80 text-slate-400 hover:text-slate-600 hover:bg-slate-200/70 transition-all"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {/* Bookmark */}
                    <button
                      type="button"
                      title={note.isBookmarked ? 'Bookmarked' : 'Add to Bookmarks'}
                      onClick={(e) => handleToggleBookmark(note.id, e)}
                      className={`p-2 rounded-xl transition-all ${
                        note.isBookmarked
                          ? 'bg-amber-100 text-amber-600'
                          : 'bg-slate-100/80 text-slate-400 hover:text-amber-500 hover:bg-slate-200/70'
                      }`}
                    >
                      <Star
                        className={`w-4 h-4 ${note.isBookmarked ? 'fill-amber-500' : ''}`}
                      />
                    </button>

                    {/* Pin Note */}
                    <button
                      type="button"
                      title={note.isPinned ? 'Unpin Note' : 'Pin Note'}
                      onClick={(e) => handleTogglePin(note.id, e)}
                      className={`p-2 rounded-xl transition-all ${
                        note.isPinned
                          ? 'bg-amber-200/80 text-[var(--navy)]'
                          : 'bg-slate-100/80 text-slate-400 hover:text-[var(--navy)] hover:bg-slate-200/70'
                      }`}
                    >
                      <Pin
                        className={`w-4 h-4 ${note.isPinned ? 'fill-[var(--gold)]' : ''}`}
                      />
                    </button>
                  </div>
                </div>

                {/* Title & Teacher Info */}
                <div>
                  <h3
                    className={`text-base sm:text-lg font-bold text-[#0B1F33] hover:text-[var(--gold)] transition-colors ${
                      note.isCompleted ? 'line-through text-slate-400' : ''
                    }`}
                  >
                    {note.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Faculty: {note.teacher}</span>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {note.summary}
                </p>

                {/* Key Points Bullet list */}
                {note.keyPoints && note.keyPoints.length > 0 && (
                  <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-100 flex flex-col gap-2">
                    <span className="text-xs font-bold text-[#0B1F33] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" />
                      Key Lecture Notes & Takeaways
                    </span>
                    <ul className="flex flex-col gap-1.5 mt-0.5">
                      {note.keyPoints.map((point, idx) => (
                        <li
                          key={idx}
                          className="text-xs sm:text-sm text-slate-700 flex items-start gap-2.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] mt-2 shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Teacher Remark Callout */}
                {note.teacherRemark && (
                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Faculty Advisory: </span>
                      <span>{note.teacherRemark}</span>
                    </div>
                  </div>
                )}

                {/* Attachments & Tags Footer */}
                <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 flex-wrap">
                  {/* Attachments */}
                  {note.attachments && note.attachments.length > 0 ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      {note.attachments.map((att, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={(e) => handleDownloadAttachment(att.name, e)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer border border-slate-200/80"
                        >
                          <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                          <span className="max-w-[150px] truncate">{att.name}</span>
                          <span className="text-[10px] text-slate-400">({att.size})</span>
                          <Download className="w-3 h-3 text-slate-500 ml-0.5" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 italic">
                      No attachments uploaded
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex items-center gap-1.5 flex-wrap ml-auto">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Modal: View Full Note Details ───────────────────────────────────── */}
      <Dialog
        open={Boolean(detailModalNote)}
        onOpenChange={(open) => !open && setDetailModalNote(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6">
          {detailModalNote && (
            <div className="flex flex-col gap-5">
              <DialogClose onClose={() => setDetailModalNote(null)} />
              <DialogHeader>
                <div className="flex items-center gap-2 flex-wrap pb-1">
                  <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-700">
                    Period {detailModalNote.periodNumber} • {detailModalNote.time}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                      SUBJECT_THEMES[detailModalNote.subject]?.badgeBg || 'bg-slate-100'
                    }`}
                  >
                    {detailModalNote.subject}
                  </span>
                  {detailModalNote.priority === 'high' && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      High Priority
                    </span>
                  )}
                </div>
                <DialogTitle className="text-xl font-bold text-[#0B1F33] mt-1">
                  {detailModalNote.title}
                </DialogTitle>
                <p className="text-xs text-slate-500">
                  Faculty: {detailModalNote.teacher} • Recorded on {selectedDayInfo.fullDateStr}
                </p>
              </DialogHeader>

              {/* Note Overview */}
              <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="font-bold text-[#0B1F33] block mb-1">Summary</span>
                {detailModalNote.summary}
              </div>

              {/* Key Bullet Points */}
              {detailModalNote.keyPoints && detailModalNote.keyPoints.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-[#0B1F33] uppercase tracking-wider">
                    Key Lecture Takeaways & Formulas
                  </span>
                  <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 flex flex-col gap-2">
                    {detailModalNote.keyPoints.map((point, i) => (
                      <div key={i} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] mt-2 shrink-0" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Faculty Remark */}
              {detailModalNote.teacherRemark && (
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200/80 text-xs sm:text-sm text-amber-900">
                  <span className="font-bold block mb-1">Faculty Advisory / Next Steps</span>
                  {detailModalNote.teacherRemark}
                </div>
              )}

              {/* Attachments */}
              {detailModalNote.attachments && detailModalNote.attachments.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-[#0B1F33] uppercase tracking-wider">
                    Attached Reference Files
                  </span>
                  <div className="flex flex-col gap-2">
                    {detailModalNote.attachments.map((att, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-600" />
                          <span className="font-semibold text-slate-800">{att.name}</span>
                          <span className="text-slate-400">({att.size})</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadAttachment(att.name)}
                          className="h-8 text-xs flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <DialogFooter className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleCopyNote(detailModalNote)}
                  className="flex items-center gap-1.5 text-xs h-9 rounded-xl"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy Note
                </Button>

                <Button
                  type="button"
                  onClick={() => setDetailModalNote(null)}
                  className="bg-[#102A43] hover:bg-[#0B1F33] text-white text-xs h-9 rounded-xl px-5"
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Modal: Add New Personal Note ────────────────────────────────────── */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl p-6">
          <DialogClose onClose={() => setCreateModalOpen(false)} />
          <form onSubmit={handleCreateNoteSubmit} className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-[#0B1F33]">
                Add Daily Study Note
              </DialogTitle>
              <p className="text-xs text-slate-500">
                Adding note to {selectedDayInfo.fullDateStr}
              </p>
            </DialogHeader>

            {/* Note Title */}
            <div>
              <label className="block text-xs font-bold text-[#0B1F33] mb-1">
                Note Title <span className="text-rose-500">*</span>
              </label>
              <Input
                required
                placeholder="e.g. Thermodynamics - Second Law & Entropy Derivation"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="h-10 text-xs sm:text-sm rounded-xl"
              />
            </div>

            {/* Subject & Period row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#0B1F33] mb-1">
                  Subject
                </label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-[#0B1F33]"
                >
                  {AVAILABLE_SUBJECTS.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B1F33] mb-1">
                  Period & Time
                </label>
                <div className="flex gap-2">
                  <select
                    value={newPeriod}
                    onChange={(e) => setNewPeriod(Number(e.target.value))}
                    className="w-24 h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-[#0B1F33]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((p) => (
                      <option key={p} value={p}>
                        P{p}
                      </option>
                    ))}
                  </select>
                  <Input
                    placeholder="e.g. 09:00 AM - 09:50 AM"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="flex-1 h-10 text-xs rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Teacher Name, Priority & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#0B1F33] mb-1">
                  Faculty / Teacher Name
                </label>
                <Input
                  placeholder="e.g. Dr. Robert Vance"
                  value={newTeacher}
                  onChange={(e) => setNewTeacher(e.target.value)}
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B1F33] mb-1">
                  Priority
                </label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as NotePriority)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-[#0B1F33]"
                >
                  <option value="normal">Normal</option>
                  <option value="medium">Medium</option>
                  <option value="high">High Priority / Exam Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B1F33] mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as NoteCategory)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-[#0B1F33]"
                >
                  <option value="lecture">Class Lecture</option>
                  <option value="homework">Homework / Task</option>
                  <option value="exam-prep">Exam Prep</option>
                  <option value="announcement">Announcement</option>
                </select>
              </div>
            </div>

            {/* Note Summary */}
            <div>
              <label className="block text-xs font-bold text-[#0B1F33] mb-1">
                Summary / Core Concept <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                placeholder="Brief 1-2 line summary of what was covered in this session..."
                value={newSummary}
                onChange={(e) => setNewSummary(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm focus:border-[#102A43] focus:outline-none resize-none"
              />
            </div>

            {/* Key Bullet Points */}
            <div>
              <label className="block text-xs font-bold text-[#0B1F33] mb-1">
                Key Bullet Points / Formulas (one per line)
              </label>
              <textarea
                rows={3}
                placeholder="Formula 1: Sn = n/2 [2a + (n-1)d]&#10;Point 2: Remember to invert signs in matrix equations&#10;Homework: Exercise 5.3 Q1-10"
                value={newKeyPointsText}
                onChange={(e) => setNewKeyPointsText(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm focus:border-[#102A43] focus:outline-none resize-none"
              />
            </div>

            {/* Teacher Remark */}
            <div>
              <label className="block text-xs font-bold text-[#0B1F33] mb-1">
                Teacher Remark / Advisory (Optional)
              </label>
              <Input
                placeholder="e.g. Bring geometry box and graph paper tomorrow"
                value={newTeacherRemark}
                onChange={(e) => setNewTeacherRemark(e.target.value)}
                className="h-10 text-xs rounded-xl"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-bold text-[#0B1F33] mb-1">
                Tags (comma separated)
              </label>
              <Input
                placeholder="Algebra, Formulas, BoardExam, Homework"
                value={newTagsText}
                onChange={(e) => setNewTagsText(e.target.value)}
                className="h-10 text-xs rounded-xl"
              />
            </div>

            {/* Pin note toggle */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="pinToggle"
                checked={newIsPinned}
                onChange={(e) => setNewIsPinned(e.target.checked)}
                className="w-4 h-4 rounded text-[#102A43] border-slate-300 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="pinToggle" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Pin this note to the top of the day
              </label>
            </div>

            <DialogFooter className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateModalOpen(false)}
                className="text-xs h-10 rounded-xl px-4"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#102A43] hover:bg-[#0B1F33] text-white text-xs font-semibold h-10 rounded-xl px-5 flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 text-[var(--gold)]" />
                Save Note
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
