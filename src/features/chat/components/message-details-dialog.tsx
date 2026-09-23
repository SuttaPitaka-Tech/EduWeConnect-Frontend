import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui'
import { Info, User, Clock, CheckCircle2, FileText, Smile } from 'lucide-react'
import type { ChatMessage } from '../types'

interface MessageDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  message: ChatMessage | null
}

export const MessageDetailsDialog: React.FC<MessageDetailsDialogProps> = ({
  open,
  onOpenChange,
  message,
}) => {
  if (!message) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-2xl">
        <DialogHeader className="p-4 pb-3 border-b border-slate-100 flex flex-row items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#E8EDFB] text-[#5B5FC7] flex items-center justify-center">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <DialogTitle className="text-sm font-semibold text-slate-800">
              Message Details
            </DialogTitle>
            <p className="text-[11px] text-slate-400">Metadata and delivery status</p>
          </div>
        </DialogHeader>

        <div className="p-4 space-y-3.5 text-xs text-slate-600">
          {/* Sender */}
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-500">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Sender</span>
            </div>
            <div className="text-right">
              <span className="font-semibold text-slate-700">{message.senderName}</span>
              {message.senderRole && (
                <span className="text-[10px] text-slate-400 ml-1">({message.senderRole})</span>
              )}
            </div>
          </div>

          {/* Timestamp */}
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Sent At</span>
            </div>
            <span className="font-medium text-slate-700">{message.timestamp}</span>
          </div>

          {/* Delivery & Read Status */}
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Status</span>
            </div>
            <span
              className={`font-semibold capitalize px-2 py-0.5 rounded-full text-[10px] ${
                message.status === 'read'
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {message.status || 'delivered'}
            </span>
          </div>

          {/* Message Length */}
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-500">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Length</span>
            </div>
            <span className="font-medium text-slate-700">
              {message.content ? `${message.content.length} characters` : 'No text content'}
            </span>
          </div>

          {/* Reactions */}
          {message.reactions && Object.keys(message.reactions).length > 0 && (
            <div className="py-1">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <Smile className="w-3.5 h-3.5 text-slate-400" />
                <span>Reactions</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(message.reactions).map(([emoji, count]) => (
                  <span
                    key={emoji}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-xs"
                  >
                    <span>{emoji}</span>
                    <span className="text-[10px] font-bold text-slate-600">{count}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Message Content Preview */}
          <div className="pt-2">
            <span className="text-[11px] text-slate-400 block mb-1 font-medium">Content Preview:</span>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 whitespace-pre-wrap max-h-32 overflow-y-auto sleek-scrollbar">
              {message.content || '[Empty text content]'}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
