import type { LoginResponse, AuthUser } from '../types/types'
import { getToken } from '@/lib/auth-storage'
import { UserRole } from '../enums/auth.enum'
import { API_GATEWAY_URL } from '@/config/api.config'

// ── Login ──────────────────────────────────────────────────────────────────
export async function loginApi(email?: string, password?: string): Promise<LoginResponse> {
  const response = await fetch(`${API_GATEWAY_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Invalid credentials');
  }

  const data = await response.json();
  const normalizedRole = (data.user?.role === 'superadmin' || data.user?.role === UserRole.SuperAdmin) 
    ? UserRole.SuperAdmin 
    : data.user?.role;
  
  const orgName = data.organizationName || data.user?.organizationName || '';
  const mustChange = Boolean(data.mustChangePassword ?? data.user?.mustChangePassword);
  
  return {
    accessToken: data.access_token,
    nextPage: 'dashboard',
    mustChangePassword: mustChange,
    organizationName: orgName,
    user: {
      id: data.user?.id || '',
      firstName: orgName || data.user?.email || '',
      lastName: '',
      email: data.user?.email || '',
      role: normalizedRole,
      institutionId: '',
      institutionName: '',
      organizationName: orgName,
      mustChangePassword: mustChange,
    }
  }
}

// ── Change Password ────────────────────────────────────────────────────────
export async function changePasswordApi(
  email: string,
  currentPassword: string,
  newPassword: string
): Promise<LoginResponse> {
  const response = await fetch(`${API_GATEWAY_URL}/auth/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, currentPassword, newPassword })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to update password');
  }

  const data = await response.json();
  const normalizedRole = (data.user?.role === 'superadmin' || data.user?.role === UserRole.SuperAdmin) 
    ? UserRole.SuperAdmin 
    : data.user?.role;

  const orgName = data.organizationName || data.user?.organizationName || '';

  return {
    accessToken: data.access_token,
    nextPage: 'dashboard',
    mustChangePassword: false,
    organizationName: orgName,
    user: {
      id: data.user?.id || '',
      firstName: orgName || data.user?.email || '',
      lastName: '',
      email: data.user?.email || '',
      role: normalizedRole,
      institutionId: '',
      institutionName: '',
      organizationName: orgName,
      mustChangePassword: false,
    }
  }
}

// ── Get current user (session restore) ────────────────────────────────────
export async function getMeApi(): Promise<AuthUser> {
  const token = getToken();
  if (!token) throw new Error('No authentication token');

  const response = await fetch(`${API_GATEWAY_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Unauthorized');
  }

  const data = await response.json();
  const normalizedRole = (data.role === 'superadmin' || data.role === UserRole.SuperAdmin) 
    ? UserRole.SuperAdmin 
    : (data.role || 'user');

  return {
    id:              data.id || '',
    firstName:       data.organizationName || data.firstName || data.email || 'Super Admin',
    lastName:        data.lastName || '',
    email:           data.email || '',
    role:            normalizedRole as AuthUser['role'],
    institutionId:   data.institutionId || '',
    institutionName: data.institutionName || '',
    organizationName: data.organizationName || '',
    mustChangePassword: Boolean(data.mustChangePassword),
    avatarUrl:       data.avatarUrl,
  }
}

// ── Logout ─────────────────────────────────────────────────────────────────
export async function logoutApi(): Promise<void> {
  // JWT is cleared locally in sessionStorage
}

// ── Other stubs ────────────────────────────────────────────────────────────
export async function verifyOtpApi(_email: string, _otp: string): Promise<LoginResponse> { return {} as LoginResponse; }
export async function forgotPasswordApi(_email: string): Promise<void> {}
export async function resetPasswordApi(_e: string, _o: string, _p: string): Promise<void> {}
