import React, { useState } from 'react'
import { FileText, Download, Quote, Pin, Bookmark, Check, X, Languages, Smile, Paperclip, Plus } from 'lucide-react'
import { toast } from 'sonner'
import type { ChatMessage } from '../types'
import { getInitials, getAvatarStyle } from '../chat-utils'
import { ChatMessageActions } from './chat-message-actions'
import { UserProfileHoverCard } from './user-profile-hover-card'

interface ChatMessageItemProps {
  message: ChatMessage
  isSameSenderAsPrev: boolean
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

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  isSameSenderAsPrev,
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
  const [isEditing, setIsEditing] = useState(false)
  const [editInput, setEditInput] = useState(message.content || '')
  const avatarStyle = getAvatarStyle(message.senderRole || message.senderName)

  const handleStartEdit = (msg: ChatMessage) => {
    setIsEditing(true)
    setEditInput(msg.content || '')
  }

  const handleSaveEditSubmit = () => {
    if (!editInput.trim()) return
    onSaveEdit(message.id, editInput.trim())
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditInput(message.content || '')
  }

  // ── Render Outgoing Message (Right Side) ──────────────────────────────────
  if (message.isOutgoing) {
    return (
      <div
        id={`msg-${message.id}`}
        className={`flex flex-col ${
          isEditing
            ? 'w-full max-w-full my-2'
            : `items-end ml-auto max-w-[85%] sm:max-w-[70%] ${isSameSenderAsPrev ? 'mt-1' : 'mt-3'}`
        } group`}
      >
        {/* Pinned Indicator Above Bubble */}
        {message.isPinned && !isEditing && (
          <div className="flex items-center gap-1 text-[10px] font-semibold text-[#5B5FC7] mb-1 mr-1 select-none">
            <Pin className="w-3 h-3 fill-[#5B5FC7]" />
            <span>Pinned message</span>
          </div>
        )}

        {/* Inline Message Edit View (MS Teams style matching Screenshot 1) */}
        {isEditing ? (
          <div className="w-full my-1 flex flex-col items-end animate-in fade-in duration-150">
            <div className="w-full rounded-md border border-slate-300 border-b-2 border-b-[#5B5FC7] bg-white p-3.5 shadow-2xs transition-all">
              <textarea
                value={editInput}
                onChange={(e) => setEditInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSaveEditSubmit()
                  }
                  if (e.key === 'Escape') handleCancelEdit()
                }}
                rows={2}
                className="w-full bg-transparent border-0 outline-none text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0 p-0 resize-none leading-relaxed min-h-[44px]"
                autoFocus
              />

              {/* Action Toolbar on bottom right */}
              <div className="flex items-center justify-end gap-1.5 pt-2 text-slate-500">
                {/* Format 'A' with pencil */}
                <button
                  type="button"
                  title="Format"
                  onClick={() => toast.info('Text formatting available')}
                  className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M4.5 13H8.5M3 15L6.5 6L10 15M17.2 9.2L12.5 14H10.5V12L15.2 7.2C15.5 6.9 16 6.9 16.3 7.2L17.2 8.1C17.5 8.4 17.5 8.9 17.2 9.2Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* Smile */}
                <button
                  type="button"
                  title="Emoji"
                  className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <Smile className="w-4 h-4" />
                </button>

                {/* Paperclip */}
                <button
                  type="button"
                  title="Attach File"
                  className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                {/* Plus */}
                <button
                  type="button"
                  title="More options"
                  className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>

                {/* Vertical Divider */}
                <div className="h-4 w-[1px] bg-slate-300 mx-1" />

                {/* Cancel ✕ */}
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  title="Cancel edit (Esc)"
                  className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 stroke-[1.8]" />
                </button>

                {/* Save ✓ */}
                <button
                  type="button"
                  onClick={handleSaveEditSubmit}
                  disabled={!editInput.trim()}
                  title="Save changes (Enter)"
                  className="p-1 rounded text-slate-600 hover:text-[#5B5FC7] hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-40"
                >
                  <Check className="w-4 h-4 stroke-[2.4]" />
                </button>
              </div>
            </div>

            {/* Sub-hint: Shift+Enter starts a new line. */}
            <div className="mt-1 text-xs text-[#5B5FC7] select-none mr-1 font-normal">
              <span className="font-semibold text-[#5B5FC7]">Shift+Enter</span> starts a new line.
            </div>
          </div>
        ) : (
          <div className="relative inline-block text-left">
            {/* Outgoing Bubble */}
            <div className="px-4 py-2 rounded-[14px] bg-[#E8EDFB] text-slate-800 text-xs sm:text-sm leading-relaxed border border-[#DCE4FA]/80 shadow-2xs">
              {/* Quoted Message Preview Header if replying */}
              {message.replyTo && (
                <div className="mb-2 px-2.5 py-1.5 rounded-lg border-l-2 border-[#5B5FC7] bg-white/70 text-[11px] text-slate-600 shadow-2xs">
                  <div className="flex items-center gap-1 font-semibold text-[#5B5FC7]">
                    <Quote className="w-3 h-3 rotate-180" />
                    <span>{message.replyTo.senderName}</span>
                  </div>
                  <p className="line-clamp-2 truncate text-slate-500 mt-0.5">
                    {message.replyTo.content}
                  </p>
                </div>
              )}

              {message.content && <p className="whitespace-pre-wrap">{message.content}</p>}

            {/* Translation Card if translated */}
            {message.translation && (
              <div className="mt-2 pt-2 border-t border-[#DCE4FA] text-xs text-slate-700 bg-white/60 p-2 rounded-lg">
                <div className="flex items-center justify-between gap-1 text-[10px] font-semibold text-slate-500 mb-1">
                  <div className="flex items-center gap-1">
                    <Languages className="w-3 h-3 text-[#5B5FC7]" />
                    <span>Translated to {message.translation.language}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onTranslate(message, '')}
                    className="text-[10px] text-slate-400 hover:text-slate-600 underline cursor-pointer"
                  >
                    Hide
                  </button>
                </div>
                <p className="whitespace-pre-wrap text-slate-800 font-normal">
                  {message.translation.text}
                </p>
              </div>
            )}

            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 flex flex-col gap-1.5">
                {message.attachments.map((att, idx) => {
                  const isImg =
                    att.type === 'image' ||
                    (att.name || '').match(/\.(png|jpe?g|gif|webp|svg)$/i) ||
                    (att.url || '').match(/\.(png|jpe?g|gif|webp|svg)/i)

                  return isImg && att.url ? (
                    <div
                      key={idx}
                      className="mt-1 rounded-xl overflow-hidden border border-slate-200/80 bg-black/5"
                    >
                      <img
                        src={att.url}
                        alt={att.name}
                        className="max-w-[280px] max-h-[220px] object-cover rounded-xl cursor-pointer hover:opacity-95 transition-opacity"
                        onClick={() => window.open(att.url, '_blank')}
                      />
                      <div className="flex items-center justify-between px-2 py-1 text-[11px] text-slate-600 bg-white/90">
                        <span className="truncate max-w-[180px] font-medium">{att.name}</span>
                        <span className="text-[10px] text-slate-400">({att.size})</span>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-3 p-2 rounded-xl text-xs bg-white/90 border border-slate-200/80 text-slate-800 shadow-2xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 shrink-0 text-[#102A43]" />
                        <span className="truncate font-medium">{att.name}</span>
                        <span className="text-[10px] text-slate-400">({att.size})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (att.url) window.open(att.url, '_blank')
                          else toast.info(`File: ${att.name}`)
                        }}
                        className="p-1 rounded-lg hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
                        title="Download attachment from MinIO"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Hover Toolbar & Three Dots Action Menu (Images 2 & 3) */}
          {!isEditing && (
            <ChatMessageActions
              message={message}
              isOutgoing={true}
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
              onStartEdit={handleStartEdit}
              onViewDetails={onViewDetails}
            />
          )}
        </div>
      )}

