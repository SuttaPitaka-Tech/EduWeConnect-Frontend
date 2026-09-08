import type { z } from 'zod'
import type {
  loginSchema,
  otpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../schemas/schemas'
import type { UserRole } from '../enums/auth.enum'

// ── Form value types ───────────────────────────────────────────────────────
export type LoginFormValues          = z.infer<typeof loginSchema>
export type OtpFormValues            = z.infer<typeof otpSchema>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormValues  = z.infer<typeof resetPasswordSchema>

// ── API response types (aligned with MySQL database) ───────────────────────
export interface LoginResponse {
  accessToken: string
  refreshToken?: string
  nextPage?: string
  mustChangePassword?: boolean
  organizationName?: string
  user: AuthUser
}

export interface MeResponse {
  id: string
  email: string
  role: UserRole
  firstName?: string
  lastName?: string
  organizationName?: string
  mustChangePassword?: boolean
}

// ── Domain types ───────────────────────────────────────────────────────────
export interface AuthUser {
  id:              string
  firstName:       string
  lastName:        string
  email:           string
  role:            UserRole
  institutionId?:  string
  institutionName?: string
  organizationName?: string
  mustChangePassword?: boolean
  avatarUrl?:      string
}

export interface AuthContextValue {
  user:            AuthUser | null
  isAuthenticated: boolean
  isInitialized:   boolean
  isLoading:       boolean
  signIn:          (email: string, password: string) => Promise<LoginResponse>
  changePassword:  (email: string, currentPassword: string, newPassword: string) => Promise<LoginResponse>
  verifyOtp:       (email: string, otp: string) => Promise<void>
  signOut:         () => void
}
