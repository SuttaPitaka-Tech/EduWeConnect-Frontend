import { useState, useRef, useEffect, useMemo } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Sparkles,
  Bell,
  CalendarDays,
  Plus,
  X,
  FileText,
  ChevronDown,
  Check,
  Search,
  Trash2,
} from 'lucide-react'
import {
  format,
  addMonths,
  subMonths,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  getDaysInMonth,
  getDay,
} from 'date-fns'
import { useAuth } from '@/contexts/auth-context'
import { fetchChatContactsApi, type ChatContact } from '@/features/chat/api/chat.api'
import { normalizeRole } from '@/features/chat/chat-permissions'
import { toast } from 'sonner'
import {
  createMeetingScheduleApi,
  fetchMyMeetingsApi,
  type MeetingScheduleRecord,
} from '../api/calendar.api'

interface ScheduleItem {
  id: string
  category: 'MEETING' | 'EVENT' | 'IMPORTANT NOTE'
  title: string
  time?: string
  meta: string
  iconType: 'meeting' | 'event' | 'note'
}

type ActionType = 'schedule_meeting' | 'add_note'

// Dynamically generated weekday headers from date-fns (Sunday to Saturday)
const WEEKDAY_NAMES = eachDayOfInterval({
  start: startOfWeek(new Date(), { weekStartsOn: 0 }),
  end: endOfWeek(new Date(), { weekStartsOn: 0 }),
}).map((d) => format(d, 'EEE').toUpperCase())

/**
 * Validates whether the logged-in user can schedule a meeting with a target user
 * based on role permissions (strictly matches the specified Chat permission rules):
 * - Organization Admin -> Student, Staff, Super Admin
 * - Super Admin -> Organization Admin, Staff, Student
 * - Student -> Other Students, Organization Admin, Super Admin
 * - Staff -> Student, Other Staff, Organization Admin, Super Admin
 */
function canScheduleMeetingWith(currentUserRole?: string, targetRole?: string): boolean {
  if (!currentUserRole) return true
  const myRole = normalizeRole(currentUserRole)
  const target = normalizeRole(targetRole)

  if (myRole === 'institution_admin') {
    return target === 'student' || target === 'staff' || target === 'super_admin'
  }
  if (myRole === 'super_admin') {
    return target === 'institution_admin' || target === 'staff' || target === 'student'
  }
  if (myRole === 'student') {
    return target === 'student' || target === 'institution_admin' || target === 'super_admin'
  }
  if (myRole === 'staff') {
    return target === 'student' || target === 'staff' || target === 'institution_admin' || target === 'super_admin'
  }
  return true
}

function getRoleBadge(role?: string) {
  const norm = normalizeRole(role)
  switch (norm) {
    case 'super_admin':
      return {
        label: 'Super Admin',
        className: 'bg-purple-50 text-purple-700 border-purple-200/80',
      }
    case 'institution_admin':
      return {
        label: 'Org Admin',
        className: 'bg-blue-50 text-blue-700 border-blue-200/80',
      }
    case 'staff':
      return {
        label: 'Staff & Teachers',
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      }
    case 'student':
      return {
        label: 'Student',
        className: 'bg-amber-50 text-amber-700 border-amber-200/80',
      }
    default:
      return {
        label: role || 'Member',
        className: 'bg-stone-50 text-stone-700 border-stone-200/80',
      }
  }
}

interface TimeFieldProps {
  value: string
  onChange: (val: string) => void
  label: string
}

