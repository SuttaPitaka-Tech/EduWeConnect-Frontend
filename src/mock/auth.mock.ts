/**
 * mock/auth.mock.ts
 * Mock data for auth module — used until backend is integrated.
 * Remove VITE_USE_MOCK=true from .env.local when backend is ready.
 */

import type { AuthUser } from '@/features/auth/types/types'
import type { LoginResponse } from '@/features/auth/types/types'

export const MOCK_AUTH_USER: AuthUser = {
  id:              'usr_001',
  firstName:       'Super',
  lastName:        'Admin',
  email:           'admin',
  role:            'super_admin',
  institutionId:   'inst_001',
  institutionName: 'EduWeConnect Demo School',
  avatarUrl:       undefined,
}

export const MOCK_LOGIN_RESPONSE: LoginResponse = {
  accessToken:  'mock_access_token_eduweconnect_2026',
  refreshToken: 'mock_refresh_token_eduweconnect_2026',
  nextPage:     'dashboard',
  user: {
    id:              'usr_001',
    firstName:       'Super',
    lastName:        'Admin',
    email:           'superadmin',
    role:            'super_admin',
    institutionId:   'inst_001',
    institutionName: 'EduWeConnect Demo School',
  },
}

export const MOCK_LOGIN_RESPONSE_OTP: LoginResponse = {
  accessToken:  '',
  nextPage:     'otp',
  user: {
    id:              'usr_001',
    firstName:       'Super',
    lastName:        'Admin',
    email:           'superadmin',
    role:            'super_admin',
    institutionId:   'inst_001',
    institutionName: 'EduWeConnect Demo School',
  },
}
