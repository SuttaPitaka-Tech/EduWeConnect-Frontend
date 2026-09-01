import axios, { type AxiosError } from 'axios'
import { clearToken, clearStoredUser } from '@/lib/auth-storage'

/** Central Axios instance — all API calls go through this */
export const apiClient = axios.create({
  baseURL:         import.meta.env.VITE_API_URL ?? '/api',
  withCredentials: true,
  headers:         { 'Content-Type': 'application/json' },
  timeout:         15_000,
})

/** Attach Bearer token from sessionStorage on every request */
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('edu_access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

/**
 * 401 interceptor — clears session and triggers session-expired Dialog.
 * Uses window.showSessionExpired() registered by AuthProvider — never window.confirm() or alert().
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearToken()
      clearStoredUser()
      // Trigger session-expired <Dialog> in AuthProvider — not window.location redirect
      if (typeof window !== 'undefined' && !window.isSessionExpiredOpen) {
        window.showSessionExpired?.()
      }
    }
    return Promise.reject(error)
  },
)

/**
 * Extract a human-readable message from any API error.
 * MANDATORY in every mutation onError: toast.error(formatApiClientError(error, 'Fallback'))
 */
export function formatApiClientError(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as Record<string, unknown> | undefined
    if (typeof data?.message === 'string') return data.message
    if (typeof data?.error   === 'string') return data.error
  }
  if (error instanceof Error) return error.message
  return fallback
}
