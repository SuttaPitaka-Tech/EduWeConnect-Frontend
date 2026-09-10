import { useState } from 'react'
import {
  ArrowLeft,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  Copy,
  Check,
  FileText,
  ExternalLink,
  Edit,
  Trash2,
  ShieldCheck,
  Loader2,
  MapPin,
  Users,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui'
import { toast } from 'sonner'
import { studentService, type StudentMember } from '../services/student.service'

interface StudentDetailViewProps {
  student: StudentMember
  onBack: () => void
  onEdit?: (student: StudentMember) => void
  onDelete?: (studentId: string) => void
}

export function StudentDetailView({
  student,
  onBack,
  onEdit,
  onDelete,
}: StudentDetailViewProps) {
  const [copiedId, setCopiedId] = useState(false)
  const [loadingDoc, setLoadingDoc] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const initial = student.student_name
    ? student.student_name.charAt(0).toUpperCase()
    : 'S'

  const handleCopyId = () => {
    navigator.clipboard.writeText(student.id)
    setCopiedId(true)
    toast.success('Student ID copied to clipboard')
    setTimeout(() => setCopiedId(false), 2000)
  }

  // Open / Download MinIO Document
  const handleOpenDoc = async () => {
    if (!student.student_aadhar_file_id) return
    setLoadingDoc(true)
    try {
      const url = await studentService.getDownloadUrl(student.student_aadhar_file_id)
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch (err: any) {
      console.error('Document download failed:', err)
      toast.error('Unable to retrieve Aadhaar document from storage')
    } finally {
      setLoadingDoc(false)
    }
  }

  const handleDeleteStudent = async () => {
    setIsDeleting(true)
    try {
      await studentService.delete(student.id)
      toast.success(`Student "${student.student_name}" removed successfully`)
      onDelete?.(student.id)
      onBack()
    } catch (err: any) {
      console.error('Delete student error:', err)
      toast.error(err.response?.data?.message || 'Failed to delete student')
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
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
    if (!path) return 'document.pdf'
    const segments = path.split('/')
    const last = segments[segments.length - 1]
    const underscoreIndex = last.lastIndexOf('_')
    return underscoreIndex > -1 ? last.substring(underscoreIndex + 1) : last
  }

  return (
    <div className="w-full flex flex-col gap-6 animate-fadeIn pb-12">
      {/* ── Top Bar: Navigation & Action Controls ───────────────────────── */}
      <div className="bg-white/95 rounded-2xl p-4 lg:p-6 border border-[var(--border)] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-xl border border-[var(--border)] bg-white hover:bg-[var(--cream)]/60 text-[var(--navy)] flex items-center justify-center shadow-2xs active:scale-95 transition-all cursor-pointer shrink-0"
            title="Back to Table"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--navy)]" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl lg:text-2xl font-serif font-bold text-[var(--navy)]">
                Student Profile
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active Student
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--gold)]/15 text-[var(--navy)] border border-[var(--gold)]/30">
                {student.standard}
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-medium">
              Enrolled in <strong className="text-[var(--navy)]">{student.standard}</strong> • Comprehensive record, documents, and family details
            </p>
          </div>
        </div>

        {/* Action Controls: Edit, Delete */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(student)}
              className="h-10 px-4 rounded-xl border border-[var(--border)] bg-white hover:bg-blue-50 text-blue-700 font-bold text-xs gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
            >
              <Edit className="w-4 h-4 text-blue-600" />
              <span>Edit Student</span>
            </Button>
          )}

          {showDeleteConfirm ? (
            <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-200 p-1.5 rounded-xl animate-fadeIn shadow-xs">
              <span className="text-xs font-bold text-rose-700 px-2">Confirm Delete?</span>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteStudent}
                className="h-8 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Yes, Delete</span>
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="h-8 px-3 rounded-lg text-gray-500 hover:bg-gray-200 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="h-10 px-4 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Delete</span>
            </Button>
          )}
        </div>
      </div>

      {/* ── Hero Profile Card ─────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-white via-[#FCFBF7] to-white rounded-2xl p-6 lg:p-8 border border-[var(--border)] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--navy)] via-[#1B365D] to-[var(--deep-navy)] text-[var(--gold)] font-serif font-bold text-3xl flex items-center justify-center shrink-0 shadow-md ring-4 ring-[var(--gold)]/20">
            {initial}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-2xl font-serif font-bold text-[var(--navy)] capitalize">
                {student.student_name}
              </h2>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--gold)]/15 text-[var(--navy)] border border-[var(--gold)]/30">
                {student.standard}
              </span>
              <span className="px-2.5 py-0.5 rounded-md font-mono text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200/80">
                Roll No: {student.roll_number || '—'}
              </span>
            </div>

            {/* Student ID & Meta */}
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-[var(--text-secondary)] font-medium">
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-[var(--border)] shadow-2xs">
                <span className="font-mono text-[11px] font-bold text-[var(--navy)]">
                  #{student.id.slice(0, 8).toUpperCase()}
                </span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="p-0.5 rounded text-gray-400 hover:text-[var(--gold)] transition-colors cursor-pointer"
                  title="Copy full UUID"
                >
                  {copiedId ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {student.created_at && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <span>Enrolled on {new Date(student.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Emergency Contact Box */}
        <div className="flex flex-col gap-2 p-4 rounded-xl bg-white border border-[var(--border)] shadow-2xs min-w-[270px] sm:min-w-[280px]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--gold)] flex items-center justify-between gap-3">
            <span className="shrink-0">Emergency Contact</span>
            {student.emergency_person_relation && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200/90 shrink-0">
                {student.emergency_person_relation}
              </span>
            )}
          </div>
          {student.emergency_person_name && (
            <span className="text-xs font-bold text-[var(--navy)]">
              {student.emergency_person_name}
            </span>
          )}
          {(student.emergency_person_mobile || student.contact_mobile) && (
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--navy)] font-semibold">
              <Phone className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
              <span>{student.emergency_person_mobile || student.contact_mobile}</span>
            </div>
          )}
          {student.contact_email && (
            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] font-medium">
              <Mail className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
              <span className="truncate">{student.contact_email}</span>
            </div>
          )}
          {!student.emergency_person_mobile && !student.contact_mobile && !student.contact_email && (
            <span className="text-xs text-gray-400 italic">No emergency contact listed</span>
          )}
        </div>
      </div>

      {/* ── Information Cards Grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Academic & Identity Information */}
        <div className="bg-white/95 rounded-2xl p-6 border border-[var(--border)] shadow-sm flex flex-col gap-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--border)]">
            <GraduationCap className="w-5 h-5 text-[var(--gold)]" />
            <h3 className="font-serif font-bold text-base text-[var(--navy)]">
              Academic &amp; Identity Details
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex flex-col gap-1 p-3 rounded-xl bg-[#FCFBF7] border border-[var(--border)]/60">
              <span className="text-[11px] text-[var(--text-secondary)] font-medium">Student Full Name</span>
              <span className="font-bold text-[var(--navy)] text-sm">{student.student_name}</span>
            </div>

            <div className="flex flex-col gap-1 p-3 rounded-xl bg-[#FCFBF7] border border-[var(--border)]/60">
              <span className="text-[11px] text-[var(--text-secondary)] font-medium">Assigned Grade / Standard</span>
              <span className="font-bold text-[var(--navy)] text-sm">{student.standard}</span>
            </div>

            <div className="flex flex-col gap-1 p-3 rounded-xl bg-[#FCFBF7] border border-[var(--border)]/60">
              <span className="text-[11px] text-[var(--text-secondary)] font-medium">Unique Roll Number</span>
              <span className="font-mono font-bold text-[var(--navy)] text-sm">{student.roll_number || '—'}</span>
            </div>

            <div className="flex flex-col gap-1 p-3 rounded-xl bg-[#FCFBF7] border border-[var(--border)]/60">
              <span className="text-[11px] text-[var(--text-secondary)] font-medium">Aadhaar Card Number</span>
              <span className="font-mono font-bold text-[var(--navy)] text-sm">{formatAadhar(student.student_aadhar_number)}</span>
            </div>

            <div className="flex flex-col gap-1 p-3 rounded-xl bg-[#FCFBF7] border border-[var(--border)]/60">
              <span className="text-[11px] text-[var(--text-secondary)] font-medium">Account Status</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="capitalize">{student.status || 'Active'}</span>
              </span>
            </div>

            <div className="flex flex-col gap-1 p-3 rounded-xl bg-[#FCFBF7] border border-[var(--border)]/60">
              <span className="text-[11px] text-[var(--text-secondary)] font-medium">Record Created At</span>
              <span className="font-medium text-[var(--navy)]">
                {student.created_at ? new Date(student.created_at).toLocaleString() : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Aadhaar Document Verification */}
        <div className="bg-white/95 rounded-2xl p-6 border border-[var(--border)] shadow-sm flex flex-col gap-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--border)]">
            <FileText className="w-5 h-5 text-[var(--gold)]" />
            <h3 className="font-serif font-bold text-base text-[var(--navy)]">
              Verification Documents
            </h3>
          </div>

          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[#FCFBF7] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-xs text-[var(--navy)] block truncate">
                    Student Aadhaar Card
                  </span>
                  <span className="text-[11px] text-[var(--text-secondary)] block truncate">
                    {student.student_aadhar_file_id
                      ? getDocFilename(student.student_aadhar_file_id)
                      : 'No document attached'}
                  </span>
                </div>
              </div>

              {student.student_aadhar_file_id ? (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={loadingDoc}
                  onClick={handleOpenDoc}
                  className="h-9 px-3.5 rounded-xl border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs gap-1.5 shadow-2xs active:scale-95 cursor-pointer shrink-0"
                >
                  {loadingDoc ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                  ) : (
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
                  )}
                  <span>View Document</span>
                </Button>
              ) : (
                <span className="text-xs text-gray-400 italic">Not Uploaded</span>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                All uploaded documents are securely encrypted and stored in private MinIO institutional buckets.
              </span>
            </div>
          </div>
        </div>

        {/* 3. Family & Guardian Details */}
        <div className="bg-white/95 rounded-2xl p-6 border border-[var(--border)] shadow-sm flex flex-col gap-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--border)]">
            <Users className="w-5 h-5 text-[var(--gold)]" />
            <h3 className="font-serif font-bold text-base text-[var(--navy)]">
              Family &amp; Guardian Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Father Details */}
            <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-[#FCFBF7] border border-[var(--border)]/60">
              <span className="text-[11px] text-[var(--gold)] font-bold uppercase tracking-wider">Father Details</span>
              <span className="font-bold text-[var(--navy)] text-sm">{student.father_name || '—'}</span>
              <span className="text-[11px] text-[var(--text-secondary)] font-mono">{student.father_mobile || 'No Mobile'}</span>
              <span className="text-[11px] text-[var(--text-secondary)] truncate">{student.father_email || 'No Email'}</span>
            </div>

            {/* Mother Details */}
            <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-[#FCFBF7] border border-[var(--border)]/60">
              <span className="text-[11px] text-[var(--gold)] font-bold uppercase tracking-wider">Mother Details</span>
              <span className="font-bold text-[var(--navy)] text-sm">{student.mother_name || '—'}</span>
              <span className="text-[11px] text-[var(--text-secondary)] font-mono">{student.mother_mobile || 'No Mobile'}</span>
              <span className="text-[11px] text-[var(--text-secondary)] truncate">{student.mother_email || 'No Email'}</span>
            </div>

            {/* Emergency Contact */}
            <div className="sm:col-span-2 flex flex-col gap-1 p-3.5 rounded-xl bg-purple-50/50 border border-purple-200/60">
              <span className="text-[11px] text-purple-800 font-bold uppercase tracking-wider">
                Emergency Contact Person
              </span>
              <div className="flex flex-wrap items-center justify-between gap-2 mt-1">
                <div>
                  <span className="font-bold text-[var(--navy)] text-sm block">
                    {student.emergency_person_name || 'Not Provided'}
                  </span>
                  <span className="text-[11px] text-[var(--text-secondary)]">
                    Relationship: <strong className="text-[var(--navy)]">{student.emergency_person_relation || 'Guardian'}</strong>
                  </span>
                </div>
                {student.emergency_person_mobile && (
                  <span className="font-mono text-xs font-bold text-[var(--navy)] bg-white px-2.5 py-1 rounded-md border border-purple-200 shadow-2xs">
                    {student.emergency_person_mobile}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Residential Address Details */}
        <div className="bg-white/95 rounded-2xl p-6 border border-[var(--border)] shadow-sm flex flex-col gap-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--border)]">
            <MapPin className="w-5 h-5 text-[var(--gold)]" />
            <h3 className="font-serif font-bold text-base text-[var(--navy)]">
              Residential &amp; Address Details
            </h3>
          </div>

          <div className="flex flex-col gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#FCFBF7] border border-[var(--border)]/60">
              <span className="text-[11px] text-[var(--gold)] font-bold uppercase tracking-wider block mb-1">
                Current Residential Address
              </span>
              <p className="text-xs text-[var(--navy)] font-medium leading-relaxed">
                {student.current_address || 'Not Provided'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FCFBF7] border border-[var(--border)]/60">
              <span className="text-[11px] text-[var(--gold)] font-bold uppercase tracking-wider block mb-1">
                Permanent Address
              </span>
              <p className="text-xs text-[var(--navy)] font-medium leading-relaxed">
                {student.permanent_address || 'Same as current address'}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-[#FCFBF7] border border-[var(--border)]/60 text-center">
                <span className="text-[10px] text-[var(--text-secondary)] block">District</span>
                <span className="font-bold text-[var(--navy)] text-xs capitalize">{student.district || '—'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FCFBF7] border border-[var(--border)]/60 text-center">
                <span className="text-[10px] text-[var(--text-secondary)] block">State</span>
                <span className="font-bold text-[var(--navy)] text-xs">{student.state || '—'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FCFBF7] border border-[var(--border)]/60 text-center">
                <span className="text-[10px] text-[var(--text-secondary)] block">Country</span>
                <span className="font-bold text-[var(--navy)] text-xs">{student.country || 'India'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
