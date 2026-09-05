import { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Building2, CheckCircle2, Upload } from 'lucide-react'
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

export function OrgOnboardingWizard() {
  const navigate = useNavigate()
  const location = useLocation()
  const initialEmail = (location.state as { email?: string })?.email ?? ''

  const [step, setStep] = useState(3)

  const {
    register,
    control,
    trigger,
    getValues,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      organizationEmail: initialEmail,
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
      orgHeadEmail: '',
      orgHeadMobile: '',
      orgHeadFirstName: '',
      orgHeadMiddleName: '',
      orgHeadLastName: '',
      orgHeadAadharNumber: '',
      orgHeadAadharFile: null,
    },
  })

  const selectedCountry = watch('country')
  const selectedState = watch('state')

  const countryOptions = useMemo(() => {
    return Country.getAllCountries().map((c: any) => ({ value: c.isoCode, label: c.name }))
  }, [])

  const stateOptions = useMemo(() => {
    if (!selectedCountry) return []
    return State.getStatesOfCountry(selectedCountry).map((s: any) => ({ value: s.isoCode, label: s.name }))
  }, [selectedCountry])

  const cityOptions = useMemo(() => {
    if (!selectedCountry || !selectedState) return []
    return City.getCitiesOfState(selectedCountry, selectedState).map((c: any) => ({ value: c.name, label: c.name }))
  }, [selectedCountry, selectedState])

  const submitDetails = () => {
    if (step === 4) {
      clearErrors()
      setStep(5)
    } else if (step === 6) {
      clearErrors()
      setStep(7)
    } else if (step === 8) {
      setStep(9)
    } else if (step === 9) {
      const email = getValues('organizationEmail')
      const name = getValues('organizationName')
      
      const newMockOrg = {
        id: `org-${Date.now()}`,
        email: email,
        password: 'password123',
        role: 'organization',
        organizationName: name,
        firstName: getValues('orgHeadFirstName') || 'Org',
        lastName: getValues('orgHeadLastName') || 'Head',
      }
      const existingUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]')
      localStorage.setItem('mockUsers', JSON.stringify([...existingUsers, newMockOrg]))

      setStep(10)
    }
  }

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 3) {
      const isValid = await trigger(['organizationName', 'organizationMobile', 'organizationType', 'address', 'city', 'district', 'pincode', 'state', 'country'])
      if (isValid) {
        setStep(4)
      }
    } else if (step === 5) {
      const isValid = await trigger(['panNumber', 'panFile', 'gstNumber', 'gstFile', 'regCertNumber', 'regCertFile', 'otherDocuments'])
      if (isValid) {
        setStep(6)
      }
    } else if (step === 7) {
      const isValid = await trigger(['orgHeadEmail', 'orgHeadMobile', 'orgHeadFirstName', 'orgHeadMiddleName', 'orgHeadLastName', 'orgHeadAadharNumber', 'orgHeadAadharFile'])
      if (isValid) {
        setStep(8)
      }
    }
  }

  return (
    <div 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-start px-4 py-10 md:py-20 overflow-y-auto bg-cover bg-center bg-no-repeat bg-fixed" 
      style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.25)), url(${buddhaBg})` }}
    >
      <div className={`w-full ${step === 9 ? 'max-w-[850px]' : 'max-w-[700px]'} transition-all duration-300 mt-auto mb-auto`}>
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
          <form noValidate className="flex flex-col gap-3" onSubmit={onFormSubmit}>
            {step === 3 && (
              <>
                <div className="flex items-center gap-2 border-b border-[var(--gold)]/20 pb-2 mb-1">
                  <Building2 className="w-5 h-5 text-[var(--gold)]" />
                  <h3 className="text-sm font-bold text-[var(--navy)] uppercase tracking-wider">Step 1: Organization Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--navy)] uppercase mb-1">Organization Name *</label>
                    <Input {...register('organizationName')} placeholder="e.g. Nalanda University" error={!!errors.organizationName} className="h-[40px] pl-3 rounded-xl text-[13px]" />
                    {errors.organizationName && <p className="text-[11px] text-red-500 mt-0.5">{errors.organizationName.message as string}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[var(--navy)] uppercase mb-1">Organization Mobile *</label>
                    <Input {...register('organizationMobile')} placeholder="10-digit Mobile Number" maxLength={10} error={!!errors.organizationMobile} className="h-[40px] pl-3 rounded-xl text-[13px]" />
                    {errors.organizationMobile && <p className="text-[11px] text-red-500 mt-0.5">{errors.organizationMobile.message as string}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-[var(--navy)] uppercase mb-1">Organization Type *</label>
                    <Controller
                      name="organizationType"
                      control={control}
                      render={({ field }) => (
                        <Dropdown
                          options={ORGANIZATION_TYPE_OPTIONS}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select Organization Type"
                          invalid={!!errors.organizationType}
                          className="h-[40px] rounded-xl text-[13px]"
                        />
                      )}
                    />
                    {errors.organizationType && <p className="text-[11px] text-red-500 mt-0.5">{errors.organizationType.message as string}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-[var(--navy)] uppercase mb-1">Address *</label>
                    <Textarea {...register('address')} placeholder="Full Street Address" error={!!errors.address} className="rounded-xl text-[13px] min-h-[60px]" />
                    {errors.address && <p className="text-[11px] text-red-500 mt-0.5">{errors.address.message as string}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[var(--navy)] uppercase mb-1">Country *</label>
                    <Controller
                      name="country"
                      control={control}
                      render={({ field }) => (
                        <Dropdown
                          options={countryOptions}
                          value={field.value}
                          onChange={(val) => {
                            field.onChange(val)
                            setValue('state', '')
                            setValue('city', '')
                          }}
                          placeholder="Select Country"
                          invalid={!!errors.country}
                          className="h-[40px] rounded-xl text-[13px]"
                        />
                      )}
                    />
                    {errors.country && <p className="text-[11px] text-red-500 mt-0.5">{errors.country.message as string}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[var(--navy)] uppercase mb-1">State *</label>
                    <Controller
                      name="state"
                      control={control}
                      render={({ field }) => (
                        <Dropdown
                          options={stateOptions}
                          value={field.value}
                          onChange={(val) => {
                            field.onChange(val)
                            setValue('city', '')
                          }}
                          placeholder="Select State"
                          disabled={!selectedCountry}
                          invalid={!!errors.state}
                          className="h-[40px] rounded-xl text-[13px]"
                        />
                      )}
                    />
                    {errors.state && <p className="text-[11px] text-red-500 mt-0.5">{errors.state.message as string}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[var(--navy)] uppercase mb-1">City / Village *</label>
                    <Controller
                      name="city"
                      control={control}
                      render={({ field }) => (
                        <Dropdown
                          options={cityOptions}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select City"
                          disabled={!selectedState}
                          invalid={!!errors.city}
                          className="h-[40px] rounded-xl text-[13px]"
                        />
                      )}
                    />
                    {errors.city && <p className="text-[11px] text-red-500 mt-0.5">{errors.city.message as string}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[var(--navy)] uppercase mb-1">District *</label>
                    <Input {...register('district')} placeholder="District" error={!!errors.district} className="h-[40px] pl-3 rounded-xl text-[13px]" />
                    {errors.district && <p className="text-[11px] text-red-500 mt-0.5">{errors.district.message as string}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[var(--navy)] uppercase mb-1">Pin Code *</label>
                    <Input {...register('pincode')} placeholder="Pin Code" error={!!errors.pincode} className="h-[40px] pl-3 rounded-xl text-[13px]" />
                    {errors.pincode && <p className="text-[11px] text-red-500 mt-0.5">{errors.pincode.message as string}</p>}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <Button type="submit" variant="gold" className="px-6 h-[42px] rounded-xl font-bold text-[13.5px]">
                    Next: Documents
                  </Button>
                </div>
              </>
            )}

            {/* Step 4: Confirm Org Details Modal */}
            {step === 4 && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-[var(--gold)]/20 pb-2">
                  <CheckCircle2 className="w-5 h-5 text-[var(--gold)]" />
                  <h3 className="text-sm font-bold text-[var(--navy)] uppercase tracking-wider">Confirm Organization Details</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><span className="font-bold text-[var(--text-secondary)]">Name:</span> <p className="font-semibold text-[var(--navy)]">{getValues('organizationName')}</p></div>
                  <div><span className="font-bold text-[var(--text-secondary)]">Mobile:</span> <p className="font-semibold text-[var(--navy)]">{getValues('organizationMobile')}</p></div>
                  <div><span className="font-bold text-[var(--text-secondary)]">Type:</span> <p className="font-semibold text-[var(--navy)]">{ORGANIZATION_TYPE_OPTIONS.find(o => o.value === getValues('organizationType'))?.label}</p></div>
                  <div><span className="font-bold text-[var(--text-secondary)]">City:</span> <p className="font-semibold text-[var(--navy)]">{getValues('city')}</p></div>
                  <div><span className="font-bold text-[var(--text-secondary)]">District:</span> <p className="font-semibold text-[var(--navy)]">{getValues('district')}</p></div>
                  <div><span className="font-bold text-[var(--text-secondary)]">State:</span> <p className="font-semibold text-[var(--navy)]">{getValues('state')}</p></div>
                  <div><span className="font-bold text-[var(--text-secondary)]">Pin Code:</span> <p className="font-semibold text-[var(--navy)]">{getValues('pincode')}</p></div>
                </div>

                <div className="flex justify-between gap-3 mt-4">
                  <Button type="button" variant="outline" onClick={() => setStep(3)} className="px-4 h-[40px] rounded-xl text-xs">
                    Edit Details
                  </Button>
                  <Button type="button" variant="gold" onClick={submitDetails} className="px-6 h-[40px] rounded-xl font-bold text-xs">
                    Confirm & Proceed
                  </Button>
                </div>
              </div>
            )}

            {/* Step 5: Document Uploads */}
            {step === 5 && (
              <>
                <div className="flex items-center gap-2 border-b border-[var(--gold)]/20 pb-2 mb-1">
                  <Upload className="w-5 h-5 text-[var(--gold)]" />
                  <h3 className="text-sm font-bold text-[var(--navy)] uppercase tracking-wider">Step 2: Upload Documents</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--navy)] uppercase mb-1">PAN Number *</label>
                    <Input {...register('panNumber')} placeholder="PAN Number" error={!!errors.panNumber} className="h-[40px] pl-3 rounded-xl text-[13px]" />
                    {errors.panNumber && <p className="text-[11px] text-red-500 mt-0.5">{errors.panNumber.message as string}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[var(--navy)] uppercase mb-1">Upload PAN Card *</label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setValue('panFile', e.target.files?.[0] || null)}
                      className="text-xs file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[var(--gold)]/10 file:text-[var(--gold)] hover:file:bg-[var(--gold)]/20"
                    />
                    {errors.panFile && <p className="text-[11px] text-red-500 mt-0.5">{errors.panFile.message as string}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[var(--navy)] uppercase mb-1">GST Number *</label>
                    <Input {...register('gstNumber')} placeholder="GST Number" error={!!errors.gstNumber} className="h-[40px] pl-3 rounded-xl text-[13px]" />
                    {errors.gstNumber && <p className="text-[11px] text-red-500 mt-0.5">{errors.gstNumber.message as string}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[var(--navy)] uppercase mb-1">Upload GST Certificate *</label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setValue('gstFile', e.target.files?.[0] || null)}
                      className="text-xs file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[var(--gold)]/10 file:text-[var(--gold)] hover:file:bg-[var(--gold)]/20"
                    />
                    {errors.gstFile && <p className="text-[11px] text-red-500 mt-0.5">{errors.gstFile.message as string}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[var(--navy)] uppercase mb-1">Registration Certificate Number *</label>
                    <Input {...register('regCertNumber')} placeholder="Certificate Number" error={!!errors.regCertNumber} className="h-[40px] pl-3 rounded-xl text-[13px]" />
                    {errors.regCertNumber && <p className="text-[11px] text-red-500 mt-0.5">{errors.regCertNumber.message as string}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[var(--navy)] uppercase mb-1">Upload Registration Certificate *</label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setValue('regCertFile', e.target.files?.[0] || null)}
                      className="text-xs file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[var(--gold)]/10 file:text-[var(--gold)] hover:file:bg-[var(--gold)]/20"
                    />
                    {errors.regCertFile && <p className="text-[11px] text-red-500 mt-0.5">{errors.regCertFile.message as string}</p>}
                  </div>
                </div>

                <div className="flex justify-between gap-3 mt-4">
                  <Button type="button" variant="outline" onClick={() => setStep(3)} className="px-4 h-[42px] rounded-xl text-xs">
                    Back
                  </Button>
                  <Button type="submit" variant="gold" className="px-6 h-[42px] rounded-xl font-bold text-[13.5px]">
                    Next: Organization Head
                  </Button>
                </div>
              </>
            )}

            {/* Step 6: Confirm Documents */}
            {step === 6 && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-[var(--gold)]/20 pb-2">
                  <CheckCircle2 className="w-5 h-5 text-[var(--gold)]" />
                  <h3 className="text-sm font-bold text-[var(--navy)] uppercase tracking-wider">Confirm Uploaded Documents</h3>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><span className="font-bold text-[var(--text-secondary)]">PAN Number:</span> <p className="font-semibold text-[var(--navy)]">{getValues('panNumber')}</p></div>
                  <div><span className="font-bold text-[var(--text-secondary)]">GST Number:</span> <p className="font-semibold text-[var(--navy)]">{getValues('gstNumber')}</p></div>
                  <div><span className="font-bold text-[var(--text-secondary)]">Reg Cert:</span> <p className="font-semibold text-[var(--navy)]">{getValues('regCertNumber')}</p></div>
                </div>

                <div className="flex justify-between gap-3 mt-4">
                  <Button type="button" variant="outline" onClick={() => setStep(5)} className="px-4 h-[40px] rounded-xl text-xs">
                    Edit Documents
                  </Button>
                  <Button type="button" variant="gold" onClick={submitDetails} className="px-6 h-[40px] rounded-xl font-bold text-xs">
                    Confirm & Proceed
                  </Button>
                </div>
              </div>
            )}

            {/* Step 7: Organization Head Details */}
            {step === 7 && (
              <>
                <div className="flex items-center gap-2 border-b border-[var(--gold)]/20 pb-2 mb-1">
                  <Mail className="w-5 h-5 text-[var(--gold)]" />
                  <h3 className="text-sm font-bold text-[var(--navy)] uppercase tracking-wider">Step 3: Head of Organization</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--navy)] uppercase mb-1">First Name *</label>
                    <Input {...register('orgHeadFirstName')} placeholder="First Name" error={!!errors.orgHeadFirstName} className="h-[40px] pl-3 rounded-xl text-[13px]" />
                    {errors.orgHeadFirstName && <p className="text-[11px] text-red-500 mt-0.5">{errors.orgHeadFirstName.message as string}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[var(--navy)] uppercase mb-1">Last Name *</label>
                    <Input {...register('orgHeadLastName')} placeholder="Last Name" error={!!errors.orgHeadLastName} className="h-[40px] pl-3 rounded-xl text-[13px]" />
                    {errors.orgHeadLastName && <p className="text-[11px] text-red-500 mt-0.5">{errors.orgHeadLastName.message as string}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[var(--navy)] uppercase mb-1">Email *</label>
                    <Input {...register('orgHeadEmail')} placeholder="head@domain.com" error={!!errors.orgHeadEmail} className="h-[40px] pl-3 rounded-xl text-[13px]" />
                    {errors.orgHeadEmail && <p className="text-[11px] text-red-500 mt-0.5">{errors.orgHeadEmail.message as string}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[var(--navy)] uppercase mb-1">Mobile *</label>
                    <Input {...register('orgHeadMobile')} placeholder="10-digit Mobile" maxLength={10} error={!!errors.orgHeadMobile} className="h-[40px] pl-3 rounded-xl text-[13px]" />
                    {errors.orgHeadMobile && <p className="text-[11px] text-red-500 mt-0.5">{errors.orgHeadMobile.message as string}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[var(--navy)] uppercase mb-1">Aadhar Number *</label>
                    <Input {...register('orgHeadAadharNumber')} placeholder="12-digit Aadhar" maxLength={12} error={!!errors.orgHeadAadharNumber} className="h-[40px] pl-3 rounded-xl text-[13px]" />
                    {errors.orgHeadAadharNumber && <p className="text-[11px] text-red-500 mt-0.5">{errors.orgHeadAadharNumber.message as string}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[var(--navy)] uppercase mb-1">Upload Aadhar Card *</label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setValue('orgHeadAadharFile', e.target.files?.[0] || null)}
                      className="text-xs file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[var(--gold)]/10 file:text-[var(--gold)] hover:file:bg-[var(--gold)]/20"
                    />
                    {errors.orgHeadAadharFile && <p className="text-[11px] text-red-500 mt-0.5">{errors.orgHeadAadharFile.message as string}</p>}
                  </div>
                </div>

                <div className="flex justify-between gap-3 mt-4">
                  <Button type="button" variant="outline" onClick={() => setStep(5)} className="px-4 h-[42px] rounded-xl text-xs">
                    Back
                  </Button>
                  <Button type="submit" variant="gold" className="px-6 h-[42px] rounded-xl font-bold text-[13.5px]">
                    Review & Submit
                  </Button>
                </div>
              </>
            )}

            {/* Step 8: Confirm Head Details */}
            {step === 8 && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-[var(--gold)]/20 pb-2">
                  <CheckCircle2 className="w-5 h-5 text-[var(--gold)]" />
                  <h3 className="text-sm font-bold text-[var(--navy)] uppercase tracking-wider">Confirm Head Details</h3>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><span className="font-bold text-[var(--text-secondary)]">Name:</span> <p className="font-semibold text-[var(--navy)]">{`${getValues('orgHeadFirstName')} ${getValues('orgHeadLastName')}`}</p></div>
                  <div><span className="font-bold text-[var(--text-secondary)]">Email:</span> <p className="font-semibold text-[var(--navy)]">{getValues('orgHeadEmail')}</p></div>
                  <div><span className="font-bold text-[var(--text-secondary)]">Mobile:</span> <p className="font-semibold text-[var(--navy)]">{getValues('orgHeadMobile')}</p></div>
                  <div><span className="font-bold text-[var(--text-secondary)]">Aadhar:</span> <p className="font-semibold text-[var(--navy)]">{getValues('orgHeadAadharNumber')}</p></div>
                </div>

                <div className="flex justify-between gap-3 mt-4">
                  <Button type="button" variant="outline" onClick={() => setStep(7)} className="px-4 h-[40px] rounded-xl text-xs">
                    Edit Head Details
                  </Button>
                  <Button type="button" variant="gold" onClick={submitDetails} className="px-6 h-[40px] rounded-xl font-bold text-xs">
                    Proceed to Review
                  </Button>
                </div>
              </div>
            )}

            {/* Step 9: Final Review */}
            {step === 9 && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-[var(--gold)]/20 pb-2">
                  <CheckCircle2 className="w-5 h-5 text-[var(--gold)]" />
                  <h3 className="text-sm font-bold text-[var(--navy)] uppercase tracking-wider">Final Application Review</h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="bg-white/60 p-3 rounded-xl">
                    <h4 className="font-bold text-[var(--gold)] mb-1">Organization</h4>
                    <p className="font-semibold text-[var(--navy)]">{getValues('organizationName')} ({ORGANIZATION_TYPE_OPTIONS.find(o => o.value === getValues('organizationType'))?.label})</p>
                    <p className="text-[var(--text-secondary)]">{getValues('address')}, {getValues('city')}, {getValues('state')} - {getValues('pincode')}</p>
                  </div>

                  <div className="bg-white/60 p-3 rounded-xl">
                    <h4 className="font-bold text-[var(--gold)] mb-1">Documents</h4>
                    <p className="font-semibold text-[var(--navy)]">PAN: {getValues('panNumber')} | GST: {getValues('gstNumber')}</p>
                    <p className="text-[var(--text-secondary)]">Registration Cert: {getValues('regCertNumber')}</p>
                  </div>

                  <div className="bg-white/60 p-3 rounded-xl">
                    <h4 className="font-bold text-[var(--gold)] mb-1">Head of Organization</h4>
                    <p className="font-semibold text-[var(--navy)]">{`${getValues('orgHeadFirstName')} ${getValues('orgHeadLastName')}`}</p>
                    <p className="text-[var(--text-secondary)]">{getValues('orgHeadEmail')} | {getValues('orgHeadMobile')}</p>
                  </div>
                </div>

                <div className="flex justify-between gap-3 mt-4">
                  <Button type="button" variant="outline" onClick={() => setStep(7)} className="px-4 h-[42px] rounded-xl text-xs">
                    Back
                  </Button>
                  <Button type="button" variant="gold" onClick={submitDetails} className="px-6 h-[42px] rounded-xl font-bold text-xs">
                    Submit Registration
                  </Button>
                </div>
              </div>
            )}

            {/* Step 10: Registration Success */}
            {step === 10 && (
              <div className="flex flex-col items-center text-center p-6 gap-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                <h3 className="text-lg font-serif font-bold text-[var(--navy)]">Registration Submitted Successfully!</h3>
                <p className="text-xs text-[var(--text-secondary)] max-w-[360px]">
                  Your organization application has been submitted for verification. You can now log in to access your dashboard.
                </p>
                <Button type="button" variant="gold" onClick={() => navigate('/login')} className="mt-4 px-8 h-[42px] rounded-xl font-bold text-xs">
                  Go to Login
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
