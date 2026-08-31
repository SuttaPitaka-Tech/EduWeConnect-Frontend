import { cn } from '@/lib/utils'
import { Spinner } from '@/components/ui/spinner'
import type { AttendanceStatsBarProps } from '../types/types'

interface StatCardProps {
  label:   string
  value:   number | string
  color:   string
  bgColor: string
}

function StatCard({ label, value, color, bgColor }: StatCardProps) {
  return (
    <div
      className={cn('flex flex-col gap-1 rounded-xl border px-4 py-3', bgColor)}
    >
      <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
        {label}
      </p>
      <p className={cn('text-2xl font-bold', color)}>{value}</p>
    </div>
  )
}

export function AttendanceStatsBar({ stats, isLoading }: AttendanceStatsBarProps) {
  if (isLoading) {
    return (
      <div className="flex h-16 items-center justify-center">
        <Spinner size={24} />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatCard
        label="Present"
        value={stats?.totalPresent ?? 0}
        color="text-green-700"
        bgColor="bg-green-50 border-green-100"
      />
      <StatCard
        label="Absent"
        value={stats?.totalAbsent ?? 0}
        color="text-red-700"
        bgColor="bg-red-50 border-red-100"
      />
      <StatCard
        label="Late"
        value={stats?.totalLate ?? 0}
        color="text-amber-700"
        bgColor="bg-amber-50 border-amber-100"
      />
      <StatCard
        label="Attendance %"
        value={stats ? `${stats.percentage.toFixed(1)}%` : '—'}
        color="text-[var(--navy)]"
        bgColor="bg-[var(--warm-white)] border-[var(--border)]"
      />
    </div>
  )
}
