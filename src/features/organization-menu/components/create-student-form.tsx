import { useState, useRef, ChangeEvent } from 'react'
import {
  ArrowLeft,
  User,
  Users,
  MapPin,
  PhoneCall,
  Lock,
  Upload,
  X,
  Sparkles,
  Home,
  Mail,
  Phone,
  CreditCard,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/auth-context'
import { studentService, type StudentMember } from '../services/student.service'

interface CreateStudentFormProps {
  mode?: 'create' | 'edit'
  initialData?: StudentMember | null
  standard?: string
  onBack: () => void
  onSuccess?: () => void
}

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi NCR',
  'Chandigarh',
]

const RELATION_OPTIONS = [
  'Father',
  'Mother',
  'Guardian',
  'Grandfather',
  'Grandmother',
  'Uncle',
  'Aunt',
  'Brother',
  'Sister',
  'Other',
]

export function CreateStudentForm({
  mode = 'create',
  initialData,
  standard,
  onBack,
  onSuccess,
}: CreateStudentFormProps) {
  const { user } = useAuth()
  const effectiveStandard = standard || initialData?.standard || ''

  // ── Group 1: Student Basic & Identity Information ─────────────────────────
  const [studentName, setStudentName] = useState(initialData?.student_name || '')
  const [aadharNumber, setAadharNumber] = useState(initialData?.student_aadhar_number || '')
  const [aadharFile, setAadharFile] = useState<File | null>(null)
  const [contactMobile, setContactMobile] = useState(initialData?.contact_mobile || '')
  const [contactEmail, setContactEmail] = useState(initialData?.contact_email || '')

  // ── Group 2: Parent / Guardian Information ────────────────────────────────
  const [fatherName, setFatherName] = useState(initialData?.father_name || '')
  const [motherName, setMotherName] = useState(initialData?.mother_name || '')
  const [fatherMobile, setFatherMobile] = useState(initialData?.father_mobile || '')
  const [motherMobile, setMotherMobile] = useState(initialData?.mother_mobile || '')
  const [fatherEmail, setFatherEmail] = useState(initialData?.father_email || '')
  const [motherEmail, setMotherEmail] = useState(initialData?.mother_email || '')

  // ── Group 3: Residential & Address Details ─────────────────────────────────
  const [country, setCountry] = useState(initialData?.country || 'India')
  const [stateName, setStateName] = useState(initialData?.state || 'Karnataka')
  const [district, setDistrict] = useState(initialData?.district || '')
  const [currentAddress, setCurrentAddress] = useState(initialData?.current_address || '')
  const [permanentAddress, setPermanentAddress] = useState(initialData?.permanent_address || '')
  const [sameAsCurrent, setSameAsCurrent] = useState(false)

  // ── Group 4: Emergency Contact Information ────────────────────────────────
  const [emergencyName, setEmergencyName] = useState(initialData?.emergency_person_name || '')
  const [emergencyMobile, setEmergencyMobile] = useState(initialData?.emergency_person_mobile || '')
  const [emergencyRelation, setEmergencyRelation] = useState(initialData?.emergency_person_relation || 'Father')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const aadharInputRef = useRef<HTMLInputElement>(null)

  // Aadhaar input formatter (12 digits with spaced display)
  const handleAadharChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 12)
    setAadharNumber(raw)
  }

  const formatDisplayAadhar = (val: string) => {
    return val.replace(/(\d{4})(?=\d)/g, '$1 ')
  }

  // Address synchronization
  const handleToggleSameAsCurrent = (checked: boolean) => {
    setSameAsCurrent(checked)
    if (checked) {
      setPermanentAddress(currentAddress)
    }
  }

  const handleCurrentAddressChange = (val: string) => {
    setCurrentAddress(val)
    if (sameAsCurrent) {
      setPermanentAddress(val)
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size exceeds 10MB limit')
        return
      }
      setAadharFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!studentName.trim()) {
      toast.error('Please enter student full name')
      return
    }

    const orgId = user?.institutionId || localStorage.getItem('lastRegisteredOrgId') || undefined

    setIsSubmitting(true)
    try {
      if (mode === 'edit' && initialData) {
        await studentService.update(initialData.id, {
          organizationId: orgId,
          standard: effectiveStandard,
          studentName: studentName.trim(),
          aadharNumber: aadharNumber.trim() || undefined,
          aadharFile: aadharFile || undefined,
          contactMobile: contactMobile.trim() || undefined,
          contactEmail: contactEmail.trim() || undefined,
          fatherName: fatherName.trim() || undefined,
          motherName: motherName.trim() || undefined,
          fatherMobile: fatherMobile.trim() || undefined,
          motherMobile: motherMobile.trim() || undefined,
          fatherEmail: fatherEmail.trim() || undefined,
          motherEmail: motherEmail.trim() || undefined,
          country: country.trim() || 'India',
          state: stateName.trim() || undefined,
          district: district.trim() || undefined,
          currentAddress: currentAddress.trim() || undefined,
          permanentAddress: (sameAsCurrent ? currentAddress : permanentAddress).trim() || undefined,
          emergencyName: emergencyName.trim() || undefined,
          emergencyMobile: emergencyMobile.trim() || undefined,
          emergencyRelation: emergencyRelation || undefined,
        })

        toast.success(`Student "${studentName}" updated successfully!`)
      } else {
        await studentService.create({
          organizationId: orgId,
          standard: effectiveStandard,
          studentName: studentName.trim(),
          aadharNumber: aadharNumber.trim() || undefined,
          aadharFile: aadharFile || undefined,
          contactMobile: contactMobile.trim() || undefined,
          contactEmail: contactEmail.trim() || undefined,
          fatherName: fatherName.trim() || undefined,
          motherName: motherName.trim() || undefined,
          fatherMobile: fatherMobile.trim() || undefined,
          motherMobile: motherMobile.trim() || undefined,
          fatherEmail: fatherEmail.trim() || undefined,
          motherEmail: motherEmail.trim() || undefined,
          country: country.trim() || 'India',
          state: stateName.trim() || undefined,
          district: district.trim() || undefined,
          currentAddress: currentAddress.trim() || undefined,
          permanentAddress: (sameAsCurrent ? currentAddress : permanentAddress).trim() || undefined,
          emergencyName: emergencyName.trim() || undefined,
          emergencyMobile: emergencyMobile.trim() || undefined,
          emergencyRelation: emergencyRelation || undefined,
        })

        toast.success(`Student "${studentName}" enrolled in ${effectiveStandard} successfully!`)
      }

      onSuccess?.()
      onBack()
    } catch (err: any) {
      console.error('Failed to submit student form:', err)
      const errorMsg =
        err?.response?.data?.message || err?.message || 'Failed to save student details. Please verify the entered details.'
      toast.error(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 animate-fadeIn pb-12">
      {/* ── Top Header Card ─────────────────────────────────────────────── */}
      <div className="bg-white/95 rounded-2xl p-5 lg:p-6 border border-[var(--border)] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-xl border border-[var(--border)] bg-white hover:bg-[var(--cream)]/60 text-[var(--navy)] flex items-center justify-center shadow-2xs active:scale-95 transition-all cursor-pointer shrink-0"
            title="Back to Students Table"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--navy)]" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl lg:text-2xl font-serif font-bold text-[var(--navy)]">
                {mode === 'edit' ? 'Edit Student Details' : 'Student Enrollment Form'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--gold)]/15 text-[var(--navy)] border border-[var(--gold)]/30">
                {effectiveStandard}
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-medium">
              {mode === 'edit'
                ? 'Update student personal details, parent credentials, and residential info.'
                : 'Fill in student personal information, parent credentials, and residential details below.'}
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onBack}
            className="h-10 px-4 rounded-xl border border-[var(--border)] bg-white text-[var(--navy)] hover:bg-[var(--cream)]/60 font-semibold text-xs cursor-pointer shadow-2xs"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSubmitting}
            className="h-10 px-5 rounded-xl bg-[var(--navy)] hover:bg-[var(--deep-navy)] text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{mode === 'edit' ? 'Saving Changes...' : 'Enrolling Student...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>{mode === 'edit' ? 'Save Changes' : 'Enroll Student'}</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* ── Section 1: Student Basic & Identity Information ─────────────── */}
      <div className="bg-white/95 rounded-2xl p-6 lg:p-7 border border-[var(--border)] shadow-sm flex flex-col gap-5">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[var(--border)]/70">
          <div className="w-9 h-9 rounded-xl bg-[#F5EEDB] text-[var(--gold)] flex items-center justify-center font-bold">
            <User className="w-5 h-5 text-[var(--navy)]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--navy)] uppercase tracking-wider">
              1. Student Basic &amp; Identity Information
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Primary identification, government Aadhaar registration, and contact credentials
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* STD (Non-Editable with Hover Tooltip) */}
          <div className="relative group">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>STD / Class (Locked)</span>
              </label>
              <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 font-semibold">
                Non-editable
              </span>
            </div>

            <div
              title="You are creating student in this STD"
              className="relative w-full h-10 px-3.5 rounded-xl border border-amber-300/80 bg-amber-50/70 text-xs font-bold text-[var(--navy)] flex items-center justify-between cursor-not-allowed select-none transition-all group-hover:border-amber-500 group-hover:bg-amber-100/70 shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-white border border-amber-300 text-xs font-black text-[var(--navy)] shadow-2xs font-mono">
                  {standard}
                </span>
                <span className="text-[11px] text-amber-900/80 font-semibold hidden sm:inline">
                  (Selected STD)
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-amber-800 font-semibold">
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                <span>Locked</span>
              </div>

              {/* Floating Hover Tooltip */}
              <div className="absolute left-1/2 -top-10 -translate-x-1/2 hidden group-hover:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--navy)] text-white text-[11px] font-semibold whitespace-nowrap shadow-xl border border-[var(--gold)]/40 pointer-events-none z-30 animate-fadeIn">
                <span>You are creating student in this STD</span>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--navy)] rotate-45 border-r border-b border-[var(--gold)]/40" />
              </div>
            </div>
          </div>

          {/* Student Name */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider mb-1.5">
              Student Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g. Aarav Sharma"
              className="w-full h-10 px-3.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-xs font-medium text-[var(--navy)] focus:outline-none focus:border-[var(--gold)] placeholder:text-[var(--text-muted)] transition-colors shadow-2xs"
            />
          </div>

          {/* Student Aadhaar Card Number */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>Student Aadhaar Card Number</span>
            </label>
            <input
              type="text"
              maxLength={14}
              value={formatDisplayAadhar(aadharNumber)}
              onChange={(e) => handleAadharChange(e.target.value)}
              placeholder="xxxx xxxx xxxx"
              className="w-full h-10 px-3.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-xs font-mono font-bold text-[var(--navy)] focus:outline-none focus:border-[var(--gold)] placeholder:text-[var(--text-muted)] transition-colors shadow-2xs"
            />
          </div>

          {/* Upload Aadhaar Card */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>Upload Aadhaar Card (.pdf, .jpg, .png)</span>
            </label>
            <input
              ref={aadharInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => aadharInputRef.current?.click()}
                className="h-10 px-3.5 flex-1 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] hover:bg-[var(--cream)]/60 text-xs font-semibold text-[var(--navy)] flex items-center justify-between cursor-pointer transition-colors shadow-2xs text-left truncate"
              >
                <span className="truncate">
                  {aadharFile
                    ? aadharFile.name
                    : initialData?.student_aadhar_file_id
                    ? 'Current Document Uploaded (Click to replace)'
                    : 'Select Aadhaar Document'}
                </span>
                <Upload className="w-3.5 h-3.5 text-[var(--gold)] shrink-0 ml-2" />
              </button>
              {aadharFile && (
                <button
                  type="button"
                  onClick={() => setAadharFile(null)}
                  className="w-10 h-10 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 cursor-pointer transition-colors"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Student Mobile Number / Parents Mobile Number */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>Student / Parent Mobile Number</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-xs font-bold text-gray-500 font-mono select-none">
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                value={contactMobile}
                onChange={(e) => setContactMobile(e.target.value.replace(/\D/g, ''))}
                placeholder="98765 43210"
                className="w-full h-10 pl-11 pr-3.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-xs font-mono font-bold text-[var(--navy)] focus:outline-none focus:border-[var(--gold)] placeholder:text-[var(--text-muted)] transition-colors shadow-2xs"
              />
            </div>
          </div>

          {/* Student Email / Parents Email */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>Student / Parent Email Address</span>
            </label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="student.parent@institution.edu"
              className="w-full h-10 px-3.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-xs font-medium text-[var(--navy)] focus:outline-none focus:border-[var(--gold)] placeholder:text-[var(--text-muted)] transition-colors shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* ── Section 2: Parent / Guardian Information ─────────────────────── */}
      <div className="bg-white/95 rounded-2xl p-6 lg:p-7 border border-[var(--border)] shadow-sm flex flex-col gap-5">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[var(--border)]/70">
          <div className="w-9 h-9 rounded-xl bg-[#F5EEDB] text-[var(--gold)] flex items-center justify-center font-bold">
            <Users className="w-5 h-5 text-[var(--navy)]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--navy)] uppercase tracking-wider">
              2. Parent &amp; Guardian Information
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Father and mother particulars, communication numbers, and verified email accounts
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Student Father Name */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider mb-1.5">
              Father Name
            </label>
            <input
              type="text"
              value={fatherName}
              onChange={(e) => setFatherName(e.target.value)}
              placeholder="e.g. Rajesh Sharma"
              className="w-full h-10 px-3.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-xs font-medium text-[var(--navy)] focus:outline-none focus:border-[var(--gold)] placeholder:text-[var(--text-muted)] transition-colors shadow-2xs"
            />
          </div>

          {/* Father Mobile Number */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider mb-1.5">
              Father Mobile Number
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-xs font-bold text-gray-500 font-mono select-none">
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                value={fatherMobile}
                onChange={(e) => setFatherMobile(e.target.value.replace(/\D/g, ''))}
                placeholder="98451 11223"
                className="w-full h-10 pl-11 pr-3.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-xs font-mono font-semibold text-[var(--navy)] focus:outline-none focus:border-[var(--gold)] placeholder:text-[var(--text-muted)] transition-colors shadow-2xs"
              />
            </div>
          </div>

          {/* Father Email ID */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider mb-1.5">
              Father Email ID
            </label>
            <input
              type="email"
              value={fatherEmail}
              onChange={(e) => setFatherEmail(e.target.value)}
              placeholder="father.email@example.com"
              className="w-full h-10 px-3.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-xs font-medium text-[var(--navy)] focus:outline-none focus:border-[var(--gold)] placeholder:text-[var(--text-muted)] transition-colors shadow-2xs"
            />
          </div>

          {/* Student Mother Name */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider mb-1.5">
              Mother Name
            </label>
            <input
              type="text"
              value={motherName}
              onChange={(e) => setMotherName(e.target.value)}
              placeholder="e.g. Sunita Sharma"
              className="w-full h-10 px-3.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-xs font-medium text-[var(--navy)] focus:outline-none focus:border-[var(--gold)] placeholder:text-[var(--text-muted)] transition-colors shadow-2xs"
            />
          </div>

          {/* Mother Mobile Number */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider mb-1.5">
              Mother Mobile Number
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-xs font-bold text-gray-500 font-mono select-none">
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                value={motherMobile}
                onChange={(e) => setMotherMobile(e.target.value.replace(/\D/g, ''))}
                placeholder="97402 33445"
                className="w-full h-10 pl-11 pr-3.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-xs font-mono font-semibold text-[var(--navy)] focus:outline-none focus:border-[var(--gold)] placeholder:text-[var(--text-muted)] transition-colors shadow-2xs"
              />
            </div>
          </div>

          {/* Mother Email ID */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider mb-1.5">
              Mother Email ID
            </label>
            <input
              type="email"
              value={motherEmail}
              onChange={(e) => setMotherEmail(e.target.value)}
              placeholder="mother.email@example.com"
              className="w-full h-10 px-3.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-xs font-medium text-[var(--navy)] focus:outline-none focus:border-[var(--gold)] placeholder:text-[var(--text-muted)] transition-colors shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* ── Section 3: Residential & Address Details ─────────────────────── */}
      <div className="bg-white/95 rounded-2xl p-6 lg:p-7 border border-[var(--border)] shadow-sm flex flex-col gap-5">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[var(--border)]/70">
          <div className="w-9 h-9 rounded-xl bg-[#F5EEDB] text-[var(--gold)] flex items-center justify-center font-bold">
            <MapPin className="w-5 h-5 text-[var(--navy)]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--navy)] uppercase tracking-wider">
              3. Residential &amp; Address Details
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              State, country, district jurisdiction, and permanent postal addresses
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Country */}
            <div>
              <label className="block text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider mb-1.5">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. India"
                className="w-full h-10 px-3.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-xs font-medium text-[var(--navy)] focus:outline-none focus:border-[var(--gold)] placeholder:text-[var(--text-muted)] transition-colors shadow-2xs"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider mb-1.5">
                State / Province
              </label>
              <input
                type="text"
                list="student-states-list"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                placeholder="e.g. Karnataka"
                className="w-full h-10 px-3.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-xs font-medium text-[var(--navy)] focus:outline-none focus:border-[var(--gold)] placeholder:text-[var(--text-muted)] transition-colors shadow-2xs"
              />
              <datalist id="student-states-list">
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st} />
                ))}
              </datalist>
            </div>

            {/* District */}
            <div>
              <label className="block text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider mb-1.5">
                District
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Bengaluru Urban"
                className="w-full h-10 px-3.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-xs font-medium text-[var(--navy)] focus:outline-none focus:border-[var(--gold)] placeholder:text-[var(--text-muted)] transition-colors shadow-2xs"
              />
            </div>
          </div>

          {/* Current Address */}
          <div>
            <label className="text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>Current Residential Address</span>
            </label>
            <textarea
              rows={2}
              value={currentAddress}
              onChange={(e) => handleCurrentAddressChange(e.target.value)}
              placeholder="Door / Flat No., Building Name, Street, Landmark, Area, City"
              className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-xs text-[var(--navy)] focus:outline-none focus:border-[var(--gold)] placeholder:text-[var(--text-muted)] transition-colors shadow-2xs font-medium resize-none"
            />
          </div>

          {/* Permanent Address with Same As Current Toggle */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>Permanent Address</span>
              </label>
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--navy)] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={sameAsCurrent}
                  onChange={(e) => handleToggleSameAsCurrent(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-[var(--gold)] accent-[var(--gold)] cursor-pointer"
                />
                <span>Same as Current Address</span>
              </label>
            </div>
            <textarea
              rows={2}
              disabled={sameAsCurrent}
              value={sameAsCurrent ? currentAddress : permanentAddress}
              onChange={(e) => setPermanentAddress(e.target.value)}
              placeholder="Permanent domicile / hometown address"
              className={`w-full p-3 rounded-xl border border-[var(--border)] text-xs text-[var(--navy)] focus:outline-none focus:border-[var(--gold)] placeholder:text-[var(--text-muted)] transition-colors shadow-2xs font-medium resize-none ${
                sameAsCurrent ? 'bg-gray-100/70 text-gray-600 cursor-not-allowed' : 'bg-[var(--input-bg)]'
              }`}
            />
          </div>
        </div>
      </div>

      {/* ── Section 4: Emergency Contact Information ─────────────────────── */}
      <div className="bg-white/95 rounded-2xl p-6 lg:p-7 border border-[var(--border)] shadow-sm flex flex-col gap-5">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[var(--border)]/70">
          <div className="w-9 h-9 rounded-xl bg-[#F5EEDB] text-[var(--gold)] flex items-center justify-center font-bold">
            <PhoneCall className="w-5 h-5 text-[var(--navy)]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--navy)] uppercase tracking-wider">
              4. Emergency Contact Information
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Primary emergency point of contact, direct contact line, and relation to student
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Emergency Person Name */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider mb-1.5">
              Emergency Person Name
            </label>
            <input
              type="text"
              value={emergencyName}
              onChange={(e) => setEmergencyName(e.target.value)}
              placeholder="e.g. Rajesh Sharma"
              className="w-full h-10 px-3.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-xs font-medium text-[var(--navy)] focus:outline-none focus:border-[var(--gold)] placeholder:text-[var(--text-muted)] transition-colors shadow-2xs"
            />
          </div>

          {/* Emergency Person Mobile Number */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider mb-1.5">
              Emergency Mobile Number
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-xs font-bold text-gray-500 font-mono select-none">
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                value={emergencyMobile}
                onChange={(e) => setEmergencyMobile(e.target.value.replace(/\D/g, ''))}
                placeholder="98451 11223"
                className="w-full h-10 pl-11 pr-3.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-xs font-mono font-semibold text-[var(--navy)] focus:outline-none focus:border-[var(--gold)] placeholder:text-[var(--text-muted)] transition-colors shadow-2xs"
              />
            </div>
          </div>

          {/* Emergency Person Relation to Student */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider mb-1.5">
              Relation to Student
            </label>
            <select
              value={emergencyRelation}
              onChange={(e) => setEmergencyRelation(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-xs font-semibold text-[var(--navy)] focus:outline-none focus:border-[var(--gold)] transition-colors shadow-2xs cursor-pointer"
            >
              {RELATION_OPTIONS.map((rel) => (
                <option key={rel} value={rel}>
                  {rel}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Bottom Submit & Cancel Bar ──────────────────────────────────── */}
      <div className="bg-white/95 rounded-2xl p-5 border border-[var(--border)] shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
          <AlertCircle className="w-4 h-4 text-[var(--gold)] shrink-0" />
          <span>Student will be registered under <strong>{standard}</strong>.</span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onBack}
            className="h-10 px-4 rounded-xl border border-[var(--border)] bg-white text-[var(--navy)] hover:bg-[var(--cream)]/60 font-semibold text-xs cursor-pointer shadow-2xs"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSubmitting}
            className="h-10 px-6 rounded-xl bg-[var(--navy)] hover:bg-[var(--deep-navy)] text-white font-bold text-xs shadow-sm cursor-pointer flex items-center gap-2 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4 text-[var(--gold)]" />
            <span>{isSubmitting ? 'Enrolling Student...' : 'Create Student Record'}</span>
          </Button>
        </div>
      </div>
    </form>
  )
}
