/**
 * AuthContext — IEBA+MNC pattern:
 * - Session stored in TanStack Query (AUTH_SESSION_QUERY_KEY) with staleTime: Infinity
 * - Token + user persisted in sessionStorage via auth-storage.ts utils
 * - markExplicitLogout() prevents session restore after manual signOut
 * - 401 interceptor in api-client.ts triggers window.showSessionExpired()
 * - Session expired shown via <Dialog> — never window.confirm()
 * - useEffect is completely BANNED — session restore via useQuery queryFn
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogFooter, Button } from '@/components/ui'
import { getMeApi, loginApi, logoutApi, verifyOtpApi } from '@/features/auth/api/auth.api'
import {
  getToken,
  setToken,
  clearToken,
  getStoredUser,
  setStoredUser,
  clearStoredUser,
  markExplicitLogout,
  clearExplicitLogout,
  wasExplicitLogout,
} from '@/lib/auth-storage'
import type { AuthUser, AuthContextValue, LoginResponse } from '@/features/auth/types/types'
import { authKeys } from '@/features/auth/queries/keys'

// ── Session expired dialog — triggered by 401 interceptor in api-client.ts ─

declare global {
  interface Window {
    showSessionExpired?: () => void
    isSessionExpiredOpen?: boolean
  }
}

// ── Context ────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null)

// ── Provider ───────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const navigate    = useNavigate()
  const [sessionExpired, setSessionExpired] = useState(false)
  const [authLoading, setAuthLoading]       = useState(false)

  // Register global session expired trigger (called by api-client 401 interceptor)
  if (typeof window !== 'undefined') {
    window.showSessionExpired = () => {
      setSessionExpired(true)
      window.isSessionExpiredOpen = true
    }
  }

  // ── Session restore via useQuery (replaces useEffect) ────────────────────
  const { data: queryUser, isLoading: sessionLoading } = useQuery<AuthUser | null>({
    queryKey: authKeys.session(),
    queryFn: async () => {
      const token      = getToken()
      const storedUser = getStoredUser()

      // Fast path — token + cached user in sessionStorage
      if (token && storedUser) return storedUser

      // If no token exists or explicit logout, user is not logged in
      if (!token || wasExplicitLogout()) return null

      // If token exists without stored user, fetch profile from server
      try {
        const user = await getMeApi()
        setStoredUser(user)
        return user
      } catch {
        clearToken()
        clearStoredUser()
        return null
      }
    },
    staleTime: Infinity,   // Session never auto-refetches — only on explicit action
    retry:     false,
  })

  const user: AuthUser | null = queryUser ?? null

  // ── Sign in ───────────────────────────────────────────────────────────────

  const signIn = useCallback(
    async (email: string, password: string): Promise<LoginResponse> => {
      clearExplicitLogout()
      setAuthLoading(true)
      try {
        const result = await loginApi(email, password)

        // If backend requires OTP next — don't set token yet
        if (result.nextPage === 'otp') {
          return result
        }

        setToken(result.accessToken)
        setStoredUser(result.user as AuthUser)
        queryClient.setQueryData<AuthUser | null>(authKeys.session(), result.user as AuthUser)
        return result
      } finally {
        setAuthLoading(false)
      }
    },
    [queryClient],
  )

  // ── Verify OTP (completes login after OTP step) ───────────────────────────

  const verifyOtp = useCallback(
    async (email: string, otp: string): Promise<void> => {
      setAuthLoading(true)
      try {
        const result = await verifyOtpApi(email, otp)
        setToken(result.accessToken)
        setStoredUser(result.user as AuthUser)
        queryClient.setQueryData<AuthUser | null>(authKeys.session(), result.user as AuthUser)
        navigate('/attendance', { replace: true })
      } finally {
        setAuthLoading(false)
      }
    },
    [queryClient, navigate],
  )

  // ── Sign out ──────────────────────────────────────────────────────────────

  const signOut = useCallback(() => {
    markExplicitLogout()
    void logoutApi().catch(() => { /* backend may already have cleared cookie */ })
    clearToken()
    clearStoredUser()
    queryClient.setQueryData<AuthUser | null>(authKeys.session(), null)
    queryClient.removeQueries({
      predicate: (q) => q.queryKey[0] !== 'auth',
    })
    toast.success('Logged out successfully')
    navigate('/login', { replace: true })
  }, [queryClient, navigate])

  // ── Session expired confirm ───────────────────────────────────────────────

  const handleSessionExpiredOk = useCallback(() => {
    setSessionExpired(false)
    window.isSessionExpiredOpen = false
    signOut()
  }, [signOut])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isInitialized:   !sessionLoading,
      isLoading:       sessionLoading || authLoading,
      signIn,
      verifyOtp,
      signOut,
    }),
    [user, sessionLoading, authLoading, signIn, verifyOtp, signOut],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}

      {/* Session Expired Dialog — triggered by api-client.ts 401 interceptor */}
      <Dialog open={sessionExpired} onOpenChange={setSessionExpired}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Your session has expired. Please log in again to continue.
            </p>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleSessionExpiredOk}>
              Log in again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthContext.Provider>
  )
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx   
}
