import { Toaster as SonnerToaster, toast } from 'sonner'

/**
 * EduWeConnect Brand Toaster Component
 * Solid white background (#FFFFFF) with variant-matched borders, titles, and icons.
 *
 * Usage anywhere in the app:
 *   import { toast } from '@/components/ui'
 *
 *   toast.success('Record saved!')
 *   toast.error('Failed to save record.')
 *   toast.warning('Payment due soon.')
 *   toast.info('New notice published.')
 *   toast.promise(apiCall(), { loading: 'Saving...', success: 'Saved!', error: 'Failed' })
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      expand={false}
      closeButton
      richColors={false}
      toastOptions={{
        style: {
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          fontSize: '12px',
          borderRadius: '10px',
          backgroundColor: '#FFFFFF',
          color: 'var(--text-primary, #102A43)',
        },
        classNames: {
          toast: 'shadow-lg border font-sans bg-white',
          title: 'font-bold text-xs',
          description: 'text-[11.5px] leading-relaxed text-slate-600',
          actionButton: 'bg-[var(--navy,#102A43)] text-white text-xs font-semibold px-2.5 py-1 rounded-md hover:bg-[var(--deep-navy,#0B1F33)]',
          cancelButton: 'bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md hover:bg-slate-200',
        },
      }}
    />
  )
}

export { toast }
