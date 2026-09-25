import React, { useState } from 'react'
import {
  MoreHorizontal,
  ExternalLink,
  MailMinus,
  BellOff,
  Link2,
  Trash2,
  EyeOff,
  AlertTriangle,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui'
import { clearChatHistoryApi, hideChatApi } from '../api/chat.api'

interface ChatConversationActionsMenuProps {
  conversationId: string
  conversationName: string
  onRemoveChatHistory?: (conversationId: string) => void
  onHideChat?: (conversationId: string) => void
  onMarkAsUnread?: (conversationId: string) => void
}

export const ChatConversationActionsMenu: React.FC<ChatConversationActionsMenuProps> = ({
  conversationId,
  conversationName,
  onRemoveChatHistory,
  onHideChat,
  onMarkAsUnread,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleOpenInNewWindow = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(false)
    window.open(window.location.href, '_blank', 'noopener,noreferrer')
  }

  const handleMarkAsUnread = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(false)
    onMarkAsUnread?.(conversationId)
    toast.success('Conversation marked as unread')
  }

  const handleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(false)
    toast.success(`Muted notifications for ${conversationName}`)
  }

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(false)
    const link = `${window.location.origin}/chat?c=${conversationId}`
    navigator.clipboard.writeText(link).then(
      () => toast.success('Link copied to clipboard'),
      () => toast.error('Failed to copy link')
    )
  }

  const handleHide = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(false)
    try {
      setIsProcessing(true)
      await hideChatApi(conversationId)
      onHideChat?.(conversationId)
      toast.success(`Chat hidden`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to hide chat')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleConfirmClear = async () => {
    try {
      setIsProcessing(true)
      await clearChatHistoryApi(conversationId)
      setShowClearConfirm(false)
      onRemoveChatHistory?.(conversationId)
      toast.success('Chat history removed')
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove chat history')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <div
        className="shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="Conversation options"
              onClick={(e) => {
                e.stopPropagation()
                setIsOpen((prev) => !prev)
              }}
              className={`p-1 rounded-md transition-all cursor-pointer ${
                isOpen
                  ? 'opacity-100 bg-slate-200/90 text-slate-800 shadow-2xs'
                  : 'opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200/70'
              }`}
              title="More options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </PopoverTrigger>

          <PopoverContent
            align="end"
            side="bottom"
            sideOffset={6}
            className="w-52 p-0 bg-white rounded-xl shadow-xl border border-slate-200/90 py-1 text-slate-700 text-xs divide-y divide-slate-100 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top actions */}
            <div className="py-1">
              <button
                type="button"
                onClick={handleOpenInNewWindow}
                className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-slate-100/80 transition-colors text-left font-medium text-slate-700 cursor-pointer"
              >
                <ExternalLink className="w-4 h-4 text-slate-500" />
                <span>Open in new window</span>
              </button>

              <button
                type="button"
                onClick={handleMarkAsUnread}
                className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-slate-100/80 transition-colors text-left font-medium text-slate-700 cursor-pointer"
              >
                <MailMinus className="w-4 h-4 text-slate-500" />
                <span>Mark as unread</span>
              </button>

              <button
                type="button"
                onClick={handleMute}
                className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-slate-100/80 transition-colors text-left font-medium text-slate-700 cursor-pointer"
              >
                <BellOff className="w-4 h-4 text-slate-500" />
                <span>Mute</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-slate-100/80 transition-colors text-left font-medium text-slate-700 cursor-pointer"
              >
                <Link2 className="w-4 h-4 text-slate-500" />
                <span>Copy link</span>
              </button>
            </div>

            {/* Critical actions (Remove / Hide) */}
            <div className="py-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsOpen(false)
                  setShowClearConfirm(true)
                }}
                className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-red-50 hover:text-red-600 transition-colors text-left font-medium text-slate-700 cursor-pointer group/danger"
              >
                <Trash2 className="w-4 h-4 text-slate-500 group-hover/danger:text-red-500" />
                <span>Remove chat history</span>
              </button>

              <button
                type="button"
                onClick={handleHide}
                className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-slate-100/80 transition-colors text-left font-medium text-slate-700 cursor-pointer"
              >
                <EyeOff className="w-4 h-4 text-slate-500" />
                <span>Hide</span>
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Confirmation Dialog for "Remove chat history" */}
      <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <DialogContent maxWidth="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2.5 text-red-600 mb-1">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <DialogTitle className="text-base font-semibold text-slate-900">
                Remove chat history?
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-slate-600 leading-relaxed mt-2">
              This will clear the conversation history with{' '}
              <strong className="text-slate-800">{conversationName}</strong> from your account.
              The other participant will still keep their full chat history intact.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-5 flex items-center justify-end gap-2">
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => setShowClearConfirm(false)}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleConfirmClear}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? 'Removing...' : 'Remove history'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
