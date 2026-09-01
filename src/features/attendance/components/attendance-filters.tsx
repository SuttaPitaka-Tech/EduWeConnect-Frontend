import { X } from 'lucide-react'
import { Dropdown, SearchInput, type DropdownOption } from '@/components/ui'
import type { AttendanceFiltersProps } from '../types/types'
import { AttendanceStatus, AttendanceType } from '../enums/attendance.enum'
import { ATTENDANCE_STATUS_BADGE } from '../constants/constants'

const STATUS_OPTIONS: DropdownOption[] = [
  { value: '', label: 'All Status' },
  ...Object.values(AttendanceStatus).map((s) => ({
    value: s,
    label: ATTENDANCE_STATUS_BADGE[s]?.label ?? s,
  })),
]

const TYPE_OPTIONS: DropdownOption[] = [
  { value: '', label: 'All Types' },
  { value: AttendanceType.STUDENT, label: 'Student' },
  { value: AttendanceType.STAFF, label: 'Staff' },
]

export function AttendanceFilters({ params, onParamsChange, onClear }: AttendanceFiltersProps) {
  const hasActiveFilters = Boolean(params.search || params.status || params.type || params.classId || params.date)

  return (
    <div
      className="flex flex-wrap items-center gap-2.5 border-b px-4 py-3 bg-white/50"
      style={{ borderColor: 'var(--border, #DED5C5)' }}
    >
      {/* Search box */}
      <div className="min-w-[200px] flex-1">
        <SearchInput
          placeholder="Search member name..."
          value={params.search ?? ''}
          onChange={(val) => onParamsChange({ search: val || undefined })}
          onClear={() => onParamsChange({ search: undefined })}
        />
      </div>

      {/* Status Dropdown */}
      <div className="w-36 shrink-0">
        <Dropdown
          value={params.status ?? ''}
          onChange={(val) => onParamsChange({ status: (val as AttendanceStatus) || undefined })}
          options={STATUS_OPTIONS}
          placeholder="All Status"
          clearable={true}
        />
      </div>

      {/* Type Dropdown */}
      <div className="w-36 shrink-0">
        <Dropdown
          value={params.type ?? ''}
          onChange={(val) => onParamsChange({ type: (val as AttendanceType) || undefined })}
          options={TYPE_OPTIONS}
          placeholder="All Types"
          clearable={true}
        />
      </div>

      {/* Date filter */}
      <input
        type="date"
        value={params.date ?? ''}
        onChange={(e) => onParamsChange({ date: e.target.value || undefined })}
        className="h-9 shrink-0 rounded-lg border bg-white px-3 text-xs outline-none transition-colors select-none hover:border-slate-400 focus:border-[var(--navy,#102A43)]"
        style={{
          borderColor: 'var(--border, #DED5C5)',
          color: 'var(--text-primary, #102A43)',
        }}
      />

      {/* Reset */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClear}
          className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg border bg-white px-3 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
          style={{ borderColor: 'var(--border, #DED5C5)' }}
        >
          <X className="size-3.5" aria-hidden />
          Reset
        </button>
      )}
    </div>
  )
}
