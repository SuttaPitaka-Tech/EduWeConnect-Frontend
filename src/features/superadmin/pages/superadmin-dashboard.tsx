import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building,
  Calendar,
  ArrowUpRight,
  Clock,
  ArrowRight,
} from 'lucide-react'
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts'
import { fetchDashboardStatsApi } from '../api/dashboard.api'

export default function SuperAdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStatsApi()
      .then(data => {
        setStats(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch dashboard stats', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex-1 w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--gold)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }



  const orgData = [
    { name: 'Total', count: stats?.organizations?.total || 0, fill: '#1967D2' },
    { name: 'Approved', count: stats?.organizations?.approved || 0, fill: '#137333' },
    { name: 'Pending', count: stats?.organizations?.pending || 0, fill: '#E37400' },
    { name: 'Rejected', count: stats?.organizations?.rejected || 0, fill: '#C5221F' },
  ];

  const currentDate = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date()) + ', ' + new Intl.DateTimeFormat('en-GB', { weekday: 'long' }).format(new Date());

  return (
    <div className="flex-1 w-full px-5 pt-2 pb-5 lg:px-8 lg:pt-3 lg:pb-8 flex flex-col gap-6 max-w-[1600px] mx-auto overflow-y-auto">
      
      {/* ── Top Welcome Bar ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-[var(--navy)] flex items-center gap-2">
            Welcome back, Super Admin <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-xs lg:text-sm text-[var(--text-secondary)] font-medium mt-1">
            Here&apos;s what&apos;s happening in EduWeConnect today.
          </p>
        </div>

        {/* Date Pill */}
        <div className="flex items-center gap-2 bg-white/90 border border-[var(--border)] px-4 py-2 rounded-xl shadow-sm self-start sm:self-auto">
          <Calendar className="w-4 h-4 text-[var(--navy)]" />
          <span className="text-xs font-semibold text-[var(--navy)]">{currentDate}</span>
        </div>
      </div>

      {/* ── Row 1: Organization Metrics ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Total Registered Organizations */}
        <div 
          onClick={() => navigate('/superadmin/approvals')}
          className="bg-white/95 rounded-2xl p-5 border border-[var(--border)] shadow-sm hover:shadow-xl hover:shadow-[var(--gold)]/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#E8F0FE] border border-[#D2E3FC] flex items-center justify-center text-[#1967D2] shrink-0">
            <Building className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[var(--text-secondary)]">Organizations Applied</p>
            <p className="text-2xl font-bold text-[var(--navy)] tracking-tight leading-snug mt-0.5">{stats?.organizations?.total || 0}</p>
            <p className="text-[11px] font-semibold text-[#16A34A] flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> Total Applications
            </p>
          </div>
        </div>

        {/* Card 2: Approved Organizations */}
        <div 
          onClick={() => navigate('/superadmin/approvals')}
          className="bg-white/95 rounded-2xl p-5 border border-[var(--border)] shadow-sm hover:shadow-xl hover:shadow-[#137333]/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#E6F4EA] border border-[#CEEAD6] flex items-center justify-center text-[#137333] shrink-0">
            <Building className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[var(--text-secondary)]">Approved</p>
            <p className="text-2xl font-bold text-[var(--navy)] tracking-tight leading-snug mt-0.5">{stats?.organizations?.approved || 0}</p>
            <p className="text-[11px] font-semibold text-[#16A34A] flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> Active in platform
            </p>
          </div>
        </div>

        {/* Card 3: Pending Organizations */}
        <div 
          onClick={() => navigate('/superadmin/approvals')}
          className="bg-white/95 rounded-2xl p-5 border border-[var(--border)] shadow-sm hover:shadow-xl hover:shadow-[#E37400]/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#FEF7E0] border border-[#FEEFC3] flex items-center justify-center text-[#E37400] shrink-0">
            <Clock className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[var(--text-secondary)]">Pending Approval</p>
            <p className="text-2xl font-bold text-[var(--navy)] tracking-tight leading-snug mt-0.5">{stats?.organizations?.pending || 0}</p>
            <p className="text-[11px] font-semibold text-[#E37400] flex items-center gap-0.5 mt-0.5">
              <ArrowRight className="w-3.5 h-3.5" /> Action required
            </p>
          </div>
        </div>

        {/* Card 4: Rejected Organizations */}
        <div 
          onClick={() => navigate('/superadmin/approvals')}
          className="bg-white/95 rounded-2xl p-5 border border-[var(--border)] shadow-sm hover:shadow-xl hover:shadow-[#C5221F]/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#FCE8E6] border border-[#FAD2CF] flex items-center justify-center text-[#C5221F] shrink-0">
            <Building className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[var(--text-secondary)]">Rejected</p>
            <p className="text-2xl font-bold text-[var(--navy)] tracking-tight leading-snug mt-0.5">{stats?.organizations?.rejected || 0}</p>
            <p className="text-[11px] font-semibold text-[#C5221F] flex items-center gap-0.5 mt-0.5">
              <ArrowRight className="w-3.5 h-3.5" /> Applications denied
            </p>
          </div>
        </div>

      </div>

      {/* ── Row 2: Entity Metrics ─────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5">
        {/* Organization Bar Chart */}
        <div 
          onClick={() => navigate('/superadmin/approvals')}
          className="bg-white/95 rounded-2xl p-5 lg:p-6 border border-[var(--border)] shadow-sm hover:shadow-xl hover:shadow-[var(--gold)]/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-[var(--navy)]">Organization Analytics</h2>
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orgData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={40}>
                <XAxis 
                  dataKey="name" 
                  tickLine={false} 
                  axisLine={{ stroke: '#D2E3FC' }}
                  tick={{ fill: '#536579', fontSize: 12, fontWeight: 600 }}
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: '#536579', fontSize: 11, fontWeight: 500 }}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    border: '1px solid #D2E3FC',
                    boxShadow: '0 8px 24px rgba(16,42,67,0.1)',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                  itemStyle={{ color: '#102A43' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {orgData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>



    </div>
  )
}
