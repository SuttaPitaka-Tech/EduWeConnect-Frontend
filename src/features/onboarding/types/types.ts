import type { ElementType } from 'react'
import { z } from 'zod'
import { registerSchema } from '../schemas/schemas'

export type OnboardingFormValues = z.infer<typeof registerSchema>
export type RegisterFormValues = OnboardingFormValues

export interface PreviewDoc {
  title: string
  file: File
}

export interface OnboardingStepItem {
  id: number
  title: string
  subtitle: string
  icon: ElementType
}

export interface StepNavigationProps {
  onBack?: () => void
  onNext?: () => void
  onReview?: () => void
}
