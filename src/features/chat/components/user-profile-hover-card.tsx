import React, { useState, useRef } from 'react'
import {
  MessageSquare,
  Phone,
  Mail,
  Send,
  ChevronRight,
  Copy,
  Check,
  Building2,
} from 'lucide-react'
import { toast } from 'sonner'
import { getInitials, getAvatarStyle } from '../chat-utils'

export interface ProfileCardUserData {
  id?: string
  name: string
  role?: string
  email?: string
  organizationName?: string
  avatar?: string
  status?: string
  workHours?: string
  department?: string
  phone?: string
}

interface UserProfileHoverCardProps {
  user: ProfileCardUserData
  children: React.ReactNode
  onSendMessage?: (content: string) => void
  onCall?: () => void
  onVideoCall?: () => void
  align?: 'left' | 'right' | 'center'
  side?: 'bottom' | 'top'
}

export const UserProfileHoverCard: React.FC<UserProfileHoverCardProps> = ({
  user,
  children,
  onSendMessage,
  onCall,
  align = 'left',
  side = 'bottom',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [quickMsg, setQuickMsg] = useState('')
  const [hasCopiedEmail, setHasCopiedEmail] = useState(false)
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 220)
  }

  const handleQuickSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!quickMsg.trim()) return

    if (onSendMessage) {
      onSendMessage(quickMsg.trim())
      toast.success(`Quick message sent to ${user.name}`)
    } else {
      toast.success(`Message "${quickMsg.trim()}" sent to ${user.name}`)
    }
    setQuickMsg('')
    setIsOpen(false)
  }

  const handleCopyEmail = (emailStr: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(emailStr)
    setHasCopiedEmail(true)
    toast.success('Email copied to clipboard')
    setTimeout(() => setHasCopiedEmail(false), 2000)
  }

  const avatarStyle = getAvatarStyle(user.role || user.name)
  const displayEmail =
    user.email ||
    `${user.name.toLowerCase().replace(/\s+/g, '.')}@eduweconnect.com`
  const isOnline = user.status === 'online'

  // Determine whether to display the separate organization badge
  // Avoid duplicate organization name if the user's name is the organization itself (Institution Admin)
  const isOrgSelf = Boolean(
    user.organizationName &&
    user.name &&
    user.organizationName.trim().toLowerCase() === user.name.trim().toLowerCase()
  )
  const showOrganization = Boolean(user.organizationName && !isOrgSelf)

  // Alignment classes
  const alignClass =
    align === 'right'
      ? 'right-0'
      : align === 'center'
      ? 'left-1/2 -translate-x-1/2'
      : 'left-0'

  const sideClass =
    side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger element (Avatar, Name, etc.) */}
      {children}

      {/* Popover Profile Card - Consistent compact shape with rounded edges */}
      {isOpen && (
        <div
          className={`absolute ${sideClass} ${alignClass} z-50 w-[360px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-5 text-slate-800 select-none flex flex-col gap-3.5 animate-in fade-in zoom-in-95 duration-150`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Profile Header */}
          <div className="flex items-start gap-4">
            {/* Large Avatar with outer role-defining circle ring */}
            <div className={`relative shrink-0 p-[2.5px] rounded-full border-2 ${avatarStyle.ringBorder} transition-all`}>
              <div
                className={`w-16 h-16 rounded-full ${avatarStyle.bg} ${avatarStyle.text} font-bold text-xl flex items-center justify-center select-none shadow-xs`}
              >
                {getInitials(user.name)}
              </div>

              {/* Status Dot */}
              <span
                className={`w-4 h-4 rounded-full ${
                  isOnline ? 'bg-emerald-500' : 'bg-slate-400'
                } border-2 border-white absolute -bottom-0.5 -right-0.5 flex items-center justify-center text-white shadow-2xs`}
                title={isOnline ? 'Online' : 'Offline'}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              </span>
            </div>

            {/* Name, Role & Organization */}
            <div className="min-w-0 flex-1 pt-0.5">
              <h3 className="text-base font-bold text-slate-900 truncate leading-tight">
                {user.name}
              </h3>
              <p className="text-xs text-slate-500 capitalize font-medium mt-1 truncate">
                {user.role || 'Member'}
              </p>
              {/* Show organization under role for student/staff or maintain balanced height */}
              {showOrganization ? (
                <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-600 font-medium truncate">
                  <Building2 className="w-3.5 h-3.5 text-[#5B5FC7] shrink-0" />
                  <span className="truncate text-slate-700" title={`Organization: ${user.organizationName}`}>
                    {user.organizationName}
                  </span>
                </div>
              ) : user.department &&
                user.department.trim().toLowerCase() !== (user.role || '').trim().toLowerCase() ? (
                <p className="text-[11px] text-slate-400 truncate mt-1">
                  {user.department}
                </p>
              ) : null}
            </div>
          </div>

          {/* Action Buttons Row: Only Chat and Call icons */}
          <div className="flex items-center justify-center gap-10 py-2 border-y border-slate-100 text-slate-600">
            <button
              type="button"
              title="Chat"
              onClick={() => {
                setIsOpen(false)
                toast.info(`Chatting with ${user.name}`)
              }}
              className="p-2.5 rounded-xl text-slate-600 hover:text-[#5B5FC7] hover:bg-[#F2F4F7] transition-colors cursor-pointer"
            >
              <MessageSquare className="w-5 h-5" />
            </button>

            <button
              type="button"
              title="Voice Call"
              onClick={() => {
                setIsOpen(false)
                if (onCall) onCall()
                else toast.info(`Starting voice call with ${user.name}...`)
              }}
              className="p-2.5 rounded-xl text-slate-600 hover:text-[#5B5FC7] hover:bg-[#F2F4F7] transition-colors cursor-pointer"
            >
              <Phone className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Message Input Box with prominent visible border */}
          <form onSubmit={handleQuickSend} className="relative">
            <input
              type="text"
              placeholder="Send a quick message"
              value={quickMsg}
              onChange={(e) => setQuickMsg(e.target.value)}
              className="w-full bg-slate-50/80 hover:bg-white focus:bg-white border border-slate-300 focus:border-[#5B5FC7] focus:ring-2 focus:ring-[#5B5FC7]/15 rounded-xl pl-3.5 pr-9 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition-all shadow-2xs"
            />
            <button
              type="submit"
              disabled={!quickMsg.trim()}
              title="Send quick message"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-[#5B5FC7] disabled:opacity-40 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Bottom Contact Section */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5 cursor-pointer group">
              <span className="group-hover:text-[#5B5FC7] transition-colors">Contact</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#5B5FC7] transition-colors" />
            </div>

            {/* Email Address Row */}
            <div className="flex items-center justify-between gap-2 py-0.5 group">
              <div className="flex items-center gap-2.5 min-w-0">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <a
                  href={`mailto:${displayEmail}`}
                  className="text-xs text-[#5B5FC7] hover:underline truncate font-normal"
                  title={displayEmail}
                >
                  {displayEmail}
                </a>
              </div>
              <button
                type="button"
                onClick={(e) => handleCopyEmail(displayEmail, e)}
                title="Copy email"
                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {hasCopiedEmail ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Organization Row if available and not self */}
            {showOrganization && (
              <div className="flex items-center gap-2.5 py-0.5 text-xs text-slate-700">
                <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate font-medium">{user.organizationName}</span>
              </div>
            )}

            {/* Show more button */}
            <button
              type="button"
              onClick={() => {
                toast.info(`Full profile details for ${user.name}`)
              }}
              className="mt-1 text-xs font-semibold text-[#5B5FC7] hover:underline cursor-pointer block"
            >
              Show more
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

