/**
 * EduWeConnect App Router — MNC Enterprise Pattern
 *
 * - All feature pages lazy-loaded via lazyWithRetry()
 * - Each route has loader() that pre-invalidates cache on navigation
 * - AuthProvider wraps entire tree (inside RouterProvider so useNavigate works)
 * - GuestOnlyRoute  → redirects logged-in users away from /login etc.
 * - ProtectedRoute  → redirects unauthenticated users to /login
 * - createAppRouter(queryClient) factory — no circular import with main.tsx
 *
 * NEW MODULES: Add lazily here when developed. Follow attendance pattern.
 */

import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Suspense } from 'react'
import type { QueryClient } from '@tanstack/react-query'
import { Spinner } from '@/components/ui'
import { lazyWithRetry } from '@/lib/lazy-with-retry'
import { ProtectedRoute } from '@/components/protected-route'
import { GuestOnlyRoute } from '@/components/guest-only-route'
import { AuthProvider }   from '@/contexts/auth-context'

// ── Auth pages ──────────────────────────────────────────────────────────────
const LandingPage        = lazyWithRetry(() => import('@/pages/landing-page/landing-page'))
const RegisterPage       = lazyWithRetry(() => import('@/pages/register-page/register-page'))
const ForgotPasswordPage = lazyWithRetry(() => import('@/features/auth/pages/forgot-password-page'))
const OtpPage            = lazyWithRetry(() => import('@/features/auth/pages/otp-page'))

// ── Layouts ──────────────────────────────────────────────────────────────────
const DashboardLayout = lazyWithRetry(() => import('@/layouts/dashboard-layout'))

// ── Attendance (fully implemented reference module) ──────────────────────────
const AttendancePage = lazyWithRetry(() => import('@/features/attendance/pages/attendance-page'))
const UiShowcasePage = lazyWithRetry(() => import('@/pages/ui-showcase-page'))

// ── Page-level loading fallback ───────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="flex h-64 w-full items-center justify-center">
      <Spinner size={36} />
    </div>
  )
}

function Lazy({ children }: { children: JSX.Element }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

// ── Router factory ────────────────────────────────────────────────────────────
export function createAppRouter(queryClient: QueryClient) {
  return createBrowserRouter([

    // ── Public Landing Page ──────────────────────────────────────────────────
    {
      path: '/',
      element: (
        <AuthProvider>
          <GuestOnlyRoute><Lazy><LandingPage /></Lazy></GuestOnlyRoute>
        </AuthProvider>
      ),
    },

    // ── Protected app shell ──────────────────────────────────────────────────
    {
      path: '/app',
      element: (
        <AuthProvider>
          <ProtectedRoute>
            <Lazy><DashboardLayout /></Lazy>
          </ProtectedRoute>
        </AuthProvider>
      ),
      children: [
        // Root redirect → Attendance module directly
        { index: true, element: <Navigate to="/app/attendance" replace /> },

        // Attendance — fully developed reference module
        {
          path: 'attendance',
          element: <Lazy><AttendancePage /></Lazy>,
          loader: async () => {
            const { attendanceKeys } = await import('@/features/attendance/queries/keys')
            await queryClient.invalidateQueries({ queryKey: attendanceKeys.all, refetchType: 'all' })
            return null
          },
        },

        // UI Showcase Page
        {
          path: 'ui-showcase',
          element: <Lazy><UiShowcasePage /></Lazy>,
        },

        // ── ADD NEW MODULES HERE as they are developed ───────────────────────
      ],
    },

    // ── Guest-only auth routes ───────────────────────────────────────────────
    {
      path: '/login',
      element: (
        <AuthProvider>
          <GuestOnlyRoute><Lazy><LandingPage /></Lazy></GuestOnlyRoute>
        </AuthProvider>
      ),
    },
    {
      path: '/register',
      element: <Lazy><RegisterPage /></Lazy>,
    },
    {
      path: '/forgot-password',
      element: (
        <AuthProvider>
          <GuestOnlyRoute><Lazy><ForgotPasswordPage /></Lazy></GuestOnlyRoute>
        </AuthProvider>
      ),
    },
    {
      path: '/otp',
      element: (
        <AuthProvider>
          <GuestOnlyRoute><Lazy><OtpPage /></Lazy></GuestOnlyRoute>
        </AuthProvider>
      ),
    },

    // Catch-all
    { path: '*', element: <Navigate to="/" replace /> },
  ], {
    future: {
      v7_relativeSplatPath: true,
    },
  })
}

// ── Singleton — same router instance throughout app lifetime ──────────────────
let _router: ReturnType<typeof createAppRouter> | null = null

export function getRouter(queryClient: QueryClient) {
  if (!_router) _router = createAppRouter(queryClient)
  return _router
}
