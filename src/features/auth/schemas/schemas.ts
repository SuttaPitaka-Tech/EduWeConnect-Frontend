import { z } from 'zod'

// ── Login ──────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email:    z.string().trim().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

// ── OTP ───────────────────────────────────────────────────────────────────

export const otpSchema = z.object({
  otp:   z.string().length(6, 'OTP must be exactly 6 digits').regex(/^\d+$/, 'OTP must be numeric'),
  email: z.string().email(),    // passed through from login step
})

// ── Forgot Password ────────────────────────────────────────────────────────

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
})

// ── Reset Password ─────────────────────────────────────────────────────────

export const resetPasswordSchema = z
  .object({
    otp:             z.string().length(6, 'OTP must be 6 digits'),
    password:        z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path:    ['confirmPassword'],
  })

// ── Register ───────────────────────────────────────────────────────────────

export const registerSchema = z
  .object({
    userType:        z.string().min(1, 'Please select a user type'),
    fullName:        z.string().trim().min(2, 'Full name is required'),
    email:           z.string().trim().email('Enter a valid email address'),
    password:        z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    acceptTerms:     z.boolean().refine((v) => v === true, 'You must accept the terms'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path:    ['confirmPassword'],
  })

// ── API response shapes ────────────────────────────────────────────────────

export const loginResponseSchema = z.object({
  accessToken:  z.string(),
  refreshToken: z.string().optional(),
  nextPage:     z.string().optional(),   // 'otp' | 'dashboard'
  user: z.object({
    id:            z.string(),
    firstName:     z.string(),
    lastName:      z.string(),
    email:         z.string(),
    role:          z.string(),
    institutionId: z.string(),
    institutionName: z.string(),
    avatarUrl:     z.string().optional(),
  }),
})

export const meResponseSchema = z.object({
  id:              z.string(),
  firstName:       z.string(),
  lastName:        z.string(),
  email:           z.string(),
  role:            z.string(),
  institutionId:   z.string(),
  institutionName: z.string(),
  avatarUrl:       z.string().optional(),
})
