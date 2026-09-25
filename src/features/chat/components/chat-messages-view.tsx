import React from 'react'
import { Loader2 } from 'lucide-react'
import type { ChatMessage } from '../types'
import { ChatMessageItem } from './chat-message-item'
import { formatChatDateDivider, getMessageDayKey } from '../chat-utils'

interface ChatMessagesViewProps {
  messages: ChatMessage[]
  isLoading?: boolean
  messagesEndRef: React.RefObject<any>
  firstUnreadMessageId?: string | null
  activeReactionMsgId: string | null
  setActiveReactionMsgId: (id: string | null) => void
  onReaction: (messageId: string, emoji: string) => void
  onReplyQuote: (message: ChatMessage) => void
  onForward: (message: ChatMessage) => void
  onCopyLink: (message: ChatMessage) => void
  onToggleSave: (message: ChatMessage) => void
  onDelete: (message: ChatMessage) => void
  onTogglePin: (message: ChatMessage) => void
  onMarkUnread: (message: ChatMessage) => void
  onShare: (message: ChatMessage) => void
  onTranslate: (message: ChatMessage, lang: string) => void
  onSaveEdit: (messageId: string, newContent: string) => void
  onViewDetails: (message: ChatMessage) => void
}

export const ChatMessagesView: React.FC<ChatMessagesViewProps> = ({
  messages,
  isLoading,
  messagesEndRef,
  firstUnreadMessageId,
  activeReactionMsgId,
  setActiveReactionMsgId,
  onReaction,
  onReplyQuote,
  onForward,
  onCopyLink,
  onToggleSave,
  onDelete,
  onTogglePin,
  onMarkUnread,
  onShare,
  onTranslate,
  onSaveEdit,
  onViewDetails,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-2.5 bg-white sleek-scrollbar">
      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-xs text-slate-400 gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-[#102A43]" />
          <p>Loading messages...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
          <p className="text-xs">No messages here yet.</p>
          <p className="text-[11px] text-slate-300 mt-1">Say hello to get the conversation started!</p>
        </div>
      ) : (
        <>
          {messages.map((msg, index) => {
            const prevMsg = messages[index - 1]
            const isNewDay = index === 0 || getMessageDayKey(msg.createdAt) !== getMessageDayKey(prevMsg?.createdAt)
            const isFirstUnread = Boolean(firstUnreadMessageId && msg.id === firstUnreadMessageId)
            const isSameSenderAsPrev =
              !isNewDay &&
              !isFirstUnread &&
              Boolean(prevMsg) &&
              prevMsg.isOutgoing === msg.isOutgoing &&
              prevMsg.senderId === msg.senderId

            return (
              <React.Fragment key={msg.id}>
                {isNewDay && (
                  <div className="relative my-4 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-slate-200/80" />
                    </div>
                    <div className="relative bg-white px-3 py-1 text-xs text-slate-500 font-medium rounded-full border border-slate-200 shadow-2xs select-none">
                      {formatChatDateDivider(msg.createdAt)}
                    </div>
                  </div>
                )}

                {isFirstUnread && (
                  <div className="relative my-4 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t-2 border-red-500/80" />
                    </div>
                    <div className="relative bg-white px-3 py-0.5 text-[11px] font-bold text-red-600 rounded-full border border-red-300 shadow-xs flex items-center gap-1.5 uppercase tracking-wider select-none animate-in fade-in duration-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      <span>New messages</span>
                    </div>
                  </div>
                )}

                <ChatMessageItem
                  message={msg}
                  isSameSenderAsPrev={isSameSenderAsPrev}
                  activeReactionMsgId={activeReactionMsgId}
                  setActiveReactionMsgId={setActiveReactionMsgId}
                  onReaction={onReaction}
                  onReplyQuote={onReplyQuote}
                  onForward={onForward}
                  onCopyLink={onCopyLink}
                  onToggleSave={onToggleSave}
                  onDelete={onDelete}
                  onTogglePin={onTogglePin}
                  onMarkUnread={onMarkUnread}
                  onShare={onShare}
                  onTranslate={onTranslate}
                  onSaveEdit={onSaveEdit}
                  onViewDetails={onViewDetails}
                />
              </React.Fragment>
            )
          })}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}
