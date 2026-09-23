import React, { useState, useRef, useEffect } from 'react'
import {
  Pencil,
  MoreHorizontal,
  Quote,
  CornerUpRight,
  Link2,
  Bookmark,
  Trash2,
  Pin,
  EyeOff,
  Mail,
  Languages,
  ChevronRight,
  Copy,
  Info,
  Flag,
  Check,
} from 'lucide-react'
import EmojiPicker, { Theme, type EmojiClickData } from 'emoji-picker-react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui'
import type { ChatMessage } from '../types'

interface ChatMessageActionsProps {
  message: ChatMessage
  isOutgoing: boolean
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
  onStartEdit: (message: ChatMessage) => void
  onViewDetails: (message: ChatMessage) => void
}

const QUICK_REACTIONS = ['👍', '❤️', '😆', '😮']

const TRANSLATION_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi (हिंदी)' },
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'de', name: 'German (Deutsch)' },
  { code: 'ar', name: 'Arabic (العربية)' },
  { code: 'te', name: 'Telugu (తెలుగు)' },
  { code: 'kn', name: 'Kannada (ಕನ್ನಡ)' },
  { code: 'ta', name: 'Tamil (தமிழ்)' },
]

export const ChatMessageActions: React.FC<ChatMessageActionsProps> = ({
  message,
  isOutgoing,
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
  onStartEdit,
  onViewDetails,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isToolbarHovered, setIsToolbarHovered] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<'translation' | 'more' | null>(null)
  const [copiedText, setCopiedText] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close context menu when clicking outside
  useEffect(() => {
    if (!isMenuOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false)
        setActiveSubmenu(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuOpen])

  const handleCopyText = () => {
    if (message.content) {
      navigator.clipboard.writeText(message.content)
      setCopiedText(true)
      setTimeout(() => {
        setCopiedText(false)
        setIsMenuOpen(false)
      }, 1000)
    }
  }

  const isEmojiPickerOpen = activeReactionMsgId === message.id
  const isVisible = isMenuOpen || isEmojiPickerOpen || isToolbarHovered

  return (
    <div
      ref={menuRef}
      onMouseEnter={() => setIsToolbarHovered(true)}
      onMouseLeave={() => setIsToolbarHovered(false)}
      className={`absolute -top-1 ${
        isOutgoing ? 'right-0' : 'left-0'
      } -translate-y-full pb-2 transition-opacity duration-150 z-20 ${
        isVisible
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto'
      }`}
    >
      {/* Invisible hover bridge to eliminate gap when moving cursor from message bubble */}
      <div className="absolute top-full left-0 right-0 h-3 pointer-events-auto" />

      {/* ── Floating Hover Toolbar (Image 2) ──────────────────────────────── */}
      <div className="flex items-center gap-1.5 bg-white border border-slate-200/90 shadow-md rounded-xl px-2 py-1 select-none backdrop-blur-sm pointer-events-auto">
        {/* Quick Reactions: 👍, ❤️, 😆, 😮 */}
        <div className="flex items-center gap-1">
          {QUICK_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => onReaction(message.id, emoji)}
              className="text-sm hover:scale-125 transition-transform cursor-pointer p-0.5"
              title={`React with ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Smiley Face with (+) Badge (Reaction Picker Trigger) */}
        <Popover
          open={isEmojiPickerOpen}
          onOpenChange={(open) => setActiveReactionMsgId(open ? message.id : null)}
        >
          <PopoverTrigger asChild>
            <button
              type="button"
              className="relative p-1 text-slate-500 hover:text-slate-800 hover:scale-110 transition-all cursor-pointer rounded-md hover:bg-slate-100"
              title="Add reaction"
            >
              {/* Custom Smiley with (+) badge matching template */}
              <svg
                className="w-4 h-4 text-slate-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5" />
                <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5" />
              </svg>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-slate-700 text-white rounded-full flex items-center justify-center text-[8px] font-bold leading-none">
                +
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            align={isOutgoing ? 'end' : 'start'}
            sideOffset={8}
            avoidCollisions={true}
            className="p-0 border-0 shadow-2xl rounded-2xl overflow-hidden z-50 w-auto bg-transparent"
          >
            <EmojiPicker
              onEmojiClick={(emojiData: EmojiClickData) => {
                onReaction(message.id, emojiData.emoji)
                setActiveReactionMsgId(null)
              }}
              width={320}
              height={380}
              previewConfig={{ showPreview: false }}
              lazyLoadEmojis={true}
              theme={Theme.LIGHT}
            />
          </PopoverContent>
        </Popover>

        {/* Vertical Divider (only before edit or three dots) */}
        <div className="h-4 w-[1px] bg-slate-200 mx-0.5" />

        {/* Edit Button (Pencil) - ONLY for sent / outgoing messages! */}
        {isOutgoing && (
          <button
            type="button"
            onClick={() => onStartEdit(message)}
            className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            title="Edit sent message"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Three Dots Button (···) */}
        <button
          type="button"
          onClick={() => {
            setIsMenuOpen((prev) => !prev)
            setActiveSubmenu(null)
          }}
          className={`p-1 rounded-md transition-colors cursor-pointer ${
            isMenuOpen
              ? 'bg-slate-100 text-[#5B5FC7]'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
          title="More message options"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* ── Context Menu Dropdown (Image 3) ───────────────────────────────── */}
      {isMenuOpen && (
        <div
          className={`absolute z-30 mt-1 w-60 rounded-2xl bg-white border border-slate-200/90 shadow-2xl py-1.5 text-xs font-medium text-slate-700 animate-in fade-in zoom-in-95 duration-150 ${
            isOutgoing ? 'right-0' : 'left-0'
          }`}
          style={{ maxHeight: '480px' }}
        >
          {/* Main Action Items */}
          <div className="flex flex-col">
            {/* 1. Reply with quote */}
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false)
                onReplyQuote(message)
              }}
              className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-slate-50 transition-colors cursor-pointer text-left w-full text-slate-700"
            >
              <Quote className="w-4 h-4 text-slate-500 shrink-0 rotate-180" />
              <span className="flex-1">Reply with quote</span>
            </button>

            {/* Edit message (only for sent messages) */}
            {isOutgoing && (
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false)
                  onStartEdit(message)
                }}
                className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-slate-50 transition-colors cursor-pointer text-left w-full text-slate-700"
              >
                <Pencil className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="flex-1">Edit message</span>
              </button>
            )}

            {/* 2. Forward */}
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false)
                onForward(message)
              }}
              className="flex items-center justify-between px-3.5 py-2 hover:bg-slate-50 transition-colors cursor-pointer text-left w-full text-slate-700"
            >
              <div className="flex items-center gap-2.5">
                <CornerUpRight className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Forward</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="text-[10px] font-semibold text-slate-400">F</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>

            {/* 3. Copy link */}
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false)
                onCopyLink(message)
              }}
              className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-slate-50 transition-colors cursor-pointer text-left w-full text-slate-700"
            >
              <Link2 className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="flex-1">Copy link</span>
            </button>

            {/* 4. Save this message */}
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false)
                onToggleSave(message)
              }}
              className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-slate-50 transition-colors cursor-pointer text-left w-full text-slate-700"
            >
              <Bookmark
                className={`w-4 h-4 shrink-0 ${
                  message.isSaved ? 'text-amber-500 fill-amber-500' : 'text-slate-500'
                }`}
              />
              <span className="flex-1">
                {message.isSaved ? 'Unsave this message' : 'Save this message'}
              </span>
            </button>

            {/* 5. Delete */}
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false)
                onDelete(message)
              }}
              className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer text-left w-full text-slate-700"
            >
              <Trash2 className="w-4 h-4 text-slate-500 hover:text-red-600 shrink-0" />
              <span className="flex-1">Delete</span>
            </button>

            {/* 6. Pin for everyone */}
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false)
                onTogglePin(message)
              }}
              className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-slate-50 transition-colors cursor-pointer text-left w-full text-slate-700"
            >
              <Pin
                className={`w-4 h-4 shrink-0 ${
                  message.isPinned ? 'text-[#5B5FC7] fill-[#5B5FC7]' : 'text-slate-500'
                }`}
              />
              <span className="flex-1">
                {message.isPinned ? 'Unpin message' : 'Pin for everyone'}
              </span>
            </button>

            {/* Divider */}
            <div className="h-[1px] bg-slate-100 my-1 mx-2" />

            {/* 7. Mark as unread */}
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false)
                onMarkUnread(message)
              }}
              className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-slate-50 transition-colors cursor-pointer text-left w-full text-slate-700"
            >
              <EyeOff className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="flex-1">Mark as unread</span>
            </button>

            {/* 8. Share to... */}
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false)
                onShare(message)
              }}
              className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-slate-50 transition-colors cursor-pointer text-left w-full text-slate-700"
            >
              <Mail className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="flex-1">Share to...</span>
            </button>

            {/* 9. Translation */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setActiveSubmenu((prev) => (prev === 'translation' ? null : 'translation'))
                }
                onMouseEnter={() => setActiveSubmenu('translation')}
                className={`flex items-center justify-between px-3.5 py-2 hover:bg-slate-50 transition-colors cursor-pointer text-left w-full ${
                  activeSubmenu === 'translation' ? 'bg-slate-50 text-[#5B5FC7]' : 'text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Languages className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Translation</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Translation Submenu */}
              {activeSubmenu === 'translation' && (
                <div
                  className={`absolute top-0 w-48 rounded-xl bg-white border border-slate-200/90 shadow-2xl py-1 z-40 max-h-60 overflow-y-auto sleek-scrollbar ${
                    isOutgoing ? 'right-full mr-1' : 'left-full ml-1'
                  }`}
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Translate To
                  </div>
                  {TRANSLATION_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false)
                        setActiveSubmenu(null)
                        onTranslate(message, lang.name)
                      }}
                      className="flex items-center justify-between w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                    >
                      <span>{lang.name}</span>
                      {message.translation?.language === lang.name && (
                        <Check className="w-3 h-3 text-[#5B5FC7]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-[1px] bg-slate-100 my-1 mx-2" />

            {/* 10. More actions */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveSubmenu((prev) => (prev === 'more' ? null : 'more'))}
                onMouseEnter={() => setActiveSubmenu('more')}
                className={`flex items-center justify-between px-3.5 py-2 hover:bg-slate-50 transition-colors cursor-pointer text-left w-full ${
                  activeSubmenu === 'more' ? 'bg-slate-50 text-[#5B5FC7]' : 'text-slate-700'
                }`}
              >
                <span>More actions</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* More Actions Submenu */}
              {activeSubmenu === 'more' && (
                <div
                  className={`absolute top-0 w-44 rounded-xl bg-white border border-slate-200/90 shadow-2xl py-1 z-40 ${
                    isOutgoing ? 'right-full mr-1' : 'left-full ml-1'
                  }`}
                >
                  <button
                    type="button"
                    onClick={handleCopyText}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                  >
                    {copiedText ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                    )}
                    <span>{copiedText ? 'Copied!' : 'Copy text'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false)
                      setActiveSubmenu(null)
                      onViewDetails(message)
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5 text-slate-500" />
                    <span>View details</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false)
                      setActiveSubmenu(null)
                      alert('Message reported for administrator review.')
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs text-amber-700 hover:bg-amber-50 transition-colors text-left cursor-pointer"
                  >
                    <Flag className="w-3.5 h-3.5 text-amber-600" />
                    <span>Report message</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
