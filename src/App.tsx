import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from '@/components/ui'
import { getRouter } from './routes'
import './index.css'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry:                1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})

// Router singleton — receives queryClient so loaders can pre-invalidate cache
const router = getRouter(queryClient)

/**
 * App shell — QueryClientProvider wraps everything.
 * AuthProvider lives inside RouterProvider (inside routes.tsx layout)
 * so that useNavigate() is available inside AuthProvider.
 */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
