import { useNavigate, useLocation } from 'react-router-dom'
import { useFormContext } from 'react-hook-form'
import { CheckCircle2, Home, LogIn, ClipboardCheck, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui'
import type { RegisterFormValues } from '../types/types'

export function OnboardingStepSuccess() {
  const navigate = useNavigate()
  const location = useLocation()
  const isSuperAdmin = location.pathname.startsWith('/superadmin')
  const { getValues } = useFormContext<RegisterFormValues>()
  const registeredId = localStorage.getItem('lastRegisteredOrgId')
  const appRef = registeredId ? `#EDU-ORG-${registeredId.slice(0, 8).toUpperCase()}` : '#EDU-ORG-581922'

  return (
    <div className="flex flex-col items-center text-center p-6 md:p-10 gap-3.5 animate-fadeIn">
      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-md">
        <CheckCircle2 className="w-9 h-9" />
      </div>

      <h3 className="text-xl md:text-2xl font-serif font-bold text-[var(--navy)]">
        {isSuperAdmin ? 'Organization Created Successfully!' : 'Registration Application Submitted!'}
      </h3>
      
      <p className="text-xs md:text-sm text-[var(--text-secondary)] max-w-[480px] leading-relaxed">
        {isSuperAdmin
          ? `The organization profile and statutory documents have been registered under application reference `
          : `Your organization profile and statutory documents have been successfully registered under application reference `}
        <strong className="text-[var(--navy)]">{appRef}</strong>.
      </p>

      <p className="text-xs text-[var(--text-muted)] max-w-[440px]">
        {isSuperAdmin
          ? 'The organization has been added to the Super Admin approvals queue. You can now review statutory documents, approve, and activate their access.'
          : 'Your application is currently under review for verification. Once completed, you will be notified via your registered email address.'}
      </p>

      <div className="bg-white/80 border border-[var(--border)] rounded-2xl p-4 w-full max-w-[400px] my-2 text-left text-xs space-y-2 shadow-2xs">
        <div className="flex justify-between items-center">
          <span className="text-[var(--text-muted)] font-medium">Application Ref:</span>
          <span className="font-mono font-bold text-[var(--navy)] text-xs">{appRef}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[var(--text-muted)] font-medium">Institution:</span>
          <span className="font-bold text-[var(--navy)]">{getValues('organizationName') || 'N/A'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[var(--text-muted)] font-medium">Registered Email:</span>
          <span className="font-semibold text-[var(--navy)]">{getValues('organizationEmail')}</span>
        </div>
        <div className="flex justify-between items-center pt-1 border-t border-[var(--border)]/50">
          <span className="text-[var(--text-muted)] font-medium">Verification Status:</span>
          <span className="font-bold text-emerald-600 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Pending Verification
          </span>
        </div>
      </div>

      {isSuperAdmin ? (
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-3 w-full max-w-[400px]">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => window.location.reload()} 
            className="w-full sm:w-1/2 h-[42px] rounded-xl font-semibold text-xs border-[var(--border)] text-[var(--navy)] hover:bg-[var(--beige)]"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1.5" /> Create Another
          </Button>

          <Button 
            type="button" 
            variant="gold" 
            onClick={() => navigate('/superadmin/approval')} 
            className="w-full sm:w-1/2 h-[42px] rounded-xl font-bold text-xs shadow-md"
          >
            <ClipboardCheck className="w-3.5 h-3.5 mr-1.5 text-[var(--navy)]" /> Go to Approvals
          </Button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-3 w-full max-w-[400px]">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/')} 
            className="w-full sm:w-1/2 h-[42px] rounded-xl font-semibold text-xs border-[var(--border)] text-[var(--navy)] hover:bg-[var(--beige)]"
          >
            <Home className="w-3.5 h-3.5 mr-1.5" /> Back to Home
          </Button>

          <Button 
            type="button" 
            variant="gold" 
            onClick={() => navigate('/login')} 
            className="w-full sm:w-1/2 h-[42px] rounded-xl font-bold text-xs shadow-md"
          >
            <LogIn className="w-3.5 h-3.5 mr-1.5" /> Login Portal
          </Button>
        </div>
      )}
    </div>
  )
}
