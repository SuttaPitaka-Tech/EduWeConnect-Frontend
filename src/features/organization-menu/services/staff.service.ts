import { apiClient } from '@/lib/api-client'

export interface StaffAddress {
  country?: string
  state?: string
  pincode?: string
  current_address?: string
  permanent_address?: string
}

export interface AdditionalDocItem {
  id?: string
  docName: string
  file?: File | null
  file_id?: string
  file_name?: string
}

export interface StaffMember {
  id: string
  organization_id?: string
  employee_first_name: string
  employee_last_name?: string
  employee_email: string
  employee_mobile_number: string
  employee_type: 'Teacher' | 'Non Staff' | 'Finance' | string
  subjects?: string[]
  employee_pan_number?: string
  employee_pan_file_id?: string | null
  employee_aadhar_number?: string
  employee_aadhar_file_id?: string | null
  employee_experience?: string
  employee_previous_work_institute_name?: string
  employee_experience_letter_file_id?: string | null
  employee_relieving_letter_file_id?: string | null
  additional_documents?: Array<{ docName: string; file_id?: string; file_name?: string }>
  staff_address?: StaffAddress | null
  status?: string
  created_at: string
}

export interface StaffFormInput {
  organizationId?: string
  firstName: string
  lastName?: string
  email: string
  mobile: string
  employeeType: string
  panNumber?: string
  panFile?: File | null
  aadharNumber?: string
  aadharFile?: File | null
  experience?: string
  previousInstitute?: string
  expLetterFile?: File | null
  relievingLetterFile?: File | null
  subjects?: string[]
  additionalDocs?: AdditionalDocItem[]
  address: StaffAddress
}

/**
 * Declarative FormData builder for staff submissions.
 * Eliminates procedural if-statement cascades while maintaining strict field sanitization.
 */
export function buildStaffFormData(input: StaffFormInput): FormData {
  const formData = new FormData()

  const stringFields: Record<string, string | undefined | null> = {
    organization_id: input.organizationId?.trim(),
    employee_first_name: input.firstName.trim(),
    employee_last_name: input.lastName?.trim(),
    employee_email: input.email.trim(),
    employee_mobile_number: input.mobile.trim(),
    employee_type: input.employeeType,
    employee_pan_number: input.panNumber?.trim(),
    employee_aadhar_number: input.aadharNumber?.trim(),
    employee_experience: input.experience?.trim(),
    employee_previous_work_institute_name: input.previousInstitute?.trim(),
    country: input.address.country?.trim(),
    state: input.address.state?.trim(),
    pincode: input.address.pincode?.trim(),
    current_address: input.address.current_address?.trim(),
    permanent_address: input.address.permanent_address?.trim(),
  }

  // Append non-empty primitive fields cleanly
  for (const [key, value] of Object.entries(stringFields)) {
    if (value) formData.append(key, value)
  }

  // Complex objects serialized as JSON
  formData.append('staff_address', JSON.stringify(input.address))

  if (input.subjects && input.subjects.length > 0) {
    formData.append('subjects', JSON.stringify(input.subjects))
  }

  if (input.additionalDocs && input.additionalDocs.length > 0) {
    const docMeta = input.additionalDocs.map((doc) => ({
      docName: doc.docName?.trim() || 'Document',
    }))
    formData.append('additional_documents', JSON.stringify(docMeta))
    input.additionalDocs.forEach((doc) => {
      if (doc.file) formData.append('additionalFiles', doc.file)
    })
  }

  // File uploads
  const fileFields: Record<string, File | null | undefined> = {
    panFile: input.panFile,
    aadharFile: input.aadharFile,
    expLetterFile: input.expLetterFile,
    relievingLetterFile: input.relievingLetterFile,
  }

  for (const [fieldName, file] of Object.entries(fileFields)) {
    if (file) formData.append(fieldName, file)
  }

  return formData
}

/**
 * Dedicated Staff Service — handles all staff CRUD and MinIO interactions
 */
export const staffService = {
  async list(organizationId?: string): Promise<StaffMember[]> {
    const params = organizationId ? { organization_id: organizationId } : undefined
    const res = await apiClient.get<StaffMember[]>('/staff-details', { params })
    return Array.isArray(res.data) ? res.data : []
  },

  async getById(id: string): Promise<StaffMember> {
    const res = await apiClient.get<StaffMember>(`/staff-details/${id}`)
    return res.data
  },

  async create(input: StaffFormInput): Promise<StaffMember> {
    const formData = buildStaffFormData(input)
    const res = await apiClient.post<StaffMember>('/staff-details', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  async update(id: string, input: StaffFormInput): Promise<StaffMember> {
    const formData = buildStaffFormData(input)
    const res = await apiClient.patch<StaffMember>(`/staff-details/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/staff-details/${id}`)
  },

  async getDownloadUrl(fileKey: string): Promise<string> {
    const cleanKey = fileKey.startsWith('/') ? fileKey.substring(1) : fileKey
    const res = await apiClient.get<{ url?: string }>(
      `/minio/download?fileName=${encodeURIComponent(cleanKey)}`
    )
    if (!res.data?.url) throw new Error('File URL could not be generated')
    return res.data.url
  },
}
