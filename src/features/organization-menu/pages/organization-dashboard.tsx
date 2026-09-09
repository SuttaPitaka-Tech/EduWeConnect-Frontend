import { useState } from 'react'
import {
  Users,
  UserCheck,
  Building,
  GraduationCap,
  Calendar,
  ChevronDown,
  ArrowUpRight,
  Trophy,
  FileText,
  Clock,
  ArrowRight,
  UserPlus,
  CalendarDays,
  CreditCard,
  ClipboardCheck,
  Bell,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { useAuth } from '@/contexts/auth-context'

// ── Attendance Trend Data for Area Chart ──────────────────────────────────────
const ATTENDANCE_TREND_DATA = [
  { day: 'Mon', attendance: 92 },
  { day: 'Tue', attendance: 95 },
  { day: 'Wed', attendance: 88 },
  { day: 'Thu', attendance: 96 },
  { day: 'Fri', attendance: 94 },
  { day: 'Sat', attendance: 91 },
]

// ── Fee Collection Donut Data ────────────────────────────────────────────────
const FEE_DATA = [
  { name: 'Collected', value: 72, amount: '₹ 18,45,200', color: '#102A43' },
  { name: 'Pending', value: 22, amount: '₹ 5,60,000', color: '#B8862C' },
  { name: 'Overdue', value: 6, amount: '₹ 1,50,000', color: '#94A3B8' },
]

// ── Attendance Gauge Data ────────────────────────────────────────────────────
const ATTENDANCE_GAUGE_DATA = [
  { name: 'Present', value: 94, color: '#B8862C' },
  { name: 'Absent & Leave', value: 6, color: '#E2D9C8' },
]

export default function OrganizationDashboard() {
  const { user } = useAuth()
  const [selectedPeriod] = useState('This Week')

  const orgDisplayName =
    user?.organizationName || user?.institutionName || user?.firstName || 'Organization'

  const formattedDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    weekday: 'long',
  })

  return (
    <div className="flex-1 w-full p-5 lg:p-8 flex flex-col gap-6 max-w-[1600px] mx-auto animate-fadeIn">
      {/* ── Top Welcome Bar ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-[var(--navy)] flex items-center gap-2">
            Welcome back, {orgDisplayName} <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-xs lg:text-sm text-[var(--text-secondary)] font-medium mt-1">
            Here&apos;s an overview of your institution&apos;s activities and metrics today.
          </p>
        </div>

        {/* Date Pill */}
        <div className="flex items-center gap-2 bg-white/90 border border-[var(--border)] px-4 py-2 rounded-xl shadow-sm self-start sm:self-auto">
          <Calendar className="w-4 h-4 text-[var(--navy)]" />
          <span className="text-xs font-semibold text-[var(--navy)]">{formattedDate}</span>
        </div>
      </div>

      {/* ── Row 1: 4 Metric Cards (KPIs) ──────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Students */}
        <div className="bg-white/95 rounded-2xl p-5 border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F5EEDB] border border-[#E5DEC9] flex items-center justify-center text-[var(--gold)] shrink-0">
            <Users className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[var(--text-secondary)]">Total Students</p>
            <p className="text-2xl font-bold text-[var(--navy)] tracking-tight leading-snug mt-0.5">
              1,420
            </p>
            <p className="text-[11px] font-semibold text-[#16A34A] flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> 8.5% from last term
            </p>
          </div>
        </div>

        {/* Card 2: Teaching & Non-Teaching Staff */}
        <div className="bg-white/95 rounded-2xl p-5 border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F5EEDB] border border-[#E5DEC9] flex items-center justify-center text-[var(--gold)] shrink-0">
            <UserCheck className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[var(--text-secondary)]">Total Staff</p>
            <p className="text-2xl font-bold text-[var(--navy)] tracking-tight leading-snug mt-0.5">
              96
            </p>
            <p className="text-[11px] font-semibold text-[#16A34A] flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> 4.2% from last month
            </p>
          </div>
        </div>

        {/* Card 3: Active Standards & Sections */}
        <div className="bg-white/95 rounded-2xl p-5 border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F5EEDB] border border-[#E5DEC9] flex items-center justify-center text-[var(--gold)] shrink-0">
            <Building className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[var(--text-secondary)]">Standards / Classes</p>
            <p className="text-2xl font-bold text-[var(--navy)] tracking-tight leading-snug mt-0.5">
              14
            </p>
            <p className="text-[11px] font-semibold text-[#16A34A] flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> Active Academic Year
            </p>
          </div>
        </div>

        {/* Card 4: Daily Average Attendance */}
        <div className="bg-white/95 rounded-2xl p-5 border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F5EEDB] border border-[#E5DEC9] flex items-center justify-center text-[var(--gold)] shrink-0">
            <GraduationCap className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[var(--text-secondary)]">Today&apos;s Attendance</p>
            <p className="text-2xl font-bold text-[var(--navy)] tracking-tight leading-snug mt-0.5">
              94.2%
            </p>
            <p className="text-[11px] font-semibold text-[#16A34A] flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> 1.8% higher than average
            </p>
          </div>
        </div>
      </div>

      {/* ── Row 2: Charts & Announcements ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Weekly Attendance Trend (7 cols) */}
        <div className="lg:col-span-7 bg-white/95 rounded-2xl p-5 lg:p-6 border border-[var(--border)] shadow-sm flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold text-[var(--navy)]">Weekly Attendance Trends</h2>
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-[var(--text-secondary)] bg-white border border-[var(--border)] rounded-lg hover:border-[var(--gold)] transition-colors cursor-pointer"
              >
                <span>{selectedPeriod}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Legend Tag */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--gold)]" />
              <span className="text-xs font-medium text-[var(--text-secondary)]">
                Average Present Percentage (%)
              </span>
            </div>

            {/* Area Chart */}
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={ATTENDANCE_TREND_DATA}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="orgAttendanceGold" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#B8862C" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#B8862C" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={{ stroke: '#E5DEC9' }}
                    tick={{ fill: '#536579', fontSize: 11, fontWeight: 500 }}
                  />
                  <YAxis
                    domain={[70, 100]}
                    ticks={[70, 80, 90, 100]}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#536579', fontSize: 11, fontWeight: 500 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '10px',
                      border: '1px solid #DED5C5',
                      boxShadow: '0 8px 24px rgba(16,42,67,0.1)',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                    itemStyle={{ color: '#102A43' }}
                    formatter={(val: any) => [`${val}%`, 'Attendance']}
                  />
                  <Area
                    type="monotone"
                    dataKey="attendance"
                    stroke="#B8862C"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#orgAttendanceGold)"
                    dot={{ fill: '#B8862C', stroke: '#FFFFFF', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#B8862C', stroke: '#FFFFFF', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Summary Bar */}
          <div className="grid grid-cols-3 gap-2 pt-4 mt-2 border-t border-[var(--border)]/60 text-center sm:text-left">
            <div>
              <p className="text-[11px] font-semibold text-[var(--text-secondary)]">Weekly Avg</p>
              <p className="text-base font-bold text-[var(--navy)] mt-0.5">93.8%</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[var(--text-secondary)]">Highest Day</p>
              <p className="text-base font-bold text-[var(--navy)] mt-0.5">Thursday (96%)</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[var(--text-secondary)]">Status</p>
              <p className="text-base font-bold text-[#16A34A] mt-0.5 flex items-center gap-1">
                Excellent <ArrowUpRight className="w-4 h-4" />
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Institutional Notices (5 cols) */}
        <div className="lg:col-span-5 bg-white/95 rounded-2xl p-5 lg:p-6 border border-[var(--border)] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-[var(--navy)]">Notices &amp; Circulars</h2>
              <button
                type="button"
                className="text-xs font-bold text-[var(--gold)] hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            {/* List */}
            <div className="flex flex-col gap-3.5">
              {/* Item 1 */}
              <div className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F7F1E3]/50 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-[#F5EEDB] text-[var(--gold)] flex items-center justify-center shrink-0 mt-0.5">
                  <Trophy className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-bold text-[var(--navy)] truncate">
                      Inter-School Science Fair 2025
                    </h3>
                    <span className="text-[10px] text-[var(--text-secondary)] shrink-0">Today</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed mt-0.5 line-clamp-2">
                    Registrations for student projects in classes 8th through 12th close on Friday.
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F7F1E3]/50 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-[#F5EEDB] text-[var(--gold)] flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-bold text-[var(--navy)] truncate">
                      Mid-Term Grade Submission
                    </h3>
                    <span className="text-[10px] text-[var(--text-secondary)] shrink-0">Yesterday</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed mt-0.5 line-clamp-2">
                    All faculty members are requested to finalize grades in the portal by next Monday.
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F7F1E3]/50 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-[#F5EEDB] text-[var(--gold)] flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-bold text-[var(--navy)] truncate">
                      Parent-Teacher Meeting
                    </h3>
                    <span className="text-[10px] text-[var(--text-secondary)] shrink-0">3d ago</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed mt-0.5 line-clamp-2">
                    Scheduled for Saturday from 9:00 AM to 1:00 PM for all primary standards.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            className="w-full mt-4 py-2.5 px-4 bg-[#F5EEDB]/60 hover:bg-[#F5EEDB] border border-[var(--gold)]/30 rounded-xl text-xs font-bold text-[var(--gold)] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>View All Notices</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Row 3: Bottom 3 Columns ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Col 1: Fee Collection Overview */}
        <div className="bg-white/95 rounded-2xl p-5 lg:p-6 border border-[var(--border)] shadow-sm flex flex-col justify-between min-h-[280px]">
          <div>
            <h2 className="text-base font-bold text-[var(--navy)] mb-4">Fee Collection Overview</h2>

            <div className="flex items-center justify-center gap-6">
              {/* Donut Chart */}
              <div className="w-[130px] h-[130px] shrink-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={FEE_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={38}
                      outerRadius={58}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {FEE_DATA.map((entry, index) => (
                        <Cell key={`fee-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Status List */}
              <div className="flex flex-col gap-2 min-w-0">
                <p className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                  Quarter Status
                </p>
                {FEE_DATA.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-semibold text-[var(--navy)] truncate">{item.name}</span>
                    <span className="text-[11px] text-[var(--text-secondary)] whitespace-nowrap ml-auto">
                      {item.amount} ({item.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Col 2: Today's Attendance Overview */}
        <div className="bg-white/95 rounded-2xl p-5 lg:p-6 border border-[var(--border)] shadow-sm flex flex-col justify-between min-h-[280px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-[var(--navy)]">Today&apos;s Attendance</h2>
              <span className="text-xs font-semibold text-[var(--text-secondary)] bg-white border border-[var(--border)] px-2.5 py-0.5 rounded-lg">
                Today
              </span>
            </div>

            <div className="flex items-center justify-center gap-8 pt-1">
              {/* Circular Gauge */}
              <div className="w-[130px] h-[130px] shrink-0 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ATTENDANCE_GAUGE_DATA}
                      cx="50%"
                      cy="50%"
                      startAngle={90}
                      endAngle={-270}
                      innerRadius={46}
                      outerRadius={58}
                      dataKey="value"
                      stroke="none"
                    >
                      <Cell fill="#B8862C" />
                      <Cell fill="#EAE2D2" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-2xl font-bold text-[var(--navy)] leading-none">94%</span>
                  <span className="text-[10px] font-semibold text-[var(--text-secondary)] mt-1">
                    Present
                  </span>
                </div>
              </div>

              {/* Attendance Breakdown */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--gold)]" />
                  <span className="font-semibold text-[var(--navy)]">Present</span>
                  <span className="font-bold text-[var(--navy)] ml-4">94%</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--navy)]" />
                  <span className="font-semibold text-[var(--navy)]">Absent</span>
                  <span className="font-bold text-[var(--navy)] ml-4">4%</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#94A3B8]" />
                  <span className="font-semibold text-[var(--navy)]">Leave</span>
                  <span className="font-bold text-[var(--navy)] ml-4">2%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Col 3: Quick Actions */}
        <div className="bg-white/95 rounded-2xl p-5 lg:p-6 border border-[var(--border)] shadow-sm flex flex-col justify-between min-h-[280px]">
          <div>
            <h2 className="text-base font-bold text-[var(--navy)] mb-4">Quick Actions</h2>

            <div className="grid grid-cols-3 gap-3">
              {/* Action 1 */}
              <button
                type="button"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#F7F1E3]/50 hover:bg-[#F5EEDB] border border-[var(--border)]/60 hover:border-[var(--gold)]/50 transition-all text-center group cursor-pointer"
              >
                <UserPlus
                  className="w-5 h-5 text-[var(--navy)] group-hover:text-[var(--gold)] transition-colors mb-1.5"
                  strokeWidth={1.75}
                />
                <span className="text-[11px] font-bold text-[var(--navy)] leading-tight">
                  Add Student
                </span>
              </button>

              {/* Action 2 */}
              <button
                type="button"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#F7F1E3]/50 hover:bg-[#F5EEDB] border border-[var(--border)]/60 hover:border-[var(--gold)]/50 transition-all text-center group cursor-pointer"
              >
                <UserCheck
                  className="w-5 h-5 text-[var(--navy)] group-hover:text-[var(--gold)] transition-colors mb-1.5"
                  strokeWidth={1.75}
                />
                <span className="text-[11px] font-bold text-[var(--navy)] leading-tight">
                  Add Staff
                </span>
              </button>

              {/* Action 3 */}
              <button
                type="button"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#F7F1E3]/50 hover:bg-[#F5EEDB] border border-[var(--border)]/60 hover:border-[var(--gold)]/50 transition-all text-center group cursor-pointer"
              >
                <ClipboardCheck
                  className="w-5 h-5 text-[var(--navy)] group-hover:text-[var(--gold)] transition-colors mb-1.5"
                  strokeWidth={1.75}
                />
                <span className="text-[11px] font-bold text-[var(--navy)] leading-tight">
                  Attendance
                </span>
              </button>

              {/* Action 4 */}
              <button
                type="button"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#F7F1E3]/50 hover:bg-[#F5EEDB] border border-[var(--border)]/60 hover:border-[var(--gold)]/50 transition-all text-center group cursor-pointer"
              >
                <CalendarDays
                  className="w-5 h-5 text-[var(--navy)] group-hover:text-[var(--gold)] transition-colors mb-1.5"
                  strokeWidth={1.75}
                />
                <span className="text-[11px] font-bold text-[var(--navy)] leading-tight">
                  Timetable
                </span>
              </button>

              {/* Action 5 */}
              <button
                type="button"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#F7F1E3]/50 hover:bg-[#F5EEDB] border border-[var(--border)]/60 hover:border-[var(--gold)]/50 transition-all text-center group cursor-pointer"
              >
                <CreditCard
                  className="w-5 h-5 text-[var(--navy)] group-hover:text-[var(--gold)] transition-colors mb-1.5"
                  strokeWidth={1.75}
                />
                <span className="text-[11px] font-bold text-[var(--navy)] leading-tight">
                  Fee Entry
                </span>
              </button>

              {/* Action 6 */}
              <button
                type="button"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#F7F1E3]/50 hover:bg-[#F5EEDB] border border-[var(--border)]/60 hover:border-[var(--gold)]/50 transition-all text-center group cursor-pointer"
              >
                <Bell
                  className="w-5 h-5 text-[var(--navy)] group-hover:text-[var(--gold)] transition-colors mb-1.5"
                  strokeWidth={1.75}
                />
                <span className="text-[11px] font-bold text-[var(--navy)] leading-tight">
                  Notice
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
