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
    <>

    
      <style>{`
        [data-sonner-toaster][data-x-position="right"] {
          right: 40px !important;
        }

        [data-sonner-toast] {
          box-sizing: border-box !important;
          width: min(390px, calc(100vw - 80px)) !important;
          max-width: calc(100vw - 80px) !important;
          min-height: 78px !important;
          height: auto !important;
          padding: 12px 46px 12px 12px !important;
          gap: 12px !important;
          align-items: center !important;
          background-color: #FFFFFF !important;
          border: 1px solid rgba(16, 42, 67, 0.14) !important;
          border-radius: 14px !important;
          box-shadow: 0 12px 32px -10px rgba(16, 42, 67, 0.22), 0 2px 8px rgba(16, 42, 67, 0.06) !important;
          color: var(--navy, #102A43) !important;
          font-family: Inter, system-ui, -apple-system, sans-serif !important;
          overflow: visible !important;
        }

        [data-sonner-toast] [data-icon] {
          width: 48px !important;
          height: 48px !important;
          min-width: 48px !important;
          margin: 0 !important;
          align-self: center !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 12px 50% 50% 12px !important;
          color: #FFFFFF !important;
        }

        [data-sonner-toast] [data-icon] svg {
          position: static !important;
          inset: auto !important;
          display: block !important;
          width: 22px !important;
          height: 22px !important;
          margin: 0 !important;
          transform: none !important;
        }

        [data-sonner-toast] [data-content] {
          flex: 1 1 auto !important;
          min-width: 0 !important;
          gap: 2px !important;
          overflow-wrap: anywhere !important;
        }

        [data-sonner-toast] [data-title] {
          color: var(--navy, #102A43) !important;
          font-size: 13px !important;
          font-weight: 700 !important;
          line-height: 1.4 !important;
          white-space: normal !important;
          overflow-wrap: anywhere !important;
        }

        [data-sonner-toast] [data-description] {
          color: #475569 !important;
          font-size: 12px !important;
          line-height: 1.45 !important;
          white-space: normal !important;
          overflow-wrap: anywhere !important;
        }

        [data-sonner-toast] [data-close-button] {
          width: 24px !important;
          height: 24px !important;
          top: 10px !important;
          right: 10px !important;
          bottom: auto !important;
          left: auto !important;
          transform: none !important;
          border: 1px solid rgba(100, 116, 139, 0.18) !important;
          border-radius: 9999px !important;
          background: #F8FAFC !important;
          color: #64748B !important;
          box-shadow: none !important;
          opacity: 1 !important;
        }

        [data-sonner-toast] [data-close-button]:hover {
          background: #E2E8F0 !important;
          color: #334155 !important;
        }

        [data-sonner-toast][data-type="success"] [data-icon] {
          background: #4CAF50 !important;
        }

        [data-sonner-toast][data-type="info"] [data-icon] {
          background: #2196E8 !important;
        }

        [data-sonner-toast][data-type="warning"] [data-icon] {
          background: #F5B400 !important;
        }

        [data-sonner-toast][data-type="error"] [data-icon] {
          background: #F44336 !important;
        }

        [data-sonner-toast][data-type="success"] [data-icon],
        [data-sonner-toast][data-type="info"] [data-icon],
        [data-sonner-toast][data-type="warning"] [data-icon],
        [data-sonner-toast][data-type="error"] [data-icon] {
          color: #FFFFFF !important;
        }

        @media (max-width: 480px) {
          [data-sonner-toaster][data-x-position="right"] {
            right: 24px !important;
          }

          [data-sonner-toast] {
            width: calc(100vw - 48px) !important;
            max-width: calc(100vw - 48px) !important;
            padding-right: 40px !important;
          }
        }
      `}</style>
      <SonnerToaster
        position="bottom-right"
        offset={40}
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
    </>
  )
}

export { toast }
