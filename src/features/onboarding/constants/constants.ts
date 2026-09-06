import { Building2, FileText, CheckCircle2 } from 'lucide-react'
import type { OnboardingStepItem } from '../types/types'

export const ORGANIZATION_TYPE_OPTIONS = [
  { value: 'kinder_garden', label: 'Kinder Garden' },
  { value: 'pre_school', label: 'Pre School (Nursery, LKG, UKG)' },
  { value: 'school', label: 'School' },
  { value: 'school_with_puc', label: 'School with Pre University College' },
  { value: 'puc', label: 'Pre University College' },
  { value: 'college', label: 'College/University' },
]

export const ONBOARDING_STEPS: OnboardingStepItem[] = [
  { id: 1, title: 'Organization Info', icon: Building2, subtitle: 'Profile & Location' },
  { id: 2, title: 'Documents & Head', icon: FileText, subtitle: 'Compliance & Auth' },
  { id: 3, title: 'Review & Submit', icon: CheckCircle2, subtitle: 'Verify Application' },
]
