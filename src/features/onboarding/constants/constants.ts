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

export const ORGANIZATION_STD_OPTIONS = [
  { value: 'Pre School', label: 'Pre School' },
  { value: 'Nursery', label: 'Nursery' },
  { value: 'LKG', label: 'LKG' },
  { value: 'UKG', label: 'UKG' },
  { value: '1st Std', label: '1st Std' },
  { value: '2nd Std', label: '2nd Std' },
  { value: '3rd Std', label: '3rd Std' },
  { value: '4th Std', label: '4th Std' },
  { value: '5th Std', label: '5th Std' },
  { value: '6th Std', label: '6th Std' },
  { value: '7th Std', label: '7th Std' },
  { value: '8th Std', label: '8th Std' },
  { value: '9th Std', label: '9th Std' },
  { value: '10th Std', label: '10th Std' },
  { value: '1st PUC', label: '1st PUC' },
  { value: '2nd PUC', label: '2nd PUC' },
  { value: 'Degree', label: 'Degree' },
]

export const ONBOARDING_STEPS: OnboardingStepItem[] = [
  { id: 1, title: 'Organization Info', icon: Building2, subtitle: 'Profile & Location' },
  { id: 2, title: 'Documents & Head', icon: FileText, subtitle: 'Compliance & Auth' },
  { id: 3, title: 'Review & Submit', icon: CheckCircle2, subtitle: 'Verify Application' },
]
