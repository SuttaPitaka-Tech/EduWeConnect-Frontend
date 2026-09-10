import { useState, useEffect, useRef, useMemo } from 'react'
import {
  Building2,
  CheckCircle2,
  Eye,
  Download,
  MapPin,
  FileText,
  UserCheck,
  ShieldCheck,
  Phone,
  Mail,
  Calendar,
  GraduationCap,
  Layers,
  ArrowRight,
  ArrowLeft,
  Users,
  Search,
  Copy,
  Check,
  BookOpen,
  DollarSign,
  Briefcase,
  Loader2,
  RefreshCw,
  X,
} from 'lucide-react'
import { Button, Spinner } from '@/components/ui'
import { toast } from 'sonner'
import { API_GATEWAY_URL } from '@/config/api.config'
import type { OrganizationRecord } from './superadmin-approvals'
import { studentService, type StudentMember } from '@/features/organization-menu/services/student.service'
import { staffService, type StaffMember } from '@/features/organization-menu/services/staff.service'

export default function SuperAdminOrganizations() {
  const [organizations, setOrganizations] = useState<OrganizationRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Selected Organization for In-Page Details View (No Popups)
  const [selectedOrg, setSelectedOrg] = useState<OrganizationRecord | null>(null)
  const [activeTab, setActiveTab] = useState<'profile' | 'head' | 'docs' | 'std' | 'staff'>('profile')

  const [loadingDocId, setLoadingDocId] = useState<string | null>(null)

  // ── STD Students Explorer State ──
  const [selectedStd, setSelectedStd] = useState<string | null>(null)
  const [stdStudents, setStdStudents] = useState<StudentMember[]>([])
  const [isLoadingStudents, setIsLoadingStudents] = useState(false)
  const [studentSearchQuery, setStudentSearchQuery] = useState('')

  // ── Staff Directory State ──
  const [staffList, setStaffList] = useState<StaffMember[]>([])
  const [isLoadingStaff, setIsLoadingStaff] = useState(false)
  const [staffFilter, setStaffFilter] = useState<'all' | 'Teacher' | 'Non Staff' | 'Finance'>('all')
  const [staffSearchQuery, setStaffSearchQuery] = useState('')

  // ── Detail Modals / Inspection State ──
  const [inspectingStudent, setInspectingStudent] = useState<StudentMember | null>(null)
  const [inspectingStaff, setInspectingStaff] = useState<StaffMember | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [loadingMinioKey, setLoadingMinioKey] = useState<string | null>(null)

  const hasMountedRef = useRef(false)
  const isFetchingRef = useRef(false)

  // ── Fetch Organizations ──────────────────────────────────────────────────
  const fetchOrganizations = async () => {
    if (isFetchingRef.current) return
    isFetchingRef.current = true
    setIsLoading(true)

    try {
      const res = await fetch(`${API_GATEWAY_URL}/organization-details`)
      if (!res.ok) throw new Error('Failed to fetch organizations')
      const data: OrganizationRecord[] = await res.json()
      setOrganizations(data)

      if (selectedOrg) {
        const refreshed = data.find((o) => o.id === selectedOrg.id)
        if (refreshed) setSelectedOrg(refreshed)
      }
    } catch (err: any) {
      toast.error(err.message || 'Error loading organizations')
    } finally {
      setIsLoading(false)
      isFetchingRef.current = false
    }
  }

  useEffect(() => {
    if (hasMountedRef.current) return
    hasMountedRef.current = true
    fetchOrganizations()
  }, [])

  // ── Filter for ONLY APPROVED organizations ───────────────────────────────
  const approvedOrganizations = useMemo(() => {
    return organizations.filter((org) => org.status === 'approved')
  }, [organizations])

  // Format Helpers
  const formatOrgType = (type?: string) => {
    if (!type) return 'Institution'
    return type
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatAadhar = (aadhar?: string) => {
    if (!aadhar) return 'N/A'
    const clean = aadhar.replace(/[\s-]+/g, '')
    if (clean.length === 12) {
      return `${clean.slice(0, 4)} ${clean.slice(4, 8)} ${clean.slice(8, 12)}`
    }
    return aadhar
  }

  // ── Document Handlers ────────────────────────────────────────────────────
  const handleOpenDocInNewTab = async (fileId?: string) => {
    if (!fileId) {
      toast.error('Document file not available')
      return
    }
    try {
      setLoadingDocId(fileId)
      const res = await fetch(`${API_GATEWAY_URL}/files/download/${fileId}`)
      if (!res.ok) throw new Error('Failed to retrieve document URL')
      const data = await res.json()
      if (data.url) {
        window.open(data.url, '_blank')
      } else {
        throw new Error('Document URL not returned')
      }
    } catch (err: any) {
      toast.error(err.message || 'Could not open document')
    } finally {
      setLoadingDocId(null)
    }
  }

  const handleDownloadDoc = async (fileId?: string) => {
    if (!fileId) {
      toast.error('Document file not available')
      return
    }
    try {
      setLoadingDocId(fileId)
      const res = await fetch(`${API_GATEWAY_URL}/files/download/${fileId}`)
      if (!res.ok) throw new Error('Failed to retrieve document download URL')
      const data = await res.json()
      if (data.url) {
        const a = document.createElement('a')
        a.href = data.url
        a.download = fileId
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    } catch (err: any) {
      toast.error(err.message || 'Could not download document')
    } finally {
      setLoadingDocId(null)
    }
  }

  // ── Copy Helper ──────────────────────────────────────────────────────────
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(text)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopiedId(null), 2000)
  }

  // ── MinIO Document Viewer ────────────────────────────────────────────────
  const handleOpenMinioDoc = async (fileKey?: string | null) => {
    if (!fileKey) {
      toast.error('No document file attached')
      return
    }
    try {
      setLoadingMinioKey(fileKey)
      const url = await studentService.getDownloadUrl(fileKey)
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch {
      toast.error('Unable to open document file')
    } finally {
      setLoadingMinioKey(null)
    }
  }

  // ── Student Fetcher for Selected Standard ────────────────────────────────
  const fetchStudentsForStd = async (std: string, orgId?: string) => {
    const targetOrgId = orgId || selectedOrg?.id
    if (!targetOrgId) return
    setIsLoadingStudents(true)
    try {
      const data = await studentService.list(targetOrgId, std)
      setStdStudents(data)
    } catch (err: any) {
      toast.error(`Failed to load students for ${std}`)
    } finally {
      setIsLoadingStudents(false)
    }
  }

  const handleSelectStd = (std: string) => {
    if (selectedStd === std) {
      setSelectedStd(null)
      setStdStudents([])
      setStudentSearchQuery('')
    } else {
      setSelectedStd(std)
      setStudentSearchQuery('')
      fetchStudentsForStd(std)
    }
  }

  // ── Staff Fetcher for Selected Organization ──────────────────────────────
  const fetchStaffForOrg = async (orgId?: string) => {
    const targetOrgId = orgId || selectedOrg?.id
    if (!targetOrgId) return
    setIsLoadingStaff(true)
    try {
      const data = await staffService.list(targetOrgId)
      setStaffList(data)
    } catch (err: any) {
      toast.error('Failed to load staff records')
    } finally {
      setIsLoadingStaff(false)
    }
  }

  // Automatically fetch staff when switching to staff tab
  useEffect(() => {
    if (selectedOrg && activeTab === 'staff') {
      fetchStaffForOrg(selectedOrg.id)
    }
  }, [selectedOrg?.id, activeTab])

  // Filtered Students in selected standard
  const filteredStudents = useMemo(() => {
    if (!studentSearchQuery.trim()) return stdStudents
    const q = studentSearchQuery.toLowerCase()
    return stdStudents.filter(
      (s) =>
        s.student_name?.toLowerCase().includes(q) ||
        s.roll_number?.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.contact_mobile?.includes(q) ||
        s.contact_email?.toLowerCase().includes(q) ||
        s.father_name?.toLowerCase().includes(q) ||
        s.mother_name?.toLowerCase().includes(q)
    )
  }, [stdStudents, studentSearchQuery])

  // Filtered Staff with Type categories (Teachers, Non Staff, Finance)
  const filteredStaff = useMemo(() => {
    let list = staffList
    if (staffFilter !== 'all') {
      list = list.filter((s) => {
        const type = (s.employee_type || '').toLowerCase()
        if (staffFilter === 'Teacher') return type.includes('teach')
        if (staffFilter === 'Non Staff') return type.includes('non')
        if (staffFilter === 'Finance') return type.includes('finance')
        return s.employee_type === staffFilter
      })
    }
    if (!staffSearchQuery.trim()) return list
    const q = staffSearchQuery.toLowerCase()
    return list.filter((s) => {
      const name = `${s.employee_first_name || ''} ${s.employee_last_name || ''}`.toLowerCase()
      const email = (s.employee_email || '').toLowerCase()
      const mobile = s.employee_mobile_number || ''
      const subjects = Array.isArray(s.subjects) ? s.subjects.join(' ').toLowerCase() : ''
      return (
        name.includes(q) ||
        email.includes(q) ||
        mobile.includes(q) ||
        subjects.includes(q) ||
        s.id.toLowerCase().includes(q)
      )
    })
  }, [staffList, staffFilter, staffSearchQuery])

  const renderStaffTypeBadge = (type?: string) => {
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

  // ── VIEW 1: In-Page Full Details View (Compact, Professional, Structured) ─
  if (selectedOrg) {
    return (
      <div className="w-full p-4 sm:p-6 flex flex-col gap-3.5 max-w-[1300px] mx-auto animate-fadeIn">
        {/* Top Navigation & Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedOrg(null)}
            className="h-8 px-3 rounded-lg text-xs font-bold border-[var(--gold)]/50 text-[var(--navy)] hover:bg-[var(--gold)]/15 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span>Back to Approved Organizations</span>
          </Button>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[var(--gold)] font-semibold bg-white px-2.5 py-1 rounded-md border border-[var(--gold)]/30 shadow-2xs">
              #EDU-ORG-{selectedOrg.id.slice(0, 8).toUpperCase()}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Approved Institution
            </span>
          </div>
        </div>

        {/* Master Corporate Card */}
        <div className="bg-white rounded-xl border border-[var(--gold)]/30 shadow-sm overflow-hidden">
          {/* Company Name Header (Moved UP, unified, compact) */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-[var(--cream)]/30 via-white to-transparent border-b border-[var(--border)]/80">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[var(--navy)] text-[var(--gold)] flex items-center justify-center shrink-0 shadow-2xs">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="text-xl sm:text-2xl font-serif font-bold text-[var(--navy)] tracking-tight">
                      {selectedOrg.organization_name}
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--gold)]/15 text-[var(--navy)] border border-[var(--gold)]/30 uppercase tracking-wider">
                      {formatOrgType(selectedOrg.organization_type)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--text-secondary)] mt-1.5 font-medium">
                    <span className="flex items-center gap-1 text-[var(--navy)]">
                      <Mail className="w-3.5 h-3.5 text-[var(--gold)]" />
                      {selectedOrg.organization_email}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[var(--navy)]">
                      <Phone className="w-3.5 h-3.5 text-[var(--gold)]" />
                      {selectedOrg.organization_mobile}
                    </span>
                    {(selectedOrg.city || selectedOrg.state) && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[var(--gold)]" />
                        {[selectedOrg.city, selectedOrg.state].filter(Boolean).join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-xs text-[var(--text-secondary)] font-medium md:text-right shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-gray-100 flex md:flex-col gap-3 md:gap-0.5">
                <div>Registered: <strong className="text-[var(--navy)]">{formatDate(selectedOrg.registered_at || selectedOrg.created_at)}</strong></div>
                {selectedOrg.reviewed_at && (
                  <div>Approved: <strong className="text-emerald-700">{formatDate(selectedOrg.reviewed_at)}</strong></div>
                )}
              </div>
            </div>
          </div>

          {/* Integrated Sub-Navigation Tabs */}
          <div className="flex border-b border-[var(--border)]/80 bg-gray-50/60 px-4 sm:px-6 gap-2 sm:gap-4 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`py-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'border-[var(--navy)] text-[var(--navy)] bg-white -mb-px'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--navy)]'
              }`}
            >
              <Building2 className="w-4 h-4 text-[var(--gold)]" />
              <span>Profile & Location</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('head')}
              className={`py-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'head'
                  ? 'border-[var(--navy)] text-[var(--navy)] bg-white -mb-px'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--navy)]'
              }`}
            >
              <UserCheck className="w-4 h-4 text-[var(--gold)]" />
              <span>Authorized Head</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('docs')}
              className={`py-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'docs'
                  ? 'border-[var(--navy)] text-[var(--navy)] bg-white -mb-px'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--navy)]'
              }`}
            >
              <FileText className="w-4 h-4 text-[var(--gold)]" />
              <span>Statutory Documents</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('std')}
              className={`py-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'std'
                  ? 'border-[var(--navy)] text-[var(--navy)] bg-white -mb-px'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--navy)]'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-[var(--gold)]" />
              <span>STD</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('staff')
                if (selectedOrg) fetchStaffForOrg(selectedOrg.id)
              }}
              className={`py-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'staff'
                  ? 'border-[var(--navy)] text-[var(--navy)] bg-white -mb-px'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--navy)]'
              }`}
            >
              <Users className="w-4 h-4 text-[var(--gold)]" />
              <span>Staff</span>
            </button>
          </div>

          {/* Tab Body: Structured Info Panels */}
          <div className="p-4 sm:p-6 bg-white">
            {/* Tab 1: Profile & Location */}
            {activeTab === 'profile' && (
              <div className="space-y-4 animate-fadeIn text-xs sm:text-sm">
                {/* Institutional Info Card */}
                <div className="border border-[var(--border)]/80 rounded-xl overflow-hidden shadow-2xs">
                  <div className="px-4 py-2.5 bg-[var(--cream)]/30 border-b border-[var(--border)]/70">
                    <h3 className="text-xs font-bold text-[var(--navy)] uppercase tracking-wider flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[var(--gold)]" />
                      <span>Institutional Details</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)]/60 bg-white">
                    <div className="p-3.5">
                      <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block tracking-wider">
                        Institution Name
                      </span>
                      <p className="font-bold text-[var(--navy)] text-[13px] mt-1">
                        {selectedOrg.organization_name}
                      </p>
                    </div>

                    <div className="p-3.5">
                      <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block tracking-wider">
                        Institution Type
                      </span>
                      <p className="font-semibold text-[var(--navy)] text-[13px] mt-1">
                        {formatOrgType(selectedOrg.organization_type)}
                      </p>
                    </div>

                    <div className="p-3.5">
                      <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block tracking-wider">
                        Official Email
                      </span>
                      <p className="font-semibold text-[var(--navy)] text-[13px] truncate mt-1" title={selectedOrg.organization_email}>
                        {selectedOrg.organization_email}
                      </p>
                    </div>

                    <div className="p-3.5">
                      <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block tracking-wider">
                        Contact Mobile
                      </span>
                      <p className="font-mono font-semibold text-[var(--navy)] text-[13px] mt-1">
                        {selectedOrg.organization_mobile}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Registered Campus Location Section */}
                <div className="border border-[var(--border)]/80 rounded-xl overflow-hidden shadow-2xs">
                  <div className="px-4 py-2.5 bg-[var(--cream)]/30 border-b border-[var(--border)]/70">
                    <h3 className="text-xs font-bold text-[var(--navy)] uppercase tracking-wider flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[var(--gold)]" />
                      <span>Registered Campus Address</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)]/60 bg-white border-b border-[var(--border)]/60">
                    <div className="sm:col-span-2 p-3.5">
                      <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block tracking-wider">
                        Street Address
                      </span>
                      <p className="font-medium text-[var(--navy)] text-[13px] mt-1">
                        {selectedOrg.address || 'N/A'}
                      </p>
                    </div>

                    <div className="p-3.5">
                      <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block tracking-wider">
                        City / Village
                      </span>
                      <p className="font-medium text-[var(--navy)] text-[13px] mt-1">
                        {selectedOrg.city || 'N/A'}
                      </p>
                    </div>

                    <div className="p-3.5">
                      <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block tracking-wider">
                        District
                      </span>
                      <p className="font-medium text-[var(--navy)] text-[13px] mt-1">
                        {selectedOrg.district || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)]/60 bg-white">
                    <div className="p-3.5">
                      <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block tracking-wider">
                        State
                      </span>
                      <p className="font-medium text-[var(--navy)] text-[13px] mt-1">
                        {selectedOrg.state || 'N/A'}
                      </p>
                    </div>

                    <div className="p-3.5">
                      <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block tracking-wider">
                        PIN Code
                      </span>
                      <p className="font-mono font-medium text-[var(--navy)] text-[13px] mt-1">
                        {selectedOrg.pincode || 'N/A'}
                      </p>
                    </div>

                    <div className="p-3.5">
                      <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block tracking-wider">
                        Country
                      </span>
                      <p className="font-medium text-[var(--navy)] text-[13px] mt-1">
                        {selectedOrg.country || 'India'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Authorized Head */}
            {activeTab === 'head' && (
              <div className="space-y-4 animate-fadeIn text-xs sm:text-sm">
                <div className="border border-[var(--border)]/80 rounded-xl overflow-hidden shadow-2xs">
                  <div className="px-4 py-2.5 bg-[var(--cream)]/30 border-b border-[var(--border)]/70 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[var(--navy)] uppercase tracking-wider flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-[var(--gold)]" />
                      <span>Authorized Head of Institution</span>
                    </h3>
                    <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Verified Signatory
                    </span>
                  </div>

                  <div className="divide-y divide-[var(--border)]/60 bg-white">
                    {/* Row 1: Name, Email, Mobile */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)]/60">
                      <div className="p-4">
                        <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block tracking-wider">
                          Full Name
                        </span>
                        <p className="font-bold text-[var(--navy)] text-[14px] mt-1">
                          {[selectedOrg.head_first_name, selectedOrg.head_middle_name, selectedOrg.head_last_name]
                            .filter(Boolean)
                            .join(' ') || 'N/A'}
                        </p>
                      </div>

                      <div className="p-4">
                        <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block tracking-wider">
                          Official / Personal Email
                        </span>
                        <p className="font-semibold text-[var(--navy)] text-[13px] break-all mt-1" title={selectedOrg.head_email}>
                          {selectedOrg.head_email || 'N/A'}
                        </p>
                      </div>

                      <div className="p-4">
                        <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block tracking-wider">
                          Mobile Number
                        </span>
                        <p className="font-mono font-semibold text-[var(--navy)] text-[13px] mt-1">
                          {selectedOrg.head_mobile || 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Row 2: Completely Visible Aadhar Number & Document */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)]/60">
                      {/* Completely Visible Aadhar Number */}
                      <div className="p-4 bg-[var(--cream)]/10">
                        <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block tracking-wider">
                          Aadhar Identification Number (Full)
                        </span>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="font-mono font-bold text-[var(--navy)] text-base tracking-wider bg-white px-3 py-1 rounded-md border border-[var(--gold)]/40 shadow-2xs inline-block">
                            {selectedOrg.head_aadhar_number ? formatAadhar(selectedOrg.head_aadhar_number) : 'Not Provided'}
                          </span>
                        </div>
                      </div>

                      {/* Aadhar Document Actions */}
                      <div className="p-4 bg-[var(--cream)]/10 flex items-center justify-between gap-3">
                        <div>
                          <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block tracking-wider">
                            Aadhar Card Document
                          </span>
                          <p className="text-xs text-[var(--navy)] font-semibold mt-1">
                            {selectedOrg.head_aadhar_file_id ? 'Uploaded File Verified' : 'No File Uploaded'}
                          </p>
                        </div>

                        {selectedOrg.head_aadhar_file_id && (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenDocInNewTab(selectedOrg.head_aadhar_file_id)}
                              disabled={loadingDocId === selectedOrg.head_aadhar_file_id}
                              className="h-8 px-3 text-xs rounded-lg border-[var(--gold)] text-[var(--navy)] hover:bg-[var(--gold)]/10 font-bold"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1 text-[var(--gold)]" /> View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadDoc(selectedOrg.head_aadhar_file_id)}
                              disabled={loadingDocId === selectedOrg.head_aadhar_file_id}
                              className="h-8 px-2.5 text-xs rounded-lg"
                              title="Download"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Statutory Documents */}
            {activeTab === 'docs' && (
              <div className="space-y-3 animate-fadeIn text-xs sm:text-sm">
                <div className="border border-[var(--border)]/80 rounded-xl overflow-hidden shadow-2xs">
                  <div className="px-4 py-2.5 bg-[var(--cream)]/30 border-b border-[var(--border)]/70">
                    <h3 className="text-xs font-bold text-[var(--navy)] uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[var(--gold)]" />
                      <span>Statutory & Compliance Certificates</span>
                    </h3>
                  </div>

                  <div className="divide-y divide-[var(--border)]/60 bg-white">
                    {/* PAN Card */}
                    <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-[var(--gold)] flex items-center justify-center shrink-0 border border-[var(--gold)]/30">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[var(--navy)] text-sm">
                            PAN Identification Card
                          </h4>
                          <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">
                            PAN: <strong className="text-[var(--navy)]">{selectedOrg.pan_number || 'N/A'}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {selectedOrg.pan_file_id ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenDocInNewTab(selectedOrg.pan_file_id)}
                              disabled={loadingDocId === selectedOrg.pan_file_id}
                              className="h-8 px-3 text-xs rounded-lg border-[var(--gold)] text-[var(--navy)] hover:bg-[var(--gold)]/10 font-bold"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1 text-[var(--gold)]" /> View Document
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadDoc(selectedOrg.pan_file_id)}
                              disabled={loadingDocId === selectedOrg.pan_file_id}
                              className="h-8 px-2.5 text-xs rounded-lg"
                              title="Download"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </Button>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400 italic">No File Uploaded</span>
                        )}
                      </div>
                    </div>

                    {/* GST Certificate */}
                    <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[var(--navy)] text-sm">
                            GST Registration Certificate
                          </h4>
                          <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">
                            GSTIN: <strong className="text-[var(--navy)]">{selectedOrg.gst_number || 'N/A'}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {selectedOrg.gst_file_id ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenDocInNewTab(selectedOrg.gst_file_id)}
                              disabled={loadingDocId === selectedOrg.gst_file_id}
                              className="h-8 px-3 text-xs rounded-lg border-[var(--gold)] text-[var(--navy)] hover:bg-[var(--gold)]/10 font-bold"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1 text-[var(--gold)]" /> View Document
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadDoc(selectedOrg.gst_file_id)}
                              disabled={loadingDocId === selectedOrg.gst_file_id}
                              className="h-8 px-2.5 text-xs rounded-lg"
                              title="Download"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </Button>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400 italic">No File Uploaded</span>
                        )}
                      </div>
                    </div>

                    {/* Registration Certificate */}
                    <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                          <Layers className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[var(--navy)] text-sm">
                            Educational Institution Registration Certificate
                          </h4>
                          <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">
                            Certificate Number: <strong className="text-[var(--navy)]">{selectedOrg.reg_cert_number || 'N/A'}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {selectedOrg.reg_cert_file_id ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenDocInNewTab(selectedOrg.reg_cert_file_id)}
                              disabled={loadingDocId === selectedOrg.reg_cert_file_id}
                              className="h-8 px-3 text-xs rounded-lg border-[var(--gold)] text-[var(--navy)] hover:bg-[var(--gold)]/10 font-bold"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1 text-[var(--gold)]" /> View Document
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadDoc(selectedOrg.reg_cert_file_id)}
                              disabled={loadingDocId === selectedOrg.reg_cert_file_id}
                              className="h-8 px-2.5 text-xs rounded-lg"
                              title="Download"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </Button>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400 italic">No File Uploaded</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: STD (Organization Standards & Enrolled Students Explorer) */}
            {activeTab === 'std' && (
              <div className="space-y-5 animate-fadeIn text-xs sm:text-sm">
                <div className="border border-[var(--border)]/80 rounded-xl overflow-hidden shadow-2xs">
                  <div className="px-4 py-3 bg-[var(--cream)]/30 border-b border-[var(--border)]/70 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-[var(--gold)]" />
                      <h3 className="text-xs font-bold text-[var(--navy)] uppercase tracking-wider">
                        Approved Standards (STD) &amp; Enrolled Students
                      </h3>
                    </div>
                    <span className="text-[11px] font-bold text-[var(--navy)] bg-[var(--gold)]/20 px-2.5 py-0.5 rounded-full border border-[var(--gold)]/40">
                      {Array.isArray(selectedOrg.organization_std) ? selectedOrg.organization_std.length : 0} Standards Offered
                    </span>
                  </div>

                  <div className="p-5 bg-white space-y-5">
                    {Array.isArray(selectedOrg.organization_std) && selectedOrg.organization_std.length > 0 ? (
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                          <p className="text-xs text-[var(--text-secondary)]">
                            Select any standard below to view enrolled students for <strong className="text-[var(--navy)]">{selectedOrg.organization_name}</strong>:
                          </p>
                          {selectedStd && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedStd(null)
                                setStdStudents([])
                                setStudentSearchQuery('')
                              }}
                              className="text-xs font-bold text-[var(--gold)] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                            >
                              <X className="w-3 h-3" /> Clear Standard Selection
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                          {selectedOrg.organization_std.map((std: string, idx: number) => {
                            const isSelected = selectedStd === std

                            return (
                              <button
                                key={std}
                                type="button"
                                onClick={() => handleSelectStd(std)}
                                className={`p-3 rounded-xl border transition-all shadow-2xs flex items-center gap-2.5 text-left cursor-pointer group ${
                                  isSelected
                                    ? 'bg-[var(--navy)] text-white border-[var(--gold)] ring-2 ring-[var(--gold)]/50 shadow-md scale-[1.02]'
                                    : 'bg-[var(--cream)]/30 border-[var(--gold)]/30 hover:border-[var(--gold)] hover:bg-[var(--cream)]/60'
                                }`}
                              >
                                <div
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${
                                    isSelected
                                      ? 'bg-[var(--gold)] text-[var(--navy)]'
                                      : 'bg-[var(--navy)] text-[var(--gold)]'
                                  }`}
                                >
                                  {idx + 1}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className={`font-bold text-xs truncate ${isSelected ? 'text-white' : 'text-[var(--navy)]'}`}>
                                    {std}
                                  </p>
                                  <span
                                    className={`text-[10px] font-semibold flex items-center gap-0.5 ${
                                      isSelected ? 'text-[var(--gold)]' : 'text-emerald-700'
                                    }`}
                                  >
                                    <CheckCircle2 className="w-2.5 h-2.5" />
                                    {isSelected ? 'Viewing Students' : 'Approved'}
                                  </span>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="py-12 text-center flex flex-col items-center justify-center max-w-sm mx-auto">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center mb-2 border border-gray-200">
                          <GraduationCap className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-[var(--navy)] text-sm">No Standards Configured</h4>
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                          No educational standards or classes have been recorded for this institution yet.
                        </p>
                      </div>
                    )}

                    {/* STD Enrolled Students Display */}
                    {selectedStd ? (
                      <div className="pt-4 border-t border-[var(--border)]/70 space-y-3.5">
                        {/* Section Header with Search & Controls */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[var(--cream)]/20 p-3.5 rounded-xl border border-[var(--gold)]/25">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[var(--navy)] text-[var(--gold)] flex items-center justify-center font-bold text-xs">
                              <Users className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-[var(--navy)] text-sm">
                                  Students Enrolled in {selectedStd}
                                </h4>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                  {filteredStudents.length} {filteredStudents.length === 1 ? 'Student' : 'Students'}
                                </span>
                              </div>
                              <p className="text-[11px] text-[var(--text-secondary)]">
                                Showing student roster for grade <strong className="text-[var(--navy)]">{selectedStd}</strong>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="relative flex-1 sm:w-64">
                              <input
                                type="text"
                                value={studentSearchQuery}
                                onChange={(e) => setStudentSearchQuery(e.target.value)}
                                placeholder="Search by name, roll no, phone..."
                                className="w-full h-8 pl-8 pr-3 rounded-lg border border-[var(--border)] bg-white text-xs text-[var(--navy)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)] shadow-2xs"
                              />
                              <Search className="w-3.5 h-3.5 text-[var(--gold)] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                              {studentSearchQuery && (
                                <button
                                  type="button"
                                  onClick={() => setStudentSearchQuery('')}
                                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
                                >
                                  ✕
                                </button>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => fetchStudentsForStd(selectedStd)}
                              disabled={isLoadingStudents}
                              className="h-8 px-2.5 rounded-lg border border-[var(--border)] bg-white hover:bg-[var(--cream)]/40 text-[var(--navy)] text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                              title="Refresh Students"
                            >
                              <RefreshCw className={`w-3.5 h-3.5 text-[var(--gold)] ${isLoadingStudents ? 'animate-spin' : ''}`} />
                            </button>
                          </div>
                        </div>

                        {/* Students Table or Loading/Empty State */}
                        {isLoadingStudents ? (
                          <div className="py-14 text-center flex flex-col items-center justify-center gap-2">
                            <Loader2 className="w-6 h-6 animate-spin text-[var(--gold)]" />
                            <p className="text-xs text-[var(--text-secondary)] font-medium">
                              Loading students enrolled in {selectedStd}...
                            </p>
                          </div>
                        ) : filteredStudents.length === 0 ? (
                          <div className="py-12 px-4 text-center bg-gray-50/70 border border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center">
                            <GraduationCap className="w-10 h-10 text-gray-300 mb-2" />
                            <h5 className="font-bold text-[var(--navy)] text-xs sm:text-sm">
                              {studentSearchQuery
                                ? `No students match "${studentSearchQuery}" in ${selectedStd}`
                                : `No Students Enrolled in ${selectedStd}`}
                            </h5>
                            <p className="text-[11px] text-[var(--text-secondary)] mt-1 max-w-sm">
                              {studentSearchQuery
                                ? 'Try searching with a different student name, roll number, or contact.'
                                : `No student records have been created under ${selectedStd} for this institution yet.`}
                            </p>
                          </div>
                        ) : (
                          <div className="border border-[var(--border)]/70 rounded-xl overflow-x-auto shadow-2xs">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="border-b border-[var(--border)] bg-[#F9F6EE]/90 text-[var(--navy)]">
                                  <th className="py-3 px-3.5 font-bold uppercase tracking-wider text-[10px]">
                                    Student ID
                                  </th>
                                  <th className="py-3 px-3.5 font-bold uppercase tracking-wider text-[10px]">
                                    Roll No
                                  </th>
                                  <th className="py-3 px-3.5 font-bold uppercase tracking-wider text-[10px]">
                                    Student Name
                                  </th>
                                  <th className="py-3 px-3.5 font-bold uppercase tracking-wider text-[10px]">
                                    Standard
                                  </th>
                                  <th className="py-3 px-3.5 font-bold uppercase tracking-wider text-[10px]">
                                    Guardian Contact
                                  </th>
                                  <th className="py-3 px-3.5 font-bold uppercase tracking-wider text-[10px]">
                                    Aadhaar &amp; Document
                                  </th>
                                  <th className="py-3 px-3.5 font-bold uppercase tracking-wider text-[10px] text-center">
                                    Status
                                  </th>
                                  <th className="py-3 px-3.5 font-bold uppercase tracking-wider text-[10px] text-right">
                                    Details
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[var(--border)]/60 bg-white">
                                {filteredStudents.map((student) => {
                                  const initial = student.student_name ? student.student_name.charAt(0).toUpperCase() : 'S'
                                  const shortId = student.id.length > 8 ? `#${student.id.slice(0, 8).toUpperCase()}` : `#${student.id}`
                                  const isCopied = copiedId === student.id

                                  return (
                                    <tr key={student.id} className="hover:bg-[#FCFBF7] transition-colors">
                                      {/* Student ID */}
                                      <td className="py-3 px-3.5 whitespace-nowrap font-mono text-[11px] font-bold text-[var(--navy)]">
                                        <div className="flex items-center gap-1.5">
                                          <span className="bg-[var(--cream)]/60 px-2 py-0.5 rounded border border-[var(--border)]">
                                            {shortId}
                                          </span>
                                          <button
                                            type="button"
                                            onClick={() => handleCopy(student.id)}
                                            className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                            title="Copy full UUID"
                                          >
                                            {isCopied ? (
                                              <Check className="w-3 h-3 text-emerald-600" />
                                            ) : (
                                              <Copy className="w-3 h-3" />
                                            )}
                                          </button>
                                        </div>
                                      </td>

                                      {/* Roll Number */}
                                      <td className="py-3 px-3.5 whitespace-nowrap">
                                        {student.roll_number ? (
                                          <span className="font-mono font-bold text-[var(--navy)] bg-amber-50 text-amber-900 border border-amber-200/80 px-2.5 py-0.5 rounded-md text-[11px] shadow-2xs">
                                            {student.roll_number}
                                          </span>
                                        ) : (
                                          <span className="text-gray-400 font-mono text-[11px]">—</span>
                                        )}
                                      </td>

                                      {/* Student Name */}
                                      <td className="py-3 px-3.5 whitespace-nowrap">
                                        <div className="flex items-center gap-2.5">
                                          <div className="w-7 h-7 rounded-full bg-[var(--navy)] text-[var(--gold)] flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                                            {initial}
                                          </div>
                                          <div>
                                            <p className="font-bold text-[var(--navy)] text-xs">
                                              {student.student_name}
                                            </p>
                                            {student.contact_email && (
                                              <p className="text-[10px] text-[var(--text-secondary)]">
                                                {student.contact_email}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      </td>

                                      {/* Standard */}
                                      <td className="py-3 px-3.5 whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                                          <GraduationCap className="w-3 h-3 text-blue-600" />
                                          {student.standard}
                                        </span>
                                      </td>

                                      {/* Guardian Contact */}
                                      <td className="py-3 px-3.5 whitespace-nowrap">
                                        <div className="text-xs">
                                          <p className="font-semibold text-[var(--navy)]">
                                            {student.father_name || student.mother_name || 'Guardian'}
                                          </p>
                                          <p className="font-mono text-[11px] text-[var(--text-secondary)]">
                                            {student.contact_mobile || student.father_mobile || student.mother_mobile || '—'}
                                          </p>
                                        </div>
                                      </td>

                                      {/* Aadhaar Info & File */}
                                      <td className="py-3 px-3.5 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                          {student.student_aadhar_number ? (
                                            <span className="font-mono text-[11px] text-[var(--navy)] font-semibold bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                                              {formatAadhar(student.student_aadhar_number)}
                                            </span>
                                          ) : (
                                            <span className="text-gray-400 text-[11px] italic">Not provided</span>
                                          )}

                                          {student.student_aadhar_file_id && (
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => handleOpenMinioDoc(student.student_aadhar_file_id)}
                                              disabled={loadingMinioKey === student.student_aadhar_file_id}
                                              className="h-6 px-2 text-[10px] font-bold border-[var(--gold)] text-[var(--navy)] hover:bg-[var(--gold)]/10 rounded-md"
                                            >
                                              {loadingMinioKey === student.student_aadhar_file_id ? (
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                              ) : (
                                                <>
                                                  <Eye className="w-3 h-3 mr-1 text-[var(--gold)]" /> Doc
                                                </>
                                              )}
                                            </Button>
                                          )}
                                        </div>
                                      </td>

                                      {/* Status */}
                                      <td className="py-3 px-3.5 whitespace-nowrap text-center">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                          Active
                                        </span>
                                      </td>

                                      {/* View Action */}
                                      <td className="py-3 px-3.5 whitespace-nowrap text-right">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => setInspectingStudent(student)}
                                          className="h-7 px-2.5 text-[11px] font-bold rounded-lg border-[var(--gold)]/50 text-[var(--navy)] hover:bg-[var(--gold)]/10"
                                        >
                                          <Eye className="w-3 h-3 mr-1 text-[var(--gold)]" /> Profile
                                        </Button>
                                      </td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="pt-2">
                        <div className="p-4 rounded-xl bg-[var(--cream)]/20 border border-dashed border-[var(--gold)]/40 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[var(--navy)] text-[var(--gold)] flex items-center justify-center shrink-0">
                            <GraduationCap className="w-5 h-5" />
                          </div>
                          <div>
                            <h5 className="font-bold text-xs text-[var(--navy)]">
                              Click any standard card above to explore enrolled students
                            </h5>
                            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                              Selecting a standard grade will dynamically fetch and show all students, roll numbers, and documents registered for that class.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Staff (Institutional Personnel Directory) */}
            {activeTab === 'staff' && (
              <div className="space-y-4 animate-fadeIn text-xs sm:text-sm">
                <div className="border border-[var(--border)]/80 rounded-xl overflow-hidden shadow-2xs">
                  {/* Top Bar with Filters & Search */}
                  <div className="p-4 sm:p-5 bg-[var(--cream)]/30 border-b border-[var(--border)]/70 flex flex-col gap-3.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[var(--gold)]" />
                        <h3 className="text-xs font-bold text-[var(--navy)] uppercase tracking-wider">
                          Institutional Staff &amp; Personnel Directory
                        </h3>
                      </div>
                      <span className="text-[11px] font-bold text-[var(--navy)] bg-[var(--gold)]/20 px-2.5 py-0.5 rounded-full border border-[var(--gold)]/40 self-start sm:self-auto">
                        {staffList.length} Total Staff Registered
                      </span>
                    </div>

                    {/* Filter Pills and Search */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
                      {/* Filter pills */}
                      <div className="inline-flex p-1 rounded-xl bg-white border border-[var(--border)] shadow-2xs self-start md:self-auto">
                        {/* All */}
                        <button
                          type="button"
                          onClick={() => setStaffFilter('all')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            staffFilter === 'all'
                              ? 'bg-[var(--navy)] text-white shadow-xs'
                              : 'text-[var(--text-secondary)] hover:text-[var(--navy)]'
                          }`}
                        >
                          <span>All Staff</span>
                          <span
                            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                              staffFilter === 'all' ? 'bg-[var(--gold)] text-[var(--navy)] font-bold' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {staffList.length}
                          </span>
                        </button>

                        {/* Teachers / Staff */}
                        <button
                          type="button"
                          onClick={() => setStaffFilter('Teacher')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            staffFilter === 'Teacher'
                              ? 'bg-[var(--navy)] text-white shadow-xs'
                              : 'text-[var(--text-secondary)] hover:text-[var(--navy)]'
                          }`}
                        >
                          <BookOpen className="w-3 h-3 text-amber-500" />
                          <span>Staff (Teachers)</span>
                          <span
                            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                              staffFilter === 'Teacher' ? 'bg-[var(--gold)] text-[var(--navy)] font-bold' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {staffList.filter((s) => (s.employee_type || '').toLowerCase().includes('teach')).length}
                          </span>
                        </button>

                        {/* Non Staff */}
                        <button
                          type="button"
                          onClick={() => setStaffFilter('Non Staff')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            staffFilter === 'Non Staff'
                              ? 'bg-[var(--navy)] text-white shadow-xs'
                              : 'text-[var(--text-secondary)] hover:text-[var(--navy)]'
                          }`}
                        >
                          <Briefcase className="w-3 h-3 text-sky-500" />
                          <span>Non Staff</span>
                          <span
                            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                              staffFilter === 'Non Staff' ? 'bg-[var(--gold)] text-[var(--navy)] font-bold' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {staffList.filter((s) => (s.employee_type || '').toLowerCase().includes('non')).length}
                          </span>
                        </button>

                        {/* Finance */}
                        <button
                          type="button"
                          onClick={() => setStaffFilter('Finance')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            staffFilter === 'Finance'
                              ? 'bg-[var(--navy)] text-white shadow-xs'
                              : 'text-[var(--text-secondary)] hover:text-[var(--navy)]'
                          }`}
                        >
                          <DollarSign className="w-3 h-3 text-emerald-500" />
                          <span>Finance</span>
                          <span
                            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                              staffFilter === 'Finance' ? 'bg-[var(--gold)] text-[var(--navy)] font-bold' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {staffList.filter((s) => (s.employee_type || '').toLowerCase().includes('finance')).length}
                          </span>
                        </button>
                      </div>

                      {/* Search & Refresh */}
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1 md:w-64">
                          <input
                            type="text"
                            value={staffSearchQuery}
                            onChange={(e) => setStaffSearchQuery(e.target.value)}
                            placeholder="Search staff by name, email, subject..."
                            className="w-full h-9 pl-8 pr-3 rounded-lg border border-[var(--border)] bg-white text-xs text-[var(--navy)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)] shadow-2xs"
                          />
                          <Search className="w-3.5 h-3.5 text-[var(--gold)] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          {staffSearchQuery && (
                            <button
                              type="button"
                              onClick={() => setStaffSearchQuery('')}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => fetchStaffForOrg(selectedOrg.id)}
                          disabled={isLoadingStaff}
                          className="h-9 px-3 rounded-lg border border-[var(--border)] bg-white hover:bg-[var(--cream)]/40 text-[var(--navy)] text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                          title="Refresh Staff List"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 text-[var(--gold)] ${isLoadingStaff ? 'animate-spin' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Staff Table / Content */}
                  <div className="bg-white">
                    {isLoadingStaff ? (
                      <div className="py-16 text-center flex flex-col items-center justify-center gap-2">
                        <Loader2 className="w-7 h-7 animate-spin text-[var(--gold)]" />
                        <p className="text-xs text-[var(--text-secondary)] font-medium">
                          Loading staff directory records...
                        </p>
                      </div>
                    ) : filteredStaff.length === 0 ? (
                      <div className="py-16 px-4 text-center flex flex-col items-center justify-center">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center mb-2 border border-gray-200">
                          <Users className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-[var(--navy)] text-sm">
                          {staffSearchQuery
                            ? `No staff matching "${staffSearchQuery}"`
                            : staffFilter !== 'all'
                            ? `No ${staffFilter} members registered yet`
                            : 'No staff members registered for this organization'}
                        </h4>
                        <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-sm">
                          {staffSearchQuery
                            ? 'Try searching with a different employee name, email, or keyword.'
                            : 'Staff records will show here once registered by the organization administrator.'}
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-[var(--border)] bg-[#F9F6EE]/90 text-[var(--navy)]">
                              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10.5px]">
                                Employee ID
                              </th>
                              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10.5px]">
                                Employee Name
                              </th>
                              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10.5px]">
                                Contact Info
                              </th>
                              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10.5px]">
                                Role / Type
                              </th>
                              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10.5px]">
                                Assigned Subjects
                              </th>
                              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10.5px]">
                                Experience
                              </th>
                              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10.5px]">
                                Address
                              </th>
                              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10.5px] text-center">
                                Status
                              </th>
                              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10.5px] text-right">
                                Details
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--border)]/60 bg-white">
                            {filteredStaff.map((staff) => {
                              const fullName = `${staff.employee_first_name} ${staff.employee_last_name || ''}`.trim()
                              const initial = staff.employee_first_name ? staff.employee_first_name.charAt(0).toUpperCase() : 'S'
                              const shortId = staff.id.length > 8 ? `#${staff.id.slice(0, 8).toUpperCase()}` : `#${staff.id}`
                              const isCopied = copiedId === staff.id

                              return (
                                <tr key={staff.id} className="hover:bg-[#FCFBF7] transition-colors">
                                  {/* ID */}
                                  <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] font-bold text-[var(--navy)]">
                                    <div className="flex items-center gap-1.5">
                                      <span className="bg-[var(--cream)]/60 px-2 py-0.5 rounded border border-[var(--border)]">
                                        {shortId}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleCopy(staff.id)}
                                        className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                        title="Copy full UUID"
                                      >
                                        {isCopied ? (
                                          <Check className="w-3 h-3 text-emerald-600" />
                                        ) : (
                                          <Copy className="w-3 h-3" />
                                        )}
                                      </button>
                                    </div>
                                  </td>

                                  {/* Name */}
                                  <td className="py-3 px-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2.5">
                                      <div className="w-7 h-7 rounded-full bg-[var(--navy)] text-[var(--gold)] flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                                        {initial}
                                      </div>
                                      <div>
                                        <p className="font-bold text-[var(--navy)] text-xs">
                                          {fullName}
                                        </p>
                                        {staff.employee_pan_number && (
                                          <p className="font-mono text-[10px] text-[var(--text-secondary)]">
                                            PAN: {staff.employee_pan_number}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </td>

                                  {/* Contact */}
                                  <td className="py-3 px-4 whitespace-nowrap">
                                    <div className="text-xs space-y-0.5">
                                      <p className="font-medium text-[var(--navy)] flex items-center gap-1">
                                        <Mail className="w-3 h-3 text-[var(--gold)]" />
                                        {staff.employee_email}
                                      </p>
                                      <p className="font-mono text-[11px] text-[var(--text-secondary)] flex items-center gap-1">
                                        <Phone className="w-3 h-3 text-[var(--gold)]" />
                                        {staff.employee_mobile_number}
                                      </p>
                                    </div>
                                  </td>

                                  {/* Role Type */}
                                  <td className="py-3 px-4 whitespace-nowrap">
                                    {renderStaffTypeBadge(staff.employee_type)}
                                  </td>

                                  {/* Subjects */}
                                  <td className="py-3 px-4">
                                    {Array.isArray(staff.subjects) && staff.subjects.length > 0 ? (
                                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                                        {staff.subjects.map((sub, sIdx) => (
                                          <span
                                            key={sIdx}
                                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--cream)]/80 text-[var(--navy)] border border-[var(--gold)]/25"
                                          >
                                            {sub}
                                          </span>
                                        ))}
                                      </div>
                                    ) : (
                                      <span className="text-gray-400 italic text-[11px]">—</span>
                                    )}
                                  </td>

                                  {/* Experience */}
                                  <td className="py-3 px-4 whitespace-nowrap">
                                    {staff.employee_experience ? (
                                      <div className="text-xs">
                                        <span className="font-bold text-[var(--navy)]">
                                          {staff.employee_experience} {staff.employee_experience === '1' ? 'Year' : 'Years'}
                                        </span>
                                        {staff.employee_previous_work_institute_name && (
                                          <span className="block text-[10px] text-[var(--text-secondary)] truncate max-w-[150px]">
                                            {staff.employee_previous_work_institute_name}
                                          </span>
                                        )}
                                      </div>
                                    ) : (
                                      <span className="text-gray-400 italic text-[11px]">—</span>
                                    )}
                                  </td>

                                  {/* Address */}
                                  <td className="py-3 px-4 max-w-[180px]">
                                    {staff.staff_address &&
                                    (staff.staff_address.current_address || staff.staff_address.state) ? (
                                      <div className="text-xs truncate" title={`${staff.staff_address.current_address || ''}, ${staff.staff_address.state || ''}`}>
                                        <span className="text-[var(--navy)] font-medium block truncate">
                                          {staff.staff_address.current_address || staff.staff_address.permanent_address || '—'}
                                        </span>
                                        <span className="text-[10px] text-[var(--text-secondary)] block truncate">
                                          {[staff.staff_address.state, staff.staff_address.country].filter(Boolean).join(', ')}
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="text-gray-400 italic text-[11px]">—</span>
                                    )}
                                  </td>

                                  {/* Status */}
                                  <td className="py-3 px-4 whitespace-nowrap text-center">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                      Active
                                    </span>
                                  </td>

                                  {/* Actions */}
                                  <td className="py-3 px-4 whitespace-nowrap text-right">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setInspectingStaff(staff)}
                                      className="h-7 px-2.5 text-[11px] font-bold rounded-lg border-[var(--gold)]/50 text-[var(--navy)] hover:bg-[var(--gold)]/10"
                                    >
                                      <Eye className="w-3 h-3 mr-1 text-[var(--gold)]" /> Profile
                                    </Button>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Student Profile Inspection Modal */}
        {inspectingStudent && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl border border-[var(--gold)]/40 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="p-5 bg-gradient-to-r from-[var(--navy)] to-[#1a2d42] text-white rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--gold)]/20 border border-[var(--gold)]/40 flex items-center justify-center text-[var(--gold)] font-bold text-base">
                    {inspectingStudent.student_name ? inspectingStudent.student_name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">
                        {inspectingStudent.student_name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[var(--gold)] text-[var(--navy)]">
                        {inspectingStudent.standard}
                      </span>
                    </div>
                    <p className="text-xs text-white/70 font-mono mt-0.5">
                      Roll No: <strong className="text-[var(--gold)]">{inspectingStudent.roll_number || 'Not Assigned'}</strong> • ID: #{inspectingStudent.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setInspectingStudent(null)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-4 text-xs">
                {/* 1. Academic & Identity Info */}
                <div className="border border-[var(--border)] rounded-xl p-4 bg-gray-50/50">
                  <h4 className="text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-[var(--gold)]" />
                    Academic &amp; Identity Verification
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block">Standard / Grade</span>
                      <span className="font-bold text-[var(--navy)] text-xs mt-0.5 block">{inspectingStudent.standard}</span>
                    </div>
                    <div>
                      <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block">Roll Number</span>
                      <span className="font-mono font-bold text-amber-800 text-xs mt-0.5 block">{inspectingStudent.roll_number || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block">Aadhaar Number</span>
                      <span className="font-mono font-bold text-[var(--navy)] text-xs mt-0.5 block">
                        {inspectingStudent.student_aadhar_number ? formatAadhar(inspectingStudent.student_aadhar_number) : 'Not Provided'}
                      </span>
                    </div>
                  </div>

                  {inspectingStudent.student_aadhar_file_id && (
                    <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                      <span className="text-xs text-[var(--navy)] font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Aadhaar Document Uploaded
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenMinioDoc(inspectingStudent.student_aadhar_file_id)}
                        disabled={loadingMinioKey === inspectingStudent.student_aadhar_file_id}
                        className="h-7 px-3 text-xs font-bold border-[var(--gold)] text-[var(--navy)] rounded-lg hover:bg-[var(--gold)]/10"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1 text-[var(--gold)]" /> View Aadhaar Card
                      </Button>
                    </div>
                  )}
                </div>

                {/* 2. Parents & Family Contact */}
                <div className="border border-[var(--border)] rounded-xl p-4 bg-white">
                  <h4 className="text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[var(--gold)]" />
                    Parents &amp; Guardian Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Father */}
                    <div className="p-3 bg-gray-50/70 rounded-lg border border-gray-100">
                      <span className="text-[10.5px] uppercase font-bold text-[var(--navy)] block">Father's Information</span>
                      <p className="font-bold text-xs text-[var(--navy)] mt-1">{inspectingStudent.father_name || 'N/A'}</p>
                      <p className="text-[11px] text-[var(--text-secondary)] font-mono mt-0.5">
                        Phone: <strong className="text-[var(--navy)]">{inspectingStudent.father_mobile || 'N/A'}</strong>
                      </p>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                        Email: <strong className="text-[var(--navy)]">{inspectingStudent.father_email || 'N/A'}</strong>
                      </p>
                    </div>

                    {/* Mother */}
                    <div className="p-3 bg-gray-50/70 rounded-lg border border-gray-100">
                      <span className="text-[10.5px] uppercase font-bold text-[var(--navy)] block">Mother's Information</span>
                      <p className="font-bold text-xs text-[var(--navy)] mt-1">{inspectingStudent.mother_name || 'N/A'}</p>
                      <p className="text-[11px] text-[var(--text-secondary)] font-mono mt-0.5">
                        Phone: <strong className="text-[var(--navy)]">{inspectingStudent.mother_mobile || 'N/A'}</strong>
                      </p>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                        Email: <strong className="text-[var(--navy)]">{inspectingStudent.mother_email || 'N/A'}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Emergency Contact */}
                <div className="border border-[var(--border)] rounded-xl p-4 bg-white">
                  <h4 className="text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-[var(--gold)]" />
                    Emergency Contact
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block">Contact Person</span>
                      <span className="font-bold text-[var(--navy)] text-xs mt-0.5 block">
                        {inspectingStudent.emergency_person_name || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block">Emergency Mobile</span>
                      <span className="font-mono font-bold text-[var(--navy)] text-xs mt-0.5 block">
                        {inspectingStudent.emergency_person_mobile || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block">Relationship</span>
                      <span className="font-semibold text-[var(--navy)] text-xs mt-0.5 block">
                        {inspectingStudent.emergency_person_relation || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. Residential Address */}
                <div className="border border-[var(--border)] rounded-xl p-4 bg-white">
                  <h4 className="text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[var(--gold)]" />
                    Residential Addresses
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block">Current Address</span>
                      <p className="text-xs text-[var(--navy)] mt-0.5 leading-relaxed">
                        {inspectingStudent.current_address || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block">Permanent Address</span>
                      <p className="text-xs text-[var(--navy)] mt-0.5 leading-relaxed">
                        {inspectingStudent.permanent_address || 'Same as current address'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-gray-100 flex flex-wrap gap-4 text-xs">
                    <span>District: <strong className="text-[var(--navy)]">{inspectingStudent.district || 'N/A'}</strong></span>
                    <span>State: <strong className="text-[var(--navy)]">{inspectingStudent.state || 'N/A'}</strong></span>
                    <span>Country: <strong className="text-[var(--navy)]">{inspectingStudent.country || 'India'}</strong></span>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-gray-50 rounded-b-2xl border-t border-gray-200 flex justify-end">
                <Button
                  size="sm"
                  onClick={() => setInspectingStudent(null)}
                  className="rounded-lg bg-[var(--navy)] text-white hover:bg-[var(--deep-navy)] text-xs font-bold"
                >
                  Close Profile
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Staff Profile Inspection Modal */}
        {inspectingStaff && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl border border-[var(--gold)]/40 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="p-5 bg-gradient-to-r from-[var(--navy)] to-[#1a2d42] text-white rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--gold)]/20 border border-[var(--gold)]/40 flex items-center justify-center text-[var(--gold)] font-bold text-base">
                    {inspectingStaff.employee_first_name ? inspectingStaff.employee_first_name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">
                        {`${inspectingStaff.employee_first_name} ${inspectingStaff.employee_last_name || ''}`.trim()}
                      </h3>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[var(--gold)] text-[var(--navy)]">
                        {inspectingStaff.employee_type}
                      </span>
                    </div>
                    <p className="text-xs text-white/70 font-mono mt-0.5">
                      ID: #{inspectingStaff.id.slice(0, 8).toUpperCase()} • {inspectingStaff.employee_email}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setInspectingStaff(null)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-4 text-xs">
                {/* Employment Role & Subjects */}
                <div className="border border-[var(--border)] rounded-xl p-4 bg-gray-50/50">
                  <h4 className="text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-[var(--gold)]" />
                    Role &amp; Academic Department
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block">Employee Type</span>
                      <div className="mt-1">{renderStaffTypeBadge(inspectingStaff.employee_type)}</div>
                    </div>
                    <div>
                      <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block">Experience</span>
                      <span className="font-bold text-[var(--navy)] text-xs mt-1 block">
                        {inspectingStaff.employee_experience ? `${inspectingStaff.employee_experience} Years` : 'Not Specified'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block">Previous Work</span>
                      <span className="font-medium text-[var(--navy)] text-xs mt-1 block truncate">
                        {inspectingStaff.employee_previous_work_institute_name || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {Array.isArray(inspectingStaff.subjects) && inspectingStaff.subjects.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block mb-1.5">Assigned Subjects</span>
                      <div className="flex flex-wrap gap-1.5">
                        {inspectingStaff.subjects.map((sub, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white text-[var(--navy)] border border-[var(--gold)]/30 shadow-2xs"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact & Address */}
                <div className="border border-[var(--border)] rounded-xl p-4 bg-white">
                  <h4 className="text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-[var(--gold)]" />
                    Contact &amp; Address Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div>
                      <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block">Email</span>
                      <span className="font-semibold text-[var(--navy)] text-xs mt-0.5 block">{inspectingStaff.employee_email}</span>
                    </div>
                    <div>
                      <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block">Mobile Number</span>
                      <span className="font-mono font-bold text-[var(--navy)] text-xs mt-0.5 block">{inspectingStaff.employee_mobile_number}</span>
                    </div>
                  </div>

                  {inspectingStaff.staff_address && (
                    <div className="pt-2.5 border-t border-gray-100">
                      <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block">Current Address</span>
                      <p className="text-xs text-[var(--navy)] mt-0.5">
                        {[
                          inspectingStaff.staff_address.current_address,
                          inspectingStaff.staff_address.state,
                          inspectingStaff.staff_address.pincode,
                          inspectingStaff.staff_address.country,
                        ].filter(Boolean).join(', ') || 'Not specified'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Statutory & Experience Documents */}
                <div className="border border-[var(--border)] rounded-xl p-4 bg-white">
                  <h4 className="text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[var(--gold)]" />
                    Statutory &amp; Experience Documents
                  </h4>

                  <div className="divide-y divide-gray-100">
                    {/* PAN Card */}
                    <div className="py-2 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[var(--navy)] text-xs">PAN Card</span>
                        <p className="text-[10.5px] font-mono text-[var(--text-secondary)]">
                          {inspectingStaff.employee_pan_number || 'N/A'}
                        </p>
                      </div>
                      {inspectingStaff.employee_pan_file_id ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenMinioDoc(inspectingStaff.employee_pan_file_id)}
                          className="h-7 px-2.5 text-xs font-bold border-[var(--gold)] text-[var(--navy)] rounded-lg hover:bg-[var(--gold)]/10"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1 text-[var(--gold)]" /> View PAN
                        </Button>
                      ) : (
                        <span className="text-[11px] text-gray-400 italic">No File</span>
                      )}
                    </div>

                    {/* Aadhaar Card */}
                    <div className="py-2 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[var(--navy)] text-xs">Aadhaar Identification</span>
                        <p className="text-[10.5px] font-mono text-[var(--text-secondary)]">
                          {inspectingStaff.employee_aadhar_number ? formatAadhar(inspectingStaff.employee_aadhar_number) : 'N/A'}
                        </p>
                      </div>
                      {inspectingStaff.employee_aadhar_file_id ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenMinioDoc(inspectingStaff.employee_aadhar_file_id)}
                          className="h-7 px-2.5 text-xs font-bold border-[var(--gold)] text-[var(--navy)] rounded-lg hover:bg-[var(--gold)]/10"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1 text-[var(--gold)]" /> View Aadhaar
                        </Button>
                      ) : (
                        <span className="text-[11px] text-gray-400 italic">No File</span>
                      )}
                    </div>

                    {/* Experience Letter */}
                    {inspectingStaff.employee_experience_letter_file_id && (
                      <div className="py-2 flex items-center justify-between">
                        <span className="font-bold text-[var(--navy)] text-xs">Experience Certificate</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenMinioDoc(inspectingStaff.employee_experience_letter_file_id)}
                          className="h-7 px-2.5 text-xs font-bold border-[var(--gold)] text-[var(--navy)] rounded-lg hover:bg-[var(--gold)]/10"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1 text-[var(--gold)]" /> View Certificate
                        </Button>
                      </div>
                    )}

                    {/* Relieving Letter */}
                    {inspectingStaff.employee_relieving_letter_file_id && (
                      <div className="py-2 flex items-center justify-between">
                        <span className="font-bold text-[var(--navy)] text-xs">Relieving Letter</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenMinioDoc(inspectingStaff.employee_relieving_letter_file_id)}
                          className="h-7 px-2.5 text-xs font-bold border-[var(--gold)] text-[var(--navy)] rounded-lg hover:bg-[var(--gold)]/10"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1 text-[var(--gold)]" /> View Letter
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-gray-50 rounded-b-2xl border-t border-gray-200 flex justify-end">
                <Button
                  size="sm"
                  onClick={() => setInspectingStaff(null)}
                  className="rounded-lg bg-[var(--navy)] text-white hover:bg-[var(--deep-navy)] text-xs font-bold"
                >
                  Close Profile
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── VIEW 2: Cards Grid (Default view) ─────────────────────────────────────
  return (
    <div className="w-full min-h-full p-6 md:p-8 lg:p-10 flex flex-col gap-6 max-w-[1600px] mx-auto animate-fadeIn pb-16">
      {isLoading ? (
        <div className="py-28 flex flex-col items-center justify-center gap-3">
          <Spinner className="w-9 h-9 text-[var(--gold)]" />
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium">
            Loading approved organizations...
          </p>
        </div>
      ) : approvedOrganizations.length === 0 ? (
        <div className="py-24 px-6 text-center bg-white/70 border border-dashed border-[var(--gold)]/35 rounded-3xl flex flex-col items-center justify-center max-w-lg mx-auto shadow-2xs">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[var(--gold)] flex items-center justify-center mb-3.5 border border-[var(--gold)]/20 shadow-2xs">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-serif font-bold text-[var(--navy)]">No Approved Organizations Found</h3>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-sm mt-1.5 leading-relaxed">
            There are currently no approved organizations. Pending registrations can be reviewed and approved in the Approval section.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {approvedOrganizations.map((org: OrganizationRecord) => {
            const standards = Array.isArray(org.organization_std) ? org.organization_std : []

            return (
              <div
                key={org.id}
                onClick={() => {
                  setSelectedOrg(org)
                  setActiveTab('profile')
                  setSelectedStd(null)
                  setStdStudents([])
                  setStudentSearchQuery('')
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="group relative bg-white border border-[var(--gold)]/25 hover:border-[var(--gold)] rounded-2xl p-6 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Top: Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[var(--gold)]/15 text-[var(--navy)] border border-[var(--gold)]/30 uppercase tracking-wider">
                      {formatOrgType(org.organization_type)}
                    </span>
                    <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 flex items-center gap-1.5 shadow-2xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Approved
                    </span>
                  </div>

                  {/* Institution Name */}
                  <h3 className="text-lg font-serif font-bold text-[var(--navy)] group-hover:text-[var(--gold)] transition-colors line-clamp-1">
                    {org.organization_name}
                  </h3>

                  {/* Reference ID */}
                  <div className="mt-1 mb-4">
                    <span className="font-mono text-[11px] text-[var(--gold)] font-semibold bg-[var(--cream)] px-2.5 py-0.5 rounded-md inline-block border border-[var(--gold)]/20">
                      #EDU-ORG-{org.id.slice(0, 8).toUpperCase()}
                    </span>
                  </div>

                  {/* Contact details */}
                  <div className="space-y-2.5 pt-3 border-t border-[var(--border)]/70 text-xs">
                    {/* Email */}
                    <div className="flex items-center gap-2.5 text-[var(--navy)]">
                      <div className="w-7 h-7 rounded-xl bg-[var(--cream)] flex items-center justify-center shrink-0 text-[var(--gold)] border border-[var(--gold)]/20">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium truncate text-xs" title={org.organization_email}>
                        {org.organization_email}
                      </span>
                    </div>

                    {/* Mobile */}
                    <div className="flex items-center gap-2.5 text-[var(--navy)]">
                      <div className="w-7 h-7 rounded-xl bg-[var(--cream)] flex items-center justify-center shrink-0 text-[var(--gold)] border border-[var(--gold)]/20">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-mono font-medium text-xs">
                        {org.organization_mobile}
                      </span>
                    </div>

                    {/* Location */}
                    {(org.city || org.state) && (
                      <div className="flex items-center gap-2.5 text-[var(--text-secondary)]">
                        <div className="w-7 h-7 rounded-xl bg-[var(--cream)] flex items-center justify-center shrink-0 text-[var(--gold)] border border-[var(--gold)]/20">
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs truncate font-medium">
                          {[org.city, org.state].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Standards Offered */}
                  {standards.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-[var(--border)]/70">
                      <div className="flex items-center gap-1.5 mb-2 text-[10.5px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                        <GraduationCap className="w-3.5 h-3.5 text-[var(--gold)]" />
                        <span>Standards Offered ({standards.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {standards.slice(0, 4).map((std: string) => (
                          <span
                            key={std}
                            className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-[var(--cream)] text-[var(--navy)] border border-[var(--gold)]/25"
                          >
                            {std}
                          </span>
                        ))}
                        {standards.length > 4 && (
                          <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600">
                            +{standards.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="mt-5 pt-3.5 border-t border-[var(--border)]/70 flex items-center justify-between text-xs">
                  <span className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[var(--gold)]" />
                    {formatDate(org.reviewed_at || org.registered_at || org.created_at)}
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--gold)] group-hover:translate-x-1 transition-transform">
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
