import type { z } from 'zod'
import type {
  loginSchema,
  otpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  loginResponseSchema,
  meResponseSchema,
} from '../schemas/schemas'
import type { UserRole } from '../enums/auth.enum'

// ── Form value types (inferred from Zod — zero duplication) ───────────────

export type LoginFormValues         = z.infer<typeof loginSchema>
export type OtpFormValues           = z.infer<typeof otpSchema>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormValues  = z.infer<typeof resetPasswordSchema>

// ── API response types ─────────────────────────────────────────────────────

export type LoginResponse = z.infer<typeof loginResponseSchema>
export type MeResponse    = z.infer<typeof meResponseSchema>

// ── Domain types ───────────────────────────────────────────────────────────

export interface AuthUser {
  id:              string
  firstName:       string
  lastName:        string
  email:           string
  role:            UserRole
  institutionId:   string
  institutionName: string
  avatarUrl?:      string
}

export interface AuthContextValue {
  user:            AuthUser | null
  isAuthenticated: boolean
  isInitialized:   boolean   // false while session restore is in progress
  isLoading:       boolean
  signIn:          (email: string, password: string) => Promise<LoginResponse>
  verifyOtp:       (email: string, otp: string) => Promise<void>
  signOut:         () => void
}
