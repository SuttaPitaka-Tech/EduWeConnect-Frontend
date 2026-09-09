import { useState, useRef } from 'react'
import {
  UserCheck,
  GraduationCap,
  Building2,
  Mail,
  Phone,
  FileText,
  Upload,
  Trash2,
  Plus,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Briefcase,
  X,
  BookOpen,
  DollarSign,
  Users,
  Eye,
  ExternalLink,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/auth-context'
import { apiClient, formatApiClientError } from '@/lib/api-client'

export interface AdditionalDoc {
  id: string
  docName: string
  file: File | null
}

function formatFileSize(bytes?: number): string {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

interface FileViewerModalProps {
  viewing: { file: File; title: string; url: string } | null
  onClose: () => void
}

function FileViewerModal({ viewing, onClose }: FileViewerModalProps) {
  if (!viewing) return null

  const isImage =
    viewing.file.type.startsWith('image/') ||
    /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(viewing.file.name)

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[var(--gold)]/30 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-gray-50/80">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[var(--cream)] border border-[var(--gold)]/30 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-[var(--navy)]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-[var(--navy)] truncate">
                {viewing.title}
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)] truncate">
                {viewing.file.name} ({formatFileSize(viewing.file.size)})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={viewing.url}
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 px-3 rounded-lg border border-[var(--gold)]/50 bg-white hover:bg-[var(--gold)]/10 text-xs font-semibold text-[var(--navy)] flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>Open in New Tab</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="h-8 w-8 rounded-lg hover:bg-gray-200 text-gray-500 hover:text-[var(--navy)] flex items-center justify-center transition-colors cursor-pointer"
              title="Close viewer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-auto p-4 bg-gray-100/60 flex items-center justify-center min-h-[420px]">
          {isImage ? (
            <img
              src={viewing.url}
              alt={viewing.title}
              className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-md"
            />
          ) : (
            <iframe
              src={viewing.url}
              title={viewing.title}
              className="w-full h-[70vh] rounded-lg border border-gray-300 bg-white shadow-xs"
            />
          )}
        </div>
      </div>
    </div>
  )
}

const COMMON_SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'English',
  'Social Studies',
  'General Science',
  'Hindi',
  'Kannada',
  'History',
  'Economics',
]

import { StaffMember } from './users-list-table'

interface CreateStaffFormProps {
  onBack: () => void
  initialData?: StaffMember | null
  mode?: 'create' | 'edit'
}

