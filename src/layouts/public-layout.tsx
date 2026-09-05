import { Outlet } from 'react-router-dom'
import { PublicHeader } from '@/components/public-header'
import { PublicFooter } from '@/components/public-footer'

/**
 * PublicLayout — shell for all public-facing (non-auth, non-dashboard) pages.
 * Composes:  <PublicHeader /> → <Outlet /> → <PublicFooter />
 *
 * Usage in routes.tsx:
 *   { path: '/', element: <PublicLayout />, children: [...] }
 */
export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-[var(--cream)] flex flex-col font-sans">
      <PublicHeader />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  )
}
