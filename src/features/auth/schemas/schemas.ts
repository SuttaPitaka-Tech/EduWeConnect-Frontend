import { z } from 'zod'

// ── Login Form Schema ──────────────────────────────────────────────────────
export const loginSchema = z.object({
  email:    z.string().trim().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
})

// ── OTP Form Schema ────────────────────────────────────────────────────────
export const otpSchema = z.object({
  otp:   z.string().length(6, 'OTP must be exactly 6 digits').regex(/^\d+$/, 'OTP must be numeric'),
  email: z.string().email(),
})

// ── Forgot Password Schema ─────────────────────────────────────────────────
export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
})

// ── Reset Password Schema ──────────────────────────────────────────────────
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
