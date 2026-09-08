/* @refresh reset */
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

import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { Suspense } from 'react'
import type { QueryClient } from '@tanstack/react-query'
import { PageSpinner } from '@/components/ui'
import { lazyWithRetry } from '@/lib/lazy-with-retry'
import { ProtectedRoute } from '@/components/protected-route'
import { GuestOnlyRoute } from '@/components/guest-only-route'
import { AuthProvider } from '@/contexts/auth-context'

// ── Pages ──────────────────────────────────────────────────────────────────
const LandingPage = lazyWithRetry(() => import('@/pages/landing-page'))
const LoginPage = lazyWithRetry(() => import('@/features/auth/pages/login-page'))
const RegisterPage = lazyWithRetry(() => import('@/features/auth/pages/register-page'))
const ForgotPasswordPage = lazyWithRetry(() => import('@/features/auth/pages/forgot-password-page'))
const OtpPage = lazyWithRetry(() => import('@/features/auth/pages/otp-page'))
const RegisterDetailsPage = lazyWithRetry(() => import('@/features/onboarding/pages/register-details-page'))

// ── Layouts ──────────────────────────────────────────────────────────────────
const PublicLayout      = lazyWithRetry(() => import('@/layouts/public-layout'))
const DashboardLayout   = lazyWithRetry(() => import('@/layouts/dashboard-layout'))
const SuperAdminLayout  = lazyWithRetry(() => import('@/layouts/superadmin-layout'))

// ── Attendance (fully implemented reference module) ──────────────────────────
const AttendancePage = lazyWithRetry(() => import('@/features/attendance/pages/attendance-page'))
const UiShowcasePage = lazyWithRetry(() => import('@/pages/ui-showcase-page'))

// ── Superadmin ───────────────────────────────────────────────────────────────
const SuperAdminDashboard = lazyWithRetry(() => import('@/features/superadmin/pages/superadmin-dashboard'))
const SuperAdminApprovals = lazyWithRetry(() => import('@/features/superadmin/pages/superadmin-approvals'))

// ── Page-level loading fallback ───────────────────────────────────────────────
function PageLoader() {
  return <PageSpinner />
}

function Lazy({ children }: { children: JSX.Element }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

// ── Router factory ────────────────────────────────────────────────────────────
export function createAppRouter(queryClient: QueryClient) {
  return createBrowserRouter([
    {
      element: (
        <AuthProvider>
          <Outlet />
        </AuthProvider>
      ),
      children: [
        // ── Public pages (header + footer via PublicLayout) ──────────────────────
        {
          element: (
            <GuestOnlyRoute><Lazy><PublicLayout /></Lazy></GuestOnlyRoute>
          ),
          children: [
            { path: '/', element: <Lazy><LandingPage /></Lazy> },
          ],
        },

        // ── Protected app shell ──────────────────────────────────────────────────
        {
          path: '/app',
          element: (
            <ProtectedRoute>
              <Lazy><DashboardLayout /></Lazy>
            </ProtectedRoute>
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

        // ── Superadmin App Shell ────────────────────────────────────────────────
        {
          path: '/superadmin',
          element: (
            <ProtectedRoute>
              <Lazy><SuperAdminLayout /></Lazy>
            </ProtectedRoute>
          ),
          children: [
            { index: true, element: <Navigate to="/superadmin/dashboard" replace /> },
            { path: 'dashboard', element: <Lazy><SuperAdminDashboard /></Lazy> },
            { path: 'approval', element: <Lazy><SuperAdminApprovals /></Lazy> },
            { path: 'approvals', element: <Navigate to="/superadmin/approval" replace /> },
            { path: 'create-organization', element: <Navigate to="/superadmin/approval" replace /> },
          ],
        },
        {
          path: '/app/superadmin/*',
          element: <Navigate to="/superadmin/dashboard" replace />,
        },

        // ── Guest-only auth routes (no public header/footer) ──────────────────────
        {
          path: '/login',
          element: (
            <GuestOnlyRoute><Lazy><LoginPage /></Lazy></GuestOnlyRoute>
          ),
        },
        {
          path: '/register',
          element: (
            <GuestOnlyRoute><Lazy><RegisterPage /></Lazy></GuestOnlyRoute>
          ),
        },
        {
          path: '/register/details',
          element: (
            <GuestOnlyRoute><Lazy><RegisterDetailsPage /></Lazy></GuestOnlyRoute>
          ),
        },
        {
          path: '/forgot-password',
          element: (
            <GuestOnlyRoute><Lazy><ForgotPasswordPage /></Lazy></GuestOnlyRoute>
          ),
        },
        {
          path: '/otp',
          element: (
            <GuestOnlyRoute><Lazy><OtpPage /></Lazy></GuestOnlyRoute>
          ),
        },

        // ── Dev/Design Tools (no auth required) ─────────────────────────────────
        {
          path: '/ui-showcase',
          element: (
            <Lazy><DashboardLayout /></Lazy>
          ),
          children: [
            { index: true, element: <Lazy><UiShowcasePage /></Lazy> },
          ],
        },
        {
          // Test route — view AppHeader/AppFooter without login
          path: '/test/attendance',
          element: (
            <Lazy><DashboardLayout /></Lazy>
          ),
          children: [
            { index: true, element: <Lazy><AttendancePage /></Lazy> },
          ],
        },

        // Catch-all
        { path: '*', element: <Navigate to="/" replace /> },
      ],
    },
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
