import React, { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui'
import { Search, Send, User, Hash, Check } from 'lucide-react'
import type { ChatConversation, ChatContact, ChatMessage } from '../types'

interface ForwardMessageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  message: ChatMessage | null
  conversations: ChatConversation[]
  contacts: ChatContact[]
  onForward: (targetId: string, isDirectContact: boolean, contactOrConv: any) => Promise<void>
}

export const ForwardMessageDialog: React.FC<ForwardMessageDialogProps> = ({
  open,
  onOpenChange,
  message,
  conversations,
  contacts,
  onForward,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [forwardedIds, setForwardedIds] = useState<Set<string>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null)

  // Reset state whenever dialog opens or active message changes
  React.useEffect(() => {
    if (open) {
      setForwardedIds(new Set())
      setSearchQuery('')
      setIsSubmitting(null)
    }
  }, [open, message?.id])

  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()

    // 1. Conversations
    const convItems = conversations
      .filter((c) => !q || c.name.toLowerCase().includes(q) || (c.subtitle || '').toLowerCase().includes(q))
      .map((c) => ({
        id: c.id,
        name: c.name,
        subtitle: c.type === 'channel' ? 'Channel' : c.role || 'Direct Chat',
        isChannel: c.type === 'channel',
        isDirectContact: false,
        raw: c,
      }))

    // 2. Contacts (only those not already in direct conversations)
    const contactItems = contacts
      .filter((contact) => {
        const contactUserId = contact.userId || contact.id
        const alreadyHasConv = conversations.some(
          (c) => c.type === 'direct' && c.members?.some((m) => m.id === contactUserId)
        )
        if (alreadyHasConv) return false
        if (!q) return true
        return (
          contact.name.toLowerCase().includes(q) ||
          contact.role.toLowerCase().includes(q) ||
          (contact.email && contact.email.toLowerCase().includes(q))
        )
      })
      .map((cnt) => ({
        id: cnt.userId || cnt.id,
        name: cnt.name,
        subtitle: cnt.role || cnt.category || 'Contact',
        isChannel: false,
        isDirectContact: true,
        raw: cnt,
      }))

    return [...convItems, ...contactItems]
  }, [conversations, contacts, searchQuery])

  const handleForwardClick = async (item: any) => {
    if (!message) return
    setIsSubmitting(item.id)
    try {
      await onForward(item.id, item.isDirectContact, item.raw)
      setForwardedIds((prev) => new Set(prev).add(item.id))
      // Revert after 2 seconds so user can send again if they wish
      setTimeout(() => {
        setForwardedIds((prev) => {
          const next = new Set(prev)
          next.delete(item.id)
          return next
        })
      }, 2000)
    } finally {
      setIsSubmitting(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-2xl">
        <DialogHeader className="p-4 pb-2 border-b border-slate-100">
          <DialogTitle className="text-base font-semibold text-slate-800">
            Forward Message
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            Share this message with colleagues, students, or channels.
          </DialogDescription>

          {/* Quoted preview snippet */}
          {message && (
            <div className="mt-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 line-clamp-2 italic">
              <span className="font-semibold not-italic text-slate-700">{message.senderName}: </span>
              {message.content || (message.attachments?.length ? `[Attachment: ${message.attachments[0].name}]` : '')}
            </div>
          )}
        </DialogHeader>

        {/* Search input */}
        <div className="px-4 py-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-[#5B5FC7] transition-all">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search chat or contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs text-slate-800 placeholder:text-slate-400 bg-transparent border-none outline-none focus:outline-none"
            />
          </div>
        </div>

        {/* Contact/Chat list */}
        <div className="max-h-[300px] overflow-y-auto px-2 py-1 sleek-scrollbar divide-y divide-slate-100">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching conversation or contact found.
            </div>
          ) : (
            filteredItems.map((item) => {
              const hasForwarded = forwardedIds.has(item.id)
              const isLoading = isSubmitting === item.id

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#E8EDFB] text-[#5B5FC7] flex items-center justify-center shrink-0 font-semibold text-xs">
                      {item.isChannel ? <Hash className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{item.subtitle}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={hasForwarded || isLoading}
                    onClick={() => handleForwardClick(item)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      hasForwarded
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : 'bg-[#5B5FC7] hover:bg-[#4a4ea8] text-white active:scale-95 disabled:opacity-50'
                    }`}
                  >
                    {hasForwarded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Sent</span>
                      </>
                    ) : isLoading ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <Send className="w-3 h-3" />
                        <span>Send</span>
                      </>
                    )}
                  </button>
                </div>
              )
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