export function CreateStaffForm({ onBack, initialData, mode = 'create' }: CreateStaffFormProps) {
  const isEditMode = mode === 'edit' && !!initialData

  // ── Form State ────────────────────────────────────────────────────────────
  const [firstName, setFirstName] = useState(initialData?.employee_first_name || '')
  const [lastName, setLastName] = useState(initialData?.employee_last_name || '')
  const [email, setEmail] = useState(initialData?.employee_email || '')
  const [mobile, setMobile] = useState(initialData?.employee_mobile_number || '')
  const [panNumber, setPanNumber] = useState(initialData?.employee_pan_number || '')
  const [panFile, setPanFile] = useState<File | null>(null)
  const [aadharNumber, setAadharNumber] = useState(initialData?.employee_aadhar_number || '')
  const [aadharFile, setAadharFile] = useState<File | null>(null)

  const [experience, setExperience] = useState(initialData?.employee_experience || '')
  const [previousInstitute, setPreviousInstitute] = useState(
    initialData?.employee_previous_work_institute_name || ''
  )
  const [expLetterFile, setExpLetterFile] = useState<File | null>(null)
  const [relievingLetterFile, setRelievingLetterFile] = useState<File | null>(null)

  const [additionalDocs, setAdditionalDocs] = useState<AdditionalDoc[]>([])

  const [employeeType, setEmployeeType] = useState<'Teacher' | 'Non Staff' | 'Finance' | ''>(
    (initialData?.employee_type as any) || ''
  )
  const [subjects, setSubjects] = useState<string[]>(initialData?.subjects || [])
  const [customSubjectInput, setCustomSubjectInput] = useState('')

  const { user } = useAuth()

  // ── Preview & Success State ───────────────────────────────────────────────
  const [isPreview, setIsPreview] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ── Document Viewer State ─────────────────────────────────────────────────
  const [viewingFile, setViewingFile] = useState<{
    file: File
    title: string
    url: string
  } | null>(null)

  const handleViewFile = (file: File | null, title: string) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setViewingFile({ file, title, url })
  }

  const handleCloseViewer = () => {
    if (viewingFile?.url) {
      URL.revokeObjectURL(viewingFile.url)
    }
    setViewingFile(null)
  }

  // ── File Input Refs ───────────────────────────────────────────────────────
  const panInputRef = useRef<HTMLInputElement>(null)
  const aadharInputRef = useRef<HTMLInputElement>(null)
  const expLetterInputRef = useRef<HTMLInputElement>(null)
  const relievingInputRef = useRef<HTMLInputElement>(null)

  // ── Helpers ───────────────────────────────────────────────────────────────
  const handleAddAdditionalDoc = () => {
    const newDoc: AdditionalDoc = {
      id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      docName: '',
      file: null,
    }
    setAdditionalDocs((prev) => [...prev, newDoc])
  }

  const handleUpdateAdditionalDocName = (id: string, name: string) => {
    setAdditionalDocs((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, docName: name } : doc))
    )
  }

  const handleUpdateAdditionalDocFile = (id: string, file: File | null) => {
    setAdditionalDocs((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, file } : doc))
    )
  }

  const handleRemoveAdditionalDoc = (id: string) => {
    setAdditionalDocs((prev) => prev.filter((doc) => doc.id !== id))
  }

  const handleToggleSubject = (sub: string) => {
    setSubjects((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    )
  }

  const handleAddCustomSubject = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = customSubjectInput.trim()
    if (!trimmed) return
    if (!subjects.includes(trimmed)) {
      setSubjects((prev) => [...prev, trimmed])
      toast.success(`Subject "${trimmed}" added`)
    }
    setCustomSubjectInput('')
  }

  const handleRemoveSubject = (sub: string) => {
    setSubjects((prev) => prev.filter((s) => s !== sub))
  }

  const handleGoToPreview = () => {
    if (!firstName.trim()) {
      toast.error('Please enter employee first name')
      return
    }
    if (!email.trim()) {
      toast.error('Please enter employee email')
      return
    }
    if (!mobile.trim()) {
      toast.error('Please enter employee mobile number')
      return
    }
    if (!employeeType) {
      toast.error('Please select employee type')
      return
    }
    if (employeeType === 'Teacher' && subjects.length === 0) {
      toast.error('Please select or add at least one subject for the teacher')
      return
    }

    setIsPreview(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      const orgId = user?.institutionId || localStorage.getItem('lastRegisteredOrgId') || ''
      if (orgId) {
        formData.append('organization_id', orgId)
      }
      formData.append('employee_first_name', firstName.trim())
      if (lastName.trim()) formData.append('employee_last_name', lastName.trim())
      formData.append('employee_email', email.trim())
      formData.append('employee_mobile_number', mobile.trim())
      formData.append('employee_type', employeeType)

      if (panNumber.trim()) formData.append('employee_pan_number', panNumber.trim())
      if (panFile) formData.append('panFile', panFile)

      if (aadharNumber.trim()) formData.append('employee_aadhar_number', aadharNumber.trim())
      if (aadharFile) formData.append('aadharFile', aadharFile)

      if (experience.trim()) formData.append('employee_experience', experience.trim())
      if (previousInstitute.trim()) {
        formData.append('employee_previous_work_institute_name', previousInstitute.trim())
      }
      if (expLetterFile) formData.append('expLetterFile', expLetterFile)
      if (relievingLetterFile) formData.append('relievingLetterFile', relievingLetterFile)

      if (subjects.length > 0) {
        formData.append('subjects', JSON.stringify(subjects))
      }

      if (additionalDocs.length > 0) {
        const docMeta: Array<{ docName: string }> = []
        additionalDocs.forEach((doc) => {
          docMeta.push({ docName: doc.docName || 'Document' })
          if (doc.file) {
            formData.append('additionalFiles', doc.file)
          }
        })
        formData.append('additional_documents', JSON.stringify(docMeta))
      }

      if (isEditMode && initialData?.id) {
        await apiClient.patch(`/staff-details/${initialData.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        setIsSubmitted(true)
        toast.success(`Staff member "${firstName} ${lastName}" updated successfully!`)
      } else {
        await apiClient.post('/staff-details', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        setIsSubmitted(true)
        toast.success(`Staff member "${firstName} ${lastName}" created and uploaded to MinIO successfully!`)
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err: any) {
      console.error('Staff submission error:', err)
      toast.error(formatApiClientError(err, 'Failed to save staff details. Please try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    if (isEditMode && initialData) {
      setFirstName(initialData.employee_first_name || '')
      setLastName(initialData.employee_last_name || '')
      setEmail(initialData.employee_email || '')
      setMobile(initialData.employee_mobile_number || '')
      setPanNumber(initialData.employee_pan_number || '')
      setPanFile(null)
      setAadharNumber(initialData.employee_aadhar_number || '')
      setAadharFile(null)
      setExperience(initialData.employee_experience || '')
      setPreviousInstitute(initialData.employee_previous_work_institute_name || '')
      setExpLetterFile(null)
      setRelievingLetterFile(null)
      setAdditionalDocs([])
      setEmployeeType((initialData.employee_type as any) || '')
      setSubjects(initialData.subjects || [])
      setIsPreview(false)
      setIsSubmitted(false)
    } else {
      setFirstName('')
      setLastName('')
      setEmail('')
      setMobile('')
      setPanNumber('')
      setPanFile(null)
      setAadharNumber('')
      setAadharFile(null)
      setExperience('')
      setPreviousInstitute('')
      setExpLetterFile(null)
      setRelievingLetterFile(null)
      setAdditionalDocs([])
      setEmployeeType('')
      setSubjects([])
      setIsPreview(false)
      setIsSubmitted(false)
    }
  }

  // ── Success View ──────────────────────────────────────────────────────────
  if (isSubmitted) {
    return (
      <div className="w-full bg-white/95 rounded-2xl p-8 lg:p-12 border border-[var(--gold)]/30 shadow-md text-center max-w-2xl mx-auto animate-fadeIn my-6">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-5 shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h2 className="text-2xl lg:text-3xl font-serif font-bold text-[var(--navy)]">
          {isEditMode ? 'Staff Updated Successfully!' : 'Staff Created Successfully!'}
        </h2>

        <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-md mx-auto leading-relaxed">
          <strong className="text-[var(--navy)]">{firstName} {lastName}</strong> has been{' '}
          {isEditMode ? 'updated with the latest changes' : 'registered as a'}{' '}
          <span className="font-semibold text-[var(--gold)]">{employeeType}</span>.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={handleReset}
            className="rounded-xl border-[var(--gold)] text-[var(--navy)] hover:bg-[var(--gold)]/10 font-bold px-5"
          >
            <Plus className="w-4 h-4 mr-1.5 text-[var(--gold)]" />
            {isEditMode ? 'Reset Changes' : 'Create Another Staff'}
          </Button>

          <Button
            size="md"
            onClick={onBack}
            className="rounded-xl bg-[var(--navy)] text-white hover:bg-[var(--deep-navy)] font-bold px-6 shadow-md"
          >
            Back to User Management
          </Button>
        </div>
      </div>
    )
  }

  // ── Preview View ──────────────────────────────────────────────────────────
  if (isPreview) {
    return (
      <div className="w-full flex flex-col gap-6 animate-fadeIn pb-12">
        <FileViewerModal viewing={viewingFile} onClose={handleCloseViewer} />
        {/* Preview Header */}
        <div className="bg-white/95 rounded-2xl p-5 lg:p-6 border border-[var(--border)] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--gold)]/15 text-[var(--navy)] border border-[var(--gold)]/30">
                Step 2: Verification
              </span>
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Ready for submission
              </span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-[var(--navy)] mt-1.5">
              Review Staff Details
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Please verify all employee personal details, uploaded certificates, and assigned role before submitting.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsPreview(false)}
              className="rounded-xl border-[var(--border)] bg-white text-[var(--navy)] hover:bg-[var(--cream)] font-bold text-xs gap-1.5 shadow-2xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Edit Details</span>
            </Button>

            <Button
              size="md"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="rounded-xl bg-[var(--navy)] text-white hover:bg-[var(--deep-navy)] font-bold text-xs gap-2 shadow-md hover:shadow-lg cursor-pointer px-5 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[var(--gold)]" />
                  <span>Uploading to MinIO...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[var(--gold)]" />
                  <span>{isEditMode ? 'Save & Update Staff' : 'Confirm & Submit'}</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Preview Structured Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Identity & Contact Info */}
          <div className="bg-white/95 rounded-2xl p-6 border border-[var(--border)] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 pb-3.5 border-b border-[var(--border)]/70">
                <div className="w-9 h-9 rounded-xl bg-[var(--cream)] text-[var(--gold)] flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--navy)] uppercase tracking-wider">
                    Personal &amp; Contact Information
                  </h3>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    Primary identity and government identification
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
                <div className="p-3 rounded-xl bg-[var(--cream)]/30 border border-[var(--border)]/60">
                  <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] tracking-wider">
                    Full Name
                  </span>
                  <p className="font-bold text-[var(--navy)] text-sm mt-0.5">
                    {firstName} {lastName || '—'}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[var(--cream)]/30 border border-[var(--border)]/60">
                  <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] tracking-wider">
                    Email Address
                  </span>
                  <p className="font-semibold text-[var(--navy)] text-xs mt-0.5 truncate" title={email}>
                    {email}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[var(--cream)]/30 border border-[var(--border)]/60">
                  <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] tracking-wider">
                    Mobile Number
                  </span>
                  <p className="font-mono font-semibold text-[var(--navy)] text-xs mt-0.5">
                    {mobile}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[var(--cream)]/30 border border-[var(--border)]/60">
                  <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] tracking-wider">
                    Employee Category
                  </span>
                  <p className="font-bold text-[var(--gold)] text-xs mt-0.5">
                    {employeeType}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[var(--cream)]/30 border border-[var(--border)]/60">
                  <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] tracking-wider">
                    PAN Card Number
                  </span>
                  <p className="font-mono font-bold text-[var(--navy)] text-xs mt-0.5">
                    {panNumber || 'Not provided'}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[var(--cream)]/30 border border-[var(--border)]/60">
                  <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] tracking-wider">
                    Aadhar Card Number
                  </span>
                  <p className="font-mono font-bold text-[var(--navy)] text-xs mt-0.5">
                    {aadharNumber || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Professional Experience & Subjects */}
          <div className="bg-white/95 rounded-2xl p-6 border border-[var(--border)] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 pb-3.5 border-b border-[var(--border)]/70">
                <div className="w-9 h-9 rounded-xl bg-[var(--cream)] text-[var(--gold)] flex items-center justify-center font-bold">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--navy)] uppercase tracking-wider">
                    Experience &amp; Specialization
                  </h3>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    Work history, institute details, and teaching subjects
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
                <div className="p-3 rounded-xl bg-[var(--cream)]/30 border border-[var(--border)]/60">
                  <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] tracking-wider">
                    Total Experience
                  </span>
                  <p className="font-bold text-[var(--navy)] text-sm mt-0.5">
                    {experience ? `${experience} Years` : 'Fresh / None'}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[var(--cream)]/30 border border-[var(--border)]/60">
                  <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] tracking-wider">
                    Previous Institute
                  </span>
                  <p className="font-semibold text-[var(--navy)] text-xs mt-0.5 truncate" title={previousInstitute}>
                    {previousInstitute || 'None / First Appointment'}
                  </p>
                </div>
              </div>

              {/* Subjects (If Teacher) */}
              {employeeType === 'Teacher' && (
                <div className="mt-4 pt-4 border-t border-[var(--border)]/60">
                  <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] tracking-wider block mb-2">
                    Assigned Subjects ({subjects.length})
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {subjects.map((sub) => (
                      <span
                        key={sub}
                        className="px-3 py-1 rounded-lg text-xs font-semibold bg-[var(--gold)]/15 text-[var(--navy)] border border-[var(--gold)]/30"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card 3: Uploaded Documents Verification */}
        <div className="bg-white/95 rounded-2xl p-6 border border-[var(--border)] shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-[var(--border)]/70 mb-5 gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[var(--cream)] text-[var(--gold)] flex items-center justify-center font-bold shadow-2xs border border-[var(--gold)]/20">
                <FileText className="w-5 h-5 text-[var(--navy)]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--navy)] uppercase tracking-wider">
                  Uploaded Verification Files
                </h3>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Documents attached with this registration for compliance &amp; HR records
                </p>
              </div>
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[var(--cream)]/60 text-[var(--navy)] border border-[var(--gold)]/30 self-start sm:self-auto">
              MinIO Storage: <code className="font-mono font-bold text-[var(--gold)]">organization-details/staff-details/</code>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* PAN Card File */}
            <div className="p-4 rounded-xl border border-[var(--border)]/80 bg-white hover:border-[var(--gold)]/60 hover:shadow-xs transition-all flex items-center justify-between gap-3 min-w-0">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl bg-[var(--cream)]/60 border border-[var(--gold)]/30 text-[var(--navy)] flex items-center justify-center shrink-0 shadow-2xs">
                  <CreditCard className="w-5 h-5 text-[var(--gold)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-xs text-[var(--navy)] block truncate">
                    PAN Card Document
                  </span>
                  {panFile ? (
                    <div className="flex items-center gap-1.5 mt-0.5 min-w-0" title={panFile.name}>
                      <span className="text-[11px] text-[var(--text-secondary)] font-medium truncate block max-w-full">
                        {panFile.name}
                      </span>
                      <span className="text-[10px] text-gray-400 shrink-0 font-mono">
                        ({formatFileSize(panFile.size)})
                      </span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-gray-400 italic block mt-0.5">
                      No file attached
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold shadow-2xs ${
                    panFile
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {panFile ? 'Attached' : 'Missing'}
                </span>

                {panFile && (
                  <button
                    type="button"
                    onClick={() => handleViewFile(panFile, 'PAN Card Document')}
                    className="h-7 px-2.5 rounded-lg border border-[var(--gold)] text-[var(--navy)] bg-white hover:bg-[var(--gold)]/10 hover:border-[var(--gold)] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
                    title="View PAN Card Document"
                  >
                    <Eye className="w-3.5 h-3.5 text-[var(--gold)]" />
                    <span>View</span>
                  </button>
                )}
              </div>
            </div>

            {/* Aadhar Card File */}
            <div className="p-4 rounded-xl border border-[var(--border)]/80 bg-white hover:border-[var(--gold)]/60 hover:shadow-xs transition-all flex items-center justify-between gap-3 min-w-0">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl bg-[var(--cream)]/60 border border-[var(--gold)]/30 text-[var(--navy)] flex items-center justify-center shrink-0 shadow-2xs">
                  <ShieldCheck className="w-5 h-5 text-[var(--gold)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-xs text-[var(--navy)] block truncate">
                    Aadhar Card Document
                  </span>
                  {aadharFile ? (
                    <div className="flex items-center gap-1.5 mt-0.5 min-w-0" title={aadharFile.name}>
                      <span className="text-[11px] text-[var(--text-secondary)] font-medium truncate block max-w-full">
                        {aadharFile.name}
                      </span>
                      <span className="text-[10px] text-gray-400 shrink-0 font-mono">
                        ({formatFileSize(aadharFile.size)})
                      </span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-gray-400 italic block mt-0.5">
                      No file attached
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold shadow-2xs ${
                    aadharFile
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {aadharFile ? 'Attached' : 'Missing'}
                </span>

                {aadharFile && (
                  <button
                    type="button"
                    onClick={() => handleViewFile(aadharFile, 'Aadhar Card Document')}
                    className="h-7 px-2.5 rounded-lg border border-[var(--gold)] text-[var(--navy)] bg-white hover:bg-[var(--gold)]/10 hover:border-[var(--gold)] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
                    title="View Aadhar Card Document"
                  >
                    <Eye className="w-3.5 h-3.5 text-[var(--gold)]" />
                    <span>View</span>
                  </button>
                )}
              </div>
            </div>

            {/* Experience Letter File */}
            <div className="p-4 rounded-xl border border-[var(--border)]/80 bg-white hover:border-[var(--gold)]/60 hover:shadow-xs transition-all flex items-center justify-between gap-3 min-w-0">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl bg-[var(--cream)]/60 border border-[var(--gold)]/30 text-[var(--navy)] flex items-center justify-center shrink-0 shadow-2xs">
                  <Briefcase className="w-5 h-5 text-[var(--gold)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-xs text-[var(--navy)] block truncate">
                    Experience Letter
                  </span>
                  {expLetterFile ? (
                    <div className="flex items-center gap-1.5 mt-0.5 min-w-0" title={expLetterFile.name}>
                      <span className="text-[11px] text-[var(--text-secondary)] font-medium truncate block max-w-full">
                        {expLetterFile.name}
                      </span>
                      <span className="text-[10px] text-gray-400 shrink-0 font-mono">
                        ({formatFileSize(expLetterFile.size)})
                      </span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-gray-400 italic block mt-0.5">
                      Optional (Not attached)
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold shadow-2xs ${
                    expLetterFile
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {expLetterFile ? 'Attached' : 'Optional'}
                </span>

                {expLetterFile && (
                  <button
                    type="button"
                    onClick={() => handleViewFile(expLetterFile, 'Experience Letter')}
                    className="h-7 px-2.5 rounded-lg border border-[var(--gold)] text-[var(--navy)] bg-white hover:bg-[var(--gold)]/10 hover:border-[var(--gold)] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
                    title="View Experience Letter"
                  >
                    <Eye className="w-3.5 h-3.5 text-[var(--gold)]" />
                    <span>View</span>
                  </button>
                )}
              </div>
            </div>

            {/* Relieving Letter File */}
            <div className="p-4 rounded-xl border border-[var(--border)]/80 bg-white hover:border-[var(--gold)]/60 hover:shadow-xs transition-all flex items-center justify-between gap-3 min-w-0">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl bg-[var(--cream)]/60 border border-[var(--gold)]/30 text-[var(--navy)] flex items-center justify-center shrink-0 shadow-2xs">
                  <FileText className="w-5 h-5 text-[var(--gold)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-xs text-[var(--navy)] block truncate">
                    Relieving Letter
                  </span>
                  {relievingLetterFile ? (
                    <div className="flex items-center gap-1.5 mt-0.5 min-w-0" title={relievingLetterFile.name}>
                      <span className="text-[11px] text-[var(--text-secondary)] font-medium truncate block max-w-full">
                        {relievingLetterFile.name}
                      </span>
                      <span className="text-[10px] text-gray-400 shrink-0 font-mono">
                        ({formatFileSize(relievingLetterFile.size)})
                      </span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-gray-400 italic block mt-0.5">
                      Optional (Not attached)
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold shadow-2xs ${
                    relievingLetterFile
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {relievingLetterFile ? 'Attached' : 'Optional'}
                </span>

                {relievingLetterFile && (
                  <button
                    type="button"
                    onClick={() => handleViewFile(relievingLetterFile, 'Relieving Letter')}
                    className="h-7 px-2.5 rounded-lg border border-[var(--gold)] text-[var(--navy)] bg-white hover:bg-[var(--gold)]/10 hover:border-[var(--gold)] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
                    title="View Relieving Letter"
                  >
                    <Eye className="w-3.5 h-3.5 text-[var(--gold)]" />
                    <span>View</span>
                  </button>
                )}
              </div>
            </div>

            {/* Additional Documents */}
            {additionalDocs.map((doc, idx) => (
              <div
                key={doc.id}
                className="p-4 rounded-xl border border-[var(--border)]/80 bg-white hover:border-[var(--gold)]/60 hover:shadow-xs transition-all flex items-center justify-between gap-3 min-w-0"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-[var(--cream)]/60 border border-[var(--gold)]/30 text-[var(--navy)] flex items-center justify-center shrink-0 shadow-2xs">
                    <FileText className="w-5 h-5 text-[var(--gold)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-xs text-[var(--navy)] block truncate">
                      {doc.docName || `Additional Document #${idx + 1}`}
                    </span>
                    {doc.file ? (
                      <div className="flex items-center gap-1.5 mt-0.5 min-w-0" title={doc.file.name}>
                        <span className="text-[11px] text-[var(--text-secondary)] font-medium truncate block max-w-full">
                          {doc.file.name}
                        </span>
                        <span className="text-[10px] text-gray-400 shrink-0 font-mono">
                          ({formatFileSize(doc.file.size)})
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-gray-400 italic block mt-0.5">
                        No file attached
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold shadow-2xs ${
                      doc.file
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {doc.file ? 'Attached' : 'Pending'}
                  </span>

                  {doc.file && (
                    <button
                      type="button"
                      onClick={() => handleViewFile(doc.file, doc.docName || `Additional Doc #${idx + 1}`)}
                      className="h-7 px-2.5 rounded-lg border border-[var(--gold)] text-[var(--navy)] bg-white hover:bg-[var(--gold)]/10 hover:border-[var(--gold)] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
                      title={`View ${doc.docName || 'Document'}`}
                    >
                      <Eye className="w-3.5 h-3.5 text-[var(--gold)]" />
                      <span>View</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsPreview(false)}
            className="rounded-xl border-[var(--gold)] text-[var(--navy)] hover:bg-[var(--gold)]/10 font-bold px-5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Edit Form
          </Button>

          <Button
            size="md"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-xl bg-[var(--navy)] text-white hover:bg-[var(--deep-navy)] font-bold px-8 shadow-md hover:shadow-lg cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-[var(--gold)]" />
                <span>Uploading to MinIO...</span>
              </>
            ) : (
              <>
                <span>{isEditMode ? 'Update Staff Member' : 'Submit Staff Registration'}</span>
                <ArrowRight className="w-4 h-4 ml-2 text-[var(--gold)]" />
              </>
            )}
          </Button>
        </div>
      </div>
    )
  }

  // ── Main Form View ────────────────────────────────────────────────────────
  return (
    <div className="w-full flex flex-col gap-6 animate-fadeIn pb-12">
      <FileViewerModal viewing={viewingFile} onClose={handleCloseViewer} />
      {/* ── Form Top Navigation Bar ────────────────────────────────────────── */}
      <div className="bg-white/95 rounded-2xl p-5 lg:p-6 border border-[var(--border)] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--gold)] hover:underline mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Users Directory
          </button>
          <h2 className="text-2xl font-serif font-bold text-[var(--navy)] flex items-center gap-2">
            {isEditMode ? 'Edit Staff Details' : 'Create Staff Member'}
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {isEditMode
              ? 'Update employee details, past experience, statutory certificates, and departmental assignment below.'
              : 'Fill in the employee details, past experience, statutory certificates, and departmental assignment below.'}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Button
            variant="outline"
            size="md"
            onClick={onBack}
            className="rounded-xl border-[var(--border)] bg-white text-[var(--navy)] hover:bg-[var(--cream)] font-bold text-xs cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            size="md"
            onClick={handleGoToPreview}
            className="rounded-xl bg-[var(--navy)] text-white hover:bg-[var(--deep-navy)] font-bold text-xs gap-2 shadow-sm hover:shadow cursor-pointer px-5"
          >
            <span>Preview Details</span>
            <ArrowRight className="w-4 h-4 text-[var(--gold)]" />
          </Button>
        </div>
      </div>

      {/* ── Section 1: Basic & Identity Information ───────────────────────── */}
      <div className="bg-white/95 rounded-2xl p-6 border border-[var(--border)] shadow-sm">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[var(--border)]/70 mb-5">
          <div className="w-9 h-9 rounded-xl bg-[#F5EEDB] text-[var(--gold)] flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--navy)] uppercase tracking-wider">
              1. Basic &amp; Contact Information
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Personal identity and official communication credentials
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* First Name */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider mb-1.5">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="e.g. Ramesh"
              className="w-full h-10 px-3.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-xs text-[var(--navy)] focus:outline-none focus:border-[var(--gold)] placeholder:text-[var(--text-muted)] transition-colors shadow-2xs"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider mb-1.5">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="e.g. Sharma"
              className="w-full h-10 px-3.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-xs text-[var(--navy)] focus:outline-none focus:border-[var(--gold)] placeholder:text-[var(--text-muted)] transition-colors shadow-2xs"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ramesh@institution.edu"
                className="w-full h-10 pl-9 pr-3.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-xs text-[var(--navy)] focus:outline-none focus:border-[var(--gold)] placeholder:text-[var(--text-muted)] transition-colors shadow-2xs"
              />
              <Mail className="w-4 h-4 text-[var(--gold)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider mb-1.5">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full h-10 pl-9 pr-3.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-xs font-mono text-[var(--navy)] focus:outline-none focus:border-[var(--gold)] placeholder:text-[var(--text-muted)] transition-colors shadow-2xs"
              />
              <Phone className="w-4 h-4 text-[var(--gold)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* PAN & Aadhar Verification Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5 pt-5 border-t border-[var(--border)]/60">
          {/* PAN Card Block */}
          <div className="p-4 rounded-xl bg-[var(--cream)]/25 border border-[var(--border)]/70 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[var(--gold)]" />
              <span className="text-xs font-bold text-[var(--navy)] uppercase tracking-wider">
                PAN Card Identification
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10.5px] font-semibold text-[var(--text-muted)] uppercase mb-1">
                  PAN Number
                </label>
                <input
                  type="text"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  maxLength={10}
                  placeholder="ABCDE1234F"
                  className="w-full h-10 px-3 rounded-xl border border-[var(--border)] bg-white text-xs font-mono font-bold text-[var(--navy)] uppercase focus:outline-none focus:border-[var(--gold)]"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-semibold text-[var(--text-muted)] uppercase mb-1">
                  Upload PAN File
                </label>
                <input
                  ref={panInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => setPanFile(e.target.files?.[0] || null)}
                />
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => panInputRef.current?.click()}
                    className="flex-1 h-10 px-3 rounded-xl border border-dashed border-[var(--gold)]/60 bg-white hover:bg-[var(--cream)]/40 flex items-center justify-between text-xs text-[var(--navy)] transition-colors cursor-pointer min-w-0"
                  >
                    <span className="truncate text-[11px] font-medium" title={panFile ? panFile.name : undefined}>
                      {panFile ? panFile.name : 'Select PAN file (.pdf, .img)'}
                    </span>
                    <Upload className="w-3.5 h-3.5 text-[var(--gold)] shrink-0 ml-1" />
                  </button>
                  {panFile && (
                    <button
                      type="button"
                      onClick={() => handleViewFile(panFile, 'PAN Card Document')}
                      className="h-10 px-2.5 rounded-xl border border-[var(--gold)]/60 bg-white hover:bg-[var(--gold)]/10 text-[var(--navy)] flex items-center justify-center shrink-0 cursor-pointer shadow-2xs"
                      title="View uploaded PAN Document"
                    >
                      <Eye className="w-3.5 h-3.5 text-[var(--gold)]" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Aadhar Card Block */}
          <div className="p-4 rounded-xl bg-[var(--cream)]/25 border border-[var(--border)]/70 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--gold)]" />
              <span className="text-xs font-bold text-[var(--navy)] uppercase tracking-wider">
                Aadhar Card Identification
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10.5px] font-semibold text-[var(--text-muted)] uppercase mb-1">
                  Aadhar Number
                </label>
                <input
                  type="text"
                  value={aadharNumber}
                  onChange={(e) => setAadharNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                  placeholder="12-digit number"
                  className="w-full h-10 px-3 rounded-xl border border-[var(--border)] bg-white text-xs font-mono font-bold text-[var(--navy)] focus:outline-none focus:border-[var(--gold)]"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-semibold text-[var(--text-muted)] uppercase mb-1">
                  Upload Aadhar File
                </label>
                <input
                  ref={aadharInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => setAadharFile(e.target.files?.[0] || null)}
                />
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => aadharInputRef.current?.click()}
                    className="flex-1 h-10 px-3 rounded-xl border border-dashed border-[var(--gold)]/60 bg-white hover:bg-[var(--cream)]/40 flex items-center justify-between text-xs text-[var(--navy)] transition-colors cursor-pointer min-w-0"
                  >
                    <span className="truncate text-[11px] font-medium" title={aadharFile ? aadharFile.name : undefined}>
                      {aadharFile ? aadharFile.name : 'Select Aadhar file (.pdf, .img)'}
                    </span>
                    <Upload className="w-3.5 h-3.5 text-[var(--gold)] shrink-0 ml-1" />
                  </button>
                  {aadharFile && (
                    <button
                      type="button"
                      onClick={() => handleViewFile(aadharFile, 'Aadhar Card Document')}
                      className="h-10 px-2.5 rounded-xl border border-[var(--gold)]/60 bg-white hover:bg-[var(--gold)]/10 text-[var(--navy)] flex items-center justify-center shrink-0 cursor-pointer shadow-2xs"
                      title="View uploaded Aadhar Document"
                    >
                      <Eye className="w-3.5 h-3.5 text-[var(--gold)]" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 2: Experience & Previous Employment ────────────────────── */}
      <div className="bg-white/95 rounded-2xl p-6 border border-[var(--border)] shadow-sm">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[var(--border)]/70 mb-5">
          <div className="w-9 h-9 rounded-xl bg-[#F5EEDB] text-[var(--gold)] flex items-center justify-center font-bold">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--navy)] uppercase tracking-wider">
              2. Experience &amp; Employment History
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Work experience record, previous institutions, and service verification letters
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Experience in Years */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider mb-1.5">
              Experience (In Years)
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="e.g. 4.5"
              className="w-full h-10 px-3.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-xs text-[var(--navy)] focus:outline-none focus:border-[var(--gold)] placeholder:text-[var(--text-muted)] transition-colors shadow-2xs"
            />
          </div>

          {/* Previous Work Institute Name */}
          <div className="lg:col-span-3">
            <label className="block text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider mb-1.5">
              Previous Work Institute Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={previousInstitute}
                onChange={(e) => setPreviousInstitute(e.target.value)}
                placeholder="e.g. St. Xavier International High School, Bangalore"
                className="w-full h-10 pl-9 pr-3.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-xs text-[var(--navy)] focus:outline-none focus:border-[var(--gold)] placeholder:text-[var(--text-muted)] transition-colors shadow-2xs"
              />
              <Building2 className="w-4 h-4 text-[var(--gold)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Experience Letter Upload */}
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider mb-1.5">
              Experience Letter Upload
            </label>
            <input
              ref={expLetterInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => setExpLetterFile(e.target.files?.[0] || null)}
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => expLetterInputRef.current?.click()}
                className="flex-1 h-11 px-3.5 rounded-xl border border-dashed border-[var(--gold)]/60 bg-[var(--cream)]/15 hover:bg-[var(--cream)]/40 flex items-center justify-between text-xs text-[var(--navy)] transition-colors cursor-pointer min-w-0"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <FileText className="w-4 h-4 text-[var(--gold)] shrink-0" />
                  <span className="truncate font-medium text-[11.5px]" title={expLetterFile ? expLetterFile.name : undefined}>
                    {expLetterFile ? expLetterFile.name : 'Choose Experience Letter (.pdf, .doc)'}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-[var(--gold)] text-white text-[10.5px] font-bold shrink-0 ml-2">
                  Browse
                </span>
              </button>
              {expLetterFile && (
                <button
                  type="button"
                  onClick={() => handleViewFile(expLetterFile, 'Experience Letter')}
                  className="h-11 px-3 rounded-xl border border-[var(--gold)]/60 bg-white hover:bg-[var(--gold)]/10 text-[var(--navy)] flex items-center justify-center shrink-0 cursor-pointer shadow-2xs"
                  title="View Experience Letter"
                >
                  <Eye className="w-4 h-4 text-[var(--gold)]" />
                </button>
              )}
            </div>
          </div>

          {/* Relieving Letter Upload */}
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider mb-1.5">
              Relieving Letter Upload
            </label>
            <input
              ref={relievingInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => setRelievingLetterFile(e.target.files?.[0] || null)}
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => relievingInputRef.current?.click()}
                className="flex-1 h-11 px-3.5 rounded-xl border border-dashed border-[var(--gold)]/60 bg-[var(--cream)]/15 hover:bg-[var(--cream)]/40 flex items-center justify-between text-xs text-[var(--navy)] transition-colors cursor-pointer min-w-0"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <FileText className="w-4 h-4 text-[var(--gold)] shrink-0" />
                  <span className="truncate font-medium text-[11.5px]" title={relievingLetterFile ? relievingLetterFile.name : undefined}>
                    {relievingLetterFile ? relievingLetterFile.name : 'Choose Relieving Letter (.pdf, .doc)'}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-[var(--gold)] text-white text-[10.5px] font-bold shrink-0 ml-2">
                  Browse
                </span>
              </button>
              {relievingLetterFile && (
                <button
                  type="button"
                  onClick={() => handleViewFile(relievingLetterFile, 'Relieving Letter')}
                  className="h-11 px-3 rounded-xl border border-[var(--gold)]/60 bg-white hover:bg-[var(--gold)]/10 text-[var(--navy)] flex items-center justify-center shrink-0 cursor-pointer shadow-2xs"
                  title="View Relieving Letter"
                >
                  <Eye className="w-4 h-4 text-[var(--gold)]" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Additional Files Section ────────────────────────────────────── */}
        <div className="mt-6 pt-5 border-t border-[var(--border)]/70">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs font-bold text-[var(--navy)] uppercase tracking-wider">
                Additional Documents (Optional)
              </span>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Add any supplementary degrees, background checks, or credentials with custom titles
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddAdditionalDoc}
              className="rounded-xl border-[var(--gold)] text-[var(--navy)] hover:bg-[var(--gold)]/10 font-bold text-xs gap-1.5 cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>Add Document</span>
            </Button>
          </div>

          {/* List of dynamic additional document rows */}
          {additionalDocs.length === 0 ? (
            <div className="py-5 text-center bg-gray-50/50 rounded-xl border border-dashed border-[var(--border)] text-xs text-[var(--text-muted)]">
              No additional documents added. Click &quot;Add Document&quot; above to attach extra files.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {additionalDocs.map((doc, idx) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-xl bg-white border border-[var(--border)] shadow-2xs flex flex-col sm:flex-row sm:items-center gap-3"
                >
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">
                      Document Title #{idx + 1}
                    </label>
                    <input
                      type="text"
                      value={doc.docName}
                      onChange={(e) => handleUpdateAdditionalDocName(doc.id, e.target.value)}
                      placeholder="e.g. Master's Degree Certificate / Police Verification"
                      className="w-full h-9 px-3 rounded-lg border border-[var(--border)] text-xs text-[var(--navy)] focus:outline-none focus:border-[var(--gold)] font-medium"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">
                      Upload File
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        id={`file_${doc.id}`}
                        className="hidden"
                        onChange={(e) =>
                          handleUpdateAdditionalDocFile(doc.id, e.target.files?.[0] || null)
                        }
                      />
                      <label
                        htmlFor={`file_${doc.id}`}
                        className="flex-1 h-9 px-3 rounded-lg border border-dashed border-[var(--gold)]/60 bg-[var(--cream)]/20 hover:bg-[var(--cream)]/40 flex items-center justify-between text-xs text-[var(--navy)] cursor-pointer truncate"
                      >
                        <span className="truncate text-[11px] font-medium">
                          {doc.file ? doc.file.name : 'Select file'}
                        </span>
                        <Upload className="w-3.5 h-3.5 text-[var(--gold)] shrink-0 ml-1" />
                      </label>

                      {doc.file && (
                        <button
                          type="button"
                          onClick={() => handleViewFile(doc.file, doc.docName || 'Additional Document')}
                          className="h-9 px-2.5 rounded-lg border border-[var(--gold)]/60 bg-white hover:bg-[var(--gold)]/10 text-[var(--navy)] flex items-center justify-center shrink-0 cursor-pointer shadow-2xs"
                          title="View Document"
                        >
                          <Eye className="w-3.5 h-3.5 text-[var(--gold)]" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveAdditionalDoc(doc.id)}
                        className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 cursor-pointer shrink-0"
                        title="Remove Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Section 3: Employee Type & Subjects ────────────────────────────── */}
      <div className="bg-white/95 rounded-2xl p-6 border border-[var(--border)] shadow-sm">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[var(--border)]/70 mb-5">
          <div className="w-9 h-9 rounded-xl bg-[#F5EEDB] text-[var(--gold)] flex items-center justify-center font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--navy)] uppercase tracking-wider">
              3. Employee Role &amp; Subject Allocation
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Specify the designation category and curricular subject assignments
            </p>
          </div>
        </div>

        {/* 3 Role Selection Cards */}
        <div>
          <label className="block text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider mb-2.5">
            Select Employee Type <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Option 1: Teacher */}
            <div
              onClick={() => setEmployeeType('Teacher')}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3.5 ${
                employeeType === 'Teacher'
                  ? 'border-[var(--gold)] bg-[var(--cream)]/40 shadow-xs scale-[1.01]'
                  : 'border-[var(--border)] bg-white hover:border-[var(--gold)]/40 hover:bg-gray-50/50'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                employeeType === 'Teacher' ? 'bg-[var(--navy)] text-[var(--gold)]' : 'bg-gray-100 text-gray-600'
              }`}>
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-[var(--navy)] text-sm">Teacher</h4>
                <p className="text-[11px] text-[var(--text-secondary)]">Academic &amp; teaching faculty</p>
              </div>
            </div>

            {/* Option 2: Non Staff */}
            <div
              onClick={() => setEmployeeType('Non Staff')}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3.5 ${
                employeeType === 'Non Staff'
                  ? 'border-[var(--gold)] bg-[var(--cream)]/40 shadow-xs scale-[1.01]'
                  : 'border-[var(--border)] bg-white hover:border-[var(--gold)]/40 hover:bg-gray-50/50'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                employeeType === 'Non Staff' ? 'bg-[var(--navy)] text-[var(--gold)]' : 'bg-gray-100 text-gray-600'
              }`}>
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-[var(--navy)] text-sm">Non Staff</h4>
                <p className="text-[11px] text-[var(--text-secondary)]">Administrative &amp; campus staff</p>
              </div>
            </div>

            {/* Option 3: Finance */}
            <div
              onClick={() => setEmployeeType('Finance')}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3.5 ${
                employeeType === 'Finance'
                  ? 'border-[var(--gold)] bg-[var(--cream)]/40 shadow-xs scale-[1.01]'
                  : 'border-[var(--border)] bg-white hover:border-[var(--gold)]/40 hover:bg-gray-50/50'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                employeeType === 'Finance' ? 'bg-[var(--navy)] text-[var(--gold)]' : 'bg-gray-100 text-gray-600'
              }`}>
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-[var(--navy)] text-sm">Finance</h4>
                <p className="text-[11px] text-[var(--text-secondary)]">Accounts, fees &amp; payroll</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── If Teacher: Dynamic Subject Allocation ───────────────────────── */}
        {employeeType === 'Teacher' && (
          <div className="mt-6 pt-5 border-t border-[var(--border)]/70 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <label className="block text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider">
                  Select Teaching Subjects <span className="text-red-500">*</span>
                </label>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Select all subjects taught by this teacher or add custom subjects below
                </p>
              </div>

              {/* Custom Subject Adder Input */}
              <form onSubmit={handleAddCustomSubject} className="flex items-center gap-2">
                <input
                  type="text"
                  value={customSubjectInput}
                  onChange={(e) => setCustomSubjectInput(e.target.value)}
                  placeholder="Add another subject..."
                  className="h-9 px-3 rounded-lg border border-[var(--border)] text-xs text-[var(--navy)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)]"
                />
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="rounded-lg border-[var(--gold)] text-[var(--navy)] hover:bg-[var(--gold)]/10 font-bold text-xs h-9 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 mr-1 text-[var(--gold)]" />
                  Add
                </Button>
              </form>
            </div>

            {/* Common Subject Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {COMMON_SUBJECTS.map((sub) => {
                const isSelected = subjects.includes(sub)
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => handleToggleSubject(sub)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[var(--navy)] text-white border-[var(--navy)] shadow-2xs scale-[1.02]'
                        : 'bg-white text-[var(--navy)] border-[var(--border)] hover:border-[var(--gold)] hover:bg-[var(--cream)]/30'
                    }`}
                  >
                    <BookOpen className={`w-3.5 h-3.5 ${isSelected ? 'text-[var(--gold)]' : 'text-gray-400'}`} />
                    <span>{sub}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[var(--gold)] ml-0.5" />}
                  </button>
                )
              })}
            </div>

            {/* Selected Subjects Badges List */}
            {subjects.length > 0 && (
              <div className="mt-4 p-3 rounded-xl bg-[var(--cream)]/30 border border-[var(--gold)]/30">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-[var(--navy)] block mb-2">
                  Assigned Subjects ({subjects.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {subjects.map((sub) => (
                    <span
                      key={sub}
                      className="px-2.5 py-1 rounded-lg bg-white border border-[var(--gold)]/40 text-[var(--navy)] text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>{sub}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubject(sub)}
                        className="text-gray-400 hover:text-rose-600 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Bottom Submit & Preview Bar ───────────────────────────────────── */}
      <div className="flex items-center justify-between p-4 bg-white/95 rounded-2xl border border-[var(--border)] shadow-sm">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={onBack}
          className="rounded-xl border-[var(--border)] bg-white text-[var(--navy)] hover:bg-[var(--cream)] font-bold text-xs cursor-pointer px-5"
        >
          Cancel
        </Button>

        <Button
          type="button"
          size="md"
          onClick={handleGoToPreview}
          className="rounded-xl bg-[var(--navy)] text-white hover:bg-[var(--deep-navy)] font-bold text-xs gap-2 shadow-sm hover:shadow cursor-pointer px-7 h-10"
        >
          <span>Preview Details &amp; Proceed</span>
          <ArrowRight className="w-4 h-4 text-[var(--gold)]" />
        </Button>
      </div>
    </div>
  )
}
