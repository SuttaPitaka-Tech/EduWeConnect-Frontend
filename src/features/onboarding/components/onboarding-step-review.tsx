import { useFormContext } from 'react-hook-form'
import { Building2, FileText, UserCheck, ShieldCheck, Edit3, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui'
import { OnboardingReviewDocCard } from './onboarding-review-doc-card'
import { ORGANIZATION_TYPE_OPTIONS } from '../constants/constants'
import type { RegisterFormValues } from '../types/types'

interface OnboardingStepReviewProps {
  onBack: () => void
  onEditSection: (stepId: number) => void
  onSubmitClick: () => void
  onPreviewDoc: (file: File, title: string, key: string) => void
  onDownloadDoc: (file: File, key: string) => void
  previewingKey?: string | null
  downloadingKey?: string | null
}

export function OnboardingStepReview({
  onBack,
  onEditSection,
  onSubmitClick,
  onPreviewDoc,
  onDownloadDoc,
  previewingKey,
  downloadingKey
}: OnboardingStepReviewProps) {
  const { getValues, watch } = useFormContext<RegisterFormValues>()

  const panFile = watch('panFile')
  const gstFile = watch('gstFile')
  const regCertFile = watch('regCertFile')
  const orgHeadAadharFile = watch('orgHeadAadharFile')

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[var(--gold)]/15 text-[var(--gold)] flex items-center justify-center shadow-2xs">
            <ShieldCheck className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[var(--navy)] uppercase tracking-wider">
              Step 3: Review & Submit Application
            </h3>
            <p className="text-[11px] text-[var(--text-secondary)]">
              Please verify all institutional, compliance, and authorized signatory details before submission.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 text-xs">
        {/* Card 1: Institutional Information */}
        <div className="bg-white/85 border border-[var(--border)] p-4 sm:p-5 rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--border)]/60 pb-2.5">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[var(--gold)]" />
              <h4 className="font-bold text-[var(--navy)] uppercase tracking-wider text-xs">
                1. Institutional Information & Location
              </h4>
            </div>
            <button
              type="button"
              onClick={() => onEditSection(1)}
              className="text-[11px] font-semibold text-[var(--gold)] hover:underline flex items-center gap-1 bg-[var(--gold)]/10 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              <Edit3 className="w-3 h-3" /> Edit Section
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Field Card: Institution Name */}
            <div className="py-2.5 px-3.5 rounded-xl bg-white/70 hover:bg-white border border-[var(--border)]/70 transition-all shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                Institution Name
              </span>
              <p className="font-bold text-[var(--navy)] text-[13px] truncate mt-0.5" title={getValues('organizationName')}>
                {getValues('organizationName') || 'N/A'}
              </p>
            </div>

            {/* Field Card: Official Email */}
            <div className="py-2.5 px-3.5 rounded-xl bg-white/70 hover:bg-white border border-[var(--border)]/70 transition-all shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                Official Email
              </span>
              <p className="font-semibold text-[var(--navy)] truncate mt-0.5" title={getValues('organizationEmail')}>
                {getValues('organizationEmail')}
              </p>
            </div>

            {/* Field Card: Contact Mobile */}
            <div className="py-2.5 px-3.5 rounded-xl bg-white/70 hover:bg-white border border-[var(--border)]/70 transition-all shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                Contact Mobile
              </span>
              <p className="font-semibold text-[var(--navy)] mt-0.5">
                {getValues('organizationMobile') || 'N/A'}
              </p>
            </div>

            {/* Field Card: Institution Type */}
            <div className="py-2.5 px-3.5 rounded-xl bg-white/70 hover:bg-white border border-[var(--border)]/70 transition-all shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                Institution Type
              </span>
              <p className="font-semibold text-[var(--navy)] truncate mt-0.5">
                {ORGANIZATION_TYPE_OPTIONS.find(o => o.value === getValues('organizationType'))?.label || getValues('organizationType') || 'N/A'}
              </p>
            </div>

            {/* Field Card: City & District */}
            <div className="py-2.5 px-3.5 rounded-xl bg-white/70 hover:bg-white border border-[var(--border)]/70 transition-all shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                City & District
              </span>
              <p className="font-semibold text-[var(--navy)] mt-0.5">
                {getValues('city') || 'N/A'}, {getValues('district') || 'N/A'}
              </p>
            </div>

            {/* Field Card: State & PIN */}
            <div className="py-2.5 px-3.5 rounded-xl bg-white/70 hover:bg-white border border-[var(--border)]/70 transition-all shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                State & PIN
              </span>
              <p className="font-semibold text-[var(--navy)] mt-0.5">
                {getValues('state') || 'N/A'} - {getValues('pincode') || 'N/A'}
              </p>
            </div>

            {/* Field Card: Standards Offered */}
            <div className="py-2.5 px-3.5 rounded-xl bg-white/70 hover:bg-white border border-[var(--border)]/70 transition-all shadow-2xs sm:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                Standards Offered
              </span>
              {getValues('organization_std') && getValues('organization_std').length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mt-0.5">
                  {getValues('organization_std').map((std: string) => (
                    <span
                      key={std}
                      className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[var(--gold)]/15 text-[var(--navy)] border border-[var(--gold)]/30"
                    >
                      {std}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="font-semibold text-[var(--navy)] text-xs">Not Specified</p>
              )}
            </div>

            {/* Field Card: Campus Address */}
            <div className="py-2.5 px-3.5 rounded-xl bg-white/70 hover:bg-white border border-[var(--border)]/70 transition-all shadow-2xs sm:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                Campus Address
              </span>
              <p className="font-semibold text-[var(--navy)] mt-0.5 truncate" title={getValues('address')}>
                {getValues('address') || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Statutory & Compliance Documents */}
        <div className="bg-white/85 border border-[var(--border)] p-4 sm:p-5 rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--border)]/60 pb-2.5">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[var(--gold)]" />
              <h4 className="font-bold text-[var(--navy)] uppercase tracking-wider text-xs">
                2. Statutory & Compliance Documents
              </h4>
            </div>
            <button
              type="button"
              onClick={() => onEditSection(2)}
              className="text-[11px] font-semibold text-[var(--gold)] hover:underline flex items-center gap-1 bg-[var(--gold)]/10 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              <Edit3 className="w-3 h-3" /> Edit Section
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            <OnboardingReviewDocCard
              title="PAN Card Document"
              docNumberLabel="PAN"
              docNumber={getValues('panNumber')}
              file={panFile}
              docKey="pan"
              onPreview={onPreviewDoc}
              onDownload={onDownloadDoc}
              previewingKey={previewingKey}
              downloadingKey={downloadingKey}
            />
            <OnboardingReviewDocCard
              title="GST Certificate"
              docNumberLabel="GSTIN"
              docNumber={getValues('gstNumber')}
              file={gstFile}
              docKey="gst"
              onPreview={onPreviewDoc}
              onDownload={onDownloadDoc}
              previewingKey={previewingKey}
              downloadingKey={downloadingKey}
            />
            <OnboardingReviewDocCard
              title="Registration Certificate"
              docNumberLabel="Reg No"
              docNumber={getValues('regCertNumber')}
              file={regCertFile}
              docKey="regCert"
              onPreview={onPreviewDoc}
              onDownload={onDownloadDoc}
              previewingKey={previewingKey}
              downloadingKey={downloadingKey}
            />
          </div>
        </div>

        {/* Card 3: Head of Organization & Identity */}
        <div className="bg-white/85 border border-[var(--border)] p-4 sm:p-5 rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--border)]/60 pb-2.5">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[var(--gold)]" />
              <h4 className="font-bold text-[var(--navy)] uppercase tracking-wider text-xs">
                3. Head of Organization & Identity
              </h4>
            </div>
            <button
              type="button"
              onClick={() => onEditSection(2)}
              className="text-[11px] font-semibold text-[var(--gold)] hover:underline flex items-center gap-1 bg-[var(--gold)]/10 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              <Edit3 className="w-3 h-3" /> Edit Section
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {/* Field Cards: Head Personal & Identity Details (2 per row) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="py-2.5 px-3.5 rounded-xl bg-white/70 hover:bg-white border border-[var(--border)]/70 transition-all shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                  Authorized Head Name
                </span>
                <p className="font-bold text-[var(--navy)] text-[13px] mt-0.5">
                  {`${getValues('orgHeadFirstName')} ${getValues('orgHeadLastName')}`.trim() || 'N/A'}
                </p>
              </div>
              <div className="py-2.5 px-3.5 rounded-xl bg-white/70 hover:bg-white border border-[var(--border)]/70 transition-all shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                  Official Email
                </span>
                <p className="font-semibold text-[var(--navy)] truncate mt-0.5" title={getValues('orgHeadEmail')}>
                  {getValues('orgHeadEmail') || 'N/A'}
                </p>
              </div>
              <div className="py-2.5 px-3.5 rounded-xl bg-white/70 hover:bg-white border border-[var(--border)]/70 transition-all shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                  Contact Mobile
                </span>
                <p className="font-semibold text-[var(--navy)] mt-0.5">
                  {getValues('orgHeadMobile') || 'N/A'}
                </p>
              </div>
              <div className="py-2.5 px-3.5 rounded-xl bg-white/70 hover:bg-white border border-[var(--border)]/70 transition-all shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                  Aadhar Number
                </span>
                <p className="font-semibold text-[var(--navy)] mt-0.5">
                  {getValues('orgHeadAadharNumber') || 'N/A'}
                </p>
              </div>
            </div>

            {/* Inner Card 3B: Head Aadhar Document Attachment */}
            <OnboardingReviewDocCard
              title="Head Aadhar Card Attachment"
              file={orgHeadAadharFile}
              docKey="orgHeadAadhar"
              onPreview={onPreviewDoc}
              onDownload={onDownloadDoc}
              previewingKey={previewingKey}
              downloadingKey={downloadingKey}
            />
          </div>
        </div>
      </div>

      {/* Step 3 Actions */}
      <div className="flex justify-between items-center pt-3 border-t border-[var(--gold)]/20 mt-4">
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onBack}
          className="px-5 h-[42px] rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-[var(--warm-white)] border border-[var(--border)] text-[var(--navy)] hover:bg-[var(--beige)] shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </Button>
        
        <Button 
          type="button" 
          variant="gold" 
          onClick={onSubmitClick}
          className="px-7 h-[42px] rounded-xl font-bold text-[13.5px] flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          Submit Application <CheckCircle2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
