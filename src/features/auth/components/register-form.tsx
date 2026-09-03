import { useState, useRef, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, ArrowRight, Home, Building2, Phone, MapPin, CheckCircle2, Upload, Plus, Trash2, FileText } from 'lucide-react'
import { Button, Input, Dropdown, Textarea } from '@/components/ui'
import { registerSchema, type RegisterFormValues } from '@/features/auth'
import { Country, State, City } from 'country-state-city'
import { buddhaBg } from '@/assets/images'

const ORGANIZATION_TYPE_OPTIONS = [
  { value: 'kinder_garden', label: 'Kinder Garden' },
  { value: 'pre_school', label: 'Pre School (Nursery, LKG, UKG)' },
  { value: 'school', label: 'School' },
  { value: 'school_with_puc', label: 'School with Pre University College' },
  { value: 'puc', label: 'Pre University College' },
  { value: 'college', label: 'College/University' },
]

// ── SVG Logos ────────────────────────────────────────────────────────────────

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.15v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.15C1.43 8.55 1 10.22 1 12s.43 3.45 1.15 4.93l3.69-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.15 7.07l3.69 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

function MicrosoftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="1" y="1" width="9" height="9" fill="#f25022" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
      <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
      <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
    </svg>
  )
}

export function RegisterForm() {
  const [step, setStep] = useState(1)
  const [otp, setOtp] = useState(['', '', '', ''])
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const {
    register,
    control,
    trigger,
    getValues,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      organizationEmail: '',
      organizationName: '',
      organizationMobile: '',
      organizationType: '',
      address: '',
      city: '',
      district: '',
      pincode: '',
      state: '',
      country: '',
      panNumber: '',
      panFile: null,
      gstNumber: '',
      gstFile: null,
      regCertNumber: '',
      regCertFile: null,
      otherDocuments: [],
    },
  })

  const { fields: otherDocs, append: appendOtherDoc, remove: removeOtherDoc } = useFieldArray({
    control,
    name: 'otherDocuments',
  })

  const selectedCountry = watch('country')
  const selectedState = watch('state')

  const countryOptions = useMemo(() => {
    return Country.getAllCountries().map(c => ({ value: c.isoCode, label: c.name }))
  }, [])

  const stateOptions = useMemo(() => {
    if (!selectedCountry) return []
    return State.getStatesOfCountry(selectedCountry).map(s => ({ value: s.isoCode, label: s.name }))
  }, [selectedCountry])

  const cityOptions = useMemo(() => {
    if (!selectedCountry || !selectedState) return []
    return City.getCitiesOfState(selectedCountry, selectedState).map(c => ({ value: c.name, label: c.name }))
  }, [selectedCountry, selectedState])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1]
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const submitDetails = (data: RegisterFormValues) => {
    setShowConfirmModal(false)
    setStep(7)
  }

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) {
      const isValid = await trigger('organizationEmail')
      if (isValid) setStep(2)
    } else if (step === 2) {
      if (otp.join('').length === 4) {
        setStep(3)
      }
    } else if (step === 3) {
      const isValid = await trigger(['organizationName', 'organizationMobile', 'organizationType', 'address', 'city', 'district', 'pincode', 'state', 'country'])
      if (isValid) {
        setStep(4)
      }
    } else if (step === 5) {
      const isValid = await trigger(['panNumber', 'panFile', 'gstNumber', 'gstFile', 'regCertNumber', 'regCertFile', 'otherDocuments'])
      if (isValid) {
        setStep(6)
      }
    }
  }

  if (step >= 3) {
    return (
      <div 
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 overflow-y-auto bg-cover bg-center bg-no-repeat bg-fixed" 
        style={{ backgroundImage: `url(${buddhaBg})` }}
      >
        <div className="w-full max-w-[700px]">
          <div className="flex flex-col items-center text-center mb-4">
            <h1 className="text-xl md:text-2xl font-serif font-bold text-[var(--navy)] mb-1">Organization Details</h1>
            <p className="text-[var(--text-secondary)] font-medium text-sm">Please complete your organization profile.</p>
          </div>
          
          <div
            className="rounded-3xl p-5 md:p-7 shadow-2xl border border-[var(--border)]"
            style={{
              background: 'linear-gradient(145deg, rgba(255,253,248,0.95) 0%, rgba(247,241,227,0.9) 100%)',
              backdropFilter: 'blur(24px)',
            }}
          >
            <form className="flex flex-col gap-3" onSubmit={onFormSubmit}>
              {step === 3 && (
                <>
                  {/* ── Email (Readonly) ── */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider">
                      Organization Email
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                        <Mail className="h-[14px] w-[14px] text-[var(--gold)]" strokeWidth={1.75} />
                      </div>
                      <Input
                        {...register('organizationEmail')}
                        type="email"
                        readOnly
                        className="pl-9 h-[40px] rounded-xl text-[13px] opacity-70 cursor-not-allowed bg-white/50"
                        title="You cannot edit this email"
                      />
                    </div>
                  </div>

                  {/* ── Organization Name & Mobile ── */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider">Organization Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                          <Building2 className="h-[14px] w-[14px] text-[var(--gold)]" strokeWidth={1.75} />
                        </div>
                        <Input {...register('organizationName')} placeholder="Name" error={!!errors.organizationName} className="pl-9 h-[40px] rounded-xl text-[13px]" />
                      </div>
                      {errors.organizationName && <p className="text-[11px] text-red-500 mt-0.5">{errors.organizationName.message}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider">Mobile Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                          <Phone className="h-[14px] w-[14px] text-[var(--gold)]" strokeWidth={1.75} />
                        </div>
                        <Input {...register('organizationMobile')} type="tel" placeholder="Mobile Number" error={!!errors.organizationMobile} className="pl-9 h-[40px] rounded-xl text-[13px]" />
                      </div>
                      {errors.organizationMobile && <p className="text-[11px] text-red-500 mt-0.5">{errors.organizationMobile.message}</p>}
                    </div>
                  </div>

                  {/* ── Organization Type ── */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider">Organization Type</label>
                    <Controller
                      name="organizationType"
                      control={control}
                      render={({ field }) => (
                        <Dropdown
                          value={field.value}
                          onChange={field.onChange}
                          options={ORGANIZATION_TYPE_OPTIONS}
                          placeholder="Select organization type"
                          invalid={!!errors.organizationType}
                          className="h-[40px] rounded-xl text-[13px]"
                        />
                      )}
                    />
                    {errors.organizationType && <p className="text-[11px] text-red-500 mt-0.5">{errors.organizationType.message}</p>}
                  </div>

                  {/* ── Address ── */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider">Address</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-start pt-3 pointer-events-none z-10">
                          <MapPin className="h-[14px] w-[14px] text-[var(--gold)]" strokeWidth={1.75} />
                        </div>
                      <Textarea {...register('address')} placeholder="Full Address" error={!!errors.address} className="pl-9 min-h-[60px] rounded-xl text-[13px] py-2 resize-y" />
                    </div>
                    {errors.address && <p className="text-[11px] text-red-500 mt-0.5">{errors.address.message}</p>}
                  </div>

                  {/* ── Country & State ── */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider">Country</label>
                      <Controller
                        name="country"
                        control={control}
                        render={({ field }) => (
                          <Dropdown
                            value={field.value}
                            onChange={(val) => { field.onChange(val); setValue('state', ''); setValue('city', ''); }}
                            options={countryOptions}
                            placeholder="Select country"
                            invalid={!!errors.country}
                            className="h-[40px] rounded-xl text-[13px]"
                          />
                        )}
                      />
                      {errors.country && <p className="text-[11px] text-red-500 mt-0.5">{errors.country.message}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider">State</label>
                      <Controller
                        name="state"
                        control={control}
                        render={({ field }) => (
                          <Dropdown
                            value={field.value}
                            onChange={(val) => { field.onChange(val); setValue('city', ''); }}
                            options={stateOptions}
                            placeholder="Select state"
                            invalid={!!errors.state}
                            className="h-[40px] rounded-xl text-[13px]"
                            disabled={!selectedCountry}
                          />
                        )}
                      />
                      {errors.state && <p className="text-[11px] text-red-500 mt-0.5">{errors.state.message}</p>}
                    </div>
                  </div>

                  {/* ── District & City ── */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider">District</label>
                      <Input {...register('district')} placeholder="Enter district" error={!!errors.district} className="h-[40px] pl-3 rounded-xl text-[13px]" />
                      {errors.district && <p className="text-[11px] text-red-500 mt-0.5">{errors.district.message}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider">City/Village</label>
                      <Controller
                        name="city"
                        control={control}
                        render={({ field }) => (
                          <Dropdown
                            value={field.value}
                            onChange={field.onChange}
                            options={cityOptions}
                            placeholder="Select city"
                            invalid={!!errors.city}
                            className="h-[40px] rounded-xl text-[13px]"
                            disabled={!selectedState}
                          />
                        )}
                      />
                      {errors.city && <p className="text-[11px] text-red-500 mt-0.5">{errors.city.message}</p>}
                    </div>
                  </div>

                  {/* ── Pin Code ── */}
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider">Pin Code</label>
                      <Input {...register('pincode')} placeholder="Enter pin code" error={!!errors.pincode} className="h-[40px] pl-3 w-1/2 rounded-xl text-[13px]" />
                      {errors.pincode && <p className="text-[11px] text-red-500 mt-0.5">{errors.pincode.message}</p>}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="gold"
                    isLoading={isSubmitting}
                    className="w-full h-[45px] rounded-xl font-bold text-[14px] mt-1 tracking-wide shadow-md hover:shadow-lg hover:scale-[1.008] active:scale-[0.99] transition-all group"
                  >
                    Next
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </>
              )}

              {step === 4 && (
                <div className="flex flex-col gap-3">
                  <div className="bg-[var(--bg-secondary)]/50 rounded-2xl p-5 border border-[var(--border)]">
                    <h3 className="text-base font-bold text-[var(--navy)] border-b border-[var(--border)] pb-2 mb-3">Preview Details</h3>
                    <div className="grid grid-cols-2 gap-2 text-[12px]">
                      <div className="flex flex-col p-2 border border-[var(--border)] rounded-xl bg-white/40">
                        <span className="text-[10px] uppercase text-[var(--navy)] font-bold tracking-wider mb-0.5">Email</span>
                        <span className="font-normal text-[var(--navy)]/90 break-words whitespace-pre-wrap">{getValues('organizationEmail')}</span>
                      </div>
                      <div className="flex flex-col p-2 border border-[var(--border)] rounded-xl bg-white/40">
                        <span className="text-[10px] uppercase text-[var(--navy)] font-bold tracking-wider mb-0.5">Name</span>
                        <span className="font-normal text-[var(--navy)]/90 break-words whitespace-pre-wrap">{getValues('organizationName')}</span>
                      </div>
                      <div className="flex flex-col p-2 border border-[var(--border)] rounded-xl bg-white/40">
                        <span className="text-[10px] uppercase text-[var(--navy)] font-bold tracking-wider mb-0.5">Mobile</span>
                        <span className="font-normal text-[var(--navy)]/90 break-words whitespace-pre-wrap">{getValues('organizationMobile')}</span>
                      </div>
                      <div className="flex flex-col p-2 border border-[var(--border)] rounded-xl bg-white/40">
                        <span className="text-[10px] uppercase text-[var(--navy)] font-bold tracking-wider mb-0.5">Type</span>
                        <span className="font-normal text-[var(--navy)]/90 break-words whitespace-pre-wrap">
                           {ORGANIZATION_TYPE_OPTIONS.find(o => o.value === getValues('organizationType'))?.label}
                        </span>
                      </div>
                      <div className="flex flex-col col-span-2 p-2 border border-[var(--border)] rounded-xl bg-white/40">
                        <span className="text-[10px] uppercase text-[var(--navy)] font-bold tracking-wider mb-0.5">Address</span>
                        <span className="font-normal text-[var(--navy)]/90 break-words whitespace-pre-wrap">{getValues('address')}</span>
                      </div>
                      <div className="flex flex-col p-2 border border-[var(--border)] rounded-xl bg-white/40">
                        <span className="text-[10px] uppercase text-[var(--navy)] font-bold tracking-wider mb-0.5">District</span>
                        <span className="font-normal text-[var(--navy)]/90 break-words whitespace-pre-wrap">{getValues('district')}</span>
                      </div>
                      <div className="flex flex-col p-2 border border-[var(--border)] rounded-xl bg-white/40">
                        <span className="text-[10px] uppercase text-[var(--navy)] font-bold tracking-wider mb-0.5">City/Village</span>
                        <span className="font-normal text-[var(--navy)]/90 break-words whitespace-pre-wrap">{getValues('city')}</span>
                      </div>
                      <div className="flex flex-col p-2 border border-[var(--border)] rounded-xl bg-white/40">
                        <span className="text-[10px] uppercase text-[var(--navy)] font-bold tracking-wider mb-0.5">Pin Code</span>
                        <span className="font-normal text-[var(--navy)]/90 break-words whitespace-pre-wrap">{getValues('pincode')}</span>
                      </div>
                      <div className="flex flex-col p-2 border border-[var(--border)] rounded-xl bg-white/40">
                        <span className="text-[10px] uppercase text-[var(--navy)] font-bold tracking-wider mb-0.5">State</span>
                        <span className="font-normal text-[var(--navy)]/90 break-words whitespace-pre-wrap">
                          {State.getStateByCodeAndCountry(getValues('state'), getValues('country'))?.name || getValues('state')}
                        </span>
                      </div>
                      <div className="flex flex-col p-2 border border-[var(--border)] rounded-xl bg-white/40 col-span-2 md:col-span-1">
                        <span className="text-[10px] uppercase text-[var(--navy)] font-bold tracking-wider mb-0.5">Country</span>
                        <span className="font-normal text-[var(--navy)]/90 break-words whitespace-pre-wrap">
                          {Country.getCountryByCode(getValues('country'))?.name || getValues('country')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={() => setStep(3)} className="flex-1 h-[45px] rounded-xl font-bold shadow-sm">
                      Edit
                    </Button>
                    <Button type="button" variant="gold" onClick={() => setStep(5)} className="flex-1 h-[45px] rounded-xl font-bold shadow-md">
                      Confirm & Save
                    </Button>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="flex flex-col gap-4">
                  <div className="bg-[var(--bg-secondary)]/50 rounded-2xl p-5 border border-[var(--border)]">
                    <h3 className="text-base font-bold text-[var(--navy)] border-b border-[var(--border)] pb-2 mb-4">Document Uploads</h3>
                    
                    <div className="flex flex-col gap-4">
                      {/* PAN */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider">Organization PAN Card Number</label>
                          <Input {...register('panNumber')} placeholder="Enter PAN Number" error={!!errors.panNumber} className="h-[40px] pl-3 rounded-xl text-[13px]" />
                          {errors.panNumber && <p className="text-[11px] text-red-500 mt-0.5">{errors.panNumber.message as string}</p>}
                        </div>
                        <div className="flex flex-col gap-1 h-[40px]">
                          <label className="cursor-pointer w-full h-full bg-white border border-[var(--gold)]/50 text-[var(--navy)] rounded-xl flex items-center justify-center font-bold text-[13px] hover:bg-[var(--gold)]/10 transition-colors">
                            <Upload className="w-4 h-4 mr-2 text-[var(--gold)]" />
                            {watch('panFile') ? (watch('panFile') as File).name : 'Upload Organization PAN Card'}
                            <input type="file" className="hidden" onChange={(e) => { if(e.target.files?.[0]) setValue('panFile', e.target.files[0], {shouldValidate: true}) }} />
                          </label>
                          {errors.panFile && <p className="text-[11px] text-red-500 mt-0.5">{errors.panFile.message as string}</p>}
                        </div>
                      </div>

                      {/* GST */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider">Organization GST Number</label>
                          <Input {...register('gstNumber')} placeholder="Enter GST Number" error={!!errors.gstNumber} className="h-[40px] pl-3 rounded-xl text-[13px]" />
                          {errors.gstNumber && <p className="text-[11px] text-red-500 mt-0.5">{errors.gstNumber.message as string}</p>}
                        </div>
                        <div className="flex flex-col gap-1 h-[40px]">
                          <label className="cursor-pointer w-full h-full bg-white border border-[var(--gold)]/50 text-[var(--navy)] rounded-xl flex items-center justify-center font-bold text-[13px] hover:bg-[var(--gold)]/10 transition-colors">
                            <Upload className="w-4 h-4 mr-2 text-[var(--gold)]" />
                            {watch('gstFile') ? (watch('gstFile') as File).name : 'Upload Organization GST'}
                            <input type="file" className="hidden" onChange={(e) => { if(e.target.files?.[0]) setValue('gstFile', e.target.files[0], {shouldValidate: true}) }} />
                          </label>
                          {errors.gstFile && <p className="text-[11px] text-red-500 mt-0.5">{errors.gstFile.message as string}</p>}
                        </div>
                      </div>

                      {/* Registration Certificate */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-[var(--navy)] uppercase tracking-wider">Registration Certificate Number</label>
                          <Input {...register('regCertNumber')} placeholder="Enter Registration Number" error={!!errors.regCertNumber} className="h-[40px] pl-3 rounded-xl text-[13px]" />
                          {errors.regCertNumber && <p className="text-[11px] text-red-500 mt-0.5">{errors.regCertNumber.message as string}</p>}
                        </div>
                        <div className="flex flex-col gap-1 h-[40px]">
                          <label className="cursor-pointer w-full h-full bg-white border border-[var(--gold)]/50 text-[var(--navy)] rounded-xl flex items-center justify-center font-bold text-[13px] hover:bg-[var(--gold)]/10 transition-colors">
                            <Upload className="w-4 h-4 mr-2 text-[var(--gold)]" />
                            {watch('regCertFile') ? (watch('regCertFile') as File).name : 'Upload Registration Certificate'}
                            <input type="file" className="hidden" onChange={(e) => { if(e.target.files?.[0]) setValue('regCertFile', e.target.files[0], {shouldValidate: true}) }} />
                          </label>
                          {errors.regCertFile && <p className="text-[11px] text-red-500 mt-0.5">{errors.regCertFile.message as string}</p>}
                        </div>
                      </div>
                      
                      {/* Divider */}
                      <div className="h-px w-full bg-[var(--border)] my-2"></div>
                      
                      {/* Other Documents */}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <label className="text-[12px] font-bold text-[var(--navy)] uppercase tracking-wider">Other Documents (Optional)</label>
                          <Button type="button" variant="ghost" onClick={() => appendOtherDoc({ name: '', file: null })} className="h-[30px] text-[12px] text-[var(--gold)] px-2 hover:bg-[var(--gold)]/10">
                            <Plus className="w-3.5 h-3.5 mr-1" /> Add Document
                          </Button>
                        </div>
                        
                        {otherDocs.map((item, index) => (
                          <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start border border-[var(--border)] p-3 rounded-xl bg-white/40">
                            <div className="md:col-span-5 flex flex-col gap-1">
                              <Input {...register(`otherDocuments.${index}.name` as const)} placeholder="Document Name" error={!!errors.otherDocuments?.[index]?.name} className="h-[40px] pl-3 rounded-xl text-[13px]" />
                              {errors.otherDocuments?.[index]?.name && <p className="text-[11px] text-red-500 mt-0.5">{errors.otherDocuments[index]?.name?.message as string}</p>}
                            </div>
                            <div className="md:col-span-6 flex flex-col gap-1 h-[40px]">
                              <label className="cursor-pointer w-full h-full bg-white border border-[var(--gold)]/50 text-[var(--navy)] rounded-xl flex items-center justify-center font-bold text-[13px] hover:bg-[var(--gold)]/10 transition-colors">
                                <Upload className="w-4 h-4 mr-2 text-[var(--gold)]" />
                                {watch(`otherDocuments.${index}.file` as const) ? (watch(`otherDocuments.${index}.file` as const) as File).name : 'Upload Document'}
                                <input type="file" className="hidden" onChange={(e) => { if(e.target.files?.[0]) setValue(`otherDocuments.${index}.file` as const, e.target.files[0], {shouldValidate: true}) }} />
                              </label>
                              {errors.otherDocuments?.[index]?.file && <p className="text-[11px] text-red-500 mt-0.5">{errors.otherDocuments[index]?.file?.message as string}</p>}
                            </div>
                            <div className="md:col-span-1 flex items-center justify-center h-[40px]">
                              <button type="button" onClick={() => removeOtherDoc(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>

                  <div className="flex gap-3 mt-1">
                    <Button type="button" variant="outline" onClick={() => setStep(4)} className="flex-1 h-[45px] rounded-xl font-bold shadow-sm">
                      Back
                    </Button>
                    <Button type="submit" variant="gold" isLoading={isSubmitting} className="flex-1 h-[45px] rounded-xl font-bold shadow-md">
                      Save & Continue
                    </Button>
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="flex flex-col gap-3">
                  <div className="bg-[var(--bg-secondary)]/50 rounded-2xl p-5 border border-[var(--border)]">
                    <h3 className="text-base font-bold text-[var(--navy)] border-b border-[var(--border)] pb-2 mb-3">Final Preview</h3>
                    
                    {/* Organization Details (from Step 4) */}
                    <div className="grid grid-cols-2 gap-2 text-[12px] mb-4">
                      <div className="flex flex-col p-2 border border-[var(--border)] rounded-xl bg-white/40">
                        <span className="text-[10px] uppercase text-[var(--navy)] font-bold tracking-wider mb-0.5">Email</span>
                        <span className="font-normal text-[var(--navy)]/90 break-words whitespace-pre-wrap">{getValues('organizationEmail')}</span>
                      </div>
                      <div className="flex flex-col p-2 border border-[var(--border)] rounded-xl bg-white/40">
                        <span className="text-[10px] uppercase text-[var(--navy)] font-bold tracking-wider mb-0.5">Name</span>
                        <span className="font-normal text-[var(--navy)]/90 break-words whitespace-pre-wrap">{getValues('organizationName')}</span>
                      </div>
                      <div className="flex flex-col p-2 border border-[var(--border)] rounded-xl bg-white/40">
                        <span className="text-[10px] uppercase text-[var(--navy)] font-bold tracking-wider mb-0.5">Mobile</span>
                        <span className="font-normal text-[var(--navy)]/90 break-words whitespace-pre-wrap">{getValues('organizationMobile')}</span>
                      </div>
                      <div className="flex flex-col p-2 border border-[var(--border)] rounded-xl bg-white/40">
                        <span className="text-[10px] uppercase text-[var(--navy)] font-bold tracking-wider mb-0.5">Type</span>
                        <span className="font-normal text-[var(--navy)]/90 break-words whitespace-pre-wrap">
                           {ORGANIZATION_TYPE_OPTIONS.find(o => o.value === getValues('organizationType'))?.label}
                        </span>
                      </div>
                    </div>
                    
                    <h4 className="text-sm font-bold text-[var(--navy)] border-b border-[var(--border)] pb-2 mb-3 mt-2">Document Details</h4>
                    <div className="grid grid-cols-2 gap-2 text-[12px]">
                      <div className="flex flex-col p-2 border border-[var(--border)] rounded-xl bg-white/40">
                        <span className="text-[10px] uppercase text-[var(--navy)] font-bold tracking-wider mb-0.5">PAN Number</span>
                        <span className="font-normal text-[var(--navy)]/90 break-words whitespace-pre-wrap">{getValues('panNumber')}</span>
                        <span className="text-[10px] text-[var(--gold)] font-medium mt-1 truncate max-w-[200px]">📄 {(getValues('panFile') as File)?.name}</span>
                      </div>
                      <div className="flex flex-col p-2 border border-[var(--border)] rounded-xl bg-white/40">
                        <span className="text-[10px] uppercase text-[var(--navy)] font-bold tracking-wider mb-0.5">GST Number</span>
                        <span className="font-normal text-[var(--navy)]/90 break-words whitespace-pre-wrap">{getValues('gstNumber')}</span>
                        <span className="text-[10px] text-[var(--gold)] font-medium mt-1 truncate max-w-[200px]">📄 {(getValues('gstFile') as File)?.name}</span>
                      </div>
                      <div className="flex flex-col p-2 border border-[var(--border)] rounded-xl bg-white/40 col-span-2">
                        <span className="text-[10px] uppercase text-[var(--navy)] font-bold tracking-wider mb-0.5">Registration Certificate</span>
                        <span className="font-normal text-[var(--navy)]/90 break-words whitespace-pre-wrap">{getValues('regCertNumber')}</span>
                        <span className="text-[10px] text-[var(--gold)] font-medium mt-1 truncate max-w-[400px]">📄 {(getValues('regCertFile') as File)?.name}</span>
                      </div>
                      
                      {getValues('otherDocuments')?.length ? getValues('otherDocuments')?.map((doc, i) => (
                        <div key={i} className="flex flex-col p-2 border border-[var(--border)] rounded-xl bg-white/40 col-span-2 md:col-span-1">
                          <span className="text-[10px] uppercase text-[var(--navy)] font-bold tracking-wider mb-0.5">{doc.name}</span>
                          <span className="text-[10px] text-[var(--gold)] font-medium mt-1 truncate max-w-[200px]">📄 {(doc.file as File)?.name}</span>
                        </div>
                      )) : null}
                    </div>

                  </div>

                  <div className="flex gap-3 mt-1">
                    <Button type="button" variant="outline" onClick={() => setStep(5)} className="flex-1 h-[45px] rounded-xl font-bold shadow-sm">
                      Edit
                    </Button>
                    <Button type="button" variant="gold" onClick={() => setShowConfirmModal(true)} className="flex-1 h-[45px] rounded-xl font-bold shadow-md">
                      Save & Continue
                    </Button>
                  </div>
                </div>
              )}

              {step === 7 && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <CheckCircle2 className="w-20 h-20 text-[var(--gold)] mb-6" />
                  <h2 className="text-2xl font-bold text-[var(--navy)] mb-3">Details Submitted!</h2>
                  <p className="text-[14px] text-[var(--text-secondary)]">This is the placeholder for the next form step.</p>
                </div>
              )}

              {showConfirmModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
                  <div className="bg-white rounded-3xl p-8 max-w-[400px] w-full shadow-2xl text-center border border-[var(--border)]">
                    <h3 className="text-xl font-bold text-[var(--navy)] mb-3">Are you sure?</h3>
                    <p className="text-[14px] text-[var(--text-secondary)] mb-8 leading-relaxed">
                      Are you sure all the entered data and documents are correct? If you're sure please click on the next button to move forward, or else click cancel.
                    </p>
                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={() => setShowConfirmModal(false)} className="flex-1 h-[45px] rounded-xl font-bold">
                        Cancel
                      </Button>
                      <Button type="button" variant="gold" onClick={handleSubmit(submitDetails)} className="flex-1 h-[45px] rounded-xl font-bold">
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    /**
     * Card shell — frosted glass over the background image.
     * bg-white/10 + backdrop-blur gives the glass look.
     * A fine white inner border + drop shadow add depth.
     */
    <div
      className="relative rounded-3xl overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, rgba(255,253,248,0.92) 0%, rgba(247,241,227,0.88) 100%)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: '0 32px 80px rgba(16,42,67,0.22), inset 0 1px 0 rgba(255,255,255,0.7)',
        border: '1px solid rgba(255,255,255,0.55)',
      }}
    >
      <div className="p-6 md:px-8 md:py-7">
        <form className="flex flex-col gap-3.5" onSubmit={onFormSubmit}>

          {step === 1 && (
            <>
              {/* ── Organization Email ─────────────────────────────────────────── */}
              <div className="flex flex-col gap-1.5 mb-2">
                <label className="text-[12px] font-bold text-[var(--navy)] uppercase tracking-wider">
                  Organization Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
                    <Mail className="h-[15px] w-[15px] text-[var(--gold)]" strokeWidth={1.75} />
                  </div>
                  <Input
                    {...register('organizationEmail')}
                    type="email"
                    placeholder="organization@domain.com"
                    error={!!errors.organizationEmail}
                    className="pl-10 h-[42px] rounded-xl text-[13px]"
                    style={{
                      background: 'rgba(255,255,255,0.7)',
                      backdropFilter: 'blur(8px)',
                    }}
                  />
                </div>
                {errors.organizationEmail && (
                  <p className="text-[11px] text-red-500 mt-0.5">{errors.organizationEmail.message}</p>
                )}
              </div>

              {/* ── Submit — gold gradient button ─────────────────────────────── */}
              <Button
                type="submit"
                variant="gold"
                isLoading={isSubmitting}
                className="w-full h-[47px] rounded-xl font-bold text-[14.5px] mt-0.5 tracking-wide shadow-md hover:shadow-lg hover:scale-[1.008] active:scale-[0.99] transition-all group"
              >
                Send OTP
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              {/* ── Divider ───────────────────────────────────────────────────── */}
              <div className="flex items-center gap-3 my-0.5 mt-2">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
                <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-widest shrink-0">
                  or continue with
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
              </div>

              {/* ── Social Login — icon pill style ────────────────────────────── */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* Google */}
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 h-[40px] rounded-xl text-[12px] font-bold text-[var(--navy)] transition-all hover:scale-[1.01] active:scale-[0.98]"
                  style={{
                    background: 'rgba(255,255,255,0.8)',
                    border: '1px solid rgba(220,213,197,0.8)',
                    boxShadow: '0 2px 8px rgba(16,42,67,0.06)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <GoogleIcon className="w-4 h-4 shrink-0" />
                  <span>Google</span>
                </button>

                {/* Microsoft */}
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 h-[40px] rounded-xl text-[12px] font-bold text-[var(--navy)] transition-all hover:scale-[1.01] active:scale-[0.98]"
                  style={{
                    background: 'rgba(255,255,255,0.8)',
                    border: '1px solid rgba(220,213,197,0.8)',
                    boxShadow: '0 2px 8px rgba(16,42,67,0.06)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <MicrosoftIcon className="w-4 h-4 shrink-0" />
                  <span>Microsoft</span>
                </button>
              </div>
            </>
          )}
          
          {step === 2 && (
            <>
              {/* ── OTP Fields ─────────────────────────────────────────── */}
              <div className="flex flex-col items-center justify-center mb-2">
                <p className="text-[13px] text-[var(--navy)]/80 text-center mb-4 font-medium">
                  Please enter the 4-digit code sent to your email.
                </p>
                <div className="flex gap-3 justify-center mb-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      ref={(el) => (inputRefs.current[index] = el)}
                      onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl font-bold rounded-xl border border-[var(--gold)]/30 shadow-sm focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] bg-white/70 backdrop-blur-md text-[var(--navy)]"
                    />
                  ))}
                </div>
              </div>

              {/* ── Verify OTP Button ─────────────────────────────────────────────── */}
              <Button
                type="submit"
                variant="gold"
                isLoading={isSubmitting}
                className="w-full h-[47px] rounded-xl font-bold text-[14.5px] mt-0.5 tracking-wide shadow-md hover:shadow-lg hover:scale-[1.008] active:scale-[0.99] transition-all group"
              >
                Verify OTP
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </>
          )}

        </form>
      </div>
    </div>
  )
}
