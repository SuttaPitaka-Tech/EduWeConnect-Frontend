import React from 'react'
import { Loader2 } from 'lucide-react'
import type { ChatMessage } from '../types'
import { ChatMessageItem } from './chat-message-item'

interface ChatMessagesViewProps {
  messages: ChatMessage[]
  isLoading?: boolean
  messagesEndRef: React.RefObject<any>
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
          <div className="my-3 text-center">
            <span className="text-xs text-slate-400 font-normal select-none">Today</span>
          </div>

          {messages.map((msg, index) => {
            const prevMsg = messages[index - 1]
            const isSameSenderAsPrev =
              Boolean(prevMsg) &&
              prevMsg.isOutgoing === msg.isOutgoing &&
              prevMsg.senderId === msg.senderId

            return (
              <ChatMessageItem
                key={msg.id}
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
            )
          })}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}
