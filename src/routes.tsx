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
import { RoleRoute } from '@/components/role-route'
import { AuthProvider, useAuth } from '@/contexts/auth-context'
import { UserRole } from '@/features/auth/enums/auth.enum'
import { getRoleHomeRoute } from '@/core/config/rbac.config'

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

// ── Organization ─────────────────────────────────────────────────────────────
const OrganizationDashboard = lazyWithRetry(() => import('@/features/organization-menu/pages/organization-dashboard'))
const OrganizationCreateUsers = lazyWithRetry(() => import('@/features/organization-menu/pages/organization-create-users'))

// ── Superadmin ───────────────────────────────────────────────────────────────
const SuperAdminDashboard = lazyWithRetry(() => import('@/features/superadmin/pages/superadmin-dashboard'))
const SuperAdminApprovals = lazyWithRetry(() => import('@/features/superadmin/pages/superadmin-approvals'))
const SuperAdminOrganizations = lazyWithRetry(() => import('@/features/superadmin/pages/superadmin-organizations'))

// ── Staff & Student ──────────────────────────────────────────────────────────
const StaffStudentLayout = lazyWithRetry(() => import('@/layouts/staff-student-layout'))
const StaffWelcomePage = lazyWithRetry(() => import('@/features/staff/pages/staff-welcome-page'))
const StudentLayout = lazyWithRetry(() => import('@/layouts/student-layout'))
const StudentWelcomePage = lazyWithRetry(() => import('@/features/student/pages/student-welcome-page'))
const StudentTimetablePage = lazyWithRetry(() => import('@/features/student/pages/student-timetable-page'))
const StudentAttendancePage = lazyWithRetry(() => import('@/features/student/pages/student-attendance-page'))

// ── Page-level loading fallback ───────────────────────────────────────────────
function PageLoader() {
  return <PageSpinner />
}

function Lazy({ children }: { children: JSX.Element }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

function AppHomeRedirect() {
  const { user } = useAuth()
  return <Navigate to={getRoleHomeRoute(user?.role)} replace />
}

// ── Router factory ────────────────────────────────────────────────────────────
export function createAppRouter(_queryClient: QueryClient) {
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

        // ── Standard Authenticated App Redirection ──────────────────────────────
        {
          path: '/app',
          element: (
            <ProtectedRoute>
              <AppHomeRedirect />
            </ProtectedRoute>
          ),
          children: [
            { index: true, element: <AppHomeRedirect /> },
            { path: 'dashboard', element: <AppHomeRedirect /> },
            { path: 'create-users', element: <AppHomeRedirect /> },
          ],
        },

        // ── Organization App Shell (Strictly for Organizations) ───────────────────
        {
          path: '/organization',
          element: (
            <RoleRoute allowedRoles={[UserRole.Organization]}>
              <Lazy><DashboardLayout /></Lazy>
            </RoleRoute>
          ),
          children: [
            { index: true, element: <Navigate to="/organization/dashboard" replace /> },
            { path: 'dashboard', element: <Lazy><OrganizationDashboard /></Lazy> },
            { path: 'create-users', element: <Lazy><OrganizationCreateUsers /></Lazy> },
          ],
        },

        // ── Superadmin App Shell (Strictly for Super Admin) ───────────────────────
        {
          path: '/superadmin',
          element: (
            <RoleRoute allowedRoles={[UserRole.SuperAdmin]}>
              <Lazy><SuperAdminLayout /></Lazy>
            </RoleRoute>
          ),
          children: [
            { index: true, element: <Navigate to="/superadmin/dashboard" replace /> },
            { path: 'dashboard', element: <Lazy><SuperAdminDashboard /></Lazy> },
            { path: 'approval', element: <Lazy><SuperAdminApprovals /></Lazy> },
            { path: 'approvals', element: <Navigate to="/superadmin/approval" replace /> },
            { path: 'organization-management', element: <Lazy><SuperAdminOrganizations /></Lazy> },
            { path: 'organizations', element: <Navigate to="/superadmin/organization-management" replace /> },
            { path: 'create-organization', element: <Navigate to="/superadmin/approval" replace /> },
          ],
        },
        {
          path: '/app/superadmin/*',
          element: <Navigate to="/superadmin/dashboard" replace />,
        },

        // ── Staff Portal (Strictly for Staff: Teacher, Non-Staff, Finance) ───────
        {
          path: '/staff',
          element: (
            <RoleRoute allowedRoles={[UserRole.Staff]}>
              <Lazy><StaffStudentLayout /></Lazy>
            </RoleRoute>
          ),
          children: [
            { index: true, element: <Navigate to="/staff/welcome" replace /> },
            { path: 'welcome', element: <Lazy><StaffWelcomePage /></Lazy> },
          ],
        },

        // ── Student Portal (Strictly for Students) ───────────────────────────────
        {
          path: '/student',
          element: (
            <RoleRoute allowedRoles={[UserRole.Students]}>
              <Lazy><StudentLayout /></Lazy>
            </RoleRoute>
          ),
          children: [
            { index: true, element: <Navigate to="/student/welcome" replace /> },
            { path: 'welcome', element: <Lazy><StudentWelcomePage /></Lazy> },
            { path: 'dashboard', element: <Navigate to="/student/welcome" replace /> },
            { path: 'timetable', element: <Lazy><StudentTimetablePage /></Lazy> },
            { path: 'attendance', element: <Lazy><StudentAttendancePage /></Lazy> },
          ],
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
