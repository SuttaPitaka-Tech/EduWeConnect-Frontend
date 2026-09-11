import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import {
  KeyRound,
  Sparkles,
  CheckCircle2,
  LogOut,
  Eye,
  EyeOff,
  Loader2,
  CalendarCheck,
  Award,
  Video,
  Clock,
  TrendingUp,
  User,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts'
import { Button, Input, Dialog, DialogContent, DialogHeader, DialogFooter } from '@/components/ui'
import { toast } from 'sonner'

// ── Attendance Trend Data ───────────────────────────────────────────────────
const ATTENDANCE_TREND_DATA = [
  { day: 'Mon', attendance: 100 },
  { day: 'Tue', attendance: 100 },
  { day: 'Wed', attendance: 92 },
  { day: 'Thu', attendance: 100 },
  { day: 'Fri', attendance: 95 },
  { day: 'Sat', attendance: 100 },
]

// ── Exam Scores by Subject ──────────────────────────────────────────────────
const EXAM_SCORES_DATA = [
  { subject: 'English', score: 94, grade: 'A+' },
  { subject: 'Maths', score: 98, grade: 'A+' },
  { subject: 'Science', score: 91, grade: 'A' },
  { subject: 'Arts', score: 96, grade: 'A+' },
  { subject: 'GK', score: 89, grade: 'A' },
]

// ── Meeting & Live Class Schedules ──────────────────────────────────────────
interface MeetingSchedule {
  id: string
  title: string
  subject: string
  teacher: string
  time: string
  status: 'Live Now' | 'Today' | 'Upcoming'
  isLive: boolean
}

const UPCOMING_MEETINGS: MeetingSchedule[] = [
  {
    id: '1',
    title: 'Interactive Storytelling & Phonics Live Class',
    subject: 'English & Literature',
    teacher: 'Ms. Sarah Jenkins',
    time: 'Today • 02:30 PM - 03:15 PM',
    status: 'Live Now',
    isLive: true,
  },
  {
    id: '2',
    title: 'Term Progress & Academic Guidance Meeting',
    subject: 'Parent-Teacher Sync',
    teacher: 'Mrs. Priya Sharma (Class Teacher)',
    time: 'Tomorrow • 10:00 AM - 10:30 AM',
    status: 'Today',
    isLive: false,
  },
  {
    id: '3',
    title: 'Coloring, Clay Modeling & Creativity Session',
    subject: 'Creative Fine Arts',
    teacher: 'Mr. David Lee',
    time: 'Monday, Sep 14 • 11:00 AM - 11:45 AM',
    status: 'Upcoming',
    isLive: false,
  },
]

export default function StudentWelcomePage() {
  const { user, signOut, changePassword } = useAuth()
  const [changePassOpen, setChangePassOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passError, setPassError] = useState<string | null>(null)

  const studentId = user?.studentId || user?.id || ''
  const studentName = user?.firstName || 'Student'
  const standard = user?.standard || 'Enrolled Class'
  const rollNumber = user?.rollNumber || '—'

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPassError(null)

    if (!currentPassword) {
      setPassError('Please enter your current password.')
      return
    }
    if (!newPassword || newPassword.length < 6) {
      setPassError('New password must be at least 6 characters.')
      return
    }
    if (newPassword === currentPassword) {
      setPassError('New password cannot be identical to current password.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPassError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)
    try {
      await changePassword(studentId || user?.email || '', currentPassword, newPassword)
      toast.success('Password updated successfully!')
      setChangePassOpen(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setPassError(err?.message || 'Failed to update password.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* ── Banner / Hero ────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 md:p-10 border border-[var(--border)]/70 shadow-sm"
        style={{
          background: 'linear-gradient(135deg, #0B2545 0%, #134074 60%, #1D4E89 100%)',
        }}
      >
        {/* Decorative soft glows */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[var(--gold)]/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--gold)]/20 border border-[var(--gold)]/40 text-[var(--gold)] text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Student Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Welcome, Student!
            </h1>
            <p className="text-sm md:text-base text-gray-200 font-medium max-w-xl">
              Hello <span className="text-[var(--gold)] font-semibold">{studentName}</span>. Your student account is active and enrolled in <span className="text-white font-semibold">{standard}</span> (Roll #{rollNumber}).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setChangePassOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white border-white/25 rounded-xl text-xs font-semibold gap-2 cursor-pointer h-10 px-4"
            >
              <KeyRound className="w-4 h-4 text-[var(--gold)]" />
              <span>Change Password</span>
            </Button>
            <Button
              type="button"
              onClick={signOut}
              className="bg-rose-500/90 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold gap-2 cursor-pointer h-10 px-4 shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ── Analytics & Graphs (Attendance & Exam Scores) ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend Graph */}
        <div className="bg-white rounded-2xl p-6 border border-[var(--border)]/70 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--navy)]">Weekly Attendance Record</h3>
                  <p className="text-xs text-[var(--text-secondary)]">Daily presence trend &amp; consistency</p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <TrendingUp className="w-3.5 h-3.5" /> 97.8% Avg
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between my-3 text-xs">
              <span className="text-[var(--text-secondary)] font-medium">Weekly Presence (%)</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Excellent Attendance
              </span>
            </div>

            {/* Attendance Area Chart */}
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ATTENDANCE_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="studentAttendanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }}
                  />
                  <YAxis
                    domain={[80, 100]}
                    ticks={[80, 90, 100]}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                    formatter={(val: any) => [`${val}%`, 'Daily Attendance']}
                  />
                  <Area
                    type="monotone"
                    dataKey="attendance"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#studentAttendanceGradient)"
                    dot={{ fill: '#10b981', stroke: '#FFFFFF', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#10b981', stroke: '#FFFFFF', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 mt-3 border-t border-[var(--border)]/50 text-center">
            <div className="p-2 rounded-xl bg-[var(--cream)]/60">
              <span className="text-[10px] text-[var(--text-muted)] font-medium block">Working Days</span>
              <span className="text-xs font-bold text-[var(--navy)]">24 Days</span>
            </div>
            <div className="p-2 rounded-xl bg-emerald-50/60">
              <span className="text-[10px] text-emerald-700 font-medium block">Present</span>
              <span className="text-xs font-bold text-emerald-700">23 Days</span>
            </div>
            <div className="p-2 rounded-xl bg-amber-50/60">
              <span className="text-[10px] text-amber-700 font-medium block">Approved Leave</span>
              <span className="text-xs font-bold text-amber-700">1 Day</span>
            </div>
          </div>
        </div>

        {/* Exam Score Performance Graph */}
        <div className="bg-white rounded-2xl p-6 border border-[var(--border)]/70 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--navy)]">Exam Score Performance</h3>
                  <p className="text-xs text-[var(--text-secondary)]">Subject evaluation &amp; assessments</p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                  Grade A+ (93.6%)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between my-3 text-xs">
              <span className="text-[var(--text-secondary)] font-medium">Marks per Subject (Max 100)</span>
              <span className="font-semibold text-[var(--gold)] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Class Rank: 3rd
              </span>
            </div>

            {/* Exam Bar Chart */}
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={EXAM_SCORES_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis
                    dataKey="subject"
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }}
                  />
                  <YAxis
                    domain={[60, 100]}
                    ticks={[60, 70, 80, 90, 100]}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                    formatter={(val: any, _name: any, item: any) => [`${val}/100 (Grade ${item.payload.grade})`, 'Score']}
                  />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                    {EXAM_SCORES_DATA.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.score >= 95 ? '#B8862C' : entry.score >= 90 ? '#102A43' : '#3B82F6'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 mt-3 border-t border-[var(--border)]/50 text-center">
            <div className="p-2 rounded-xl bg-[var(--cream)]/60">
              <span className="text-[10px] text-[var(--text-muted)] font-medium block">Highest Score</span>
              <span className="text-xs font-bold text-[var(--navy)]">98 / 100 (Maths)</span>
            </div>
            <div className="p-2 rounded-xl bg-blue-50/60">
              <span className="text-[10px] text-blue-700 font-medium block">Evaluations</span>
              <span className="text-xs font-bold text-blue-800">5 Subjects</span>
            </div>
            <div className="p-2 rounded-xl bg-emerald-50/60">
              <span className="text-[10px] text-emerald-700 font-medium block">Academic Status</span>
              <span className="text-xs font-bold text-emerald-700">Passed with Distinction</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 3: Meeting & Live Class Schedules ─────────────────── */}
      <div className="bg-white rounded-2xl p-6 border border-[var(--border)]/70 shadow-2xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border)]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--navy)]">Meeting &amp; Live Class Schedules</h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Interactive classes, scheduled teacher syncs, and virtual sessions
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[var(--cream)] border border-[var(--border)] text-[var(--navy)] self-start sm:self-auto">
            3 Upcoming Sessions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {UPCOMING_MEETINGS.map((meeting) => (
            <div
              key={meeting.id}
              className={`rounded-2xl p-4 border transition-all flex flex-col justify-between gap-3 ${
                meeting.isLive
                  ? 'bg-gradient-to-br from-rose-50/50 via-white to-white border-rose-200 shadow-xs'
                  : 'bg-[var(--cream)]/30 border-[var(--border)]/80 hover:shadow-2xs'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {meeting.subject}
                  </span>
                  {meeting.isLive ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                      Live Now
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {meeting.status}
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-[var(--navy)] line-clamp-2">
                  {meeting.title}
                </h4>

                <div className="text-[11px] text-gray-500 space-y-1">
                  <p className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span className="font-medium text-[var(--navy)] truncate">{meeting.teacher}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[var(--gold)]" />
                    <span>{meeting.time}</span>
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border)]/40">
                <button
                  type="button"
                  onClick={() => toast.info(`Connecting to session: ${meeting.title}`)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    meeting.isLive
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                      : 'bg-[var(--navy)] hover:bg-[var(--navy)]/90 text-white'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>{meeting.isLive ? 'Join Live Class' : 'View Meeting Link'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Change Password Dialog ──────────────────────────────── */}
      <Dialog open={changePassOpen} onOpenChange={setChangePassOpen}>
        <DialogContent className="max-w-md p-6 bg-white rounded-2xl border border-[var(--border)] shadow-xl">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shrink-0">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--navy)]">Change Student Password</h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Update security password for Student ID #{studentId.slice(0, 8)}
                </p>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 mt-4">
            {passError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {passError}
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-[var(--navy)] block mb-1">
                Current Password
              </label>
              <div className="relative">
                <Input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                  className="pr-10 text-xs h-10 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[var(--navy)] block mb-1">
                New Password
              </label>
              <div className="relative">
                <Input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  className="pr-10 text-xs h-10 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[var(--navy)] block mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <Input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  className="pr-10 text-xs h-10 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <DialogFooter className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setChangePassOpen(false)}
                className="h-10 px-4 rounded-xl text-xs font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-10 px-5 rounded-xl bg-[var(--navy)] text-white hover:bg-[var(--deep-navy)] text-xs font-bold gap-2"
              >
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Save New Password</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
