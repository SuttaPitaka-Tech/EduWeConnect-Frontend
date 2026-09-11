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
  
  const isOrg = normalizedRole === UserRole.Organization;
  const userFirstName = isOrg ? (orgName || 'Organization') : (data.user?.firstName || data.user?.email || '');

  return {
    accessToken: data.access_token,
    nextPage: 'dashboard',
    mustChangePassword: mustChange,
    organizationName: orgName,
    user: {
      id: data.user?.id || '',
      firstName: userFirstName,
      lastName: data.user?.lastName || '',
      email: data.user?.email || '',
      role: normalizedRole,
      institutionId: data.user?.institutionId || '',
      institutionName: data.user?.institutionName || orgName,
      organizationName: orgName,
      employeeType: data.user?.employeeType,
      standard: data.user?.standard,
      rollNumber: data.user?.rollNumber,
      studentId: data.user?.studentId || data.user?.id,
      subjects: data.user?.subjects || [],
      mobileNumber: data.user?.mobileNumber,
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
  const isOrg = normalizedRole === UserRole.Organization;
  const userFirstName = isOrg ? (orgName || 'Organization') : (data.user?.firstName || data.user?.email || '');

  return {
    accessToken: data.access_token,
    nextPage: 'dashboard',
    mustChangePassword: false,
    organizationName: orgName,
    user: {
      id: data.user?.id || '',
      firstName: userFirstName,
      lastName: data.user?.lastName || '',
      email: data.user?.email || '',
      role: normalizedRole,
      institutionId: data.user?.institutionId || '',
      institutionName: data.user?.institutionName || orgName,
      organizationName: orgName,
      employeeType: data.user?.employeeType,
      standard: data.user?.standard,
      rollNumber: data.user?.rollNumber,
      studentId: data.user?.studentId || data.user?.id,
      subjects: data.user?.subjects || [],
      mobileNumber: data.user?.mobileNumber,
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

  const isOrg = normalizedRole === UserRole.Organization;
  const firstName = isOrg 
    ? (data.organizationName || 'Organization') 
    : (data.firstName || data.email || 'User');

  return {
    id:              data.id || '',
    firstName:       firstName,
    lastName:        data.lastName || '',
    email:           data.email || '',
    role:            normalizedRole as AuthUser['role'],
    institutionId:   data.institutionId || '',
    institutionName: data.institutionName || data.organizationName || '',
    organizationName: data.organizationName || '',
    employeeType:    data.employeeType,
    standard:        data.standard,
    rollNumber:      data.rollNumber,
    studentId:       data.studentId || data.id,
    subjects:        data.subjects || [],
    mobileNumber:    data.mobileNumber,
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
