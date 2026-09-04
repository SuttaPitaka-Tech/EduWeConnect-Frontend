import { z } from 'zod'

// ── Login ──────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email:    z.string().trim().min(1, 'Email or username is required'),
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

export const registerSchema = z.object({
  organizationEmail: z
    .string()
    .trim()
    .min(1, 'Organization email is required')
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Enter a valid email containing "@" and "." (e.g. name@domain.com)',
    ),
  organizationName: z.string().trim().min(2, 'Organization name is required'),
  organizationMobile: z
    .string()
    .trim()
    .min(1, 'Mobile number is required')
    .regex(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits'),
  organizationType: z.string().min(1, 'Select an organization type'),
  address: z.string().trim().min(3, 'Address is required'),
  city: z.string().trim().min(1, 'City/Village is required'),
  district: z.string().trim().min(1, 'District is required'),
  pincode: z.string().trim().min(1, 'Pin code is required'),
  state: z.string().trim().min(1, 'State is required'),
  country: z.string().trim().min(1, 'Country is required'),
  
  // Document Uploads
  panNumber: z.string().trim().min(1, 'PAN number is required'),
  panFile: z.any().refine((val) => val !== null && val !== undefined && val !== '', 'PAN file is required'),
  gstNumber: z.string().trim().min(1, 'GST number is required'),
  gstFile: z.any().refine((val) => val !== null && val !== undefined && val !== '', 'GST file is required'),
  regCertNumber: z.string().trim().min(1, 'Registration number is required'),
  regCertFile: z.any().refine((val) => val !== null && val !== undefined && val !== '', 'Registration certificate is required'),
  otherDocuments: z.array(
    z.object({
      name: z.string().trim().min(1, 'Document name is required'),
      file: z.any().refine((val) => val !== null && val !== undefined && val !== '', 'File is required')
    })
  ).optional(),

  // Organization Head Details
  orgHeadEmail: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Enter a valid email containing "@" and "." (e.g. name@domain.com)',
    ),
  orgHeadMobile: z
    .string()
    .trim()
    .min(1, 'Mobile number is required')
    .regex(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits'),
  orgHeadFirstName: z.string().trim().min(1, 'First name is required'),
  orgHeadMiddleName: z.string().trim().optional(),
  orgHeadLastName: z.string().trim().min(1, 'Last name is required'),
  orgHeadAadharNumber: z.string().trim().min(12, 'Enter a valid Aadhar number'),
  orgHeadAadharFile: z.any().refine((val) => val !== null && val !== undefined && val !== '', 'Aadhar card file is required'),
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
