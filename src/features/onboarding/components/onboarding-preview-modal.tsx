import { useState, useEffect } from 'react'
import { FileText, Download } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button
} from '@/components/ui'
import type { PreviewDoc } from '../types/types'

interface OnboardingPreviewModalProps {
  doc: PreviewDoc | null
  onClose: () => void
}

export function OnboardingPreviewModal({ doc, onClose }: OnboardingPreviewModalProps) {
  const [fileUrl, setFileUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!doc?.file) {
      setFileUrl(null)
      return
    }
    const url = URL.createObjectURL(doc.file)
    setFileUrl(url)
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [doc])

  if (!doc || !doc.file) return null

  const isImage = doc.file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(doc.file.name)
  const isPdf = doc.file.type === 'application/pdf' || doc.file.name.toLowerCase().endsWith('.pdf')

  const handleDownload = () => {
    if (!fileUrl) return
    const a = document.createElement('a')
    a.href = fileUrl
    a.download = doc.file.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <Dialog open={!!doc} onOpenChange={(open) => !open && onClose()}>
      <DialogContent maxWidth="max-w-2xl" className="p-0 overflow-hidden rounded-2xl bg-[var(--warm-white)] border border-[var(--border)] shadow-2xl">
        <DialogHeader className="px-5 py-3.5 border-b border-[var(--border)] bg-white/95 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--gold)]/15 text-[var(--gold)] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="text-sm md:text-base font-bold text-[var(--navy)]">
                {doc.title}
              </DialogTitle>
              <DialogDescription className="text-[11px] text-[var(--text-muted)] font-medium">
                {doc.file.name} • {(doc.file.size / 1024).toFixed(1)} KB
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Preview Container */}
        <div className="p-4 bg-slate-100/70 flex items-center justify-center min-h-[300px] max-h-[60vh] overflow-auto">
          {isImage && fileUrl ? (
            <div className="flex flex-col items-center justify-center bg-white p-2 rounded-xl border border-[var(--border)] shadow-xs max-w-full">
              <img
                src={fileUrl}
                alt={doc.title}
                className="max-h-[50vh] max-w-full object-contain rounded-lg shadow-xs"
              />
            </div>
          ) : isPdf && fileUrl ? (
            <iframe
              src={fileUrl}
              title={doc.title}
              className="w-full h-[55vh] rounded-xl border border-[var(--border)] bg-white shadow-xs"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-[var(--border)] text-center shadow-xs">
              <FileText className="w-12 h-12 text-[var(--gold)] mb-3 opacity-80" />
              <h4 className="font-bold text-[var(--navy)] text-sm mb-1">{doc.file.name}</h4>
              <p className="text-xs text-[var(--text-muted)] mb-4">
                {(doc.file.size / 1024).toFixed(1)} KB • {doc.file.type || 'Document File'}
              </p>
              <Button
                type="button"
                variant="gold"
                onClick={handleDownload}
                className="px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download to View
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="px-5 py-3 border-t border-[var(--border)] bg-white/95 flex flex-row items-center justify-between sm:justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="px-4 h-[38px] rounded-xl text-xs font-semibold bg-[var(--warm-white)] border border-[var(--border)] text-[var(--navy)] hover:bg-[var(--beige)]"
          >
            Close
          </Button>

          <Button
            type="button"
            variant="gold"
            onClick={handleDownload}
            className="px-4 h-[38px] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" /> Download Document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
