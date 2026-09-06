import { FileText, FileImage } from 'lucide-react'
import { ActionIconButton } from '@/components/ui'

export interface OnboardingReviewDocCardProps {
  title: string
  docNumber?: string
  docNumberLabel?: string
  file: File | null
  docKey: string
  onPreview: (file: File, title: string, key: string) => void
  onDownload: (file: File, key: string) => void
  previewingKey?: string | null
  downloadingKey?: string | null
}

export function OnboardingReviewDocCard({
  title,
  docNumber,
  docNumberLabel = 'Doc No',
  file,
  docKey,
  onPreview,
  onDownload,
  previewingKey,
  downloadingKey,
}: OnboardingReviewDocCardProps) {
  const isPdf = file?.type === 'application/pdf' || file?.name.toLowerCase().endsWith('.pdf')
  const isImage = file?.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file?.name || '')
  const isOpening = previewingKey === docKey
  const isDownloading = downloadingKey === docKey

  return (
    <div className="py-2.5 px-3.5 rounded-xl bg-white/70 hover:bg-white border border-[var(--border)]/70 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Document title & Number */}
      <div className="flex items-center gap-3 min-w-[220px] flex-1">
        <div className="w-8 h-8 rounded-lg bg-[var(--gold)]/10 text-[var(--gold)] flex items-center justify-center shrink-0">
          {isPdf ? (
            <FileText className="w-4 h-4 text-rose-500" />
          ) : isImage ? (
            <FileImage className="w-4 h-4 text-sky-600" />
          ) : (
            <FileText className="w-4 h-4 text-[var(--gold)]" />
          )}
        </div>
        <div className="min-w-0">
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
            {title}
          </span>
          {docNumber && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] text-[var(--text-secondary)] font-medium">
                {docNumberLabel}:
              </span>
              <span className="font-semibold text-[var(--navy)] text-xs">
                {docNumber}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Attachment info & actions */}
      {file ? (
        <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
          <div className="flex items-center gap-1.5 min-w-0 max-w-[260px]">
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                isPdf
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'bg-sky-50 text-sky-600 border border-sky-200'
              }`}
            >
              {isPdf ? 'PDF' : isImage ? 'IMG' : 'DOC'}
            </span>
            <span className="text-xs text-[var(--navy)] font-medium truncate" title={file.name}>
              {file.name}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] shrink-0">
              ({(file.size / 1024).toFixed(0)} KB)
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <ActionIconButton
              variant="view"
              size="sm"
              isLoading={isOpening}
              title="Preview Document"
              onClick={() => onPreview(file, title, docKey)}
            />
            <ActionIconButton
              variant="download"
              size="sm"
              isLoading={isDownloading}
              title="Download Document"
              onClick={() => onDownload(file, docKey)}
            />
          </div>
        </div>
      ) : (
        <div className="text-[11px] text-[var(--text-muted)] italic">
          No document attached
        </div>
      )}
    </div>
  )
}
