import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { ActionIconButton, Spinner } from '@/components/ui'

interface OnboardingFileUploadProps {
  label: string
  required?: boolean
  file: File | null
  onFileSelect: (file: File | null) => void
  onPreview?: (file: File, label: string) => void
  accept?: string
  error?: string
}

export function OnboardingFileUpload({
  label,
  required,
  file,
  onFileSelect,
  onPreview,
  accept = '.pdf,.jpg,.jpeg,.png',
  error
}: OnboardingFileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null
    if (selected) {
      setIsUploading(true)
      setTimeout(() => {
        setIsUploading(false)
        onFileSelect(selected)
      }, 400)
    } else {
      onFileSelect(null)
    }
  }

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!file) return
    const url = URL.createObjectURL(file)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <div>
      <label className="block text-[11px] font-semibold text-[var(--navy)] uppercase mb-1">
        {label} {required && '*'}
      </label>
      <div 
        onClick={() => {
          if (!isUploading) fileInputRef.current?.click()
        }}
        className={`flex items-center justify-between h-[40px] px-2.5 rounded-xl border bg-[var(--input-bg)] cursor-pointer transition-all hover:border-[var(--gold)] ${
          error ? 'border-red-500' : 'border-[var(--border)]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleFileChange}
        />
        
        {/* Upload Button Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--gold)] text-white text-[11.5px] font-semibold hover:opacity-90 shadow-sm transition-opacity shrink-0 select-none">
          {isUploading ? (
            <>
              <Spinner size={13} color="#FFFFFF" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-3.5 h-3.5" />
              <span>{file ? 'Change' : 'Upload'}</span>
            </>
          )}
        </div>

        {/* Selected File Details & Actions / Placeholder */}
        <div className="flex items-center gap-1.5 truncate ml-2 text-xs flex-1 justify-end select-none">
          {isUploading ? (
            <span className="text-[var(--gold)] font-medium text-[11.5px] animate-pulse">Processing file...</span>
          ) : file ? (
            <div className="flex items-center gap-1 text-[var(--navy)] font-medium truncate max-w-full">
              <span className="truncate max-w-[100px] sm:max-w-[135px] text-[11.5px] font-semibold text-[var(--navy)]" title={file.name}>
                {file.name}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] shrink-0 font-normal">
                ({(file.size / 1024).toFixed(0)} KB)
              </span>

              {/* View Action */}
              <ActionIconButton
                variant="view"
                size="sm"
                title="Preview document"
                onClick={(e) => {
                  e.stopPropagation()
                  if (onPreview) onPreview(file, label)
                }}
              />

              {/* Download Action */}
              <ActionIconButton
                variant="download"
                size="sm"
                title="Download document"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDownload(e)
                }}
              />

              {/* Remove Action */}
              <ActionIconButton
                variant="close"
                size="sm"
                title="Remove file"
                onClick={(e) => {
                  e.stopPropagation()
                  onFileSelect(null)
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
              />
            </div>
          ) : (
            <span className="text-[var(--text-muted)] truncate text-[11.5px]">No file chosen</span>
          )}
        </div>
      </div>
      {error && (
        <p className="text-[11px] font-medium text-red-500 mt-0.5">{error}</p>
      )}
    </div>
  )
}
