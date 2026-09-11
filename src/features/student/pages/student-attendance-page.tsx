import { useState, useMemo, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Info,
  Save,
  RotateCcw,
  Calendar,
} from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { toast } from 'sonner'

// ── Attendance Status Types ──────────────────────────────────────────────────
export type AttendanceStatus = 'present' | 'absent' | 'half_day' | 'leave' | 'holiday' | 'unmarked'

export interface AttendanceRecord {
  dateStr: string // YYYY-MM-DD
  status: AttendanceStatus
  checkIn?: string
  checkOut?: string
  reason?: string
  notes?: string
  recordedBy?: string
}

// ── Storage Key ─────────────────────────────────────────────────────────────
const STORAGE_KEY = 'edu_student_attendance_records_v1'

// ── Helper to format date keys YYYY-MM-DD ─────────────────────────────────────
function formatDateKey(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${year}-${m}-${d}`
}

// ── Generate Default Realistic Mock Records ──────────────────────────────────
function generateDefaultRecords(): Record<string, AttendanceRecord> {
  const records: Record<string, AttendanceRecord> = {}
  const now = new Date(2026, 8, 11) // Sep 11, 2026
  const year = now.getFullYear()
  const month = now.getMonth() // 8 = September

  // Generate days 1 to 11 for September 2026
  for (let d = 1; d <= 30; d++) {
    const dayDate = new Date(year, month, d)
    const dayOfWeek = dayDate.getDay() // 0 = Sun, 6 = Sat
    const key = formatDateKey(year, month, d)

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      records[key] = {
        dateStr: key,
        status: 'holiday',
        notes: dayOfWeek === 0 ? 'Sunday - Weekend' : 'Saturday - Weekend',
      }
    } else if (d <= 11) {
      // Past days up to today
      if (d === 3) {
        records[key] = {
          dateStr: key,
          status: 'leave',
          reason: 'Sick Leave',
          notes: 'Doctor appointment & viral fever recovery',
        }
      } else if (d === 8) {
        records[key] = {
          dateStr: key,
          status: 'half_day',
          checkIn: '08:30 AM',
          checkOut: '12:30 PM',
          reason: 'Personal Emergency',
          notes: 'Departed after midterm assessment',
        }
      } else if (d === 7) {
        records[key] = {
          dateStr: key,
          status: 'absent',
          reason: 'Unexcused Absence',
          notes: 'Missed morning roll call',
        }
      } else {
        records[key] = {
          dateStr: key,
          status: 'present',
          checkIn: '08:25 AM',
          checkOut: '03:30 PM',
          notes: 'Full day attended - All 6 periods',
        }
      }
    }
  }

  return records
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function StudentAttendancePage() {
  const { user } = useAuth()
  const studentName = user?.firstName || 'Student'
  const standard = user?.standard || 'Enrolled Class'
  const rollNumber = user?.rollNumber || '—'

  // Today reference: Sep 11, 2026
  const today = useMemo(() => new Date(2026, 8, 11), [])
  const todayKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate())

  // Current Calendar Month View State
  const [currentYear, setCurrentYear] = useState(2026)
  const [currentMonth, setCurrentMonth] = useState(8) // 8 = September

  // Selected Date State (Defaults to Today)
  const [selectedDate, setSelectedDate] = useState<Date>(today)
  const selectedKey = formatDateKey(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate()
  )

  // Attendance Records State
  const [records, setRecords] = useState<Record<string, AttendanceRecord>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {
      // ignore
    }
    return generateDefaultRecords()
  })

  // Save records to local storage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
    } catch {
      // ignore
    }
  }, [records])

  // Form State for the Right-Half Editor Panel
  const currentRecord = records[selectedKey]
  const [formStatus, setFormStatus] = useState<AttendanceStatus>('present')
  const [formCheckIn, setFormCheckIn] = useState('08:30 AM')
  const [formCheckOut, setFormCheckOut] = useState('03:30 PM')
  const [formReason, setFormReason] = useState('Regular Attendance')
  const [formNotes, setFormNotes] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Sync form inputs whenever selectedDate changes
  useEffect(() => {
    if (currentRecord) {
      setFormStatus(currentRecord.status)
      setFormCheckIn(currentRecord.checkIn || '08:30 AM')
      setFormCheckOut(currentRecord.checkOut || '03:30 PM')
      setFormReason(currentRecord.reason || (currentRecord.status === 'present' ? 'Regular Attendance' : 'Personal Leave'))
      setFormNotes(currentRecord.notes || '')
    } else {
      const isWeekend = selectedDate.getDay() === 0 || selectedDate.getDay() === 6
      setFormStatus(isWeekend ? 'holiday' : 'present')
      setFormCheckIn('08:30 AM')
      setFormCheckOut('03:30 PM')
      setFormReason(isWeekend ? 'Weekend Off' : 'Regular Attendance')
      setFormNotes('')
    }
  }, [selectedKey, currentRecord, selectedDate])

  // ── Month Navigation ───────────────────────────────────────────────────────
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear((y) => y - 1)
    } else {
      setCurrentMonth((m) => m - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear((y) => y + 1)
    } else {
      setCurrentMonth((m) => m + 1)
    }
  }

  const handleJumpToToday = () => {
    setCurrentYear(today.getFullYear())
    setCurrentMonth(today.getMonth())
    setSelectedDate(today)
  }

  // ── Calendar Days Calculation ──────────────────────────────────────────────
  const calendarGrid = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

    // Day of week for day 1 (0=Sunday, 1=Monday, ..., 6=Saturday)
    // Convert to Mon=0, Tue=1, ..., Sun=6
    let startDay = firstDayOfMonth.getDay() - 1
    if (startDay < 0) startDay = 6

    const cells: Array<{
      date: Date
      isCurrentMonth: boolean
      dayNumber: number
      key: string
      status: AttendanceStatus
      isToday: boolean
      isSelected: boolean
      isWeekend: boolean
    }> = []

    // Previous month padding days
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate()
    for (let i = startDay - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear
      const d = new Date(prevYear, prevMonth, dayNum)
      const key = formatDateKey(prevYear, prevMonth, dayNum)
      const isWeekend = d.getDay() === 0 || d.getDay() === 6
      cells.push({
        date: d,
        isCurrentMonth: false,
        dayNumber: dayNum,
        key,
        status: records[key]?.status || (isWeekend ? 'holiday' : 'unmarked'),
        isToday: key === todayKey,
        isSelected: key === selectedKey,
        isWeekend,
      })
    }

    // Current month days
    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const d = new Date(currentYear, currentMonth, dayNum)
      const key = formatDateKey(currentYear, currentMonth, dayNum)
      const isWeekend = d.getDay() === 0 || d.getDay() === 6
      cells.push({
        date: d,
        isCurrentMonth: true,
        dayNumber: dayNum,
        key,
        status: records[key]?.status || (isWeekend ? 'holiday' : 'unmarked'),
        isToday: key === todayKey,
        isSelected: key === selectedKey,
        isWeekend,
      })
    }

    // Next month padding days to complete grid (multiples of 7)
    const remaining = 7 - (cells.length % 7)
    if (remaining < 7) {
      for (let dayNum = 1; dayNum <= remaining; dayNum++) {
        const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1
        const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear
        const d = new Date(nextYear, nextMonth, dayNum)
        const key = formatDateKey(nextYear, nextMonth, dayNum)
        const isWeekend = d.getDay() === 0 || d.getDay() === 6
        cells.push({
          date: d,
          isCurrentMonth: false,
          dayNumber: dayNum,
          key,
          status: records[key]?.status || (isWeekend ? 'holiday' : 'unmarked'),
          isToday: key === todayKey,
          isSelected: key === selectedKey,
          isWeekend,
        })
      }
    }

    return cells
  }, [currentYear, currentMonth, records, todayKey, selectedKey])

  // ── Monthly Attendance Analytics ───────────────────────────────────────────
  const monthlyStats = useMemo(() => {
    let presentCount = 0
    let absentCount = 0
    let leaveCount = 0
    let halfDayCount = 0
    let totalWorkingDays = 0

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    for (let d = 1; d <= daysInMonth; d++) {
      const dayDate = new Date(currentYear, currentMonth, d)
      const isWeekend = dayDate.getDay() === 0 || dayDate.getDay() === 6
      const key = formatDateKey(currentYear, currentMonth, d)
      const rec = records[key]

      if (!isWeekend) {
        totalWorkingDays++
        if (rec?.status === 'present') presentCount++
        else if (rec?.status === 'absent') absentCount++
        else if (rec?.status === 'leave') leaveCount++
        else if (rec?.status === 'half_day') {
          halfDayCount++
          presentCount += 0.5
        }
      }
    }

    const effectivePresent = presentCount
    const attendancePercentage = totalWorkingDays > 0
      ? Math.round((effectivePresent / Math.min(totalWorkingDays, 11)) * 100) // normalized to past days
      : 100

    return {
      presentCount: Math.floor(presentCount),
      absentCount,
      leaveCount,
      halfDayCount,
      totalWorkingDays,
      attendancePercentage: Math.min(100, Math.max(0, attendancePercentage)),
    }
  }, [currentYear, currentMonth, records])

  // ── Save Attendance Handler ────────────────────────────────────────────────
  const handleSaveAttendance = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // Simulate saving response
    await new Promise((r) => setTimeout(r, 400))

    const updatedRecord: AttendanceRecord = {
      dateStr: selectedKey,
      status: formStatus,
      checkIn: formStatus === 'present' || formStatus === 'half_day' ? formCheckIn : undefined,
      checkOut: formStatus === 'present' || formStatus === 'half_day' ? formCheckOut : undefined,
      reason: formReason.trim() || undefined,
      notes: formNotes.trim() || undefined,
      recordedBy: `${studentName} (Self)`,
    }

    setRecords((prev) => ({
      ...prev,
      [selectedKey]: updatedRecord,
    }))

    setIsSaving(false)
    const formattedDateTitle = selectedDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    toast.success(`Attendance updated for ${formattedDateTitle}: ${formStatus.toUpperCase()}`)
  }

  // ── Quick Status Helpers ───────────────────────────────────────────────────
  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Present
          </span>
        )
      case 'absent':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-700 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Absent
          </span>
        )
      case 'half_day':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-800 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Half Day
          </span>
        )
      case 'leave':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-700 border border-blue-500/30">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            Excused Leave
          </span>
        )
      case 'holiday':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Holiday / Weekend
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            Not Marked
          </span>
        )
    }
  }

  const isSelectedDateFuture = selectedDate.getTime() > today.getTime()
  const isSelectedDateToday = selectedKey === todayKey

  return (
    <div className="flex flex-col gap-6 pb-12 font-sans">
      {/* ── Top Hero Banner ───────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 md:p-10 border border-[var(--border)]/70 shadow-sm"
        style={{
          background: 'linear-gradient(135deg, #0B2545 0%, #134074 60%, #1D4E89 100%)',
        }}
      >
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[var(--gold)]/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--gold)]/20 border border-[var(--gold)]/40 text-[var(--gold)] text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Student Attendance Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Attendance Calendar &amp; Logging
            </h1>
            <p className="text-sm md:text-base text-gray-200 font-medium max-w-xl">
              Hello <span className="text-[var(--gold)] font-semibold">{studentName}</span>. Select any date on the calendar to review, mark, or update your presence for <span className="text-white font-semibold">{standard}</span> (Roll #{rollNumber}).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 shadow-inner">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-white/70 font-medium uppercase tracking-wider">Month Attendance</p>
                <p className="text-2xl font-black text-white">{monthlyStats.attendancePercentage}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI Summary Quick Metric Strip ────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Present</p>
            <p className="text-xl font-extrabold text-slate-800">{monthlyStats.presentCount} <span className="text-xs font-normal text-slate-400">days</span></p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Absent</p>
            <p className="text-xl font-extrabold text-slate-800">{monthlyStats.absentCount} <span className="text-xs font-normal text-slate-400">days</span></p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Half Day</p>
            <p className="text-xl font-extrabold text-slate-800">{monthlyStats.halfDayCount} <span className="text-xs font-normal text-slate-400">days</span></p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Leave</p>
            <p className="text-xl font-extrabold text-slate-800">{monthlyStats.leaveCount} <span className="text-xs font-normal text-slate-400">days</span></p>
          </div>
        </div>
      </div>

      {/* ── Main Split View: Left Half Calendar | Right Half Attendance Editor ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* LEFT HALF: CALENDAR GRID (7 Cols on desktop)                       */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col gap-5">
          {/* Calendar Header with Navigation */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B1F33] flex items-center justify-center text-[var(--gold)] shadow-sm">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#0B1F33]">
                  {MONTH_NAMES[currentMonth]} {currentYear}
                </h2>
                <p className="text-xs text-slate-500">
                  Select any day to mark or update attendance
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Previous Month"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white transition-all shadow-xs cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleJumpToToday}
                className="px-2.5 h-8 text-xs font-bold text-[#0B1F33] hover:bg-white rounded-lg transition-all cursor-pointer"
              >
                Today
              </button>

              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Next Month"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white transition-all shadow-xs cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Legend Strip */}
          <div className="flex flex-wrap items-center gap-3 text-xs px-2 py-2 bg-slate-50/80 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-medium mr-1 text-[11px] uppercase">Legend:</span>
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
              Present
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-200" />
              Absent
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-200" />
              Half Day
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-blue-200" />
              Leave
            </span>
            <span className="flex items-center gap-1.5 text-slate-400 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              Weekend
            </span>
          </div>

          {/* Weekday Column Headers */}
          <div className="grid grid-cols-7 gap-2 text-center">
            {DAY_NAMES.map((day, idx) => (
              <div
                key={day}
                className={`text-xs font-bold uppercase tracking-wider py-1.5 rounded-lg ${
                  idx >= 5 ? 'text-amber-700/80 bg-amber-50/40' : 'text-slate-500'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid Cells */}
          <div className="grid grid-cols-7 gap-2">
            {calendarGrid.map((cell) => {
              const isCellSelected = cell.isSelected
              const isCellToday = cell.isToday
              const isOffMonth = !cell.isCurrentMonth

              // Status dot and pill colors
              let statusPill = null
              let statusBg = 'bg-white hover:bg-slate-50'

              if (cell.status === 'present') {
                statusBg = 'bg-emerald-50/60 border-emerald-200/80 hover:bg-emerald-100/70'
                statusPill = (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100/90 px-1.5 py-0.2 rounded-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    P
                  </span>
                )
              } else if (cell.status === 'absent') {
                statusBg = 'bg-rose-50/70 border-rose-200/80 hover:bg-rose-100/70'
                statusPill = (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-700 bg-rose-100/90 px-1.5 py-0.2 rounded-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    A
                  </span>
                )
              } else if (cell.status === 'half_day') {
                statusBg = 'bg-amber-50/70 border-amber-200/80 hover:bg-amber-100/70'
                statusPill = (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-800 bg-amber-100/90 px-1.5 py-0.2 rounded-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    HD
                  </span>
                )
              } else if (cell.status === 'leave') {
                statusBg = 'bg-blue-50/70 border-blue-200/80 hover:bg-blue-100/70'
                statusPill = (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-blue-700 bg-blue-100/90 px-1.5 py-0.2 rounded-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    L
                  </span>
                )
              } else if (cell.isWeekend) {
                statusBg = 'bg-slate-50/60 border-slate-200/60 hover:bg-slate-100/50'
                statusPill = (
                  <span className="text-[10px] font-medium text-slate-400">
                    Off
                  </span>
                )
              }

              return (
                <button
                  key={cell.key}
                  type="button"
                  onClick={() => setSelectedDate(cell.date)}
                  className={`relative min-h-[68px] sm:min-h-[76px] p-2 rounded-2xl border transition-all duration-200 flex flex-col justify-between items-start text-left cursor-pointer group ${statusBg} ${
                    isOffMonth ? 'opacity-40' : 'opacity-100'
                  } ${
                    isCellSelected
                      ? '!border-[#B8862C] !ring-2 !ring-[#B8862C] shadow-lg scale-[1.03] z-10 !bg-gradient-to-b from-white to-amber-50/50'
                      : 'border-slate-200/70 hover:border-slate-300'
                  }`}
                >
                  {/* Top: Day Number + Today Indicator */}
                  <div className="w-full flex items-center justify-between">
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isCellToday
                          ? 'bg-[#0B1F33] text-[var(--gold)] shadow-xs'
                          : isCellSelected
                          ? 'text-[#0B1F33] font-black'
                          : 'text-slate-700 group-hover:text-slate-900'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>

                    {isCellToday && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-amber-600 bg-amber-100/80 px-1.5 py-0.5 rounded-md">
                        Today
                      </span>
                    )}
                  </div>

                  {/* Bottom: Status Pill */}
                  <div className="w-full flex items-center justify-between mt-1">
                    {statusPill || <span className="text-[10px] text-slate-300">—</span>}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Bottom Info note */}
          <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              Attendance is recorded daily. To request official leaves or corrections, select the date and submit below.
            </span>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* RIGHT HALF: ATTENDANCE ENTRY & DETAILS PANEL (5 Cols on desktop)   */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col gap-6 sticky top-24">
          {/* Header for Selected Date */}
          <div className="pb-4 border-b border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#B8862C]" />
                Selected Date
              </span>

              {isSelectedDateToday && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20">
                  Today&apos;s Date
                </span>
              )}
            </div>

            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-extrabold text-[#0B1F33] tracking-tight">
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {standard} • Student #{rollNumber}
                </p>
              </div>

              <div>{getStatusBadge(formStatus)}</div>
            </div>
          </div>

          {/* Notice for Future Dates or Weekends */}
          {isSelectedDateFuture && (
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-800 text-xs font-medium">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                This date is in the future. You can schedule planned excused leaves in advance.
              </span>
            </div>
          )}

          {/* Interactive Attendance Form */}
          <form onSubmit={handleSaveAttendance} className="space-y-5">
            {/* Status Option Radios / Cards */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                Select Attendance Status
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                {/* 1. Present */}
                <button
                  type="button"
                  onClick={() => setFormStatus('present')}
                  className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    formStatus === 'present'
                      ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/30 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      formStatus === 'present'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-emerald-100/70 text-emerald-600'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Present</span>
                    <span className="text-[10px] text-slate-500">Attended full day</span>
                  </div>
                </button>

                {/* 2. Absent */}
                <button
                  type="button"
                  onClick={() => setFormStatus('absent')}
                  className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    formStatus === 'absent'
                      ? 'bg-rose-50/90 border-rose-500 ring-2 ring-rose-500/30 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      formStatus === 'absent'
                        ? 'bg-rose-500 text-white'
                        : 'bg-rose-100/70 text-rose-600'
                    }`}
                  >
                    <XCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Absent</span>
                    <span className="text-[10px] text-slate-500">Unexcused absence</span>
                  </div>
                </button>

                {/* 3. Half Day */}
                <button
                  type="button"
                  onClick={() => setFormStatus('half_day')}
                  className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    formStatus === 'half_day'
                      ? 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-500/30 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      formStatus === 'half_day'
                        ? 'bg-amber-500 text-white'
                        : 'bg-amber-100/70 text-amber-600'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Half Day</span>
                    <span className="text-[10px] text-slate-500">Partial attendance</span>
                  </div>
                </button>

                {/* 4. Excused Leave */}
                <button
                  type="button"
                  onClick={() => setFormStatus('leave')}
                  className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    formStatus === 'leave'
                      ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-500/30 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      formStatus === 'leave'
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-100/70 text-blue-600'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Excused Leave</span>
                    <span className="text-[10px] text-slate-500">Medical or approved</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Conditional Sub-fields: Timing or Reason */}
            {(formStatus === 'present' || formStatus === 'half_day') && (
              <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-3">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#B8862C]" />
                  Session Check-in / Check-out
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Check-in Time</label>
                    <Input
                      value={formCheckIn}
                      onChange={(e) => setFormCheckIn(e.target.value)}
                      placeholder="08:30 AM"
                      className="bg-white text-xs h-9"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Check-out Time</label>
                    <Input
                      value={formCheckOut}
                      onChange={(e) => setFormCheckOut(e.target.value)}
                      placeholder="03:30 PM"
                      className="bg-white text-xs h-9"
                    />
                  </div>
                </div>
              </div>
            )}

            {(formStatus === 'absent' || formStatus === 'leave' || formStatus === 'half_day') && (
              <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-3">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#B8862C]" />
                  Reason for Absence / Leave
                </p>

                <div className="space-y-2">
                  <select
                    value={formReason}
                    onChange={(e) => setFormReason(e.target.value)}
                    className="w-full text-xs h-9 px-3 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#B8862C]/40"
                  >
                    <option value="Regular Attendance">Regular Attendance</option>
                    <option value="Medical / Sick Leave">Medical / Sick Leave</option>
                    <option value="Doctor Appointment">Doctor Appointment</option>
                    <option value="Family Function">Family Function</option>
                    <option value="Personal Emergency">Personal Emergency</option>
                    <option value="Unexcused Absence">Unexcused Absence</option>
                    <option value="School Sanctioned Event">School Sanctioned Event / Competition</option>
                    <option value="Other">Other Reason</option>
                  </select>

                  <textarea
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Optional remarks or notes for class teacher..."
                    rows={2}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B8862C]/40 resize-none"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-gradient-to-r from-[#0B1F33] to-[#1A365D] hover:from-[#102A43] hover:to-[#224570] text-white font-bold text-xs h-11 rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    Saving Record...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-[var(--gold)]" />
                    Save &amp; Update Status
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormStatus('present')
                  setFormCheckIn('08:30 AM')
                  setFormCheckOut('03:30 PM')
                  setFormReason('Regular Attendance')
                  setFormNotes('')
                }}
                className="h-11 px-4 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
              >
                Reset
              </Button>
            </div>
          </form>

          {/* Audit Timestamp Footnote */}
          {currentRecord?.recordedBy && (
            <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-100">
              <span>Last updated:</span>
              <span className="font-medium text-slate-600">
                {currentRecord.recordedBy}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
