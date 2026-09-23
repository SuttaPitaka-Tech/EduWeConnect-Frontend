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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textInputRef = useRef<HTMLInputElement>(null)

  // Auto-focus input when replying
  React.useEffect(() => {
    if (replyingTo) {
      textInputRef.current?.focus()
    }
  }, [replyingTo])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !conversationId) return

    if (file.size > 25 * 1024 * 1024) {
      toast.error('File size exceeds the 25 MB limit.')
      return
    }

    setIsUploading(true)
    const toastId = toast.loading(`Uploading "${file.name}" to secure MinIO storage...`)

    try {
      const uploaded = await uploadAttachmentApi(file, conversationId)
      toast.success(`Attached "${file.name}" successfully!`, { id: toastId })

      const isImg = file.type.startsWith('image/')
      const isPdf = file.type === 'application/pdf'
      const attachment: ChatAttachment = {
        name: uploaded.file_name || file.name,
        size: uploaded.file_size || `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: isImg ? 'image' : isPdf ? 'pdf' : 'doc',
        url: uploaded.url,
      }

      onSendMessage(attachment)
    } catch (err: any) {
      toast.error(err.message || 'Attachment upload failed', { id: toastId })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim()) return
    onSendMessage()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (messageInput.trim()) {
        onSendMessage()
      }
    }
  }

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
        {/* Unified Input Box matching the template */}
        <div className="w-full h-11 sm:h-12 px-3 sm:px-4 rounded-lg sm:rounded-xl border border-slate-200 border-b-2 border-b-[#5B5FC7] bg-white flex items-center gap-2 shadow-2xs transition-all focus-within:border-slate-300 focus-within:border-b-2 focus-within:border-b-[#5B5FC7] focus-within:shadow-xs">
          {/* Main Text Input */}
          <input
            ref={textInputRef}
            type="text"
            placeholder={replyingTo ? `Replying to ${replyingTo.senderName}...` : 'Type a message'}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-0 outline-none text-xs sm:text-sm text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-0 p-0"
          />

          {/* Action Toolbar on the right */}
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
              title="Attach File"
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
              disabled={!messageInput.trim()}
              title="Send message"
              className={`p-1 rounded-md transition-colors cursor-pointer ${
                messageInput.trim()
                  ? 'text-[#5B5FC7] hover:text-[#4347A8] hover:bg-slate-100'
                  : 'text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              <SendHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

