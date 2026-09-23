import React, { useState } from 'react'
import { Phone, Video, Info, Hash } from 'lucide-react'
import type { ChatConversation } from '../types'
import { getInitials, getAvatarStyle, PRESENCE_COLORS } from '../chat-utils'
import { UserProfileHoverCard } from './user-profile-hover-card'
import { toast } from 'sonner'

interface ChatHeaderProps {
  conversation: ChatConversation
  onCall?: () => void
  onVideoCall?: () => void
  onInfo?: () => void
  onSendMessage?: (content: string) => void
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversation,
  onCall,
  onVideoCall,
  onInfo,
  onSendMessage,
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'shared' | 'notes' | 'recap'>('chat')
  const avatarStyle = getAvatarStyle(conversation.role || conversation.name)
  const isChannel = conversation.type === 'channel'
  const presenceColor = PRESENCE_COLORS[conversation.status || 'offline']

  // Find other participant's email if available
  const otherMember = conversation.members?.find((m) => m.name === conversation.name)
  const contactEmail = conversation.email || otherMember?.email

  return (
    <div className="h-16 px-4 sm:px-6 border-b border-slate-200/90 flex items-center justify-between bg-white shrink-0">
      <div className="flex items-center gap-4 sm:gap-6 min-w-0">
        {/* Profile with Hover Card (MS Teams style matching screenshot) */}
        <UserProfileHoverCard
          user={{
            id: conversation.id,
            name: conversation.name,
            role: conversation.role || (isChannel ? 'Channel' : 'Member'),
            email: contactEmail,
            organizationName: conversation.organizationName || otherMember?.organizationName,
            avatar: conversation.avatar,
            status: conversation.status || 'online',
            department: isChannel
              ? 'Team Channel'
              : conversation.subtitle?.trim().toLowerCase() !==
                (conversation.role || '').trim().toLowerCase()
              ? conversation.subtitle
              : undefined,
          }}
          onSendMessage={onSendMessage}
          onCall={onCall}
          onVideoCall={onVideoCall}
          align="left"
          side="bottom"
        >
          <div className="flex items-center gap-3 cursor-pointer group py-1">
            {/* Outer role-defining circle ring */}
            <div className={`relative shrink-0 p-[2px] rounded-full border-2 ${avatarStyle.ringBorder} transition-all`}>
              <div
                className={`w-9 h-9 rounded-full ${avatarStyle.bg} ${avatarStyle.text} font-semibold text-xs flex items-center justify-center select-none shadow-2xs group-hover:scale-105 transition-all`}
              >
                {isChannel ? <Hash className="w-4 h-4 text-slate-600" /> : getInitials(conversation.name)}
              </div>
              {!isChannel && (
                <span
                  className={`w-2.5 h-2.5 rounded-full ${presenceColor} border-2 border-white absolute -bottom-0.5 -right-0.5`}
                  title={conversation.status || 'offline'}
                />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate group-hover:text-[#5B5FC7] transition-colors">
                  {isChannel ? `#${conversation.name}` : conversation.name}
                </h2>
                {conversation.role && (
                  <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium rounded-md bg-slate-100 text-slate-600 border border-slate-200 capitalize">
                    {conversation.role}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 truncate capitalize">
                {isChannel
                  ? conversation.subtitle || `${conversation.members?.length || 0} members`
                  : conversation.status || 'Active'}
              </p>
            </div>
          </div>
        </UserProfileHoverCard>

        {/* MS Teams Header Tabs matching screenshot (Chat, Shared, Notes, Recap) */}
        <div className="hidden md:flex items-center gap-1 self-stretch pt-2">
          {(['chat', 'shared', 'notes', 'recap'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab)
                if (tab !== 'chat') toast.info(`${tab.toUpperCase()} tab view`)
              }}
              className={`px-3 py-1.5 text-xs font-semibold capitalize transition-all border-b-2 cursor-pointer ${
                activeTab === tab
                  ? 'text-slate-900 border-b-[#5B5FC7]'
                  : 'text-slate-500 border-b-transparent hover:text-slate-800 hover:border-b-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <button
          type="button"
          onClick={onCall}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Voice Call"
        >
          <Phone className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onVideoCall}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Video Call"
        >
          <Video className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onInfo}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Chat Details"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
