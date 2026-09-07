import keycloak, { getKeycloakLogoutUrl } from '@/core/config/keycloak'
import type { LoginResponse, MeResponse, AuthUser } from '../types/types'
import { apiClient } from '@/lib/api-client'

// ── Login ──────────────────────────────────────────────────────────────────
export async function loginApi(_email?: string, _password?: string): Promise<LoginResponse> {
  // Keycloak uses redirect-based flow, so we don't actually post email/password here.
  // Instead, we trigger the login redirect.
  await keycloak.login();
  
  // This code theoretically won't be reached after a successful redirect, 
  // but we return a stub to satisfy types
  return {
    accessToken: keycloak.token || '',
    nextPage: 'dashboard',
    user: {} as AuthUser
  }
}

// ── Get current user (session restore) ────────────────────────────────────
export async function getMeApi(): Promise<AuthUser> {
  // If Keycloak is authenticated, we pull details from the Keycloak token
  if (keycloak.authenticated && keycloak.tokenParsed) {
    const roles = keycloak.realmAccess?.roles || [];
    let mappedRole = 'user';
    if (roles.includes('admin')) mappedRole = 'superadmin';
    if (roles.includes('organization')) mappedRole = 'organization';

    return {
      id: keycloak.subject || '',
      firstName: keycloak.tokenParsed.given_name || keycloak.tokenParsed.preferred_username,
      lastName: keycloak.tokenParsed.family_name || '',
      email: keycloak.tokenParsed.email || '',
      role: mappedRole as AuthUser['role'],
      institutionId: '',
      institutionName: '',
      avatarUrl: undefined,
    }
  }

  // Fallback to real API if needed
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
  if (keycloak.authenticated) {
    const logoutUrl = getKeycloakLogoutUrl(window.location.origin);
    window.location.href = logoutUrl;
    return;
  }
  await apiClient.post('/auth/logout')
}

// ── Other stubs ────────────────────────────────────────────────────────────
export async function verifyOtpApi(_email: string, _otp: string): Promise<LoginResponse> { return {} as LoginResponse; }
export async function forgotPasswordApi(_email: string): Promise<void> {}
export async function resetPasswordApi(_e: string, _o: string, _p: string): Promise<void> {}
