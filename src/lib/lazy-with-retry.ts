import { lazy } from 'react'

/**
 * React.lazy() wrapper that auto-reloads on stale chunk errors.
 * Prevents "Failed to fetch dynamically imported module" after deployments.
 * Pattern from IEBA codebase (production-proven).
 */
export function lazyWithRetry<T extends React.ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>,
): React.LazyExoticComponent<T> {
  return lazy(() =>
    factory().catch((error: unknown) => {
      if (
        error instanceof Error &&
        (error.message.includes('Failed to fetch') ||
          error.message.includes('Importing a module script failed'))
      ) {
        window.location.reload()
        return new Promise(() => undefined) as Promise<{ default: T }>
      }
      return Promise.reject(error)
    }),
  )
}
