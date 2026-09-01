import { apiClient } from '@/lib/api-client'
import type { LoginResponse, MeResponse, AuthUser } from '../types/types'

// ── Login ──────────────────────────────────────────────────────────────────

export async function loginApi(email: string, password: string): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', { email, password })
  return data
}

// ── OTP verification ───────────────────────────────────────────────────────

export async function verifyOtpApi(email: string, otp: string): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/auth/verify-otp', { email, otp })
  return data
}

// ── Forgot password — send OTP/link to email ──────────────────────────────

export async function forgotPasswordApi(email: string): Promise<void> {
  await apiClient.post('/auth/forgot-password', { email })
}

// ── Reset password with OTP ────────────────────────────────────────────────

export async function resetPasswordApi(
  email: string,
  otp: string,
  password: string,
): Promise<void> {
  await apiClient.post('/auth/reset-password', { email, otp, password })
}

// ── Get current user (session restore) ────────────────────────────────────

export async function getMeApi(): Promise<AuthUser> {
  const { data } = await apiClient.get<MeResponse>('/auth/me')
  return {
    id:              data.id,
    firstName:       data.firstName,
    lastName:        data.lastName,
    email:           data.email,
    role:            data.role as AuthUser['role'],
    institutionId:   data.institutionId,
    institutionName: data.institutionName,
    avatarUrl:       data.avatarUrl,
  }
}

// ── Logout ─────────────────────────────────────────────────────────────────

export async function logoutApi(): Promise<void> {
  await apiClient.post('/auth/logout')
}