        {/* Reaction badges (Below bubble) */}
        {message.reactions && Object.keys(message.reactions).length > 0 && (
          <div className="flex flex-wrap items-center gap-1 mt-1 justify-end">
            {Object.entries(message.reactions).map(([emoji, count]) => (
              <button
                key={emoji}
                type="button"
                onClick={() => onReaction(message.id, emoji)}
                className="inline-flex items-center gap-1 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-full px-2 py-0.5 shadow-2xs text-[11px] text-slate-700 transition-all cursor-pointer active:scale-95"
                title={`React with ${emoji}`}
              >
                <span>{emoji}</span>
                <span className="text-[10px] font-semibold text-slate-600">{count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Timestamp, Saved Bookmark & Circle Delivery/Read Indicator */}
        <div className="flex items-center justify-end gap-1.5 mt-1 mr-1 select-none">
          {message.isSaved && (
            <span title="Saved message">
              <Bookmark className="w-3 h-3 text-amber-500 fill-amber-500" />
            </span>
          )}
          {message.isEdited && (
            <span className="text-[10px] text-slate-400 italic">(edited)</span>
          )}
          <span className="text-[11px] text-slate-400 font-normal">{message.timestamp}</span>

          {/* Read Receipt using circle indicator as requested */}
          {message.status === 'read' ? (
            <span
              className="inline-block rounded-full shrink-0 shadow-2xs"
              style={{
                width: '10px',
                height: '10px',
                minWidth: '10px',
                minHeight: '10px',
                backgroundColor: '#2563eb',
                border: '2px solid #2563eb',
                boxSizing: 'border-box',
              }}
              title="Read by receiver"
            />
          ) : (
            <span
              className="inline-block rounded-full shrink-0 shadow-2xs"
              style={{
                width: '10px',
                height: '10px',
                minWidth: '10px',
                minHeight: '10px',
                backgroundColor: '#ffffff',
                border: '2px solid #64748b',
                boxSizing: 'border-box',
              }}
              title="Delivered to receiver"
            />
          )}
        </div>
      </div>
    )
  }

  // ── Render Incoming Message (Left Side) ───────────────────────────────────
  return (
    <div
      id={`msg-${message.id}`}
      className={`flex items-start gap-2.5 max-w-[85%] sm:max-w-[70%] group ${
        isSameSenderAsPrev ? 'mt-1' : 'mt-3'
      }`}
    >
      {!isSameSenderAsPrev ? (
        <UserProfileHoverCard
          user={{
            id: message.senderId,
            name: message.senderName,
            role: message.senderRole || 'Member',
            email: message.senderEmail,
            organizationName: message.senderOrganizationName,
            avatar: message.senderAvatar,
          }}
          align="left"
          side="top"
        >
          <div className={`relative shrink-0 mt-0.5 cursor-pointer p-[1.5px] rounded-full border-2 ${avatarStyle.ringBorder} transition-all`}>
            <div
              className={`w-8 h-8 rounded-full ${avatarStyle.bg} ${avatarStyle.text} font-semibold text-xs flex items-center justify-center select-none shadow-2xs hover:scale-105 transition-all`}
            >
              {getInitials(message.senderName)}
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-white absolute -bottom-0.5 -right-0.5" />
          </div>
        </UserProfileHoverCard>
      ) : (
        <div className="w-8 shrink-0" />
      )}

      <div className="flex flex-col items-start gap-1 min-w-0">
        {!isSameSenderAsPrev && (
          <UserProfileHoverCard
            user={{
              id: message.senderId,
              name: message.senderName,
              role: message.senderRole || 'Member',
              email: message.senderEmail,
              organizationName: message.senderOrganizationName,
              avatar: message.senderAvatar,
            }}
            align="left"
            side="top"
          >
            <div className="flex items-center gap-2 mb-0.5 px-0.5 cursor-pointer group/name">
              <span className="text-xs font-semibold text-slate-700 group-hover/name:text-[#5B5FC7] group-hover/name:underline transition-colors">
                {message.senderName}
              </span>
            </div>
          </UserProfileHoverCard>
        )}

        {/* Pinned Indicator Above Incoming Bubble */}
        {message.isPinned && (
          <div className="flex items-center gap-1 text-[10px] font-semibold text-[#5B5FC7] mb-1 ml-1 select-none">
            <Pin className="w-3 h-3 fill-[#5B5FC7]" />
            <span>Pinned message</span>
          </div>
        )}

        <div className="relative inline-block text-left">
          {/* Incoming Bubble */}
          <div className="px-4 py-2 rounded-[14px] bg-[#F2F4F7] text-slate-800 text-xs sm:text-sm leading-relaxed border border-slate-200/50 shadow-2xs">
            {/* Quoted Message Preview Header if replying */}
            {message.replyTo && (
              <div className="mb-2 px-2.5 py-1.5 rounded-lg border-l-2 border-[#5B5FC7] bg-white text-[11px] text-slate-600 shadow-2xs">
                <div className="flex items-center gap-1 font-semibold text-[#5B5FC7]">
                  <Quote className="w-3 h-3 rotate-180" />
                  <span>{message.replyTo.senderName}</span>
                </div>
                <p className="line-clamp-2 truncate text-slate-500 mt-0.5">
                  {message.replyTo.content}
                </p>
              </div>
            )}

            {message.content && <p className="whitespace-pre-wrap">{message.content}</p>}

            {/* Translation Card if translated */}
            {message.translation && (
              <div className="mt-2 pt-2 border-t border-slate-200 text-xs text-slate-700 bg-white p-2 rounded-lg">
                <div className="flex items-center justify-between gap-1 text-[10px] font-semibold text-slate-500 mb-1">
                  <div className="flex items-center gap-1">
                    <Languages className="w-3 h-3 text-[#5B5FC7]" />
                    <span>Translated to {message.translation.language}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onTranslate(message, '')}
                    className="text-[10px] text-slate-400 hover:text-slate-600 underline cursor-pointer"
                  >
                    Hide
                  </button>
                </div>
                <p className="whitespace-pre-wrap text-slate-800 font-normal">
                  {message.translation.text}
                </p>
              </div>
            )}

            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 flex flex-col gap-1.5">
                {message.attachments.map((att, idx) => {
                  const isImg =
                    att.type === 'image' ||
                    (att.name || '').match(/\.(png|jpe?g|gif|webp|svg)$/i) ||
                    (att.url || '').match(/\.(png|jpe?g|gif|webp|svg)/i)

                  return isImg && att.url ? (
                    <div
                      key={idx}
                      className="mt-1 rounded-xl overflow-hidden border border-slate-200 bg-white shadow-2xs"
                    >
                      <img
                        src={att.url}
                        alt={att.name}
                        className="max-w-[280px] max-h-[220px] object-cover rounded-xl cursor-pointer hover:opacity-95 transition-opacity"
                        onClick={() => window.open(att.url, '_blank')}
                      />
                      <div className="flex items-center justify-between px-2 py-1 text-[11px] text-slate-600 bg-white">
                        <span className="truncate max-w-[180px] font-medium">{att.name}</span>
                        <span className="text-[10px] text-slate-400">({att.size})</span>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-3 p-2 rounded-xl text-xs bg-white border border-slate-200 text-slate-800 shadow-2xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 shrink-0 text-[#102A43]" />
                        <span className="truncate font-medium">{att.name}</span>
                        <span className="text-[10px] text-slate-400">({att.size})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (att.url) window.open(att.url, '_blank')
                          else toast.info(`File: ${att.name}`)
                        }}
                        className="p-1 rounded-lg hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
                        title="Download attachment from MinIO"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Hover Toolbar & Three Dots Action Menu (Images 2 & 3) */}
          <ChatMessageActions
            message={message}
            isOutgoing={false}
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
            onStartEdit={handleStartEdit}
            onViewDetails={onViewDetails}
          />
        </div>

        {/* Reaction badges (Below bubble) */}
        {message.reactions && Object.keys(message.reactions).length > 0 && (
          <div className="flex flex-wrap items-center gap-1 mt-1 justify-start">
            {Object.entries(message.reactions).map(([emoji, count]) => (
              <button
                key={emoji}
                type="button"
                onClick={() => onReaction(message.id, emoji)}
                className="inline-flex items-center gap-1 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-full px-2 py-0.5 shadow-2xs text-[11px] text-slate-700 transition-all cursor-pointer active:scale-95"
                title={`React with ${emoji}`}
              >
                <span>{emoji}</span>
                <span className="text-[10px] font-semibold text-slate-600">{count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Timestamp & Saved Bookmark */}
        <div className="flex items-center justify-start gap-1.5 mt-1 ml-1 select-none">
          {message.isSaved && (
            <span title="Saved message">
              <Bookmark className="w-3 h-3 text-amber-500 fill-amber-500" />
            </span>
          )}
          {message.isEdited && (
            <span className="text-[10px] text-slate-400 italic">(edited)</span>
          )}
          <span className="text-[11px] text-slate-400 font-normal">{message.timestamp}</span>
        </div>
      </div>
    </div>
  )
}
