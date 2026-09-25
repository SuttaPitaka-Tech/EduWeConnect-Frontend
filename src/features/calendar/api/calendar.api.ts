import { apiClient } from '@/lib/api-client'
import type { ChatContact } from '@/features/chat/api/chat.api'

export interface CreateMeetingPayload {
  meeting_subject: string
  meeting_date: string // YYYY-MM-DD
  start_time: string // e.g. 09:30:00 AM
  end_time: string // e.g. 10:30:00 AM
  attendees: ChatContact[]
  organizer_id?: string
  organizer_name?: string
  organizer_email?: string
  organizer_role?: string
}

export interface MeetingScheduleRecord {
  id: string
  meeting_subject: string
  meeting_date: string
  start_time: string
  end_time: string
  organizer_id: string
  organizer_name: string
  organizer_email: string | null
  organizer_role: string
  attendees: ChatContact[]
  attendee_ids: string[]
  status: string
  created_at: string
  updated_at: string
}

/**
 * Fetch all meetings scheduled for or by the current user
 */
export async function fetchMyMeetingsApi(): Promise<MeetingScheduleRecord[]> {
  const res = await apiClient.get('/meetings')
  return res.data || []
}

/**
 * Schedule a new meeting record in Meeting_schedules table
 */
export async function createMeetingScheduleApi(
  payload: CreateMeetingPayload,
): Promise<MeetingScheduleRecord> {
  const res = await apiClient.post('/meetings', payload)
  return res.data
}

/**
 * Delete / cancel a scheduled meeting
 */
export async function deleteMeetingScheduleApi(
  id: string,
): Promise<{ success: boolean }> {
  const res = await apiClient.delete(`/meetings/${id}`)
  return res.data
}
