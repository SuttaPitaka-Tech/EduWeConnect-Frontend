import React, { useRef, useState } from 'react'
import {
  Paperclip,
  Smile,
  SendHorizontal,
  Loader2,
  Sticker,
  Plus,
  Quote,
  X,
  FileText,
} from 'lucide-react'
import EmojiPicker, { Theme, type EmojiClickData } from 'emoji-picker-react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui'
import { toast } from 'sonner'
import { uploadAttachmentApi } from '../api/chat.api'
import type { ChatAttachment, ChatMessage } from '../types'

interface ChatComposerProps {
  conversationId: string
  conversationName?: string
  isChannel?: boolean
  onSendMessage: (attachment?: ChatAttachment) => void
  messageInput: string
  setMessageInput: React.Dispatch<React.SetStateAction<string>>
  replyingTo?: ChatMessage | null
  onCancelReply?: () => void
}

export const ChatComposer: React.FC<ChatComposerProps> = ({
  conversationId,
  onSendMessage,
  messageInput,
  setMessageInput,
  replyingTo,
  onCancelReply,
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadingFileName, setUploadingFileName] = useState('')
  const [pendingAttachment, setPendingAttachment] = useState<ChatAttachment | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-focus input when replying
  React.useEffect(() => {
    if (replyingTo) {
      textareaRef.current?.focus()
    }
  }, [replyingTo])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !conversationId) return

    const MAX_SIZE = 2 * 1024 * 1024 // 2 MB limit
    if (file.size > MAX_SIZE) {
      toast.error('File size exceeds the 2 MB limit.')
      if (e.target) e.target.value = ''
      return
    }

    setIsUploading(true)
    setUploadingFileName(file.name)
    const toastId = toast.loading(`Uploading "${file.name}" to secure storage...`)

    try {
      const uploaded = await uploadAttachmentApi(file, conversationId)
      toast.success(`Attached "${file.name}"`, { id: toastId })

      const isImg = file.type.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg)$/i.test(file.name)
      const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name)
      const attachment: ChatAttachment = {
        name: uploaded.file_name || file.name,
        size: uploaded.file_size || `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: isImg ? 'image' : isPdf ? 'pdf' : 'doc',
        url: uploaded.url,
        storage_key: uploaded.storage_key,
      }

      // Keep attachment inside composer ready to send (Teams style)
      setPendingAttachment(attachment)
    } catch (err: any) {
      toast.error(err.message || 'Attachment upload failed', { id: toastId })
    } finally {
      setIsUploading(false)
      setUploadingFileName('')
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSend = () => {
    if (!messageInput.trim() && !pendingAttachment) return
    if (isUploading) {
      toast.info('Please wait for the file to finish uploading')
      return
    }

    onSendMessage(pendingAttachment || undefined)
    setPendingAttachment(null)
    setMessageInput('')
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSend()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
  }

  const canSend = Boolean(messageInput.trim()) || Boolean(pendingAttachment)

  return (
    <div className="p-3 sm:px-4 sm:py-3 bg-white relative shrink-0">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
        className="hidden"
      />

      {/* Reply with quote banner */}
      {replyingTo && (
        <div className="mb-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-1 h-7 rounded-full bg-[#5B5FC7] shrink-0" />
            <Quote className="w-3.5 h-3.5 text-[#5B5FC7] shrink-0 rotate-180" />
            <div className="min-w-0 text-xs">
              <span className="font-semibold text-[#5B5FC7] block truncate">
                Replying to {replyingTo.senderName}
              </span>
              <span className="text-[11px] text-slate-500 truncate block">
                {replyingTo.content || (replyingTo.attachments?.length ? `[Attachment: ${replyingTo.attachments[0].name}]` : 'Message')}
              </span>
            </div>
          </div>
          {onCancelReply && (
            <button
              type="button"
              onClick={onCancelReply}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer shrink-0"
              title="Cancel reply"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full">
        {/* Teams-style Unified Input Box */}
        <div className="w-full rounded-lg sm:rounded-xl border border-slate-200 border-b-2 border-b-[#5B5FC7] bg-white flex flex-col p-2.5 sm:p-3 shadow-2xs transition-all focus-within:border-slate-300 focus-within:border-b-2 focus-within:border-b-[#5B5FC7] focus-within:shadow-xs">
          {/* Main Text Input / Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder={replyingTo ? `Replying to ${replyingTo.senderName}...` : 'Type a message'}
            value={messageInput}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-0 outline-none text-xs sm:text-sm text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-0 p-0 resize-none min-h-[24px] max-h-32 leading-relaxed"
          />

          {/* Pending Uploading indicator card */}
          {isUploading && (
            <div className="mt-2 mb-1 p-2 sm:p-2.5 rounded-lg border border-slate-200 bg-slate-50/80 flex items-center justify-between gap-3 max-w-sm animate-in fade-in duration-150">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-md bg-white border border-slate-200/80 shrink-0 flex items-center justify-center text-[#5B5FC7]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {uploadingFileName || 'Uploading file...'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Uploading to storage (max 2MB)...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Teams-style Pending Attachment Card inside the text field area */}
          {pendingAttachment && (
            <div className="mt-2 mb-1 p-2 sm:p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-50 flex items-center justify-between gap-3 max-w-sm transition-colors animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center gap-2.5 min-w-0">
                {pendingAttachment.type === 'image' && pendingAttachment.url ? (
                  <div className="w-9 h-9 rounded-md overflow-hidden bg-white border border-slate-200 shrink-0 flex items-center justify-center">
                    <img
                      src={pendingAttachment.url}
                      alt={pendingAttachment.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-md bg-white border border-slate-200 shrink-0 flex items-center justify-center text-slate-500">
                    <FileText className="w-5 h-5 text-slate-500 stroke-[1.5]" />
                  </div>
                )}
                <div className="min-w-0 text-left">
                  <p
                    className="text-xs font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-[230px]"
                    title={pendingAttachment.name}
                  >
                    {pendingAttachment.name}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {pendingAttachment.size} • Anyone with the link can edit
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPendingAttachment(null)
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer shrink-0"
                title="Remove attachment"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Action Toolbar on the bottom right */}
          <div className="flex items-center justify-between mt-2 pt-1 text-slate-500">
            <div />
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 text-slate-500">
              {/* Format Icon: 'A' with pencil */}
              <button
                type="button"
                title="Format"
                onClick={() => toast.info('Text formatting available')}
                className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.5 13H8.5M3 15L6.5 6L10 15M17.2 9.2L12.5 14H10.5V12L15.2 7.2C15.5 6.9 16 6.9 16.3 7.2L17.2 8.1C17.5 8.4 17.5 8.9 17.2 9.2Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Emoji Picker Popover */}
              <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    title="Emoji"
                    className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  side="top"
                  align="end"
                  sideOffset={14}
                  avoidCollisions={true}
                  className="p-0 border-0 shadow-2xl rounded-2xl overflow-hidden z-50 w-auto bg-transparent"
                >
                  <EmojiPicker
                    onEmojiClick={(emojiData: EmojiClickData) => {
                      setMessageInput((prev) => prev + emojiData.emoji)
                    }}
                    width={340}
                    height={380}
                    previewConfig={{ showPreview: false }}
                    lazyLoadEmojis={true}
                    theme={Theme.LIGHT}
                  />
                </PopoverContent>
              </Popover>

              {/* Attach File Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                title="Attach File (Max 2MB)"
                className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#5B5FC7]" />
                ) : (
                  <Paperclip className="w-4 h-4" />
                )}
              </button>

              {/* Sticker / GIF Button */}
              <button
                type="button"
                title="Stickers"
                onClick={() => toast.info('Stickers & GIFs')}
                className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Sticker className="w-4 h-4" />
              </button>

              {/* Plus / More Actions Button */}
              <button
                type="button"
                title="More options"
                onClick={() => fileInputRef.current?.click()}
                className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>

              {/* Vertical Divider */}
              <div className="h-4 w-[1px] bg-slate-300 mx-1" />

              {/* Send Horizontal Paper Airplane */}
              <button
                id="chat-send-btn"
                type="submit"
                disabled={!canSend || isUploading}
                title="Send message"
                className={`p-1 rounded-md transition-colors ${
                  canSend && !isUploading
                    ? 'text-[#5B5FC7] hover:text-[#4347A8] hover:bg-slate-100 cursor-pointer'
                    : 'text-slate-300 cursor-not-allowed'
                }`}
              >
                <SendHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Shift+Enter helper note */}
        <div className="flex justify-end mt-1 px-1 text-[11px] text-slate-400 select-none">
          <span><strong className="font-normal text-slate-500">Shift+Enter</strong> starts a new line.</span>
        </div>
      </form>
    </div>
  )
}