function TimeField({ value, onChange, label }: TimeFieldProps) {
  const [isOpen, setIsOpen] = useState(false)
  const hourRef = useRef<HTMLInputElement>(null)
  const minuteRef = useRef<HTMLInputElement>(null)
  const secondRef = useRef<HTMLInputElement>(null)

  // Parse time: supports "09:30:00 AM", "09:30 AM", etc.
  const match = value.match(/^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?\s*(AM|PM)?$/i)
  const hour = match ? match[1].padStart(2, '0') : '09'
  const minute = match ? match[2].padStart(2, '0') : '30'
  const second = match ? (match[3] || '00').padStart(2, '0') : '00'
  const period = (match?.[4]?.toUpperCase() || 'AM') as 'AM' | 'PM'

  const updateTime = (newH: string, newM: string, newS: string, newP: 'AM' | 'PM') => {
    onChange(`${newH}:${newM}:${newS} ${newP}`)
  }

  const handleHourChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '')
    if (!digits) {
      updateTime('00', minute, second, period)
      return
    }
    let num = parseInt(digits, 10)
    if (num > 12) num = 12
    if (num < 1 && digits.length === 2) num = 1
    const val = String(num).padStart(digits.length === 2 ? 2 : 1, '0')
    updateTime(val.padStart(2, '0'), minute, second, period)
    if (digits.length >= 2 || num >= 2) {
      minuteRef.current?.focus()
      minuteRef.current?.select()
    }
  }

  const handleMinuteChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '')
    if (!digits) {
      updateTime(hour, '00', second, period)
      return
    }
    let num = parseInt(digits, 10)
    if (num > 59) num = 59
    const val = String(num).padStart(digits.length === 2 ? 2 : 1, '0')
    updateTime(hour, val.padStart(2, '0'), second, period)
    if (digits.length >= 2 || num >= 6) {
      secondRef.current?.focus()
      secondRef.current?.select()
    }
  }

  const handleSecondChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '')
    if (!digits) {
      updateTime(hour, minute, '00', period)
      return
    }
    let num = parseInt(digits, 10)
    if (num > 59) num = 59
    const val = String(num).padStart(digits.length === 2 ? 2 : 1, '0')
    updateTime(hour, minute, val.padStart(2, '0'), period)
  }

  const togglePeriod = () => {
    updateTime(hour, minute, second, period === 'AM' ? 'PM' : 'AM')
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: 'hour' | 'minute' | 'second'
  ) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (field === 'hour') {
        const next = parseInt(hour, 10) >= 12 ? 1 : parseInt(hour, 10) + 1
        updateTime(String(next).padStart(2, '0'), minute, second, period)
      } else if (field === 'minute') {
        const next = parseInt(minute, 10) >= 59 ? 0 : parseInt(minute, 10) + 1
        updateTime(hour, String(next).padStart(2, '0'), second, period)
      } else {
        const next = parseInt(second, 10) >= 59 ? 0 : parseInt(second, 10) + 1
        updateTime(hour, minute, String(next).padStart(2, '0'), period)
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (field === 'hour') {
        const next = parseInt(hour, 10) <= 1 ? 12 : parseInt(hour, 10) - 1
        updateTime(String(next).padStart(2, '0'), minute, second, period)
      } else if (field === 'minute') {
        const next = parseInt(minute, 10) <= 0 ? 59 : parseInt(minute, 10) - 1
        updateTime(hour, String(next).padStart(2, '0'), second, period)
      } else {
        const next = parseInt(second, 10) <= 0 ? 59 : parseInt(second, 10) - 1
        updateTime(hour, minute, String(next).padStart(2, '0'), period)
      }
    } else if (e.key === 'Backspace' && (e.currentTarget.value === '' || e.currentTarget.value === '00')) {
      if (field === 'second') {
        minuteRef.current?.focus()
        minuteRef.current?.select()
      } else if (field === 'minute') {
        hourRef.current?.focus()
        hourRef.current?.select()
      }
    } else if (e.key === ':' || e.key === 'Enter' || e.key === 'ArrowRight') {
      if (field === 'hour') {
        e.preventDefault()
        minuteRef.current?.focus()
        minuteRef.current?.select()
      } else if (field === 'minute') {
        e.preventDefault()
        secondRef.current?.focus()
        secondRef.current?.select()
      }
    } else if (e.key === 'ArrowLeft') {
      if (field === 'second') {
        e.preventDefault()
        minuteRef.current?.focus()
        minuteRef.current?.select()
      } else if (field === 'minute') {
        e.preventDefault()
        hourRef.current?.focus()
        hourRef.current?.select()
      }
    }
  }

  // Generate all time slots from 06:00:00 AM through 11:30:00 PM
  const PRESETS: string[] = []
  for (let h = 6; h <= 23; h++) {
    for (const m of ['00', '30']) {
      const period = h < 12 ? 'AM' : 'PM'
      const displayHour = h % 12 === 0 ? 12 : h % 12
      PRESETS.push(`${String(displayHour).padStart(2, '0')}:${m}:00 ${period}`)
    }
  }

  return (
    <div className="relative">
      <label className="text-xs font-bold text-[#102A43] uppercase tracking-wider block mb-2.5">
        {label}
      </label>

      {/* Main Input Box */}
      <div
        className={`h-12 w-full rounded-2xl border transition-all flex items-center justify-between px-3 bg-white shadow-xs ${
          isOpen
            ? 'border-[#B8862C] ring-2 ring-[#B8862C]/20'
            : 'border-[#DED5C5] hover:border-[#B8862C]/80 focus-within:border-[#B8862C] focus-within:ring-2 focus-within:ring-[#B8862C]/20'
        }`}
      >
        {/* Digits and AM/PM */}
        <div className="flex items-center gap-1">
          {/* Hour */}
          <input
            ref={hourRef}
            type="text"
            inputMode="numeric"
            maxLength={2}
            value={hour}
            onChange={(e) => handleHourChange(e.target.value)}
            onFocus={(e) => e.target.select()}
            onKeyDown={(e) => handleKeyDown(e, 'hour')}
            className="w-7 h-8 text-center text-sm font-bold text-[#102A43] bg-transparent hover:bg-[#F7F1E3]/50 focus:bg-[#F7F1E3] focus:text-[#0B1F33] focus:outline-none rounded-md transition-colors"
            placeholder="09"
            aria-label="Hour"
          />

          <span className="text-[#B8862C] font-bold text-sm select-none px-0.5">:</span>

          {/* Minute */}
          <input
            ref={minuteRef}
            type="text"
            inputMode="numeric"
            maxLength={2}
            value={minute}
            onChange={(e) => handleMinuteChange(e.target.value)}
            onFocus={(e) => e.target.select()}
            onKeyDown={(e) => handleKeyDown(e, 'minute')}
            className="w-7 h-8 text-center text-sm font-bold text-[#102A43] bg-transparent hover:bg-[#F7F1E3]/50 focus:bg-[#F7F1E3] focus:text-[#0B1F33] focus:outline-none rounded-md transition-colors"
            placeholder="30"
            aria-label="Minute"
          />

          <span className="text-[#B8862C] font-bold text-sm select-none px-0.5">:</span>

          {/* Second */}
          <input
            ref={secondRef}
            type="text"
            inputMode="numeric"
            maxLength={2}
            value={second}
            onChange={(e) => handleSecondChange(e.target.value)}
            onFocus={(e) => e.target.select()}
            onKeyDown={(e) => handleKeyDown(e, 'second')}
            className="w-7 h-8 text-center text-sm font-bold text-[#102A43] bg-transparent hover:bg-[#F7F1E3]/50 focus:bg-[#F7F1E3] focus:text-[#0B1F33] focus:outline-none rounded-md transition-colors"
            placeholder="00"
            aria-label="Second"
          />

          {/* AM / PM Pill Button (Clean, NO ARROW here!) */}
          <button
            type="button"
            onClick={togglePeriod}
            className="ml-1 px-2 py-0.5 rounded-lg text-xs font-bold text-[#102A43] bg-[#F7F1E3] hover:bg-[#EDE2CC] active:scale-95 transition-all cursor-pointer border border-[#DED5C5]"
            title="Click to switch AM / PM"
          >
            {period}
          </button>
        </div>

        {/* Right: The ONLY Downward Arrow (v) */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="p-1 rounded-lg text-[#536579] hover:text-[#B8862C] hover:bg-[#F7F1E3]/50 transition-colors cursor-pointer shrink-0 ml-1"
          aria-label="Toggle time presets"
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-[#B8862C]' : ''
            }`}
          />
        </button>
      </div>

      {/* Preset Times Dropdown */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-full max-h-56 overflow-y-auto rounded-2xl border border-[#DED5C5] bg-white shadow-xl p-2 space-y-1 z-30 animate-in fade-in-50 zoom-in-95 duration-150">
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#7C8794]">
            Quick Presets
          </div>
          {PRESETS.map((preset) => {
            const isSelected = preset === `${hour}:${minute}:${second} ${period}`
            return (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  onChange(preset)
                  setIsOpen(false)
                }}
                className={`w-full px-3 py-2 rounded-xl text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#F7F1E3] font-bold text-[#102A43] border border-[#DED5C5]'
                    : 'font-semibold text-[#102A43] hover:bg-[#FDFBF8]'
                }`}
              >
                <span>{preset}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#102A43]" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function CalendarPage() {
  const today = new Date()
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState(today.getDate())
  const [eventsStore, setEventsStore] = useState<Record<string, ScheduleItem[]>>({})

  // Side Page / Drawer State
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false)
  const [actionType, setActionType] = useState<ActionType>('schedule_meeting')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [meetingDate, setMeetingDate] = useState<Date>(today)
  const [startTime, setStartTime] = useState<string>('09:30:00 AM')
  const [endTime, setEndTime] = useState<string>('10:30:00 AM')
  const [meetingSubject, setMeetingSubject] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Attendees & Permission State
  const { user } = useAuth()
  const [allContacts, setAllContacts] = useState<ChatContact[]>([])
  const [selectedAttendees, setSelectedAttendees] = useState<ChatContact[]>([])
  const [isAttendeeDropdownOpen, setIsAttendeeDropdownOpen] = useState(false)
  const [attendeeSearchQuery, setAttendeeSearchQuery] = useState('')
  const attendeeDropdownRef = useRef<HTMLDivElement>(null)

  // Fetch real scheduled meetings from database (Meeting_schedules table)
  useEffect(() => {
    let isMounted = true
    fetchMyMeetingsApi()
      .then((meetings) => {
        if (!isMounted || !meetings) return
        const store: Record<string, ScheduleItem[]> = {}
        meetings.forEach((m: MeetingScheduleRecord) => {
          const dateKey = m.meeting_date
          const item: ScheduleItem = {
            id: m.id,
            category: 'MEETING',
            title: m.meeting_subject,
            time: `${m.start_time} - ${m.end_time}`,
            meta: `${m.attendees?.length || 0} attendees · Organized by ${m.organizer_name}`,
            iconType: 'meeting',
          }
          if (!store[dateKey]) store[dateKey] = []
          store[dateKey].push(item)
        })
        setEventsStore(store)
      })
      .catch((err) => {
        console.warn('Could not load meetings from database:', err)
      })
    return () => {
      isMounted = false
    }
  }, [user?.id])

  // Fetch real contacts from database
  useEffect(() => {
    let isMounted = true
    fetchChatContactsApi()
      .then((contacts) => {
        if (isMounted) {
          setAllContacts(contacts || [])
        }
      })
      .catch((err) => {
        console.warn('Failed to load chat contacts for calendar:', err)
        if (isMounted) {
          setAllContacts([])
        }
      })
    return () => {
      isMounted = false
    }
  }, [])

  // Close attendee dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        attendeeDropdownRef.current &&
        !attendeeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAttendeeDropdownOpen(false)
      }
    }
    if (isAttendeeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isAttendeeDropdownOpen])

  // Filter contacts by current user's role permissions (matches Chat permission matrix)
  const permittedContacts = useMemo(() => {
    const myRole = user?.role || ''
    return allContacts.filter((contact) => {
      // Exclude logged in user
      if (user?.id && (contact.userId === user.id || contact.id === user.id)) {
        return false
      }
      return canScheduleMeetingWith(myRole, contact.role)
    })
  }, [allContacts, user?.role, user?.id])

  // Filter contacts by search query
  const filteredContacts = useMemo(() => {
    const q = attendeeSearchQuery.trim().toLowerCase()
    if (!q) return permittedContacts
    return permittedContacts.filter((c) => {
      const nameMatch = c.name?.toLowerCase().includes(q)
      const emailMatch = c.email?.toLowerCase().includes(q)
      const roleMatch = c.role?.toLowerCase().includes(q)
      const orgMatch = c.organizationName?.toLowerCase().includes(q)
      return nameMatch || emailMatch || roleMatch || orgMatch
    })
  }, [permittedContacts, attendeeSearchQuery])

  const toggleAttendee = (contact: ChatContact) => {
    setSelectedAttendees((prev) => {
      const exists = prev.some(
        (item) => (item.id && item.id === contact.id) || (item.userId && item.userId === contact.userId)
      )
      if (exists) {
        return prev.filter(
          (item) => !((item.id && item.id === contact.id) || (item.userId && item.userId === contact.userId))
        )
      } else {
        return [...prev, contact]
      }
    })
  }

  const removeAttendee = (contactId: string) => {
    setSelectedAttendees((prev) =>
      prev.filter((item) => item.id !== contactId && item.userId !== contactId)
    )
  }

  const handlePrevMeetingDate = () => {
    setMeetingDate((prev) => subDays(prev, 1))
  }

  const handleNextMeetingDate = () => {
    setMeetingDate((prev) => addDays(prev, 1))
  }

  const handlePrevMonth = () => {
    const prev = subMonths(new Date(currentYear, currentMonth, 1), 1)
    setCurrentYear(prev.getFullYear())
    setCurrentMonth(prev.getMonth())
  }

  const handleNextMonth = () => {
    const next = addMonths(new Date(currentYear, currentMonth, 1), 1)
    setCurrentYear(next.getFullYear())
    setCurrentMonth(next.getMonth())
  }

  const handleToday = () => {
    const now = new Date()
    setCurrentYear(now.getFullYear())
    setCurrentMonth(now.getMonth())
    setSelectedDay(now.getDate())
  }

  const openSideDrawer = (defaultAction?: ActionType) => {
    if (defaultAction) {
      setActionType(defaultAction)
    }
    setMeetingDate(new Date(currentYear, currentMonth, selectedDay))
    setStartTime('09:30:00 AM')
    setEndTime('10:30:00 AM')
    setIsDropdownOpen(false)
    setIsAttendeeDropdownOpen(false)
    setAttendeeSearchQuery('')
    setMeetingSubject('')
    setSelectedAttendees([])
    setSideDrawerOpen(true)
  }

  const handleScheduleMeeting = async () => {
    if (!meetingSubject.trim()) {
      toast.error('Please enter a meeting subject')
      return
    }
    if (selectedAttendees.length === 0) {
      toast.error('Please select at least one attendee')
      return
    }

    setIsSubmitting(true)
    try {
      const dateStr = format(meetingDate, 'yyyy-MM-dd')
      const organizerFullName = user?.firstName
        ? `${user.firstName} ${user.lastName || ''}`.trim()
        : user?.email?.split('@')[0] || 'User'

      const createdRecord = await createMeetingScheduleApi({
        meeting_subject: meetingSubject.trim(),
        meeting_date: dateStr,
        start_time: startTime,
        end_time: endTime,
        attendees: selectedAttendees,
        organizer_id: user?.id,
        organizer_name: organizerFullName,
        organizer_email: user?.email,
        organizer_role: user?.role || 'student',
      })

      toast.success('Meeting scheduled successfully!')

      // Map newly scheduled meeting into eventsStore
      const newItem: ScheduleItem = {
        id: createdRecord.id,
        category: 'MEETING',
        title: createdRecord.meeting_subject,
        time: `${createdRecord.start_time} - ${createdRecord.end_time}`,
        meta: `${createdRecord.attendees?.length || selectedAttendees.length} attendees · Organized by ${createdRecord.organizer_name}`,
        iconType: 'meeting',
      }

      setEventsStore((prev) => ({
        ...prev,
        [dateStr]: [...(prev[dateStr] || []), newItem],
      }))

      // Reset form and close drawer
      setMeetingSubject('')
      setSelectedAttendees([])
      setSideDrawerOpen(false)
    } catch (err: any) {
      console.error('Failed to schedule meeting:', err)
      toast.error(err?.response?.data?.message || 'Failed to schedule meeting')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Days in month calculation via date-fns
  const activeMonthDate = new Date(currentYear, currentMonth, 1)
  const firstDayOfWeek = getDay(activeMonthDate)
  const daysInCurrentMonth = getDaysInMonth(activeMonthDate)
  const daysInPrevMonth = getDaysInMonth(subMonths(activeMonthDate, 1))

  // Selected date metadata via date-fns
  const selectedDateObj = new Date(currentYear, currentMonth, selectedDay)
  const selectedDateKey = format(selectedDateObj, 'yyyy-MM-dd')
  const selectedDayOfWeekName = format(selectedDateObj, 'EEEE')
  const selectedMonthName = format(activeMonthDate, 'MMMM')
  const activeMonthYearLabel = format(activeMonthDate, 'MMMM yyyy')

  // Dynamic items for selected day
  const activeItems = eventsStore[selectedDateKey] || []

  // Dynamic next upcoming event from eventsStore
  const upcomingEvent = useMemo(() => {
    const allEvents: Array<ScheduleItem & { dateKey: string }> = []
    Object.entries(eventsStore).forEach(([dateKey, items]) => {
      items.forEach((item) => allEvents.push({ ...item, dateKey }))
    })
    allEvents.sort((a, b) => a.dateKey.localeCompare(b.dateKey))
    const todayKey = format(new Date(), 'yyyy-MM-dd')
    return allEvents.find((e) => e.dateKey >= todayKey)
  }, [eventsStore])

  return (
    <div className="w-full max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-3 flex flex-col justify-center min-h-0 h-full">
      {/* ── Top Header Section ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-3.5 shrink-0">
        <div className="space-y-0.5">
          {/* Mini Brand Label */}
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.18em] text-[#B8862C] uppercase">
            <CalendarDays className="w-3.5 h-3.5 text-[#B8862C]" />
            <span>EDUWECONNECT</span>
          </div>

          {/* Page Title */}
          <h1 className="font-serif text-3xl sm:text-[36px] font-bold text-[#102A43] tracking-tight leading-tight">
            Calendar
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-[#536579] font-normal">
            Your events, meetings, and notes in one place.
          </p>
        </div>

        {/* Today Action Button */}
        <div>
          <button
            type="button"
            onClick={handleToday}
            className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-white border border-[#DED5C5] text-xs font-semibold text-[#102A43] shadow-[0_2px_8px_rgba(16,42,67,0.06)] hover:bg-[#FDFBF7] hover:border-[#B8862C]/50 transition-all cursor-pointer"
          >
            Today
          </button>
        </div>
      </div>

      {/* ── Main Unified Calendar & Schedule Card ────────────────── */}
      <div className="bg-white rounded-3xl border border-[#EADBCA] shadow-[0_4px_24px_rgba(16,42,67,0.04)] overflow-hidden shrink-0">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* ── Left Column: Month Grid (7 cols) ─────────────────── */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-9 flex flex-col justify-between lg:border-r border-[#F0E6D8]">
            <div>
              {/* Month Selector Navigation */}
              <div className="flex items-center justify-between pb-5 sm:pb-6">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  aria-label="Previous Month"
                  className="w-8 h-8 rounded-full border border-gray-200/80 text-gray-600 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#102A43]">
                  {activeMonthYearLabel}
                </h2>

                <button
                  type="button"
                  onClick={handleNextMonth}
                  aria-label="Next Month"
                  className="w-8 h-8 rounded-full border border-gray-200/80 text-gray-600 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Day of Week Headers via date-fns */}
              <div className="grid grid-cols-7 text-center pb-3.5 text-[11px] font-bold text-[#7C8794] tracking-wider uppercase">
                {WEEKDAY_NAMES.map((dayName) => (
                  <div key={dayName}>{dayName}</div>
                ))}
              </div>

              {/* Month Days Grid */}
              <div className="grid grid-cols-7 gap-y-3 sm:gap-y-3.5 gap-x-1 sm:gap-x-2 text-center">
                {/* Previous Month Trail Days */}
                {Array.from({ length: firstDayOfWeek }).map((_, idx) => {
                  const dayNum = daysInPrevMonth - firstDayOfWeek + idx + 1
                  return (
                    <div
                      key={`prev-${idx}`}
                      className="h-12 flex flex-col items-center justify-center text-xs sm:text-sm font-semibold text-gray-300 select-none"
                    >
                      {dayNum}
                    </div>
                  )
                })}

                {/* Current Month Active Days */}
                {Array.from({ length: daysInCurrentMonth }).map((_, idx) => {
                  const dayNum = idx + 1
                  const isSelected = selectedDay === dayNum

                  // Event indicators based on dynamic stored events for this day
                  const dayDateKey = format(new Date(currentYear, currentMonth, dayNum), 'yyyy-MM-dd')
                  const dayItems = eventsStore[dayDateKey] || []
                  const hasMeeting = dayItems.some((i) => i.iconType === 'meeting')
                  const hasEvent = dayItems.some((i) => i.iconType === 'event')
                  const hasNote = dayItems.some((i) => i.iconType === 'note')

                  return (
                    <div
                      key={`day-${dayNum}`}
                      className="h-12 flex items-center justify-center"
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedDay(dayNum)}
                        className={`w-11 sm:w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-[#E8DCBF] text-[#102A43] shadow-[0_3px_14px_rgba(184,134,44,0.25)] border border-[#D5C299] scale-105'
                            : 'hover:bg-[#F7F1E3]/60 text-[#102A43]'
                        }`}
                      >
                        <span className={`text-sm sm:text-base ${isSelected ? 'font-bold' : 'font-semibold'}`}>
                          {dayNum}
                        </span>

                        {/* Event Indicator Dots - rendered dynamically when events exist */}
                        <div className="h-1.5 mt-1 flex items-center justify-center gap-0.5">
                          {hasMeeting && <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />}
                          {hasEvent && <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />}
                          {hasNote && <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />}
                        </div>
                      </button>
                    </div>
                  )
                })}

                {/* Next Month Trail Days */}
                {(() => {
                  const totalRendered = firstDayOfWeek + daysInCurrentMonth
                  const remainingSlots = (7 - (totalRendered % 7)) % 7
                  return Array.from({ length: remainingSlots }).map((_, idx) => (
                    <div
                      key={`next-${idx}`}
                      className="h-12 flex flex-col items-center justify-center text-xs sm:text-sm font-semibold text-gray-300 select-none"
                    >
                      {idx + 1}
                    </div>
                  ))
                })()}
              </div>
            </div>

            {/* Bottom Legend */}
            <div className="pt-7 sm:pt-8 flex justify-center">
              <div className="inline-flex items-center justify-center gap-5 sm:gap-6 px-5 py-2.5 rounded-full border border-gray-200/90 bg-white text-xs font-medium text-[#536579] shadow-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                  <span>Events</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                  <span>Meetings</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                  <span>Important notes</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column: Selected Day Schedule (5 cols) ─────── */}
          <div className="lg:col-span-5 p-6 sm:p-8 lg:p-9 flex flex-col justify-between bg-[#FDFBF8]/40">
            <div className="space-y-4 sm:space-y-5">
              {/* Selected Day Header with Date Badge & Add Event Button */}
              <div>
                <div className="text-[11px] font-bold tracking-[0.16em] text-[#B8862C] uppercase mb-3">
                  SELECTED DAY
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    {/* Dark Date Badge */}
                    <div className="w-14 h-14 rounded-2xl bg-[#102A43] text-white flex flex-col items-center justify-center shadow-sm shrink-0 px-2 py-1.5">
                      <span className="text-[9px] font-bold tracking-widest uppercase text-white/85 leading-none">
                        {selectedMonthName.slice(0, 3).toUpperCase()}
                      </span>
                      <span className="text-2xl font-bold leading-none text-white mt-1">
                        {selectedDay}
                      </span>
                    </div>

                    {/* Day & Full Date */}
                    <div>
                      <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#102A43] leading-tight">
                        {selectedDayOfWeekName}
                      </h3>
                      <p className="text-xs text-[#7C8794] font-medium mt-0.5">
                        {selectedMonthName} {selectedDay}, {currentYear}
                      </p>
                    </div>
                  </div>

                  {/* Add Event Button with Side Page Drawer Trigger */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => openSideDrawer()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#B8862C] hover:bg-[#D6A84F] text-[#0B1F33] text-xs font-bold shadow-[0_2px_8px_rgba(184,134,44,0.25)] transition-all cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Event</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Day Schedule Header with Count Badge */}
              <div className="flex items-center justify-between pt-1.5">
                <h4 className="text-sm font-bold text-[#102A43]">
                  Day schedule
                </h4>
                <span className="px-2.5 py-0.5 rounded-full bg-[#EDE2CC]/70 text-[#102A43] text-xs font-semibold">
                  {activeItems.length} {activeItems.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Schedule Item Cards */}
              <div className="space-y-3.5">
                {activeItems.length > 0 ? (
                  activeItems.map((item) => {
                    const isMeeting = item.iconType === 'meeting'
                    const isEvent = item.iconType === 'event'
                    const isNote = item.iconType === 'note'

                    return (
                      <div
                        key={item.id}
                        className="rounded-2xl p-4 bg-white border border-[#EADBCA]/80 shadow-[0_2px_8px_rgba(16,42,67,0.02)] hover:border-[#B8862C]/40 transition-all flex items-start justify-between gap-3"
                      >
                        <div className="flex items-start gap-3.5 min-w-0">
                          {/* Left Icon Badge */}
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                              isMeeting
                                ? 'bg-blue-50 text-blue-600 border-blue-100'
                                : isEvent
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                : 'bg-amber-50 text-amber-600 border-amber-100'
                            }`}
                          >
                            {isMeeting && <Users className="w-4 h-4" />}
                            {isEvent && <Sparkles className="w-4 h-4" />}
                            {isNote && <Bell className="w-4 h-4" />}
                          </div>

                          {/* Content Details */}
                          <div className="min-w-0">
                            <span
                              className={`text-[10px] font-bold tracking-wider uppercase block ${
                                isMeeting
                                  ? 'text-blue-600'
                                  : isEvent
                                  ? 'text-emerald-600'
                                  : 'text-amber-700'
                              }`}
                            >
                              {item.category}
                            </span>

                            <h5 className="text-sm font-bold text-[#102A43] leading-snug truncate mt-0.5">
                              {item.title}
                            </h5>

                            <div className="flex items-center gap-1.5 text-xs text-[#536579] mt-1">
                              {isMeeting && <Users className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
                              {isEvent && <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
                              {isNote && <Bell className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
                              <span className="truncate">{item.meta}</span>
                            </div>
                          </div>
                        </div>

                        {/* Top-Right Time Badge if present */}
                        {item.time && (
                          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#B8862C] shrink-0 pt-0.5">
                            <Clock className="w-3.5 h-3.5 text-[#B8862C]" />
                            <span>{item.time}</span>
                          </div>
                        )}
                      </div>
                    )
                  })
                ) : (
                  <div className="p-8 rounded-2xl bg-white border border-dashed border-[#EADBCA] text-center flex flex-col items-center justify-center">
                    <p className="text-xs font-semibold text-[#102A43]">
                      No events scheduled for this day
                    </p>
                    <p className="text-[11px] text-[#7C8794] mt-1">
                      Click the <span className="font-semibold text-[#B8862C]">Add Event</span> button above to schedule an item.
                    </p>
                    <button
                      type="button"
                      onClick={() => openSideDrawer()}
                      className="mt-3 inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#102A43] text-white text-xs font-semibold hover:bg-[#0B1F33] transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Event</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Bottom Banner */}
            <div className="pt-4 mt-4 border-t border-[#F0E6D8] text-xs">
              <span className="font-bold text-[#102A43]">Upcoming: </span>
              {upcomingEvent ? (
                <span className="text-[#536579]">
                  {upcomingEvent.title} · {format(new Date(upcomingEvent.dateKey), 'MMMM d')}
                </span>
              ) : (
                <span className="text-[#7C8794]">
                  No upcoming events scheduled
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Slide-Over Side Page (Drawer from Right) ─────────────── */}
      {sideDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
          {/* Dark Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => {
              setSideDrawerOpen(false)
              setIsDropdownOpen(false)
            }}
          />

          {/* Right Slide-over Side Page Panel with Increased Width */}
          <div className="relative w-full sm:w-[540px] max-w-[95vw] h-full bg-[#FFFDF8] shadow-2xl z-10 border-l border-[#DED5C5] flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="px-6 sm:px-8 py-5 sm:py-6 border-b border-[#DED5C5] bg-[#F7F1E3]/50 flex items-start justify-between gap-4 shrink-0">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.16em] text-[#B8862C] uppercase">
                  <CalendarDays className="w-3.5 h-3.5 text-[#B8862C]" />
                  <span>EDUWECONNECT CALENDAR</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#102A43] mt-1.5">
                  Add to Calendar
                </h3>
                <p className="text-xs text-[#536579] font-medium mt-1">
                  For{' '}
                  {actionType === 'schedule_meeting'
                    ? format(meetingDate, 'EEEE, MMMM d, yyyy')
                    : `${selectedDayOfWeekName}, ${selectedMonthName} ${selectedDay}, ${currentYear}`}
                </p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setSideDrawerOpen(false)
                  setIsDropdownOpen(false)
                }}
                className="p-2 rounded-xl text-gray-500 hover:text-[#102A43] hover:bg-black/5 transition-colors cursor-pointer shrink-0"
                aria-label="Close side page"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Side Page Body */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 sm:py-8 space-y-5">
              {/* Dropdown Section */}
              <div>
                <label className="text-xs font-bold text-[#102A43] uppercase tracking-wider block mb-2.5">
                  Select Action *
                </label>

                {/* Custom Styled Dropdown Selector */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className={`w-full px-4 py-3.5 text-left rounded-2xl border transition-all flex items-center justify-between cursor-pointer bg-white shadow-xs ${
                      isDropdownOpen
                        ? 'border-[#B8862C] ring-2 ring-[#B8862C]/20'
                        : 'border-[#DED5C5] hover:border-[#B8862C]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                          actionType === 'schedule_meeting'
                            ? 'bg-blue-50 text-blue-600 border-blue-200'
                            : 'bg-amber-50 text-amber-600 border-amber-200'
                        }`}
                      >
                        {actionType === 'schedule_meeting' ? (
                          <Users className="w-5 h-5" />
                        ) : (
                          <FileText className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-[#102A43] block">
                          {actionType === 'schedule_meeting' ? 'Schedule Meeting' : 'Add Note'}
                        </span>
                        <span className="text-xs text-[#7C8794] block mt-0.5">
                          {actionType === 'schedule_meeting'
                            ? 'Schedule a formal meeting with attendees and location.'
                            : 'Create a personal note, deadline reminder, or institutional task.'}
                        </span>
                      </div>
                    </div>

                    <ChevronDown
                      className={`w-4 h-4 text-[#536579] transition-transform duration-200 shrink-0 ml-3 ${
                        isDropdownOpen ? 'rotate-180 text-[#B8862C]' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Options Menu */}
                  {isDropdownOpen && (
                    <div className="mt-3 w-full rounded-2xl border border-[#DED5C5] bg-white shadow-lg p-2 space-y-1.5 z-20">
                      {/* Option 1: Schedule Meeting */}
                      <button
                        type="button"
                        onClick={() => {
                          setActionType('schedule_meeting')
                          setIsDropdownOpen(false)
                        }}
                        className={`w-full p-3.5 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                          actionType === 'schedule_meeting'
                            ? 'bg-[#F7F1E3] border border-[#DED5C5]'
                            : 'hover:bg-[#FDFBF8] border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
                            <Users className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-[#102A43]">
                              Schedule Meeting
                            </div>
                            <div className="text-xs text-[#536579] mt-0.5">
                              Schedule a formal meeting with attendees and location.
                            </div>
                          </div>
                        </div>

                        {actionType === 'schedule_meeting' && (
                          <div className="w-5 h-5 rounded-full bg-[#102A43] text-white flex items-center justify-center shrink-0 ml-2">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </button>

                      {/* Option 2: Add Note */}
                      <button
                        type="button"
                        onClick={() => {
                          setActionType('add_note')
                          setIsDropdownOpen(false)
                        }}
                        className={`w-full p-3.5 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                          actionType === 'add_note'
                            ? 'bg-[#F7F1E3] border border-[#DED5C5]'
                            : 'hover:bg-[#FDFBF8] border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-[#102A43]">
                              Add Note
                            </div>
                            <div className="text-xs text-[#536579] mt-0.5">
                              Create a personal note, deadline reminder, or institutional task.
                            </div>
                          </div>
                        </div>

                        {actionType === 'add_note' && (
                          <div className="w-5 h-5 rounded-full bg-[#102A43] text-white flex items-center justify-center shrink-0 ml-2">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Meeting Date Selector - Displayed when Schedule Meeting is selected */}
              {actionType === 'schedule_meeting' && (
                <div className="pt-1 animate-in fade-in-50 duration-200">
                  <label className="text-xs font-bold text-[#102A43] uppercase tracking-wider block mb-2.5">
                    Meeting Date
                  </label>

                  <div className="w-full bg-white rounded-2xl border border-[#DED5C5] p-2 flex items-center justify-between shadow-xs">
                    {/* Backward Arrow Button < */}
                    <button
                      type="button"
                      onClick={handlePrevMeetingDate}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-[#102A43] hover:bg-[#F7F1E3] active:scale-95 transition-all cursor-pointer border border-transparent hover:border-[#DED5C5] shrink-0"
                      aria-label="Previous date"
                    >
                      <ChevronLeft className="w-5 h-5 text-[#102A43]" />
                    </button>

                    {/* Date Display via date-fns */}
                    <div className="flex-1 flex items-center justify-center gap-2.5 px-3 py-1">
                      <CalendarDays className="w-4 h-4 text-[#B8862C] shrink-0" />
                      <div className="text-center">
                        <span className="text-sm font-bold text-[#102A43] tracking-tight">
                          {format(meetingDate, 'EEE, MMMM d, yyyy')}
                        </span>
                      </div>
                    </div>

                    {/* Forward Arrow Button > */}
                    <button
                      type="button"
                      onClick={handleNextMeetingDate}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-[#102A43] hover:bg-[#F7F1E3] active:scale-95 transition-all cursor-pointer border border-transparent hover:border-[#DED5C5] shrink-0"
                      aria-label="Next date"
                    >
                      <ChevronRight className="w-5 h-5 text-[#102A43]" />
                    </button>
                  </div>
                </div>
              )}

              {/* Meeting Time Selector (Start Time & End Time) */}
              {actionType === 'schedule_meeting' && (
                <div className="pt-1 animate-in fade-in-50 duration-200">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {/* Start Time */}
                    <TimeField
                      label="Start Time *"
                      value={startTime}
                      onChange={setStartTime}
                    />

                    {/* End Time */}
                    <TimeField
                      label="End Time *"
                      value={endTime}
                      onChange={setEndTime}
                    />
                  </div>
                </div>
              )}

              {/* Attendees Selector & Table */}
              {actionType === 'schedule_meeting' && (
                <div className="pt-2 space-y-3.5 animate-in fade-in-50 duration-200">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#102A43] uppercase tracking-wider block">
                      Meeting Attendees *
                    </label>
                    <span className="text-[11px] font-semibold text-[#B8862C] bg-[#F7F1E3] px-2.5 py-0.5 rounded-full border border-[#DED5C5]">
                      {selectedAttendees.length} {selectedAttendees.length === 1 ? 'attendee' : 'attendees'}
                    </span>
                  </div>

                  {/* Searchable Dropdown */}
                  <div className="relative" ref={attendeeDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsAttendeeDropdownOpen((prev) => !prev)}
                      className={`w-full bg-white rounded-2xl border px-4 py-3.5 flex items-center justify-between text-left transition-all cursor-pointer shadow-xs ${
                        isAttendeeDropdownOpen
                          ? 'border-[#B8862C] ring-2 ring-[#B8862C]/20 shadow-md'
                          : 'border-[#DED5C5] hover:border-[#B8862C]/70 hover:bg-[#FDFBF8]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-[#F7F1E3] border border-[#DED5C5] text-[#102A43] flex items-center justify-center shrink-0">
                          <Users className="w-4 h-4 text-[#102A43]" />
                        </div>
                        <div className="truncate">
                          <span className="text-sm font-medium text-[#102A43] block truncate">
                            {selectedAttendees.length > 0
                              ? `Select more attendees (${selectedAttendees.length} added)...`
                              : 'Select person to schedule meeting with...'}
                          </span>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-[#536579] transition-transform duration-200 shrink-0 ml-2 ${
                          isAttendeeDropdownOpen ? 'rotate-180 text-[#B8862C]' : ''
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu with Search Bar */}
                    {isAttendeeDropdownOpen && (
                      <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-[#DED5C5] shadow-xl p-3 z-30 space-y-2.5 animate-in fade-in-50 zoom-in-95 duration-150">
                        {/* Search Bar inside Dropdown */}
                        <div className="relative">
                          <Search className="w-4 h-4 text-[#8C9BAE] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            value={attendeeSearchQuery}
                            onChange={(e) => setAttendeeSearchQuery(e.target.value)}
                            placeholder="Search by name, role, email..."
                            autoFocus
                            className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-[#F7F1E3]/50 hover:bg-[#F7F1E3]/80 focus:bg-white rounded-xl border border-[#DED5C5] focus:border-[#B8862C] focus:outline-hidden focus:ring-2 focus:ring-[#B8862C]/20 transition-all text-[#102A43] placeholder-[#8C9BAE]"
                          />
                          {attendeeSearchQuery && (
                            <button
                              type="button"
                              onClick={() => setAttendeeSearchQuery('')}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#8C9BAE] hover:text-[#102A43] rounded-md transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Permission Context Summary */}
                        <div className="px-2 py-1 text-[11px] text-[#536579] flex items-center justify-between border-b border-[#F0E6D8] pb-2">
                          <span>
                            Eligible contacts for{' '}
                            <span className="font-semibold text-[#102A43] capitalize">
                              {user?.role ? user.role.replace(/[_-]/g, ' ') : 'your role'}
                            </span>
                          </span>
                          <span className="font-medium text-[#B8862C]">
                            {filteredContacts.length} available
                          </span>
                        </div>

                        {/* Scrollable Contacts List */}
                        <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
                          {filteredContacts.length === 0 ? (
                            <div className="py-7 text-center text-xs text-[#536579]">
                              <p className="font-semibold text-[#102A43]">No contacts found</p>
                              <p className="mt-0.5 text-[11px]">
                                No users match &ldquo;{attendeeSearchQuery}&rdquo; or your role permissions.
                              </p>
                            </div>
                          ) : (
                            filteredContacts.map((contact) => {
                              const isSelected = selectedAttendees.some(
                                (item) =>
                                  (item.id && item.id === contact.id) ||
                                  (item.userId && item.userId === contact.userId)
                              )
                              const badge = getRoleBadge(contact.role)
                              const initials = (contact.name || 'User')
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()
                                .slice(0, 2)

                              return (
                                <button
                                  key={contact.id || contact.userId}
                                  type="button"
                                  onClick={() => toggleAttendee(contact)}
                                  className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer border ${
                                    isSelected
                                      ? 'bg-[#F7F1E3] border-[#B8862C]/50 shadow-xs'
                                      : 'bg-white hover:bg-[#FDFBF8] border-transparent hover:border-[#DED5C5]'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-8 h-8 rounded-full bg-[#102A43] text-white flex items-center justify-center text-xs font-bold shrink-0">
                                      {initials}
                                    </div>
                                    <div className="min-w-0">
                                      <div className="text-xs sm:text-sm font-bold text-[#102A43] truncate">
                                        {contact.name}
                                      </div>
                                      <div className="text-[11px] text-[#536579] truncate">
                                        {contact.email || contact.organizationName || 'EduWeConnect Member'}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0 ml-2">
                                    <span
                                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.className}`}
                                    >
                                      {badge.label}
                                    </span>
                                    <div
                                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                                        isSelected
                                          ? 'bg-[#102A43] text-white'
                                          : 'border border-[#DED5C5] text-transparent hover:border-[#B8862C]'
                                      }`}
                                    >
                                      <Check className="w-3 h-3 stroke-[3]" />
                                    </div>
                                  </div>
                                </button>
                              )
                            })
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Selected Attendees Table */}
                  <div className="w-full pt-1">
                    <div className="text-xs font-bold text-[#102A43] uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Selected Attendees Table</span>
                      <span className="text-[11px] font-medium text-[#536579]">
                        {selectedAttendees.length} {selectedAttendees.length === 1 ? 'person added' : 'people added'}
                      </span>
                    </div>

                    {selectedAttendees.length === 0 ? (
                      <div className="bg-white rounded-2xl border border-dashed border-[#DED5C5] p-5 text-center flex flex-col items-center justify-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-[#F7F1E3] border border-[#DED5C5] flex items-center justify-center text-[#B8862C]">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#102A43]">No attendees selected</p>
                          <p className="text-[11px] text-[#536579] mt-0.5">
                            Search and select people from the dropdown above to add them to this table.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white rounded-2xl border border-[#DED5C5] shadow-xs overflow-hidden">
                        <div className="max-h-[220px] overflow-y-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-[#F7F1E3] border-b border-[#DED5C5] text-[10px] sm:text-[11px] font-bold text-[#102A43] uppercase tracking-wider">
                                <th className="py-2.5 px-3">Participant</th>
                                <th className="py-2.5 px-3">Role</th>
                                <th className="py-2.5 px-3 text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F0E6D8]">
                              {selectedAttendees.map((person) => {
                                const badge = getRoleBadge(person.role)
                                const initials = (person.name || 'User')
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .toUpperCase()
                                  .slice(0, 2)

                                return (
                                  <tr
                                    key={person.id || person.userId}
                                    className="hover:bg-[#FDFBF8] transition-colors"
                                  >
                                    <td className="py-2.5 px-3">
                                      <div className="flex items-center gap-2.5">
                                        <div className="w-7 h-7 rounded-full bg-[#102A43] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                                          {initials}
                                        </div>
                                        <div className="min-w-0">
                                          <div className="text-xs font-bold text-[#102A43] truncate max-w-[140px] sm:max-w-[170px]">
                                            {person.name}
                                          </div>
                                          <div className="text-[10px] text-[#536579] truncate max-w-[140px] sm:max-w-[170px]">
                                            {person.email || person.organizationName || 'Participant'}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="py-2.5 px-3 whitespace-nowrap">
                                      <span
                                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.className}`}
                                      >
                                        {badge.label}
                                      </span>
                                    </td>
                                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                                      <button
                                        type="button"
                                        onClick={() => removeAttendee(person.id || person.userId)}
                                        aria-label={`Remove ${person.name}`}
                                        className="p-1.5 rounded-lg text-[#8C9BAE] hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all cursor-pointer"
                                        title="Remove attendee"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Meeting Subject Input */}
                  <div className="pt-1 space-y-2">
                    <label className="text-xs font-bold text-[#102A43] uppercase tracking-wider block">
                      Meeting Subject *
                    </label>
                    <input
                      type="text"
                      value={meetingSubject}
                      onChange={(e) => setMeetingSubject(e.target.value)}
                      placeholder="e.g., Curriculum Planning Sync, Academic Review..."
                      className="w-full px-4 py-3 text-sm bg-white rounded-2xl border border-[#DED5C5] focus:border-[#B8862C] focus:outline-hidden focus:ring-2 focus:ring-[#B8862C]/20 transition-all text-[#102A43] placeholder-[#8C9BAE] shadow-xs"
                    />
                  </div>

                  {/* Schedule Meeting Action Button */}
                  <div className="pt-3 pb-2">
                    <button
                      type="button"
                      onClick={handleScheduleMeeting}
                      disabled={isSubmitting || !meetingSubject.trim() || selectedAttendees.length === 0}
                      className="w-full py-3.5 px-6 rounded-2xl bg-[#B8862C] hover:bg-[#A37424] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-[#0B1F33] font-bold text-sm shadow-[0_4px_16px_rgba(184,134,44,0.25)] transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[#0B1F33] border-t-transparent rounded-full animate-spin" />
                          <span>Scheduling Meeting...</span>
                        </>
                      ) : (
                        <>
                          <CalendarDays className="w-4 h-4" />
                          <span>Schedule Meeting</span>
                        </>
                      )}
                    </button>
                    {selectedAttendees.length === 0 && (
                      <p className="text-[11px] text-center text-[#7C8794] mt-2">
                        Select at least one attendee above to enable scheduling.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
