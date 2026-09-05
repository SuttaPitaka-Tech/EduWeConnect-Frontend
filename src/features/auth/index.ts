// Auth feature public barrel — import only from '@/features/auth'

export { useAuth }                               from '@/contexts/auth-context'
export { AuthProvider }                          from '@/contexts/auth-context'
export { loginApi, logoutApi, getMeApi,
         forgotPasswordApi, verifyOtpApi,
         resetPasswordApi }                      from './api/auth.api'
export { authKeys }                              from './queries/keys'
export { AuthJourney, AuthNextPage, UserRole }   from './enums/auth.enum'
export {
  loginSchema, otpSchema,
  forgotPasswordSchema, resetPasswordSchema,
  registerSchema,
  loginResponseSchema, meResponseSchema,
}                                                from './schemas/schemas'
export { mapToAuthUser, getDisplayName, getRoleLabel } from './utils/auth-utils'
export type {
  AuthUser, AuthContextValue,
  LoginFormValues, OtpFormValues,
  ForgotPasswordFormValues, ResetPasswordFormValues,
  RegisterFormValues,
  LoginResponse, MeResponse,
}                                                from './types/types'
