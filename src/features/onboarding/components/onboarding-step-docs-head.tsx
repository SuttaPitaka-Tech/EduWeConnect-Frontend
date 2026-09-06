import { useFormContext } from 'react-hook-form'
import { FileText, Mail, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { OnboardingFileUpload } from './onboarding-file-upload'
import type { RegisterFormValues } from '../types/types'

interface OnboardingStepDocsHeadProps {
  onBack: () => void
  onNext: () => void
  onPreviewDoc: (file: File, label: string) => void
}

export function OnboardingStepDocsHead({
  onBack,
  onNext,
  onPreviewDoc
}: OnboardingStepDocsHeadProps) {
  const {
    register,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext<RegisterFormValues>()

  const panFile = watch('panFile')
  const gstFile = watch('gstFile')
  const regCertFile = watch('regCertFile')
  const orgHeadAadharFile = watch('orgHeadAadharFile')

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* ── Sub-Section: Statutory Document Uploads ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-1">
          <FileText className="w-4 h-4 text-[var(--gold)]" />
          <h3 className="text-xs font-bold text-[var(--navy)] uppercase tracking-wider">
            Step 2: Statutory & Compliance Documents
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* PAN Number */}
          <div>
            <label className="block text-[11px] font-semibold text-[var(--navy)] uppercase mb-1">
              PAN Number *
            </label>
            <Input 
              {...register('panNumber')} 
              placeholder="e.g. ABCDE1234F" 
              maxLength={10} 
              error={!!errors.panNumber} 
              className="h-[40px] pl-3 rounded-xl text-[13px] uppercase" 
            />
            {errors.panNumber && (
              <p className="text-[11px] font-medium text-red-500 mt-0.5">
                {errors.panNumber.message as string}
              </p>
            )}
          </div>

          {/* Upload PAN Card */}
          <OnboardingFileUpload
            label="Upload PAN Card"
            required
            file={panFile}
            onFileSelect={(file) => setValue('panFile', file, { shouldValidate: true })}
            onPreview={onPreviewDoc}
            error={errors.panFile?.message as string}
          />

          {/* GST Number */}
          <div>
            <label className="block text-[11px] font-semibold text-[var(--navy)] uppercase mb-1">
              GST Number *
            </label>
            <Input 
              {...register('gstNumber')} 
              placeholder="15-digit GSTIN" 
              maxLength={15} 
              error={!!errors.gstNumber} 
              className="h-[40px] pl-3 rounded-xl text-[13px] uppercase" 
            />
            {errors.gstNumber && (
              <p className="text-[11px] font-medium text-red-500 mt-0.5">
                {errors.gstNumber.message as string}
              </p>
            )}
          </div>

          {/* Upload GST Certificate */}
          <OnboardingFileUpload
            label="Upload GST Certificate"
            required
            file={gstFile}
            onFileSelect={(file) => setValue('gstFile', file, { shouldValidate: true })}
            onPreview={onPreviewDoc}
            error={errors.gstFile?.message as string}
          />

          {/* Registration Certificate Number */}
          <div>
            <label className="block text-[11px] font-semibold text-[var(--navy)] uppercase mb-1">
              Registration Certificate Number *
            </label>
            <Input 
              {...register('regCertNumber')} 
              placeholder="e.g. REG-2024-XXXX" 
              error={!!errors.regCertNumber} 
              className="h-[40px] pl-3 rounded-xl text-[13px]" 
            />
            {errors.regCertNumber && (
              <p className="text-[11px] font-medium text-red-500 mt-0.5">
                {errors.regCertNumber.message as string}
              </p>
            )}
          </div>

          {/* Upload Registration Certificate */}
          <OnboardingFileUpload
            label="Upload Registration Certificate"
            required
            file={regCertFile}
            onFileSelect={(file) => setValue('regCertFile', file, { shouldValidate: true })}
            onPreview={onPreviewDoc}
            error={errors.regCertFile?.message as string}
          />
        </div>
      </div>

      {/* ── Sub-Section: Head of Organization Details ── */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2 pb-1">
          <Mail className="w-4 h-4 text-[var(--gold)]" />
          <h3 className="text-xs font-bold text-[var(--navy)] uppercase tracking-wider">
            Head of Organization & Authorized Signatory
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* First Name */}
          <div>
            <label className="block text-[11px] font-semibold text-[var(--navy)] uppercase mb-1">
              First Name *
            </label>
            <Input 
              {...register('orgHeadFirstName')} 
              placeholder="First Name" 
              error={!!errors.orgHeadFirstName} 
              className="h-[40px] pl-3 rounded-xl text-[13px]" 
            />
            {errors.orgHeadFirstName && (
              <p className="text-[11px] font-medium text-red-500 mt-0.5">
                {errors.orgHeadFirstName.message as string}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-[11px] font-semibold text-[var(--navy)] uppercase mb-1">
              Last Name *
            </label>
            <Input 
              {...register('orgHeadLastName')} 
              placeholder="Last Name" 
              error={!!errors.orgHeadLastName} 
              className="h-[40px] pl-3 rounded-xl text-[13px]" 
            />
            {errors.orgHeadLastName && (
              <p className="text-[11px] font-medium text-red-500 mt-0.5">
                {errors.orgHeadLastName.message as string}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] font-semibold text-[var(--navy)] uppercase mb-1">
              Official Head Email *
            </label>
            <Input 
              {...register('orgHeadEmail')} 
              placeholder="head@institution.edu" 
              error={!!errors.orgHeadEmail} 
              className="h-[40px] pl-3 rounded-xl text-[13px]" 
            />
            {errors.orgHeadEmail && (
              <p className="text-[11px] font-medium text-red-500 mt-0.5">
                {errors.orgHeadEmail.message as string}
              </p>
            )}
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-[11px] font-semibold text-[var(--navy)] uppercase mb-1">
              Head Contact Mobile *
            </label>
            <Input 
              {...register('orgHeadMobile')} 
              type="tel"
              inputMode="numeric"
              placeholder="10-digit Mobile" 
              maxLength={10} 
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                setValue('orgHeadMobile', val, { shouldValidate: !!errors.orgHeadMobile, shouldDirty: true })
              }}
              onBlur={() => trigger('orgHeadMobile')}
              error={!!errors.orgHeadMobile} 
              className="h-[40px] pl-3 rounded-xl text-[13px]" 
            />
            {errors.orgHeadMobile && (
              <p className="text-[11px] font-medium text-red-500 mt-0.5">
                {errors.orgHeadMobile.message as string}
              </p>
            )}
          </div>

          {/* Aadhar Number */}
          <div>
            <label className="block text-[11px] font-semibold text-[var(--navy)] uppercase mb-1">
              Aadhar Number *
            </label>
            <Input 
              {...register('orgHeadAadharNumber')} 
              type="tel"
              inputMode="numeric"
              placeholder="12-digit Aadhar Number" 
              maxLength={12} 
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 12)
                setValue('orgHeadAadharNumber', val, { shouldValidate: !!errors.orgHeadAadharNumber, shouldDirty: true })
              }}
              onBlur={() => trigger('orgHeadAadharNumber')}
              error={!!errors.orgHeadAadharNumber} 
              className="h-[40px] pl-3 rounded-xl text-[13px]" 
            />
            {errors.orgHeadAadharNumber && (
              <p className="text-[11px] font-medium text-red-500 mt-0.5">
                {errors.orgHeadAadharNumber.message as string}
              </p>
            )}
          </div>

          {/* Upload Aadhar */}
          <OnboardingFileUpload
            label="Upload Aadhar Card"
            required
            file={orgHeadAadharFile}
            onFileSelect={(file) => setValue('orgHeadAadharFile', file, { shouldValidate: true })}
            onPreview={onPreviewDoc}
            error={errors.orgHeadAadharFile?.message as string}
          />
        </div>
      </div>

      {/* Step 2 Actions */}
      <div className="flex justify-between items-center pt-3 border-t border-[var(--gold)]/20 mt-4">
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onBack}
          className="px-5 h-[42px] rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-[var(--warm-white)] border border-[var(--border)] text-[var(--navy)] hover:bg-[var(--beige)] shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </Button>
        
        <Button 
          type="button" 
          variant="gold" 
          onClick={onNext}
          className="px-6 h-[42px] rounded-xl font-bold text-[13.5px] flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all"
        >
          Next: Review <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
