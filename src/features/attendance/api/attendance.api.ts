import { apiClient } from '@/lib/api-client'
import {
  attendanceListResponseSchema,
  attendanceRecordSchema,
  attendanceStatsSchema,
} from '../schemas/schemas'
import type {
  AttendanceListParams,
  AttendanceListResponse,
  AttendanceRecord,
  AttendanceStats,
  CreateAttendanceDto,
  UpdateAttendanceDto,
} from '../types/types'

const BASE = '/attendance'

// ── Get paginated list ─────────────────────────────────────────────────────

export async function getAttendances(params: AttendanceListParams = {}): Promise<AttendanceListResponse> {
  const response = await apiClient.get<unknown>(BASE, { params })
  return attendanceListResponseSchema.parse(response.data)
}

// ── Get single record ──────────────────────────────────────────────────────

export async function getAttendanceById(id: string): Promise<AttendanceRecord> {
  const response = await apiClient.get<unknown>(`${BASE}/${id}`)
  return attendanceRecordSchema.parse(response.data)
}

// ── Get stats ──────────────────────────────────────────────────────────────

export async function getAttendanceStats(
  params: Pick<AttendanceListParams, 'classId' | 'date' | 'type'>,
): Promise<AttendanceStats> {
  const response = await apiClient.get<unknown>(`${BASE}/stats`, { params })
  return attendanceStatsSchema.parse(response.data)
}

// ── Create ─────────────────────────────────────────────────────────────────

export async function createAttendance(payload: CreateAttendanceDto): Promise<AttendanceRecord> {
  const response = await apiClient.post<unknown>(BASE, payload)
  return attendanceRecordSchema.parse(response.data)
}

// ── Update ─────────────────────────────────────────────────────────────────

export async function updateAttendance(id: string, payload: UpdateAttendanceDto): Promise<AttendanceRecord> {
  const response = await apiClient.put<unknown>(`${BASE}/${id}`, payload)
  return attendanceRecordSchema.parse(response.data)
}

// ── Delete ─────────────────────────────────────────────────────────────────

export async function deleteAttendance(id: string): Promise<{ id: string }> {
  await apiClient.delete<unknown>(`${BASE}/${id}`)
  return { id }
}
