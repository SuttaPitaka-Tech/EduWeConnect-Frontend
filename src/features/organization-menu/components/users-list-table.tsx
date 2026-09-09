import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import {
  UserCheck,
  GraduationCap,
  Users,
  Search,
  RefreshCw,
  Copy,
  Check,
  Mail,
  Phone,
  BookOpen,
  Briefcase,
  DollarSign,
  ShieldCheck,
  Sparkles,
  Eye,
  Pencil,
  Trash2,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'

export type UserRoleTab = 'staff' | 'students' | 'parents'

export interface StaffMember {
  id: string
  organization_id?: string
  employee_first_name: string
  employee_last_name?: string
  employee_email: string
  employee_mobile_number: string
  employee_type: 'Teacher' | 'Non Staff' | 'Finance' | string
  subjects?: string[]
  employee_pan_number?: string
  employee_pan_file_id?: string | null
  employee_aadhar_number?: string
  employee_aadhar_file_id?: string | null
  employee_experience?: string
  employee_previous_work_institute_name?: string
  employee_experience_letter_file_id?: string | null
  employee_relieving_letter_file_id?: string | null
  additional_documents?: Array<{ docName: string; file_id?: string; file_name?: string }>
  status?: string
  created_at: string
}

export interface StudentMember {
  id: string
  name: string
  email: string
  mobile_number: string
  class_grade: string
  roll_number: string
  parent_name: string
  status: string
  created_at: string
}

export interface ParentMember {
  id: string
  name: string
  email: string
  mobile_number: string
  relation: string
  student_name: string
  student_grade: string
  status: string
  created_at: string
}

const MOCK_STUDENTS: StudentMember[] = [
  {
    id: 'STU-94812',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@institution.edu',
    mobile_number: '+91 98451 22334',
    class_grade: '10th Std - Section A',
    roll_number: '1001',
    parent_name: 'Rajesh Sharma (Father)',
    status: 'Active',
    created_at: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 'STU-94813',
    name: 'Ananya Rao',
    email: 'ananya.rao@institution.edu',
    mobile_number: '+91 97402 55667',
    class_grade: '9th Std - Section B',
    roll_number: '0914',
    parent_name: 'Suresh Rao (Father)',
    status: 'Active',
    created_at: '2026-09-02T11:30:00.000Z',
  },
  {
    id: 'STU-94814',
    name: 'Rohan Deshmukh',
    email: 'rohan.d@institution.edu',
    mobile_number: '+91 99003 77889',
    class_grade: '1st PUC - PCMB',
    roll_number: '1105',
    parent_name: 'Priya Deshmukh (Mother)',
    status: 'Active',
    created_at: '2026-09-05T09:15:00.000Z',
  },
  {
    id: 'STU-94815',
    name: 'Diya Patel',
    email: 'diya.patel@institution.edu',
    mobile_number: '+91 98860 99112',
    class_grade: '8th Std - Section A',
    roll_number: '0822',
    parent_name: 'Amit Patel (Father)',
    status: 'Active',
    created_at: '2026-09-07T14:20:00.000Z',
  },
]

const MOCK_PARENTS: ParentMember[] = [
  {
    id: 'PAR-88210',
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@gmail.com',
    mobile_number: '+91 98451 22334',
    relation: 'Father',
    student_name: 'Aarav Sharma',
    student_grade: '10th Std - Sec A',
    status: 'Verified',
    created_at: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 'PAR-88211',
    name: 'Suresh Rao',
    email: 'suresh.rao@outlook.com',
    mobile_number: '+91 97402 55667',
    relation: 'Father',
    student_name: 'Ananya Rao',
    student_grade: '9th Std - Sec B',
    status: 'Verified',
    created_at: '2026-09-02T11:30:00.000Z',
  },
  {
    id: 'PAR-88212',
    name: 'Priya Deshmukh',
    email: 'priya.deshmukh@yahoo.com',
    mobile_number: '+91 99003 77889',
    relation: 'Mother',
    student_name: 'Rohan Deshmukh',
    student_grade: '1st PUC - PCMB',
    status: 'Verified',
    created_at: '2026-09-05T09:15:00.000Z',
  },
  {
    id: 'PAR-88213',
    name: 'Amit Patel',
    email: 'amit.patel@gmail.com',
    mobile_number: '+91 98860 99112',
    relation: 'Father',
    student_name: 'Diya Patel',
    student_grade: '8th Std - Sec A',
    status: 'Verified',
    created_at: '2026-09-07T14:20:00.000Z',
  },
]

interface UsersListTableProps {
  onCreateStaffClick?: () => void
  onCreateStudentClick?: () => void
  onCreateParentsClick?: () => void
  onViewStaff?: (staff: StaffMember) => void
  onEditStaff?: (staff: StaffMember) => void
  onStaffDeleted?: (staffId: string) => void
}

export function UsersListTable({
  onCreateStaffClick,
  onCreateStudentClick,
  onCreateParentsClick,
  onViewStaff,
  onEditStaff,
  onStaffDeleted,
}: UsersListTableProps) {
  const [activeTab, setActiveTab] = useState<UserRoleTab>('staff')
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Real staff state from backend API
  const [staffList, setStaffList] = useState<StaffMember[]>([])
  const [isLoadingStaff, setIsLoadingStaff] = useState<boolean>(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [deletingStaffId, setDeletingStaffId] = useState<string | null>(null)
  const [confirmDeleteStaffId, setConfirmDeleteStaffId] = useState<string | null>(null)

  // Guard against duplicate in-flight and React double-mount API calls
  const hasFetchedRef = useRef(false)
  const isFetchingRef = useRef(false)

  const handleDeleteStaff = async (staff: StaffMember) => {
    setDeletingStaffId(staff.id)
    try {
      await apiClient.delete(`/staff-details/${staff.id}`)
      const name = `${staff.employee_first_name} ${staff.employee_last_name || ''}`.trim()
      toast.success(`Staff member "${name}" deleted successfully`)
      setStaffList((prev) => prev.filter((s) => s.id !== staff.id))
      onStaffDeleted?.(staff.id)
    } catch (err: any) {
      console.error('Failed to delete staff:', err)
      toast.error(err.response?.data?.message || 'Failed to delete staff member')
    } finally {
      setDeletingStaffId(null)
      setConfirmDeleteStaffId(null)
    }
  }

  // Fetch real staff from API Gateway / Role Allocation
  const fetchStaffData = useCallback(async (force = false) => {
    if (isFetchingRef.current && !force) return
    isFetchingRef.current = true
    setIsLoadingStaff(true)
    setFetchError(null)
    try {
      const res = await apiClient.get<StaffMember[]>('/staff-details')
      if (Array.isArray(res.data)) {
        setStaffList(res.data)
      } else {
        setStaffList([])
      }
    } catch (err: any) {
      console.error('Failed to load staff list:', err)
      setFetchError('Unable to load staff records. Click refresh to retry.')
    } finally {
      setIsLoadingStaff(false)
      isFetchingRef.current = false
    }
  }, [])

  useEffect(() => {
    if (hasFetchedRef.current) return
    hasFetchedRef.current = true
    fetchStaffData()
  }, [fetchStaffData])

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id)
    setCopiedId(id)
    toast.success('User ID copied to clipboard!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Filter staff records based on search query
  const filteredStaff = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return staffList
    return staffList.filter((s) => {
      const fullName = `${s.employee_first_name} ${s.employee_last_name || ''}`.toLowerCase()
      const email = (s.employee_email || '').toLowerCase()
      const mobile = (s.employee_mobile_number || '').toLowerCase()
      const type = (s.employee_type || '').toLowerCase()
      const id = (s.id || '').toLowerCase()
      const subjects = (s.subjects || []).join(' ').toLowerCase()
      return (
        fullName.includes(q) ||
        email.includes(q) ||
        mobile.includes(q) ||
        type.includes(q) ||
        id.includes(q) ||
        subjects.includes(q)
      )
    })
  }, [staffList, searchQuery])

  // Filter students based on search query
  const filteredStudents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return MOCK_STUDENTS
    return MOCK_STUDENTS.filter((st) => {
      return (
        st.name.toLowerCase().includes(q) ||
        st.id.toLowerCase().includes(q) ||
        st.email.toLowerCase().includes(q) ||
        st.class_grade.toLowerCase().includes(q) ||
        st.roll_number.toLowerCase().includes(q) ||
        st.parent_name.toLowerCase().includes(q)
      )
    })
  }, [searchQuery])

  // Filter parents based on search query
  const filteredParents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return MOCK_PARENTS
    return MOCK_PARENTS.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.mobile_number.toLowerCase().includes(q) ||
        p.student_name.toLowerCase().includes(q) ||
        p.relation.toLowerCase().includes(q)
      )
    })
  }, [searchQuery])

  const renderRoleBadge = (type: string) => {
    const normalized = (type || '').toLowerCase()
    if (normalized.includes('teach')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs">
          <BookOpen className="w-3 h-3 text-amber-600" />
          <span>Teacher</span>
        </span>
      )
    }
    if (normalized.includes('finance')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs">
          <DollarSign className="w-3 h-3 text-emerald-600" />
          <span>Finance</span>
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-50 text-sky-800 border border-sky-200/80 shadow-2xs">
        <Briefcase className="w-3 h-3 text-sky-600" />
        <span>Non Staff</span>
      </span>
    )
  }

  return (
    <div className="w-full bg-white/95 rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden flex flex-col transition-all">
      {/* ── Table Top Bar: Tabs & Search Controls ── */}
      <div className="p-5 lg:p-6 border-b border-[var(--border)]/80 bg-gradient-to-r from-white via-[#FCFBF7] to-white flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg lg:text-xl font-serif font-bold text-[var(--navy)]">
                Registered Institutional Users
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live Data
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Manage and view all staff members, enrolled students, and registered parents
            </p>
          </div>

          {/* Role Navigation Tabs */}
          <div className="inline-flex p-1 rounded-xl bg-[var(--cream)]/60 border border-[var(--border)] shadow-2xs self-start md:self-auto">
            {/* Staff Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('staff')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'staff'
                  ? 'bg-white text-[var(--navy)] shadow-xs border border-[var(--border)]/60'
                  : 'text-[var(--text-secondary)] hover:text-[var(--navy)]'
              }`}
            >
              <UserCheck className={`w-3.5 h-3.5 ${activeTab === 'staff' ? 'text-[var(--gold)]' : ''}`} />
              <span>Staff</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'staff'
                    ? 'bg-[var(--gold)]/15 text-[var(--navy)]'
                    : 'bg-gray-200/70 text-gray-600'
                }`}
              >
                {staffList.length}
              </span>
            </button>

            {/* Students Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('students')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'students'
                  ? 'bg-white text-[var(--navy)] shadow-xs border border-[var(--border)]/60'
                  : 'text-[var(--text-secondary)] hover:text-[var(--navy)]'
              }`}
            >
              <GraduationCap className={`w-3.5 h-3.5 ${activeTab === 'students' ? 'text-[var(--gold)]' : ''}`} />
              <span>Students</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'students'
                    ? 'bg-[var(--gold)]/15 text-[var(--navy)]'
                    : 'bg-gray-200/70 text-gray-600'
                }`}
              >
                {MOCK_STUDENTS.length}
              </span>
            </button>

            {/* Parents Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('parents')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'parents'
                  ? 'bg-white text-[var(--navy)] shadow-xs border border-[var(--border)]/60'
                  : 'text-[var(--text-secondary)] hover:text-[var(--navy)]'
              }`}
            >
              <Users className={`w-3.5 h-3.5 ${activeTab === 'parents' ? 'text-[var(--gold)]' : ''}`} />
              <span>Parents</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'parents'
                    ? 'bg-[var(--gold)]/15 text-[var(--navy)]'
                    : 'bg-gray-200/70 text-gray-600'
                }`}
              >
                {MOCK_PARENTS.length}
              </span>
            </button>
          </div>
        </div>

        {/* Search, Status & Quick Action Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab} by name, user ID, email, or role...`}
              className="w-full h-10 pl-9 pr-4 rounded-xl border border-[var(--border)] bg-white text-xs text-[var(--navy)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)] shadow-2xs transition-colors"
            />
            <Search className="w-4 h-4 text-[var(--gold)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => fetchStaffData(true)}
              disabled={isLoadingStaff}
              className="h-10 px-3.5 rounded-xl border border-[var(--border)] bg-white hover:bg-[var(--cream)]/40 text-[var(--navy)] text-xs font-bold flex items-center gap-2 shadow-2xs active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              title="Refresh users data"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[var(--gold)] ${isLoadingStaff ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            {activeTab === 'staff' && onCreateStaffClick && (
              <Button
                size="sm"
                onClick={onCreateStaffClick}
                className="h-10 px-4 rounded-xl bg-[var(--navy)] text-white hover:bg-[var(--deep-navy)] text-xs font-bold gap-1.5 shadow-sm cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>Add Staff</span>
              </Button>
            )}

            {activeTab === 'students' && onCreateStudentClick && (
              <Button
                size="sm"
                onClick={onCreateStudentClick}
                className="h-10 px-4 rounded-xl bg-[var(--navy)] text-white hover:bg-[var(--deep-navy)] text-xs font-bold gap-1.5 shadow-sm cursor-pointer"
              >
                <GraduationCap className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>Add Student</span>
              </Button>
            )}

            {activeTab === 'parents' && onCreateParentsClick && (
              <Button
                size="sm"
                onClick={onCreateParentsClick}
                className="h-10 px-4 rounded-xl bg-[var(--navy)] text-white hover:bg-[var(--deep-navy)] text-xs font-bold gap-1.5 shadow-sm cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>Add Parent</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── Table Content ── */}
      <div className="w-full overflow-x-auto min-h-[300px]">
        {/* 1. STAFF TAB (Real Data) */}
        {activeTab === 'staff' && (
          <>
            {isLoadingStaff ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3 text-center">
                <RefreshCw className="w-8 h-8 text-[var(--gold)] animate-spin" />
                <p className="text-xs font-semibold text-[var(--navy)]">Loading registered staff records...</p>
                <p className="text-[11px] text-[var(--text-secondary)]">Connecting to EduWeConnect database &amp; MinIO storage</p>
              </div>
            ) : fetchError ? (
              <div className="py-16 text-center px-4">
                <p className="text-xs font-bold text-rose-600 mb-2">{fetchError}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fetchStaffData(true)}
                  className="rounded-xl border-[var(--gold)] text-[var(--navy)] text-xs"
                >
                  Retry Loading Staff
                </Button>
              </div>
            ) : filteredStaff.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3 text-center px-4">
                <div className="w-14 h-14 rounded-2xl bg-[var(--cream)] border border-[var(--gold)]/30 flex items-center justify-center text-[var(--gold)]">
                  <UserCheck className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-bold text-[var(--navy)]">
                  {searchQuery ? 'No staff matching your search' : 'No staff members registered yet'}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] max-w-sm">
                  {searchQuery
                    ? 'Try searching with a different employee name, email, or subject.'
                    : 'Click "Create Staff" above to onboard teachers, non-teaching personnel, and finance officers.'}
                </p>
                {!searchQuery && onCreateStaffClick && (
                  <Button
                    size="sm"
                    onClick={onCreateStaffClick}
                    className="mt-2 rounded-xl bg-[var(--navy)] text-white hover:bg-[var(--deep-navy)] font-bold text-xs"
                  >
                    Register First Staff
                  </Button>
                )}
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[#F9F6EE]/80 text-[var(--navy)]">
                    <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10.5px]">
                      User ID
                    </th>
                    <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10.5px]">
                      Employee Name
                    </th>
                    <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10.5px]">
                      Email Address
                    </th>
                    <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10.5px]">
                      Mobile Number
                    </th>
                    <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10.5px]">
                      Employee Type
                    </th>
                    <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10.5px]">
                      Assigned Subjects
                    </th>
                    <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10.5px] text-center">
                      Status
                    </th>
                    <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10.5px] text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]/60 bg-white">
                  {filteredStaff.map((staff, idx) => {
                    const fullName = `${staff.employee_first_name} ${staff.employee_last_name || ''}`.trim()
                    const initial = staff.employee_first_name ? staff.employee_first_name.charAt(0).toUpperCase() : 'S'
                    const shortId = staff.id.length > 8 ? `#${staff.id.substring(0, 8)}...` : `#${staff.id}`
                    const isCopied = copiedId === staff.id

                    return (
                      <tr
                        key={staff.id || idx}
                        className="hover:bg-[#FCFBF7] transition-colors group"
                      >
                        {/* 1. User ID with copy button */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="font-mono text-[11px] font-bold text-[var(--navy)] bg-[var(--cream)]/60 px-2 py-0.5 rounded-md border border-[var(--border)]"
                              title={staff.id}
                            >
                              {shortId}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyId(staff.id)}
                              className="p-1 rounded-md text-gray-400 hover:text-[var(--gold)] hover:bg-[var(--cream)] transition-colors cursor-pointer"
                              title="Copy full User ID"
                            >
                              {isCopied ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* 2. Employee Name with Avatar */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--navy)] to-[var(--deep-navy)] text-[var(--gold)] font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                              {initial}
                            </div>
                            <div>
                              <span className="font-bold text-[var(--navy)] text-xs block capitalize">
                                {fullName}
                              </span>
                              {staff.created_at && (
                                <span className="text-[10px] text-[var(--text-secondary)]">
                                  Joined {new Date(staff.created_at).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* 3. Email */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <a
                            href={`mailto:${staff.employee_email}`}
                            className="inline-flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--navy)] font-medium transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
                            <span>{staff.employee_email}</span>
                          </a>
                        </td>

                        {/* 4. Mobile Number */}
                        <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px]">
                          <span className="inline-flex items-center gap-1.5 text-[var(--navy)] font-semibold">
                            <Phone className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
                            <span>{staff.employee_mobile_number || '—'}</span>
                          </span>
                        </td>

                        {/* 5. Employee Type */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {renderRoleBadge(staff.employee_type)}
                        </td>

                        {/* 6. Subjects */}
                        <td className="py-3.5 px-4">
                          {Array.isArray(staff.subjects) && staff.subjects.length > 0 ? (
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {staff.subjects.map((sub, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-[var(--cream)]/60 text-[var(--navy)] border border-[var(--gold)]/25"
                                >
                                  {sub}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400 italic text-[11px]">—</span>
                          )}
                        </td>

                        {/* 7. Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Active</span>
                          </span>
                        </td>

                        {/* 8. Actions (View, Edit, Delete) */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-right">
                          {confirmDeleteStaffId === staff.id ? (
                            <div className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 p-1 rounded-xl animate-fadeIn">
                              <span className="text-[11px] font-bold text-rose-700 px-1">Delete?</span>
                              <button
                                type="button"
                                disabled={deletingStaffId === staff.id}
                                onClick={() => handleDeleteStaff(staff)}
                                className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer disabled:opacity-50 shadow-2xs"
                              >
                                {deletingStaffId === staff.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Trash2 className="w-3 h-3" />
                                )}
                                <span>Yes</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteStaffId(null)}
                                className="px-2 py-1 rounded-lg text-gray-500 hover:bg-gray-200 text-[11px] font-medium cursor-pointer"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-1.5">
                              {/* View Option */}
                              <button
                                type="button"
                                onClick={() => onViewStaff?.(staff)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-[var(--navy)] bg-[var(--cream)]/70 hover:bg-[var(--gold)]/20 border border-[var(--gold)]/35 shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer"
                                title="View Staff Details (Inline)"
                              >
                                <Eye className="w-3.5 h-3.5 text-[var(--gold)]" />
                                <span>View</span>
                              </button>

                              {/* Edit Option */}
                              <button
                                type="button"
                                onClick={() => onEditStaff?.(staff)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-[var(--navy)] bg-white hover:bg-blue-50/80 hover:text-blue-700 border border-[var(--border)] hover:border-blue-300 shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer"
                                title="Edit Staff Member"
                              >
                                <Pencil className="w-3.5 h-3.5 text-blue-600" />
                                <span>Edit</span>
                              </button>

                              {/* Delete Option */}
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteStaffId(staff.id)}
                                className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
                                title="Delete Staff Member"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </>
        )}

        {/* 2. STUDENTS TAB (Placeholder & Preview Data) */}
        {activeTab === 'students' && (
          <div>
            <div className="px-5 py-2.5 bg-blue-50/60 border-b border-blue-100 flex items-center justify-between text-xs text-blue-900">
              <span className="flex items-center gap-2 font-medium">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Student enrollment schema is currently active. Showing roster of enrolled students.</span>
              </span>
              <span className="text-[11px] font-bold text-blue-700">Total: {filteredStudents.length} Students</span>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[#F9F6EE]/80 text-[var(--navy)]">
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10.5px]">
                    User ID
                  </th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10.5px]">
                    Student Name
                  </th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10.5px]">
                    Class &amp; Section
                  </th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10.5px]">
                    Roll Number
                  </th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10.5px]">
                    Guardian Contact
                  </th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10.5px] text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]/60 bg-white">
                {filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-[#FCFBF7] transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] font-bold text-[var(--navy)]">
                      <span className="bg-[var(--cream)]/60 px-2 py-0.5 rounded-md border border-[var(--border)]">
                        #{st.id}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
                          {st.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-[var(--navy)] text-xs block">{st.name}</span>
                          <span className="text-[10px] text-[var(--text-secondary)]">{st.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[var(--cream)] text-[var(--navy)] border border-[var(--gold)]/30">
                        {st.class_grade}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold text-[var(--navy)]">
                      {st.roll_number}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div>
                        <span className="font-semibold text-xs text-[var(--navy)] block">{st.parent_name}</span>
                        <span className="text-[11px] text-[var(--text-secondary)] font-mono">{st.mobile_number}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{st.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. PARENTS TAB (Placeholder & Preview Data) */}
        {activeTab === 'parents' && (
          <div>
            <div className="px-5 py-2.5 bg-purple-50/60 border-b border-purple-100 flex items-center justify-between text-xs text-purple-900">
              <span className="flex items-center gap-2 font-medium">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Parent &amp; guardian accounts directory. Showing linked family guardians.</span>
              </span>
              <span className="text-[11px] font-bold text-purple-700">Total: {filteredParents.length} Guardians</span>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[#F9F6EE]/80 text-[var(--navy)]">
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10.5px]">
                    User ID
                  </th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10.5px]">
                    Guardian Name
                  </th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10.5px]">
                    Relationship
                  </th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10.5px]">
                    Email Address
                  </th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10.5px]">
                    Mobile Number
                  </th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10.5px]">
                    Associated Student
                  </th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10.5px] text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]/60 bg-white">
                {filteredParents.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FCFBF7] transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] font-bold text-[var(--navy)]">
                      <span className="bg-[var(--cream)]/60 px-2 py-0.5 rounded-md border border-[var(--border)]">
                        #{p.id}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center">
                          {p.name.charAt(0)}
                        </div>
                        <span className="font-bold text-[var(--navy)] text-xs">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
                        {p.relation}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <a
                        href={`mailto:${p.email}`}
                        className="inline-flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--navy)] font-medium"
                      >
                        <Mail className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
                        <span>{p.email}</span>
                      </a>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-[var(--navy)] font-semibold">
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
                        <span>{p.mobile_number}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div>
                        <span className="font-bold text-xs text-[var(--navy)] block">{p.student_name}</span>
                        <span className="text-[10px] text-[var(--text-secondary)]">{p.student_grade}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>{p.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Table Footer ── */}
      <div className="p-4 border-t border-[var(--border)]/70 bg-gradient-to-r from-[#FCFBF7] to-white flex items-center justify-between text-xs text-[var(--text-secondary)]">
        <span className="font-medium">
          Showing{' '}
          <strong className="text-[var(--navy)]">
            {activeTab === 'staff'
              ? filteredStaff.length
              : activeTab === 'students'
              ? filteredStudents.length
              : filteredParents.length}
          </strong>{' '}
          {activeTab} records
        </span>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-gray-400">EduWeConnect Role Management</span>
        </div>
      </div>
    </div>
  )
}
