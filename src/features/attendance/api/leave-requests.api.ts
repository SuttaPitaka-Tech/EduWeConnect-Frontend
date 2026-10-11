import { apiClient } from '@/lib/api-client';

export interface LeaveRequestItem {
  id: string;
  userId: string;
  name: string;
  role: 'STUDENT' | 'STAFF';
  subInfo: string;
  avatar: string;
  organizationId: string;
  requestType: string;
  durationType: string;
  fromDate?: string;
  toDate?: string;
  dateRange: string;
  leaveCategory: string;
  note: string;
  status: 'pending' | 'approved' | 'declined';
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  reviewNote?: string | null;
  createdAt: string;
  updatedAt: string;
  timeAgo: string;
}

export interface LeaveRequestsSummaryCounts {
  all: number;
  pending: number;
  approved: number;
  declined: number;
  staff: number;
  student: number;
}

export interface FetchLeaveRequestsResponse {
  status: string;
  items: LeaveRequestItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  counts: LeaveRequestsSummaryCounts;
}

export interface FetchLeaveRequestsParams {
  organizationId?: string;
  role?: 'all' | 'staff' | 'student';
  status?: 'all' | 'pending' | 'approved' | 'declined';
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateLeaveRequestPayload {
  userId?: string;
  name?: string;
  role?: 'STUDENT' | 'STAFF';
  subInfo?: string;
  avatar?: string;
  organizationId: string;
  requestType?: 'leave' | 'half' | 'regularization';
  durationType?: string;
  fromDate?: string;
  toDate?: string;
  dateRange?: string;
  leaveCategory: string;
  note?: string;
}

/**
 * Fetch paginated leave requests for an organization
 */
export async function fetchLeaveRequestsApi(
  params: FetchLeaveRequestsParams,
): Promise<FetchLeaveRequestsResponse> {
  const response = await apiClient.get<FetchLeaveRequestsResponse>(
    '/attendance/requests',
    { params },
  );
  return response.data;
}

/**
 * Submit a new leave or half-day request
 */
export async function createLeaveRequestApi(
  payload: CreateLeaveRequestPayload,
): Promise<{ status: string; message: string; data: LeaveRequestItem }> {
  const response = await apiClient.post<{
    status: string;
    message: string;
    data: LeaveRequestItem;
  }>('/attendance/requests', payload);
  return response.data;
}

/**
 * Approve a leave request
 */
export async function approveLeaveRequestApi(
  id: string,
  reviewedBy?: string,
): Promise<{ status: string; message: string; data: LeaveRequestItem }> {
  const response = await apiClient.post<{
    status: string;
    message: string;
    data: LeaveRequestItem;
  }>(`/attendance/requests/${id}/approve`, { reviewedBy });
  return response.data;
}

/**
 * Decline a leave request
 */
export async function declineLeaveRequestApi(
  id: string,
  reviewedBy?: string,
  reviewNote?: string,
): Promise<{ status: string; message: string; data: LeaveRequestItem }> {
  const response = await apiClient.post<{
    status: string;
    message: string;
    data: LeaveRequestItem;
  }>(`/attendance/requests/${id}/decline`, { reviewedBy, reviewNote });
  return response.data;
}

/**
 * Save daily attendance (creates pending approval for half-day / leave automatically)
 */
export async function saveAttendanceApi(payload: {
  date: string;
  status: string;
  userId?: string;
  userName?: string;
  userType?: string;
  organizationId?: string;
  startTime?: string;
  startPeriod?: string;
  endTime?: string;
  endPeriod?: string;
  totalHours?: string;
  feedback?: string;
  reason?: string;
  absentReason?: string;
  leaveReason?: string;
  documentFileName?: string;
  documentFileKey?: string;
  documentFileUrl?: string;
  documentMimeType?: string;
  documentFileSize?: number;
}): Promise<{ status: string; message: string; data: any }> {
  const response = await apiClient.post<{
    status: string;
    message: string;
    data: any;
  }>('/attendance/save', payload);
  return response.data;
}

/**
 * Fetch attendance logs for a user or organization
 */
export async function fetchAttendanceLogsApi(params: {
  date?: string;
  startDate?: string;
  endDate?: string;
  userId?: string;
  organizationId?: string;
}): Promise<{ status: string; count: number; data: any[] }> {
  const response = await apiClient.get<{
    status: string;
    count: number;
    data: any[];
  }>('/attendance/logs', { params });
  return response.data;
}
