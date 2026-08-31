/**
 * auth-storage.ts — Centralized sessionStorage util for auth tokens & user.
 * All auth state reads/writes go through here — never direct sessionStorage in components.
 */

const TOKEN_KEY         = 'edu_access_token'
const USER_KEY          = 'edu_auth_user'
const EXPLICIT_LOGOUT   = 'edu_explicit_logout'

// ── Token ──────────────────────────────────────────────────────────────────

export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY)?.trim() || null
}

export function setToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token.trim())
}

export function clearToken(): void {
  sessionStorage.removeItem(TOKEN_KEY)
}

// ── Stored user (for instant session restore on refresh) ───────────────────

import type { AuthUser } from '@/features/auth/types/types'

export function getStoredUser(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export function setStoredUser(user: AuthUser): void {
  sessionStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearStoredUser(): void {
  sessionStorage.removeItem(USER_KEY)
}

// ── Explicit logout flag — prevents session restore after manual logout ─────

export function markExplicitLogout(): void {
  sessionStorage.setItem(EXPLICIT_LOGOUT, '1')
}

export function clearExplicitLogout(): void {
  sessionStorage.removeItem(EXPLICIT_LOGOUT)
}

export function wasExplicitLogout(): boolean {
  return sessionStorage.getItem(EXPLICIT_LOGOUT) === '1'
}
