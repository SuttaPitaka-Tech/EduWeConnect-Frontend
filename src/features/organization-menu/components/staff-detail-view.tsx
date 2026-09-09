import { useState } from 'react'
import {
  ArrowLeft,
  Mail,
  Phone,
  CreditCard,
  Briefcase,
  BookOpen,
  DollarSign,
  Calendar,
  Copy,
  Check,
  FileText,
  ExternalLink,
  Edit,
  Trash2,
  ShieldCheck,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api-client'
import { StaffMember } from './users-list-table'

interface StaffDetailViewProps {
  staff: StaffMember
  onBack: () => void
  onEdit: (staff: StaffMember) => void
  onDelete: (staffId: string) => void
}

export function StaffDetailView({
  staff,
  onBack,
  onEdit,
  onDelete,
}: StaffDetailViewProps) {
  const [copiedId, setCopiedId] = useState(false)
  const [loadingDocKey, setLoadingDocKey] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const fullName = `${staff.employee_first_name} ${staff.employee_last_name || ''}`.trim()
  const initial = staff.employee_first_name
    ? staff.employee_first_name.charAt(0).toUpperCase()
    : 'S'

  const handleCopyId = () => {
    navigator.clipboard.writeText(staff.id)
    setCopiedId(true)
    toast.success('User ID copied to clipboard')
    setTimeout(() => setCopiedId(false), 2000)
  }

  // Open / Download MinIO Document
  const handleOpenDoc = async (fileKey: string, docLabel: string) => {
    if (!fileKey) return
    setLoadingDocKey(fileKey)
    try {
      // Clean file key if needed
      const cleanKey = fileKey.startsWith('/') ? fileKey.substring(1) : fileKey
      const res = await apiClient.get<{ url?: string; error?: string }>(
        `/minio/download?fileName=${encodeURIComponent(cleanKey)}`
      )
      if (res.data?.url) {
        window.open(res.data.url, '_blank', 'noopener,noreferrer')
      } else {
        toast.error(`Unable to retrieve URL for ${docLabel}`)
      }
    } catch (err: any) {
      console.error('Document download failed:', err)
      toast.error(`Failed to open document: ${err.message || 'File not accessible'}`)
    } finally {
      setLoadingDocKey(null)
    }
  }

  const handleDeleteStaff = async () => {
    setIsDeleting(true)
    try {
      await apiClient.delete(`/staff-details/${staff.id}`)
      toast.success(`Staff member "${fullName}" deleted successfully`)
      onDelete(staff.id)
      onBack()
    } catch (err: any) {
      console.error('Delete staff error:', err)
      toast.error(err.response?.data?.message || 'Failed to delete staff member')
      setIsDeleting(false)
    }
  }

  const renderRoleBadge = () => {
    const type = (staff.employee_type || '').toLowerCase()
    if (type.includes('teach')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300">
          <BookOpen className="w-3.5 h-3.5 text-amber-600" />
          <span>Teacher</span>
        </span>
      )
    }
    if (type.includes('finance')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-300">
          <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
          <span>Finance Officer</span>
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-900 border border-sky-300">
        <Briefcase className="w-3.5 h-3.5 text-sky-600" />
        <span>Non-Teaching Staff</span>
      </span>
    )
  }

  const formatAadhar = (raw?: string | null) => {
    if (!raw) return 'Not Provided'
    const digits = raw.replace(/\s+/g, '')
    if (digits.length === 12) {
      return `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8, 12)}`
    }
    return raw
  }

  const getDocFilename = (path?: string | null) => {
    if (!path) return ''
    const parts = path.split('/')
    return parts[parts.length - 1]
  }

  return (
    <div className="w-full flex flex-col gap-6 animate-fadeIn pb-12">
      {/* ── Top Navigation Bar ─────────────────────────────────────────── */}
      <div className="bg-white/95 rounded-2xl p-5 lg:p-6 border border-[var(--border)] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-xl border border-[var(--border)] bg-white hover:bg-[var(--cream)]/60 text-[var(--navy)] flex items-center justify-center shadow-2xs active:scale-95 transition-all cursor-pointer shrink-0"
            title="Back to Registered Users"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--navy)]" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl lg:text-2xl font-serif font-bold text-[var(--navy)]">
                Staff Profile &amp; Information
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--gold)]/15 text-[var(--navy)] border border-[var(--gold)]/30">
                Full Details
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-medium">
              Complete records, statutory identifiers, and verified credentials for this institutional user.
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(staff)}
            className="h-10 px-4 rounded-xl border border-[var(--gold)] bg-white text-[var(--navy)] hover:bg-[var(--gold)]/10 font-bold text-xs gap-2 shadow-2xs active:scale-95 transition-all cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span>Edit Staff</span>
          </Button>

          {showDeleteConfirm ? (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 p-1.5 rounded-xl animate-fadeIn">
              <span className="text-[11px] font-bold text-rose-700 px-2">Delete staff?</span>
              <button
                type="button"
                onClick={handleDeleteStaff}
                disabled={isDeleting}
                className="h-8 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                <span>Confirm</span>
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="h-8 px-2 rounded-lg text-gray-500 hover:bg-gray-200 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="h-10 px-3.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 font-bold text-xs gap-1.5 shadow-2xs active:scale-95 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              <span>Delete</span>
            </Button>
          )}
        </div>
      </div>

      {/* ── Staff Hero Header Card ────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[var(--navy)] to-[var(--deep-navy)] rounded-2xl p-6 lg:p-8 text-white shadow-md border border-[var(--gold)]/20 relative overflow-hidden">
        {/* Subtle Background Deco */}
        <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-[var(--gold)]/10 blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--gold)] to-amber-600 text-[var(--navy)] font-bold font-serif text-3xl flex items-center justify-center shadow-lg border-2 border-white/20 shrink-0">
              {initial}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                <h2 className="text-2xl lg:text-3xl font-serif font-bold tracking-tight text-white capitalize">
                  {fullName}
                </h2>
                {renderRoleBadge()}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Active Account</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-white/80 font-medium">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <a href={`mailto:${staff.employee_email}`} className="hover:underline text-white">
                    {staff.employee_email}
                  </a>
                </span>
                <span className="flex items-center gap-1.5 font-mono">
                  <Phone className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <span>{staff.employee_mobile_number}</span>
                </span>
                {staff.created_at && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[var(--gold)]" />
                    <span>Registered {new Date(staff.created_at).toLocaleDateString()}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* User ID Identifier Card */}
          <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-3.5 flex flex-col gap-1 self-start md:self-auto min-w-[220px]">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--gold)]">
              System User ID
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold text-white truncate" title={staff.id}>
                #{staff.id}
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer shrink-0"
                title="Copy User ID"
              >
                {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Information Cards (3-Column / Grid) ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Personal & Statutory Info */}
        <div className="bg-white/95 rounded-2xl p-6 border border-[var(--border)] shadow-sm flex flex-col gap-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--border)]">
            <div className="w-8 h-8 rounded-xl bg-[var(--cream)] border border-[var(--gold)]/30 flex items-center justify-center text-[var(--gold)]">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--navy)]">Personal &amp; Identity</h3>
              <p className="text-[11px] text-[var(--text-secondary)]">Government IDs and contact particulars</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-xs">
            <div>
              <span className="text-[10.5px] uppercase font-bold tracking-wider text-[var(--text-secondary)] block mb-1">
                First Name
              </span>
              <span className="font-semibold text-[var(--navy)] text-sm capitalize">
                {staff.employee_first_name}
              </span>
            </div>

            <div>
              <span className="text-[10.5px] uppercase font-bold tracking-wider text-[var(--text-secondary)] block mb-1">
                Last Name
              </span>
              <span className="font-semibold text-[var(--navy)] text-sm capitalize">
                {staff.employee_last_name || '—'}
              </span>
            </div>

            <div>
              <span className="text-[10.5px] uppercase font-bold tracking-wider text-[var(--text-secondary)] block mb-1">
                Email Address
              </span>
              <a
                href={`mailto:${staff.employee_email}`}
                className="font-semibold text-[var(--navy)] text-sm hover:underline block truncate"
              >
                {staff.employee_email}
              </a>
            </div>

            <div>
              <span className="text-[10.5px] uppercase font-bold tracking-wider text-[var(--text-secondary)] block mb-1">
                Mobile Number
              </span>
              <span className="font-mono font-bold text-[var(--navy)] text-sm">
                {staff.employee_mobile_number}
              </span>
            </div>

            <div className="pt-2 border-t border-[var(--border)] flex flex-col gap-3">
              <div>
                <span className="text-[10.5px] uppercase font-bold tracking-wider text-[var(--text-secondary)] block mb-1">
                  PAN Card Number
                </span>
                <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-md bg-[var(--cream)]/70 text-[var(--navy)] border border-[var(--gold)]/30 inline-block">
                  {staff.employee_pan_number || 'Not Provided'}
                </span>
              </div>

              <div>
                <span className="text-[10.5px] uppercase font-bold tracking-wider text-[var(--text-secondary)] block mb-1">
                  Aadhaar Card Number
                </span>
                <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-md bg-[var(--cream)]/70 text-[var(--navy)] border border-[var(--gold)]/30 inline-block">
                  {formatAadhar(staff.employee_aadhar_number)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Employment & Subject Allocations */}
        <div className="bg-white/95 rounded-2xl p-6 border border-[var(--border)] shadow-sm flex flex-col gap-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--border)]">
            <div className="w-8 h-8 rounded-xl bg-[var(--cream)] border border-[var(--gold)]/30 flex items-center justify-center text-[var(--gold)]">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--navy)]">Role &amp; Experience</h3>
              <p className="text-[11px] text-[var(--text-secondary)]">Designation, seniority, and assignments</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-xs">
            <div>
              <span className="text-[10.5px] uppercase font-bold tracking-wider text-[var(--text-secondary)] block mb-1">
                Employee Role Type
              </span>
              <div>{renderRoleBadge()}</div>
            </div>

            <div>
              <span className="text-[10.5px] uppercase font-bold tracking-wider text-[var(--text-secondary)] block mb-1">
                Total Teaching / Work Experience
              </span>
              <span className="font-semibold text-[var(--navy)] text-sm">
                {staff.employee_experience ? `${staff.employee_experience} Years` : 'Fresh Candidate'}
              </span>
            </div>

            <div>
              <span className="text-[10.5px] uppercase font-bold tracking-wider text-[var(--text-secondary)] block mb-1">
                Previous Institution / Employer
              </span>
              <span className="font-semibold text-[var(--navy)] text-sm">
                {staff.employee_previous_work_institute_name || 'None / Not Provided'}
              </span>
            </div>

            <div className="pt-2 border-t border-[var(--border)]">
              <span className="text-[10.5px] uppercase font-bold tracking-wider text-[var(--text-secondary)] block mb-2">
                Assigned Subjects / Disciplines
              </span>
              {Array.isArray(staff.subjects) && staff.subjects.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {staff.subjects.map((sub, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[var(--gold)]/15 text-[var(--navy)] border border-[var(--gold)]/40 flex items-center gap-1.5 shadow-2xs"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[var(--gold)]" />
                      <span>{sub}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">No academic subjects assigned (Non-teaching profile)</p>
              )}
            </div>
          </div>
        </div>

        {/* Card 3: Uploaded Verification Documents (MinIO) */}
        <div className="bg-white/95 rounded-2xl p-6 border border-[var(--border)] shadow-sm flex flex-col gap-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--border)]">
            <div className="w-8 h-8 rounded-xl bg-[var(--cream)] border border-[var(--gold)]/30 flex items-center justify-center text-[var(--gold)]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--navy)]">Verification Documents</h3>
              <p className="text-[11px] text-[var(--text-secondary)]">Securely stored in MinIO storage</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {/* 1. PAN Document */}
            <div className="p-3 rounded-xl border border-[var(--border)] bg-[#FCFBF7] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-4 h-4 text-[var(--gold)] shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs font-bold text-[var(--navy)] block truncate">
                    PAN Card Document
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)] block truncate">
                    {staff.employee_pan_file_id ? getDocFilename(staff.employee_pan_file_id) : 'Not uploaded'}
                  </span>
                </div>
              </div>
              {staff.employee_pan_file_id ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenDoc(staff.employee_pan_file_id!, 'PAN Card')}
                  disabled={loadingDocKey === staff.employee_pan_file_id}
                  className="h-8 px-2.5 rounded-lg border-[var(--gold)]/60 text-xs font-bold text-[var(--navy)] gap-1 shrink-0 cursor-pointer"
                >
                  {loadingDocKey === staff.employee_pan_file_id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <ExternalLink className="w-3 h-3 text-[var(--gold)]" />
                  )}
                  <span>View</span>
                </Button>
              ) : (
                <span className="text-[10px] text-gray-400 italic">Missing</span>
              )}
            </div>

            {/* 2. Aadhaar Document */}
            <div className="p-3 rounded-xl border border-[var(--border)] bg-[#FCFBF7] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-4 h-4 text-[var(--gold)] shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs font-bold text-[var(--navy)] block truncate">
                    Aadhaar Card Document
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)] block truncate">
                    {staff.employee_aadhar_file_id ? getDocFilename(staff.employee_aadhar_file_id) : 'Not uploaded'}
                  </span>
                </div>
              </div>
              {staff.employee_aadhar_file_id ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenDoc(staff.employee_aadhar_file_id!, 'Aadhaar Card')}
                  disabled={loadingDocKey === staff.employee_aadhar_file_id}
                  className="h-8 px-2.5 rounded-lg border-[var(--gold)]/60 text-xs font-bold text-[var(--navy)] gap-1 shrink-0 cursor-pointer"
                >
                  {loadingDocKey === staff.employee_aadhar_file_id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <ExternalLink className="w-3 h-3 text-[var(--gold)]" />
                  )}
                  <span>View</span>
                </Button>
              ) : (
                <span className="text-[10px] text-gray-400 italic">Missing</span>
              )}
            </div>

            {/* 3. Experience Letter */}
            <div className="p-3 rounded-xl border border-[var(--border)] bg-[#FCFBF7] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-4 h-4 text-[var(--gold)] shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs font-bold text-[var(--navy)] block truncate">
                    Experience Certificate
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)] block truncate">
                    {staff.employee_experience_letter_file_id
                      ? getDocFilename(staff.employee_experience_letter_file_id)
                      : 'Not uploaded'}
                  </span>
                </div>
              </div>
              {staff.employee_experience_letter_file_id ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenDoc(staff.employee_experience_letter_file_id!, 'Experience Certificate')}
                  disabled={loadingDocKey === staff.employee_experience_letter_file_id}
                  className="h-8 px-2.5 rounded-lg border-[var(--gold)]/60 text-xs font-bold text-[var(--navy)] gap-1 shrink-0 cursor-pointer"
                >
                  {loadingDocKey === staff.employee_experience_letter_file_id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <ExternalLink className="w-3 h-3 text-[var(--gold)]" />
                  )}
                  <span>View</span>
                </Button>
              ) : (
                <span className="text-[10px] text-gray-400 italic">Missing</span>
              )}
            </div>

            {/* 4. Relieving Letter */}
            <div className="p-3 rounded-xl border border-[var(--border)] bg-[#FCFBF7] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-4 h-4 text-[var(--gold)] shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs font-bold text-[var(--navy)] block truncate">
                    Relieving Letter
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)] block truncate">
                    {staff.employee_relieving_letter_file_id
                      ? getDocFilename(staff.employee_relieving_letter_file_id)
                      : 'Not uploaded'}
                  </span>
                </div>
              </div>
              {staff.employee_relieving_letter_file_id ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenDoc(staff.employee_relieving_letter_file_id!, 'Relieving Letter')}
                  disabled={loadingDocKey === staff.employee_relieving_letter_file_id}
                  className="h-8 px-2.5 rounded-lg border-[var(--gold)]/60 text-xs font-bold text-[var(--navy)] gap-1 shrink-0 cursor-pointer"
                >
                  {loadingDocKey === staff.employee_relieving_letter_file_id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <ExternalLink className="w-3 h-3 text-[var(--gold)]" />
                  )}
                  <span>View</span>
                </Button>
              ) : (
                <span className="text-[10px] text-gray-400 italic">Missing</span>
              )}
            </div>

            {/* Additional Documents if any */}
            {Array.isArray(staff.additional_documents) && staff.additional_documents.length > 0 && (
              <div className="pt-2 border-t border-[var(--border)] flex flex-col gap-2">
                <span className="text-[10.5px] uppercase font-bold tracking-wider text-[var(--text-secondary)]">
                  Additional Uploads
                </span>
                {staff.additional_documents.map((ad, adIdx) => (
                  <div
                    key={adIdx}
                    className="p-3 rounded-xl border border-[var(--border)] bg-[#FCFBF7] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-4 h-4 text-[var(--gold)] shrink-0" />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-[var(--navy)] block truncate">
                          {ad.docName || `Doc #${adIdx + 1}`}
                        </span>
                        <span className="text-[10px] text-[var(--text-secondary)] block truncate">
                          {ad.file_id ? getDocFilename(ad.file_id) : 'Attached'}
                        </span>
                      </div>
                    </div>
                    {ad.file_id && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenDoc(ad.file_id!, ad.docName || 'Document')}
                        disabled={loadingDocKey === ad.file_id}
                        className="h-8 px-2.5 rounded-lg border-[var(--gold)]/60 text-xs font-bold text-[var(--navy)] gap-1 shrink-0 cursor-pointer"
                      >
                        {loadingDocKey === ad.file_id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <ExternalLink className="w-3 h-3 text-[var(--gold)]" />
                        )}
                        <span>View</span>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
