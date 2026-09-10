import { apiClient } from '@/lib/api-client'

export interface OrganizationDetailsRecord {
  id: string
  organization_name: string
  organization_email: string
  organization_type?: string
  organization_std?: string[]
}

export interface StudentMember {
  id: string
  organization_id?: string
  standard: string
  roll_number?: string | null
  student_name: string
  student_aadhar_number?: string | null
  student_aadhar_file_id?: string | null
  contact_mobile?: string | null
  contact_email?: string | null
  father_name?: string | null
  mother_name?: string | null
  father_mobile?: string | null
  mother_mobile?: string | null
  father_email?: string | null
  mother_email?: string | null
  country?: string | null
  state?: string | null
  district?: string | null
  current_address?: string | null
  permanent_address?: string | null
  emergency_person_name?: string | null
  emergency_person_mobile?: string | null
  emergency_person_relation?: string | null
  status: string
  created_at: string
  updated_at: string
}

export interface StudentFormInput {
  organizationId?: string
  standard: string
  studentName: string
  aadharNumber?: string
  aadharFile?: File | null
  contactMobile?: string
  contactEmail?: string
  fatherName?: string
  motherName?: string
  fatherMobile?: string
  motherMobile?: string
  fatherEmail?: string
  motherEmail?: string
  country?: string
  state?: string
  district?: string
  currentAddress?: string
  permanentAddress?: string
  emergencyName?: string
  emergencyMobile?: string
  emergencyRelation?: string
}

/**
 * Builds FormData for student creation and updates, allowing seamless MinIO file uploads.
 */
export function buildStudentFormData(input: StudentFormInput): FormData {
  const formData = new FormData()

  const textFields: Record<string, string | undefined | null> = {
    organization_id: input.organizationId?.trim(),
    standard: input.standard?.trim(),
    student_name: input.studentName?.trim(),
    student_aadhar_number: input.aadharNumber?.trim(),
    contact_mobile: input.contactMobile?.trim(),
    contact_email: input.contactEmail?.trim(),
    father_name: input.fatherName?.trim(),
    mother_name: input.motherName?.trim(),
    father_mobile: input.fatherMobile?.trim(),
    mother_mobile: input.motherMobile?.trim(),
    father_email: input.fatherEmail?.trim(),
    mother_email: input.motherEmail?.trim(),
    country: input.country?.trim() || 'India',
    state: input.state?.trim(),
    district: input.district?.trim(),
    current_address: input.currentAddress?.trim(),
    permanent_address: input.permanentAddress?.trim(),
    emergency_person_name: input.emergencyName?.trim(),
    emergency_person_mobile: input.emergencyMobile?.trim(),
    emergency_person_relation: input.emergencyRelation?.trim(),
  }

  for (const [key, value] of Object.entries(textFields)) {
    if (value !== undefined && value !== null && value !== '') {
      formData.append(key, value)
    }
  }

  if (input.aadharFile) {
    formData.append('aadharFile', input.aadharFile)
  }

  return formData
}

/**
 * Dedicated Student & Academic Service
 * Manages standards retrieval, student lifecycle, and document storage directly through backend & MinIO.
 */
export const studentService = {
  /**
   * Retrieves the approved standards strictly from the database for the active institution.
   */
  async getApprovedStandards(organizationId?: string): Promise<string[]> {
    if (organizationId) {
      const res = await apiClient.get<OrganizationDetailsRecord>(`/organization-details/${organizationId}`)
      if (Array.isArray(res.data?.organization_std)) {
        return res.data.organization_std
      }
    }

    const res = await apiClient.get<OrganizationDetailsRecord[]>('/organization-details')
    if (Array.isArray(res.data) && res.data.length > 0) {
      const org = organizationId
        ? res.data.find((o) => o.id === organizationId) || res.data[0]
        : res.data[0]

      if (Array.isArray(org?.organization_std)) {
        return org.organization_std
      }
    }

    return []
  },

  /**
   * Lists students with optional organization and standard filters.
   */
  async list(organizationId?: string, standard?: string): Promise<StudentMember[]> {
    const params: Record<string, string> = {}
    if (organizationId) params.organization_id = organizationId
    if (standard) params.standard = standard

    const res = await apiClient.get<StudentMember[]>('/student-details', { params })
    return Array.isArray(res.data) ? res.data : []
  },

  /**
   * Fetches single student record by UUID.
   */
  async getById(id: string): Promise<StudentMember> {
    const res = await apiClient.get<StudentMember>(`/student-details/${id}`)
    return res.data
  },

  /**
   * Creates a student record with multipart form data and Aadhaar upload to MinIO.
   */
  async create(input: StudentFormInput): Promise<StudentMember> {
    const formData = buildStudentFormData(input)
    const res = await apiClient.post<StudentMember>('/student-details', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  /**
   * Updates student details.
   */
  async update(id: string, input: StudentFormInput): Promise<StudentMember> {
    const formData = buildStudentFormData(input)
    const res = await apiClient.patch<StudentMember>(`/student-details/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  /**
   * Deletes a student and cleans up MinIO documents.
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/student-details/${id}`)
  },

  /**
   * Retrieves presigned secure download URL for MinIO stored documents.
   */
  async getDownloadUrl(fileKey: string): Promise<string> {
    const cleanKey = fileKey.startsWith('/') ? fileKey.substring(1) : fileKey
    const res = await apiClient.get<{ url?: string }>(
      `/minio/download?fileName=${encodeURIComponent(cleanKey)}`
    )
    if (!res.data?.url) throw new Error('File URL could not be generated')
    return res.data.url
  },
}
