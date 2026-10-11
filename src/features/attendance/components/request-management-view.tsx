import { useState, useMemo, useEffect, useCallback } from 'react'
import { 
  ArrowLeft, 
  CalendarDays, 
  ArrowRight, 
  Search, 
  Check, 
  X, 
  Clock, 
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Eye,
  Calendar,
  UserCheck,
  Loader2,
  MessageSquare,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/auth-context'
import {
  fetchLeaveRequestsApi,
  createLeaveRequestApi,
  approveLeaveRequestApi,
  declineLeaveRequestApi,
  type LeaveRequestItem,
  type LeaveRequestsSummaryCounts,
} from '../api/leave-requests.api'

interface RequestManagementViewProps {
  onBack: () => void
}

export function RequestManagementView({ onBack }: RequestManagementViewProps) {
  const { user } = useAuth()
  const organizationId = user?.institutionId || user?.id || 'default-org'

  // Backend Data States
  const [requests, setRequests] = useState<LeaveRequestItem[]>([])
  const [counts, setCounts] = useState<LeaveRequestsSummaryCounts>({
    all: 0,
    pending: 0,
    approved: 0,
    declined: 0,
    staff: 0,
    student: 0,
  })
  const [totalItems, setTotalItems] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  // Filter & Search states
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'declined'>('all')
  const [roleFilter, setRoleFilter] = useState<'all' | 'staff' | 'student'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDetails, setSelectedDetails] = useState<LeaveRequestItem | null>(null)
  const [modalReviewNote, setModalReviewNote] = useState('')

  // Decline Feedback Modal states
  const [declineModalOpen, setDeclineModalOpen] = useState(false)
  const [declineTargetItem, setDeclineTargetItem] = useState<LeaveRequestItem | null>(null)
  const [declineFeedbackText, setDeclineFeedbackText] = useState('')
  const [isSubmittingDecline, setIsSubmittingDecline] = useState(false)
  
  // Apply Leave Modal state
  const [applyModalOpen, setApplyModalOpen] = useState(false)
  const [applyLeaveType, setApplyLeaveType] = useState('Medical leave')
  const [applyFromDate, setApplyFromDate] = useState('2026-10-24')
  const [applyToDate, setApplyToDate] = useState('2026-10-24')
  const [applyNote, setApplyNote] = useState('')
  const [isSubmittingApply, setIsSubmittingApply] = useState(false)

  // Pagination states
  const [pageSize, setPageSize] = useState<number>(5)
  const [currentPage, setCurrentPage] = useState<number>(1)

  // ── Load Requests from Backend API ──────────────────────────────────────────
  const loadRequests = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await fetchLeaveRequestsApi({
        organizationId,
        role: roleFilter,
        status: statusFilter,
        search: searchQuery.trim() || undefined,
        page: currentPage,
        limit: pageSize,
      })

      if (res && res.items) {
        setRequests(res.items)
        setTotalItems(res.total || 0)
        setTotalPages(res.totalPages || 1)
        if (res.counts) {
          setCounts(res.counts)
        }
      }
    } catch (err: any) {
      console.error('Failed to load leave requests:', err)
      toast.error('Failed to load leave requests from server')
    } finally {
      setIsLoading(false)
    }
  }, [organizationId, roleFilter, statusFilter, searchQuery, currentPage, pageSize])

  useEffect(() => {
    loadRequests()
  }, [loadRequests])

  // Reset page to 1 when filters or page size change
  const handleStatusFilterChange = (filter: 'all' | 'pending' | 'approved' | 'declined') => {
    setStatusFilter(filter)
    setCurrentPage(1)
  }

  const handleRoleFilterChange = (filter: 'all' | 'staff' | 'student') => {
    setRoleFilter(filter)
    setCurrentPage(1)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(1)
  }

  // ── Approve & Decline Backend Handlers ───────────────────────────────────────
  const handleApprove = async (id: string, name: string, reviewNote?: string) => {
    try {
      setActionLoadingId(id)
      const reviewer = user
        ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Organization Admin'
        : 'Organization Admin'

      await approveLeaveRequestApi(id, reviewer)
      toast.success(`Request for ${name} has been approved`)
      if (selectedDetails && selectedDetails.id === id) {
        setSelectedDetails(prev => prev ? {
          ...prev,
          status: 'approved',
          reviewedBy: reviewer,
          reviewedAt: new Date().toISOString(),
          reviewNote: reviewNote || prev.reviewNote,
        } : null)
      }
      await loadRequests()
    } catch (err) {
      console.error('Failed to approve request:', err)
      toast.error(`Failed to approve request for ${name}`)
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleDecline = async (id: string, name: string, reviewNote?: string) => {
    try {
      setActionLoadingId(id)
      const reviewer = user
        ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Organization Admin'
        : 'Organization Admin'

      await declineLeaveRequestApi(id, reviewer, reviewNote)
      toast.info(`Request for ${name} has been declined`)
      if (selectedDetails && selectedDetails.id === id) {
        setSelectedDetails(prev => prev ? {
          ...prev,
          status: 'declined',
          reviewedBy: reviewer,
          reviewedAt: new Date().toISOString(),
          reviewNote: reviewNote || prev.reviewNote,
        } : null)
      }
      await loadRequests()
    } catch (err) {
      console.error('Failed to decline request:', err)
      toast.error(`Failed to decline request for ${name}`)
    } finally {
      setActionLoadingId(null)
    }
  }

  const openDeclineModal = (item: LeaveRequestItem) => {
    setDeclineTargetItem(item)
    setDeclineFeedbackText('')
    setDeclineModalOpen(true)
  }

  const handleConfirmDecline = async () => {
    if (!declineTargetItem) return
    if (!declineFeedbackText.trim()) {
      toast.error('Please enter feedback or reason for declining the request')
      return
    }

    try {
      setIsSubmittingDecline(true)
      await handleDecline(declineTargetItem.id, declineTargetItem.name, declineFeedbackText.trim())
      setDeclineModalOpen(false)
      setDeclineTargetItem(null)
      setDeclineFeedbackText('')
    } finally {
      setIsSubmittingDecline(false)
    }
  }

  // ── Submit New Leave Application Handler ────────────────────────────────────
  const handleApplySubmit = async () => {
    if (!applyNote.trim()) {
      toast.error('Please enter a note or reason for the leave')
      return
    }

    try {
      setIsSubmittingApply(true)
      const applicantName = user
        ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Staff Member'
        : 'Staff Member'

      await createLeaveRequestApi({
        organizationId,
        userId: user?.id,
        name: applicantName,
        role: 'STAFF',
        subInfo: user?.organizationName || 'Staff Member',
        leaveCategory: applyLeaveType,
        fromDate: applyFromDate,
        toDate: applyToDate,
        note: applyNote.trim(),
      })

      toast.success('Leave application submitted successfully')
      setApplyModalOpen(false)
      setApplyNote('')
      await loadRequests()
    } catch (err) {
      console.error('Failed to submit leave:', err)
      toast.error('Failed to submit leave application')
    } finally {
      setIsSubmittingApply(false)
    }
  }

  // Calculate pagination boundaries
  const safeCurrentPage = Math.min(currentPage, Math.max(1, totalPages))
  const startIndex = (safeCurrentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + requests.length, totalItems)

  // Generate Page Numbers Array
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (safeCurrentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages)
      } else if (safeCurrentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, '...', totalPages)
      }
    }
    return pages
  }, [totalPages, safeCurrentPage])

  return (
    <div className="w-full max-w-[1340px] mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-3 flex flex-col justify-start min-h-0 animate-fadeIn font-sans">
      {/* ── Top Header Section ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3 sm:mb-3.5 shrink-0">
        <div>
          {/* Mini Brand Label */}
          <div className="inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.16em] text-[var(--gold)] uppercase mb-1">
            <CalendarDays className="w-3 h-3 text-[var(--gold)]" />
            <span>EDUWECONNECT</span>
          </div>

          {/* Title & Back Button */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onBack}
              className="w-8 h-8 rounded-lg border border-[#DED5C5] bg-white text-[#102A43] hover:bg-[#FDFBF7] hover:border-[#B8862C]/60 hover:text-[#B8862C] shadow-2xs flex items-center justify-center transition-all cursor-pointer group shrink-0 active:scale-95"
              title="Back to Attendance"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <h1 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-[#102A43] tracking-tight flex items-center gap-2 sm:gap-2.5 flex-wrap">
              <span>Request Management</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-[#F5EEDB] text-[#8C6D23] border border-[#E5DEC9] shadow-2xs">
                Organization Control
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-xs text-[#536579] font-normal mt-0.5 ml-10.5">
            Review and approve attendance regularization, leave, and half-day requests.
          </p>
        </div>

        {/* Apply for Leave Button */}
        <div className="self-start sm:self-center ml-10.5 sm:ml-0">
          <button
            type="button"
            onClick={() => setApplyModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#102A43] text-white text-xs font-semibold rounded-lg hover:bg-[#0B1F33] hover:shadow-xs transition-all duration-200 cursor-pointer active:scale-95 shadow-2xs group"
          >
            <span>Apply for Leave</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* ── Metric Summary Cards Row ──────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mb-3 sm:mb-3.5 shrink-0">
        {/* Card 1: Pending */}
        <div className="bg-white rounded-xl p-3 sm:p-3.5 border border-[#E5DEC9] shadow-2xs hover:shadow-xs hover:border-[#D8C29D] transition-all duration-200 flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold tracking-wider text-[#64748B] uppercase">
              PENDING REQUESTS
            </p>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <div className="my-1">
            <span className="text-xl sm:text-2xl md:text-[26px] font-serif font-bold text-[#102A43] tracking-tight group-hover:text-[var(--gold)] transition-colors">
              {String(counts.pending).padStart(2, '0')}
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] font-medium leading-none">
            Awaiting your review
          </p>
        </div>

        {/* Card 2: Approved */}
        <div className="bg-white rounded-xl p-3 sm:p-3.5 border border-[#E5DEC9] shadow-2xs hover:shadow-xs hover:border-[#D8C29D] transition-all duration-200 flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold tracking-wider text-[#64748B] uppercase">
              APPROVED
            </p>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          <div className="my-1">
            <span className="text-xl sm:text-2xl md:text-[26px] font-serif font-bold text-[#059669] tracking-tight">
              {String(counts.approved).padStart(2, '0')}
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] font-medium leading-none">
            In this request list
          </p>
        </div>

        {/* Card 3: Staff Requests */}
        <div className="bg-white rounded-xl p-3 sm:p-3.5 border border-[#E5DEC9] shadow-2xs hover:shadow-xs hover:border-[#D8C29D] transition-all duration-200 flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold tracking-wider text-[#64748B] uppercase">
              STAFF REQUESTS
            </p>
            <UserCheck className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#102A43] transition-colors" />
          </div>
          <div className="my-1">
            <span className="text-xl sm:text-2xl md:text-[26px] font-serif font-bold text-[#102A43] tracking-tight group-hover:text-[var(--gold)] transition-colors">
              {String(counts.staff).padStart(2, '0')}
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] font-medium leading-none">
            Across the organization
          </p>
        </div>

        {/* Card 4: Student Requests */}
        <div className="bg-white rounded-xl p-3 sm:p-3.5 border border-[#E5DEC9] shadow-2xs hover:shadow-xs hover:border-[#D8C29D] transition-all duration-200 flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold tracking-wider text-[#64748B] uppercase">
              STUDENT REQUESTS
            </p>
            <Calendar className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#102A43] transition-colors" />
          </div>
          <div className="my-1">
            <span className="text-xl sm:text-2xl md:text-[26px] font-serif font-bold text-[#102A43] tracking-tight group-hover:text-[var(--gold)] transition-colors">
              {String(counts.student).padStart(2, '0')}
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] font-medium leading-none">
            Across all classes
          </p>
        </div>
      </div>

      {/* ── Main Leave Requests Container Card ────────────────────────── */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-[#E5DEC9] shadow-xs flex flex-col mb-3 transition-all overflow-hidden">
        {/* Card Top Title & Role Segment Control */}
        <div className="px-3.5 sm:px-5 py-2.5 sm:py-3 border-b border-[#F0EBE1] flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-base sm:text-lg font-bold text-[#102A43]">
              Leave requests
            </h2>
            <span className="px-2 py-0.2 rounded-full bg-[#FEF3C7] text-[#B45309] text-[11px] font-bold shadow-2xs">
              {counts.pending}
            </span>
          </div>

          {/* Segmented Role Switch: All Requests / Staff Only / Students Only */}
          <div className="inline-flex items-center p-0.5 bg-[#F8F6F1] border border-[#E5DEC9] rounded-lg shadow-2xs">
            <button
              type="button"
              onClick={() => handleRoleFilterChange('all')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all duration-200 cursor-pointer ${
                roleFilter === 'all'
                  ? 'bg-white text-[#102A43] shadow-2xs font-bold'
                  : 'text-[#64748B] hover:text-[#102A43] hover:bg-white/40'
              }`}
            >
              All Requests
            </button>
            <button
              type="button"
              onClick={() => handleRoleFilterChange('staff')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all duration-200 cursor-pointer ${
                roleFilter === 'staff'
                  ? 'bg-white text-[#102A43] shadow-2xs font-bold'
                  : 'text-[#64748B] hover:text-[#102A43] hover:bg-white/40'
              }`}
            >
              Staff Only
            </button>
            <button
              type="button"
              onClick={() => handleRoleFilterChange('student')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all duration-200 cursor-pointer ${
                roleFilter === 'student'
                  ? 'bg-white text-[#102A43] shadow-2xs font-bold'
                  : 'text-[#64748B] hover:text-[#102A43] hover:bg-white/40'
              }`}
            >
              Students Only
            </button>
          </div>
        </div>

        {/* Filter Toolbar: Status Tabs & Search Box */}
        <div className="px-3.5 sm:px-5 py-2 sm:py-2.5 border-b border-[#F0EBE1] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-[#FAF8F5]/60">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => handleStatusFilterChange('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-[#102A43] text-white shadow-2xs'
                  : 'text-[#536579] hover:bg-black/5 hover:text-[#102A43]'
              }`}
            >
              <span>All Requests</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-semibold ${statusFilter === 'all' ? 'bg-white/20 text-white' : 'bg-black/5 text-[#536579]'}`}>
                {counts.all}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleStatusFilterChange('pending')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                statusFilter === 'pending'
                  ? 'bg-[#102A43] text-white shadow-2xs'
                  : 'text-[#536579] hover:bg-black/5 hover:text-[#102A43]'
              }`}
            >
              <span>Pending</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-semibold ${statusFilter === 'pending' ? 'bg-white/20 text-white' : 'bg-black/5 text-[#536579]'}`}>
                {counts.pending}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleStatusFilterChange('approved')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                statusFilter === 'approved'
                  ? 'bg-[#102A43] text-white shadow-2xs'
                  : 'text-[#536579] hover:bg-black/5 hover:text-[#102A43]'
              }`}
            >
              <span>Approved</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-semibold ${statusFilter === 'approved' ? 'bg-white/20 text-white' : 'bg-black/5 text-[#536579]'}`}>
                {counts.approved}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleStatusFilterChange('declined')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                statusFilter === 'declined'
                  ? 'bg-[#102A43] text-white shadow-2xs'
                  : 'text-[#536579] hover:bg-black/5 hover:text-[#102A43]'
              }`}
            >
              <span>Declined</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-semibold ${statusFilter === 'declined' ? 'bg-white/20 text-white' : 'bg-black/5 text-[#536579]'}`}>
                {counts.declined}
              </span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64 md:w-72">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search name, class, department..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 bg-white border border-[#E5DEC9] rounded-lg text-xs text-[#102A43] placeholder:text-[#94A3B8] focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]/20 shadow-2xs transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* ── Request Items List ────────────────────────────────────────── */}
        <div className="divide-y divide-[#F0EBE1]/80">
          {isLoading ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-[var(--gold)] mb-2" />
              <p className="text-xs text-[#64748B] font-medium">Loading requests from server...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="p-10 text-center flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-[#F7F4EE] border border-[#E5DEC9] flex items-center justify-center text-[#94A3B8] mb-2 shadow-2xs">
                <FileText className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <p className="text-sm font-serif font-bold text-[#102A43]">No requests found</p>
              <p className="text-[11px] text-[#64748B] mt-0.5 max-w-sm">
                No leave or attendance records match your current criteria. Try adjusting your status, role filter, or search keywords.
              </p>
            </div>
          ) : (
            requests.map((item) => (
              <div 
                key={item.id} 
                onClick={() => {
                  setSelectedDetails(item)
                  setModalReviewNote('')
                }}
                className="px-3.5 sm:px-5 py-3 hover:bg-[#FAF8F5] transition-all duration-150 flex flex-col md:flex-row md:items-center justify-between gap-3 group border-l-3 border-l-transparent hover:border-l-[var(--gold)] cursor-pointer"
              >
                {/* 1. Applicant Column: Avatar + Name + Role Tag + SubInfo */}
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-[210px] md:w-[26%] shrink-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F5EEDB] to-[#EBE2CF] text-[#102A43] font-bold text-xs flex items-center justify-center shrink-0 border border-[#E5DEC9] shadow-2xs group-hover:scale-105 group-hover:border-[var(--gold)]/50 transition-all duration-200">
                    {item.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-xs sm:text-[13px] text-[#102A43] group-hover:text-[var(--gold)] transition-colors truncate">
                        {item.name}
                      </span>
                      {item.role === 'STUDENT' ? (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-[#F1EFEA] text-[#64748B] border border-[#E5DEC9] tracking-wider uppercase">
                          STUDENT
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0] tracking-wider uppercase">
                          STAFF
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#64748B] font-medium truncate mt-0.5">
                      {item.subInfo}
                    </p>
                  </div>
                </div>

                {/* 2. Leave Schedule & Structured Details Column */}
                <div className="flex-1 md:px-3 min-w-0">
                  {/* Top line: Type Chip + Date with Calendar Icon + Relative Time */}
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${
                      item.requestType === 'half'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200/80'
                        : 'bg-indigo-50 text-indigo-800 border border-indigo-200/80'
                    }`}>
                      {item.durationType || (item.requestType === 'half' ? 'Half Day' : 'Full Day')}
                    </span>

                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#102A43]">
                      <Calendar className="w-3.5 h-3.5 text-[#64748B]" />
                      <span>{item.dateRange || item.fromDate}</span>
                    </span>

                    <span className="text-[#CBD5E1] hidden sm:inline">•</span>

                    <span className="text-[10px] text-[#94A3B8] flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3 text-[#94A3B8]" />
                      <span>{item.timeAgo}</span>
                    </span>
                  </div>

                  {/* Bottom line: Reason & Category */}
                  <div className="flex items-center gap-2 flex-wrap text-xs text-[#536579]">
                    <span className="px-2 py-0.5 rounded-md bg-[#F1EFEA] border border-[#E5DEC9] text-[#102A43] font-semibold text-[10px]">
                      {item.leaveCategory}
                    </span>

                    {/* Show Reason cleanly if provided */}
                    {item.note && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E5DEC9] text-xs text-[#334155] max-w-lg truncate shadow-2xs">
                        <MessageSquare className="w-3 h-3 text-[var(--gold)] shrink-0" />
                        <span className="font-semibold text-[#8C6D23]">Reason:</span>
                        <span className="italic truncate text-[#334155]">
                          "{item.note.replace(/^[“"]+|[”"]+$/g, '')}"
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Status Pill & Action Controls */}
                <div 
                  className="flex items-center gap-2 sm:gap-2.5 self-start md:self-center shrink-0 md:w-[28%] md:justify-end flex-wrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  {item.status === 'pending' ? (
                    <>
                      {/* Pending Badge */}
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B45309] animate-pulse" />
                        <span>Pending review</span>
                      </span>

                      {/* View Details Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDetails(item)
                          setModalReviewNote('')
                        }}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-[#E5DEC9] bg-white text-[#102A43] hover:text-[var(--gold)] hover:border-[var(--gold)] text-[11px] font-semibold transition-all duration-150 cursor-pointer shadow-2xs"
                        title="View Full Details"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#64748B]" />
                        <span>View</span>
                      </button>

                      {/* Quick Actions: Decline & Approve */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={actionLoadingId === item.id}
                          onClick={() => openDeclineModal(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-red-200 bg-white text-[#DC2626] text-[11px] font-bold hover:bg-red-50 hover:border-red-300 transition-all duration-150 cursor-pointer active:scale-95 shadow-2xs disabled:opacity-50"
                          title="Decline Request"
                        >
                          <X className="w-3 h-3" />
                          <span>Decline</span>
                        </button>

                        <button
                          type="button"
                          disabled={actionLoadingId === item.id}
                          onClick={() => handleApprove(item.id, item.name)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#064E3B] text-white text-[11px] font-bold hover:bg-[#065F46] transition-all duration-150 cursor-pointer active:scale-95 shadow-2xs disabled:opacity-50"
                          title="Approve Request"
                        >
                          {actionLoadingId === item.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Check className="w-3 h-3" />
                          )}
                          <span>Approve</span>
                        </button>
                      </div>
                    </>
                  ) : item.status === 'approved' ? (
                    <>
                      {/* Approved Badge */}
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                        <span>Approved</span>
                      </span>

                      {/* View Details */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDetails(item)
                          setModalReviewNote('')
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E5DEC9] bg-white text-[#102A43] hover:text-[var(--gold)] hover:border-[var(--gold)] text-[11px] font-semibold transition-all duration-150 cursor-pointer shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#64748B]" />
                        <span>View details</span>
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Declined Badge */}
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA] shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                        <span>Declined</span>
                      </span>

                      {/* View Details */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDetails(item)
                          setModalReviewNote('')
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E5DEC9] bg-white text-[#102A43] hover:text-[var(--gold)] hover:border-[var(--gold)] text-[11px] font-semibold transition-all duration-150 cursor-pointer shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#64748B]" />
                        <span>View details</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Compact Pagination & Footer Bar ─────────────────────────── */}
        <div className="px-3.5 sm:px-5 py-2 sm:py-2.5 border-t border-[#F0EBE1] bg-[#FAF8F5]/90 flex flex-wrap items-center justify-between gap-2.5 text-xs text-[#64748B]">
          {/* Left: Summary + Rows per page selector */}
          <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
            <span className="font-medium text-[11px] sm:text-xs text-[#536579]">
              Showing <span className="font-bold text-[#102A43]">{totalItems > 0 ? startIndex + 1 : 0}</span> to <span className="font-bold text-[#102A43]">{endIndex}</span> of <span className="font-bold text-[#102A43]">{totalItems}</span> requests
            </span>

            {/* Page Size Dropdown */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-[#E5DEC9]">
              <span className="text-[11px] text-[#64748B]">Rows per page:</span>
              <div className="relative inline-block">
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="appearance-none bg-white border border-[#E5DEC9] text-[#102A43] font-bold text-[11px] rounded-md pl-2 pr-5 py-0.5 shadow-2xs focus:outline-none focus:border-[var(--gold)] cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <ChevronDown className="w-3 h-3 text-[#64748B] absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Center / Navigation: Page Controls */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1 self-center">
              {/* Previous Button */}
              <button
                type="button"
                disabled={safeCurrentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="w-7 h-7 rounded-md border border-[#E5DEC9] bg-white text-[#102A43] flex items-center justify-center hover:bg-[#FAF8F5] hover:border-[var(--gold)] transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-2xs active:scale-95"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {/* Number Buttons */}
              {pageNumbers.map((p, idx) => (
                typeof p === 'number' ? (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setCurrentPage(p)}
                    className={`w-7 h-7 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center justify-center shadow-2xs active:scale-95 ${
                      safeCurrentPage === p
                        ? 'bg-[#102A43] text-white shadow-xs'
                        : 'bg-white border border-[#E5DEC9] text-[#536579] hover:bg-[#FAF8F5] hover:text-[#102A43]'
                    }`}
                  >
                    {p}
                  </button>
                ) : (
                  <span key={`ellipsis-${idx}`} className="px-0.5 text-gray-400 select-none text-xs">
                    {p}
                  </span>
                )
              ))}

              {/* Next Button */}
              <button
                type="button"
                disabled={safeCurrentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="w-7 h-7 rounded-md border border-[#E5DEC9] bg-white text-[#102A43] flex items-center justify-center hover:bg-[#FAF8F5] hover:border-[var(--gold)] transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-2xs active:scale-95"
                title="Next Page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Right: Latest Requests Action */}
          <button
            type="button"
            onClick={() => {
              setCurrentPage(1)
              loadRequests()
              toast.info('Displaying latest requests')
            }}
            className="font-bold tracking-wider text-[10px] text-[#102A43] hover:text-[var(--gold)] uppercase flex items-center gap-1 cursor-pointer transition-colors group self-end sm:self-auto py-0.5"
          >
            <span>LATEST REQUESTS</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* ── Details Dialog Modal ────────────────────────────────────── */}
      {selectedDetails && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedDetails(null)}
        >
          <div 
            className="bg-white rounded-2xl border border-[#E5DEC9] shadow-2xl max-w-lg w-full p-4 sm:p-6 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#F0EBE1]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F5EEDB] border border-[#E5DEC9] flex items-center justify-center text-[var(--gold)] font-bold text-sm shadow-2xs">
                  {selectedDetails.avatar}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#102A43] flex items-center gap-2">
                    <span>Leave Request</span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] tracking-wider ${
                      selectedDetails.status === 'approved' 
                        ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]' 
                        : selectedDetails.status === 'declined'
                          ? 'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]'
                          : 'bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        selectedDetails.status === 'approved' 
                          ? 'bg-[#059669]' 
                          : selectedDetails.status === 'declined' 
                            ? 'bg-[#DC2626]' 
                            : 'bg-[#B45309] animate-pulse'
                      }`} />
                      <span>{selectedDetails.status}</span>
                    </span>
                  </h3>
                  <p className="text-[11px] text-[#64748B] font-medium flex items-center gap-1.5 mt-0.5">
                    <span>ID: {selectedDetails.id.slice(0, 8)}...</span>
                    <span>•</span>
                    <Clock className="w-3 h-3 text-[#94A3B8]" />
                    <span>{selectedDetails.timeAgo}</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedDetails(null)} 
                className="text-[#64748B] hover:text-[#102A43] p-1.5 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-4 space-y-3 text-xs">
              {/* Applicant Card */}
              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E5DEC9] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-[#64748B] uppercase block">Applicant Profile</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-bold text-sm text-[#102A43]">{selectedDetails.name}</span>
                    {selectedDetails.role === 'STUDENT' ? (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-[#F1EFEA] text-[#64748B] border border-[#E5DEC9] tracking-wider uppercase">
                        STUDENT
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0] tracking-wider uppercase">
                        STAFF
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-0.5 font-medium">{selectedDetails.subInfo}</p>
                </div>
                <div className="text-right text-[11px] text-[#64748B]">
                  <span className="block font-semibold text-[#102A43]">User ID</span>
                  <span className="font-mono text-[10px] text-[#94A3B8]">{selectedDetails.userId?.slice(0, 10)}...</span>
                </div>
              </div>

              {/* Schedule Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E5DEC9]">
                  <span className="text-[10px] font-bold tracking-wider text-[#64748B] uppercase block mb-1">Duration / Type</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                    selectedDetails.requestType === 'half'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                  }`}>
                    {selectedDetails.durationType || (selectedDetails.requestType === 'half' ? 'Half Day' : 'Full Day')}
                  </span>
                </div>
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E5DEC9]">
                  <span className="text-[10px] font-bold tracking-wider text-[#64748B] uppercase block mb-1">Date Period</span>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#102A43]">
                    <Calendar className="w-3.5 h-3.5 text-[var(--gold)]" />
                    <span>{selectedDetails.dateRange || selectedDetails.fromDate}</span>
                  </div>
                </div>
              </div>

              {/* Reason & Category Box */}
              <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E5DEC9]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold tracking-wider text-[#64748B] uppercase flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[var(--gold)]" />
                    <span>Application Reason & Details</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-[#E5DEC9] text-[#102A43] font-semibold text-[10px]">
                    {selectedDetails.leaveCategory}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#EBE4D5] shadow-2xs">
                  <p className="text-xs text-[#1E293B] font-medium leading-relaxed italic">
                    "{selectedDetails.note ? selectedDetails.note.replace(/^[“"]+|[”"]+$/g, '') : selectedDetails.leaveCategory}"
                  </p>
                </div>
              </div>

              {/* Reviewer Note / Decision Info (if reviewed) */}
              {selectedDetails.status !== 'pending' && selectedDetails.reviewedBy && (
                <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                  <span className="text-[10px] font-bold tracking-wider text-[#64748B] uppercase block mb-0.5">Review Decision</span>
                  <div className="flex items-center justify-between text-xs text-[#334155]">
                    <span className="font-semibold">Reviewed by: <span className="text-[#102A43] font-bold">{selectedDetails.reviewedBy}</span></span>
                    {selectedDetails.reviewedAt && (
                      <span className="text-[11px] text-[#94A3B8]">
                        {new Date(selectedDetails.reviewedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                  {selectedDetails.reviewNote && (
                    <p className="text-[11px] text-[#64748B] mt-1 italic">Note: "{selectedDetails.reviewNote}"</p>
                  )}
                </div>
              )}

              {/* Pending Quick Action Input (for Organization Admin) */}
              {selectedDetails.status === 'pending' && (
                <div className="pt-1">
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                    Review Note / Remarks (Optional):
                  </label>
                  <input
                    type="text"
                    placeholder="Add an optional comment or instruction..."
                    value={modalReviewNote}
                    onChange={(e) => setModalReviewNote(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-[#E5DEC9] rounded-lg text-xs text-[#102A43] placeholder:text-[#94A3B8] focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]/20 shadow-2xs"
                  />
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-3 border-t border-[#F0EBE1] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setSelectedDetails(null)}
                className="px-3.5 py-1.5 border border-[#E5DEC9] bg-white text-[#536579] text-xs font-semibold rounded-lg hover:bg-[#FAF8F5] transition-colors shadow-2xs cursor-pointer active:scale-95"
              >
                Close
              </button>

              {selectedDetails.status === 'pending' && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={actionLoadingId === selectedDetails.id}
                    onClick={() => openDeclineModal(selectedDetails)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-red-200 bg-white text-[#DC2626] text-xs font-bold hover:bg-red-50 hover:border-red-300 transition-all cursor-pointer active:scale-95 shadow-2xs disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Decline Request</span>
                  </button>

                  <button
                    type="button"
                    disabled={actionLoadingId === selectedDetails.id}
                    onClick={() => handleApprove(selectedDetails.id, selectedDetails.name, modalReviewNote)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#064E3B] text-white text-xs font-bold hover:bg-[#065F46] transition-all cursor-pointer active:scale-95 shadow-2xs disabled:opacity-50"
                  >
                    {actionLoadingId === selectedDetails.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    <span>Approve Request</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Apply For Leave Dialog Modal ────────────────────────────── */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-[#E5DEC9] shadow-xl max-w-md w-full p-4 sm:p-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#102A43]">Apply for Leave</h3>
              <button 
                onClick={() => setApplyModalOpen(false)} 
                className="text-[#64748B] hover:text-[#102A43] p-1 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3.5 space-y-3 text-xs">
              <div>
                <label className="text-[#102A43] font-bold block mb-1">Leave Type</label>
                <select 
                  value={applyLeaveType}
                  onChange={(e) => setApplyLeaveType(e.target.value)}
                  className="w-full p-2 bg-[#FAF8F5] border border-[#E5DEC9] rounded-lg text-xs font-medium text-[#102A43] focus:outline-none focus:border-[var(--gold)]"
                >
                  <option value="Medical leave">Medical leave</option>
                  <option value="Personal leave">Personal leave</option>
                  <option value="Sick leave">Sick leave</option>
                  <option value="Casual leave">Casual leave</option>
                  <option value="Academic leave">Academic leave</option>
                  <option value="Half day · Afternoon">Half day · Afternoon</option>
                  <option value="Half day · Morning">Half day · Morning</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[#102A43] font-bold block mb-1">From Date</label>
                  <input 
                    type="date" 
                    value={applyFromDate}
                    onChange={(e) => setApplyFromDate(e.target.value)}
                    className="w-full p-2 bg-[#FAF8F5] border border-[#E5DEC9] rounded-lg text-xs font-medium text-[#102A43] focus:outline-none focus:border-[var(--gold)]" 
                  />
                </div>
                <div>
                  <label className="text-[#102A43] font-bold block mb-1">To Date</label>
                  <input 
                    type="date" 
                    value={applyToDate}
                    onChange={(e) => setApplyToDate(e.target.value)}
                    className="w-full p-2 bg-[#FAF8F5] border border-[#E5DEC9] rounded-lg text-xs font-medium text-[#102A43] focus:outline-none focus:border-[var(--gold)]" 
                  />
                </div>
              </div>

              <div>
                <label className="text-[#102A43] font-bold block mb-1">Reason / Note</label>
                <textarea 
                  rows={2.5} 
                  value={applyNote}
                  onChange={(e) => setApplyNote(e.target.value)}
                  placeholder="Please provide detailed reason for the leave request..." 
                  className="w-full p-2 bg-[#FAF8F5] border border-[#E5DEC9] rounded-lg text-xs text-[#102A43] placeholder:text-gray-400 focus:outline-none focus:border-[var(--gold)] leading-relaxed" 
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#F0EBE1] flex justify-end gap-2">
              <button
                type="button"
                disabled={isSubmittingApply}
                onClick={() => setApplyModalOpen(false)}
                className="px-3.5 py-1.5 bg-gray-100 text-[#536579] text-xs font-semibold rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmittingApply}
                onClick={handleApplySubmit}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#102A43] text-white text-xs font-semibold rounded-lg hover:bg-[#0B1F33] transition-colors shadow-2xs cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isSubmittingApply && <Loader2 className="w-3 h-3 animate-spin" />}
                <span>Submit Application</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Decline / Rejection Feedback Dialog Modal ───────────────── */}
      {declineModalOpen && declineTargetItem && (
        <div 
          className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setDeclineModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl border border-red-200 shadow-2xl max-w-md w-full p-4 sm:p-5 animate-in zoom-in-95 duration-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-red-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
                  <X className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#102A43]">
                    Decline Leave Request
                  </h3>
                  <p className="text-[11px] text-[#64748B]">
                    Applicant: <span className="font-bold text-[#102A43]">{declineTargetItem.name}</span> ({declineTargetItem.role})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDeclineModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="py-3.5 space-y-3 text-xs">
              <div className="p-2.5 rounded-xl bg-red-50/60 border border-red-100 text-[#991B1B] text-[11px] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>Feedback is required so the applicant understands why their request was rejected.</span>
              </div>

              {/* Quick Preset Chips */}
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] mb-1.5">
                  Quick reasons:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Insufficient leave balance',
                    'Class / Exam schedule conflict',
                    'Notice period not met',
                    'Prior permission required',
                    'Documentation missing'
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setDeclineFeedbackText(chip)}
                      className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-all cursor-pointer border ${
                        declineFeedbackText === chip
                          ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                          : 'bg-[#FAF8F5] text-[#536579] border-[#E5DEC9] hover:bg-red-50 hover:text-red-700 hover:border-red-200'
                      }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Textarea */}
              <div>
                <label className="block text-[11px] font-semibold text-[#102A43] mb-1">
                  Rejection Feedback / Reason: <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={declineFeedbackText}
                  onChange={(e) => setDeclineFeedbackText(e.target.value)}
                  placeholder="Enter detailed reason for rejection..."
                  className="w-full px-3 py-2 bg-white border border-[#E5DEC9] rounded-xl text-xs text-[#102A43] placeholder:text-[#94A3B8] focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 shadow-2xs resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-[#F0EBE1] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeclineModalOpen(false)}
                className="px-3.5 py-1.5 border border-[#E5DEC9] bg-white text-[#536579] text-xs font-semibold rounded-lg hover:bg-[#FAF8F5] transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!declineFeedbackText.trim() || isSubmittingDecline}
                onClick={handleConfirmDecline}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#DC2626] text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-all cursor-pointer active:scale-95 shadow-2xs disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSubmittingDecline ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <X className="w-3.5 h-3.5" />
                )}
                <span>Submit Rejection</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
