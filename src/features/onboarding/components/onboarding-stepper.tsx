import { Check } from 'lucide-react'
import { ONBOARDING_STEPS } from '../constants/constants'

interface OnboardingStepperProps {
  currentStep: number
  onStepClick?: (stepId: number) => void
}

export function OnboardingStepper({ currentStep, onStepClick }: OnboardingStepperProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-6 mb-2">
      <div className="flex items-center justify-between">
        {ONBOARDING_STEPS.map((s, idx) => {
          const isCompleted = currentStep > s.id
          const isCurrent = currentStep === s.id
          const Icon = s.icon
          const isLast = idx === ONBOARDING_STEPS.length - 1

          return (
            <div
              key={s.id}
              className={`flex items-center ${isLast ? 'flex-none' : 'flex-1'}`}
            >
              {/* Step Circle & Label */}
              <div
                onClick={() => {
                  if (isCompleted && onStepClick) {
                    onStepClick(s.id)
                  }
                }}
                className={`flex flex-col items-center select-none ${
                  isCompleted ? 'cursor-pointer group' : 'cursor-default'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-sm group-hover:scale-105'
                      : isCurrent
                      ? 'bg-[var(--gold)] text-white shadow-md ring-4 ring-[#B8862C]/25'
                      : 'bg-white border-2 border-[var(--border)] text-[var(--text-muted)]'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <span
                  className={`text-[11px] md:text-xs font-semibold mt-1.5 uppercase tracking-wider text-center whitespace-nowrap transition-colors ${
                    isCurrent
                      ? 'text-[var(--navy)] font-bold'
                      : isCompleted
                      ? 'text-emerald-700'
                      : 'text-[var(--text-muted)]'
                  }`}
                >
                  {s.title}
                </span>
              </div>

              {/* Connecting progress bar between steps — ONLY between nodes, never on ends */}
              {!isLast && (
                <div className="flex-1 mx-2 sm:mx-4 -mt-5">
                  <div className="h-[2px] bg-[var(--border)] rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        currentStep > s.id ? 'w-full bg-emerald-600' : 'w-0'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
