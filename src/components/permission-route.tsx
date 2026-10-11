import { ReactNode } from 'react'
import { usePermissions } from '@/hooks/use-permissions'
import { AccessPendingView } from './access-pending-view'
import { PageSpinner } from '@/components/ui'
import { ShieldAlert, ArrowRight } from 'lucide-react'

interface PermissionRouteProps {
  moduleName?: string
  children: ReactNode
}

export function PermissionRoute({ moduleName, children }: PermissionRouteProps) {
  const {
    isLoading,
    hasAnyRolePermission,
    canAccessModule,
    firstAllowedRoute,
  } = usePermissions()

  if (isLoading) {
    return <PageSpinner />
  }

  // If no permissions at all are granted for this role/organization
  if (!hasAnyRolePermission) {
    return <AccessPendingView />
  }

  // If a specific moduleName was provided and user doesn't have access to it
  if (moduleName && !canAccessModule(moduleName)) {
    // If they have another permitted module, we can redirect or show restricted notice
    if (firstAllowedRoute) {
      return (
        <div className="flex-1 w-full min-h-[60vh] flex items-center justify-center p-6 animate-fadeIn">
          <div className="max-w-md w-full bg-white rounded-3xl border border-[var(--border)] shadow-lg p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-serif font-bold text-[var(--navy)]">
              Module Access Restricted
            </h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Super Admin has not enabled access to the <span className="font-semibold text-[var(--navy)]">{moduleName}</span> module for your account.
            </p>
            <a
              href={firstAllowedRoute}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--navy)] text-white text-sm font-semibold hover:bg-[var(--deep-navy)] transition-colors shadow-sm"
            >
              <span>Go to Available Features</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )
    }

    return <AccessPendingView />
  }

  return <>{children}</>
}
