import React, { useMemo } from 'react'
import { Search, SquarePen, Hash, X, MessageSquare, UserPlus, Users } from 'lucide-react'
import { Input } from '@/components/ui'
import type { ChatConversation } from '../types'
import type { ChatContact as ApiChatContact } from '../api/chat.api'
import { getInitials, getAvatarStyle, PRESENCE_COLORS } from '../chat-utils'
import { groupMembersByRole } from '../chat-permissions'

export type FilterTab = 'all' | 'channels' | 'direct' | 'members'

interface ChatSidebarProps {
  currentUserRole?: string
  currentUserName?: string
  conversations: ChatConversation[]
  contacts?: ApiChatContact[]
  activeConversationId: string
  onSelectConversation: (id: string) => void
  onStartDirectChat?: (contact: ApiChatContact) => void
  onOpenNewChat: () => void
  searchQuery: string
  onSearchChange: (q: string) => void
  filterTab: FilterTab
  onFilterTabChange: (tab: FilterTab) => void
  isLoading?: boolean
}

const TABS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'channels', label: 'Groups & Channels' },
  { id: 'direct', label: 'Direct' },
  { id: 'members', label: 'Members' },
]

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  currentUserRole,
  currentUserName,
  conversations,
  contacts = [],
  activeConversationId,
  onSelectConversation,
  onStartDirectChat,
  onOpenNewChat,
  searchQuery,
  onSearchChange,
  filterTab,
  onFilterTabChange,
  isLoading,
}) => {
  const trimmedSearch = searchQuery.trim().toLowerCase()
  const isSearching = trimmedSearch.length > 0

  // Filter contacts matching the search query
  const matchingContacts = useMemo(() => {
    if (!isSearching || !contacts || contacts.length === 0) return []
    return contacts.filter((c) => {
      const name = (c.name || '').toLowerCase()
      const role = (c.role || '').toLowerCase()
      const category = (c.category || '').toLowerCase()
      const email = (c.email || '').toLowerCase()
      return (
        name.includes(trimmedSearch) ||
        role.includes(trimmedSearch) ||
        category.includes(trimmedSearch) ||
        email.includes(trimmedSearch)
      )
    })
  }, [contacts, isSearching, trimmedSearch])

  // Group members strictly by role hierarchy: Super Admin -> Org -> Staff -> Student
  const memberGroups = useMemo(() => {
    return groupMembersByRole(contacts)
  }, [contacts])

  return (
    <div className="w-full md:w-80 lg:w-96 border-r border-slate-200/90 flex flex-col bg-white shrink-0">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-200/90 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#0B1F33] flex items-center justify-center text-white font-bold text-xs shadow-2xs">
              💬
            </div>
            <h1 className="font-semibold text-base text-slate-800 tracking-tight">EduChat</h1>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 capitalize">
            {currentUserName || 'User'} {currentUserRole ? `• ${currentUserRole}` : ''}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNewChat}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B1F33] hover:bg-[#142f4c] text-white text-xs font-medium shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-98"
        >
          <SquarePen className="w-3.5 h-3.5" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-slate-100">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search people, teachers, admins..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-8 h-9 text-xs bg-slate-50 border-slate-200/90 rounded-xl focus:bg-white focus:border-[#0B1F33]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs or Search Active Indicator */}
      {isSearching ? (
        <div className="px-3.5 py-2 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between text-[11px] text-slate-500">
          <span>
            Results for &ldquo;<span className="font-semibold text-slate-700">{searchQuery}</span>&rdquo;
          </span>
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="text-[11px] text-[#0B1F33] hover:underline font-medium cursor-pointer"
          >
            Clear
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1 p-2 border-b border-slate-100 overflow-x-hidden">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onFilterTabChange(tab.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                filterTab === tab.id
                  ? 'bg-[#0B1F33] text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Main List Area */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 sleek-scrollbar">
        {isLoading ? (
          <div className="p-6 text-center text-xs text-slate-400">Loading chats...</div>
        ) : isSearching ? (
          /* Search results view */
          conversations.length === 0 && matchingContacts.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2.5 text-base">
                🔍
              </div>
              <p className="text-xs font-medium text-slate-700">No matches found</p>
              <p className="text-[11px] text-slate-400 mt-1">
                No active chats or contacts found for &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                type="button"
                onClick={onOpenNewChat}
                className="mt-3 inline-flex items-center gap-1 text-xs text-[#0B1F33] hover:underline font-medium cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Browse all contacts</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {/* Existing Conversations matching search */}
              {conversations.length > 0 && (
                <div>
                  <div className="px-3.5 py-1.5 bg-slate-50/90 text-[10px] font-bold uppercase tracking-wider text-slate-500 sticky top-0 z-10">
                    Conversations ({conversations.length})
                  </div>
                  {conversations.map((conv) => {
                    const isActive = conv.id === activeConversationId
                    const isChannel = conv.type === 'channel'
                    const avatarStyle = getAvatarStyle(conv.role || conv.name)
                    const presenceColor = PRESENCE_COLORS[conv.status || 'offline']

                    return (
                      <button
                        key={conv.id}
                        type="button"
                        onClick={() => onSelectConversation(conv.id)}
                        className={`w-full p-3.5 flex items-start gap-3 text-left transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-[#F2F4F7] border-l-4 border-l-[#0B1F33]'
                            : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                        }`}
                      >
                        {/* Outer role-defining circle ring */}
                        <div className={`relative shrink-0 mt-0.5 p-[2px] rounded-full border-2 ${avatarStyle.ringBorder} transition-all`}>
                          <div
                            className={`w-10 h-10 rounded-full ${avatarStyle.bg} ${avatarStyle.text} font-semibold text-xs flex items-center justify-center select-none shadow-2xs`}
                          >
                            {isChannel ? (
                              <Hash className="w-4 h-4 text-slate-600" />
                            ) : (
                              getInitials(conv.name)
                            )}
                          </div>
                          {!isChannel && (
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${presenceColor} border-2 border-white absolute -bottom-0.5 -right-0.5`}
                            />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <span
                              className={`text-xs truncate ${
                                conv.unreadCount && conv.unreadCount > 0
                                  ? 'font-bold text-slate-900'
                                  : isActive
                                  ? 'font-semibold text-slate-900'
                                  : 'font-medium text-slate-800'
                              }`}
                            >
                              {isChannel ? `#${conv.name}` : conv.name}
                            </span>
                            {Boolean(conv.unreadCount && conv.unreadCount > 0) ? (
                              <span
                                title="Unread messages"
                                className="w-2.5 h-2.5 rounded-full bg-[#5B5FC7] shrink-0 shadow-xs ring-2 ring-[#5B5FC7]/20"
                              />
                            ) : conv.lastMessageTime ? (
                              <span className="text-[10px] text-slate-400 shrink-0 font-normal">
                                {conv.lastMessageTime}
                              </span>
                            ) : null}
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            <p
                              className={`text-xs truncate ${
                                conv.unreadCount && conv.unreadCount > 0
                                  ? 'font-medium text-slate-800'
                                  : 'text-slate-500 font-normal'
                              }`}
                            >
                              {conv.lastMessage || 'No messages yet'}
                            </p>
                            {Boolean(conv.unreadCount && conv.unreadCount > 0 && conv.lastMessageTime) && (
                              <span className="text-[10px] font-medium text-[#5B5FC7] shrink-0">
                                {conv.lastMessageTime}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* People & Contacts matching search */}
              {matchingContacts.length > 0 && (
                <div>
                  <div className="px-3.5 py-1.5 bg-slate-50/90 text-[10px] font-bold uppercase tracking-wider text-slate-500 sticky top-0 z-10 flex items-center justify-between">
                    <span>People & Contacts ({matchingContacts.length})</span>
                    <span className="text-[9px] font-normal text-slate-400 normal-case">Click to chat</span>
                  </div>
                  {matchingContacts.map((contact) => {
                    const avatarStyle = getAvatarStyle(contact.role || contact.name)
                    return (
                      <button
                        key={contact.id || contact.userId}
                        type="button"
                        onClick={() => onStartDirectChat?.(contact)}
                        className="w-full p-3 flex items-center justify-between gap-3 text-left hover:bg-slate-50 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Outer role-defining circle ring */}
                          <div className={`relative shrink-0 p-[2px] rounded-full border-2 ${avatarStyle.ringBorder} transition-all`}>
                            <div
                              className={`w-9 h-9 rounded-full ${avatarStyle.bg} ${avatarStyle.text} font-semibold text-xs flex items-center justify-center select-none shadow-2xs`}
                            >
                              {getInitials(contact.name)}
                            </div>
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-0.5 -right-0.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-[#0B1F33]">
                              {contact.name}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate">
                              {contact.email || contact.category || 'Click to message'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-md border capitalize ${avatarStyle.badge}`}
                          >
                            {contact.role}
                          </span>
                          <div className="w-6 h-6 rounded-lg bg-slate-100 group-hover:bg-[#0B1F33] group-hover:text-white text-slate-500 flex items-center justify-center transition-colors">
                            <MessageSquare className="w-3 h-3" />
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        ) : filterTab === 'members' ? (
          /* Members Directory view: Strictly ordered Super Admin -> Org -> Staff -> Students */
          memberGroups.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2.5">
                <Users className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-xs font-semibold text-slate-700">No members found</p>
              <p className="text-[11px] text-slate-400 mt-1">There are no other members in your directory.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {memberGroups.map((group) => (
                <div key={group.key} className="relative">
                  {/* Category Header */}
                  <div className="px-3.5 py-1.5 bg-slate-50/90 backdrop-blur-xs border-y border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-600 uppercase tracking-wider sticky top-0 z-10">
                    <span>{group.title}</span>
                    <span className="text-[10px] bg-slate-200/80 text-slate-700 px-1.5 py-0.2 rounded-full font-semibold">
                      {group.members.length}
                    </span>
                  </div>

                  {/* Group Members List */}
                  <div className="divide-y divide-slate-100/70">
                    {group.members.map((member) => {
                      const avatarStyle = getAvatarStyle(member.role || member.name)
                      const isOnline = member.status === 'online'
                      const contactUserId = member.userId || member.id

                      // Check if existing conversation is active
                      const existingConv = conversations.find(
                        (c) =>
                          c.type === 'direct' &&
                          (c.members?.some((m) => m.id === contactUserId) ||
                            c.name.toLowerCase() === member.name.toLowerCase())
                      )
                      const isCurrentlyActive = existingConv && existingConv.id === activeConversationId

                      return (
                        <button
                          key={member.id || member.userId}
                          type="button"
                          onClick={() => {
                            if (existingConv) {
                              onSelectConversation(existingConv.id)
                            } else if (onStartDirectChat) {
                              onStartDirectChat(member)
                            }
                          }}
                          className={`w-full p-3 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer group ${
                            isCurrentlyActive
                              ? 'bg-[#F2F4F7] border-l-4 border-l-[#0B1F33]'
                              : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Outer role-defining circle ring */}
                            <div className={`relative shrink-0 p-[2px] rounded-full border-2 ${avatarStyle.ringBorder} transition-all`}>
                              <div
                                className={`w-9 h-9 rounded-full ${avatarStyle.bg} ${avatarStyle.text} font-semibold text-xs flex items-center justify-center select-none shadow-2xs`}
                              >
                                {getInitials(member.name)}
                              </div>
                              <span
                                className={`w-2.5 h-2.5 rounded-full ${
                                  isOnline ? 'bg-emerald-500' : 'bg-slate-400'
                                } border-2 border-white absolute -bottom-0.5 -right-0.5`}
                              />
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-[#0B1F33]">
                                  {member.name}
                                </p>
                                {existingConv && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#5B5FC7]" title="Active chat" />
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 truncate">
                                {member.organizationName &&
                                member.organizationName.toLowerCase() !== member.name.toLowerCase()
                                  ? member.organizationName
                                  : member.email || member.role}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`text-[10px] font-medium px-2 py-0.5 rounded-md border capitalize ${avatarStyle.badge}`}
                            >
                              {member.role}
                            </span>
                            <div className="p-1 rounded-md text-slate-400 group-hover:text-[#0B1F33] group-hover:bg-slate-200/60 transition-colors">
                              <MessageSquare className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : conversations.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-xs text-slate-400">No conversations found</p>
            <button
              type="button"
              onClick={onOpenNewChat}
              className="mt-2 text-xs text-[#0B1F33] hover:underline font-medium cursor-pointer"
            >
              Start a new chat
            </button>
          </div>
        ) : (
          conversations.map((conv) => {
            const isActive = conv.id === activeConversationId
            const isChannel = conv.type === 'channel'
            const avatarStyle = getAvatarStyle(conv.role || conv.name)
            const presenceColor = PRESENCE_COLORS[conv.status || 'offline']

            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => onSelectConversation(conv.id)}
                className={`w-full p-3.5 flex items-start gap-3 text-left transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#F2F4F7] border-l-4 border-l-[#0B1F33]'
                    : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                }`}
              >
                {/* Outer role-defining circle ring */}
                <div className={`relative shrink-0 mt-0.5 p-[2px] rounded-full border-2 ${avatarStyle.ringBorder} transition-all`}>
                  <div
                    className={`w-10 h-10 rounded-full ${avatarStyle.bg} ${avatarStyle.text} font-semibold text-xs flex items-center justify-center select-none shadow-2xs`}
                  >
                    {isChannel ? (
                      <Hash className="w-4 h-4 text-slate-600" />
                    ) : (
                      getInitials(conv.name)
                    )}
                  </div>
                  {!isChannel && (
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${presenceColor} border-2 border-white absolute -bottom-0.5 -right-0.5`}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span
                      className={`text-xs truncate ${
                        conv.unreadCount && conv.unreadCount > 0
                          ? 'font-bold text-slate-900'
                          : isActive
                          ? 'font-semibold text-slate-900'
                          : 'font-medium text-slate-800'
                      }`}
                    >
                      {isChannel ? `#${conv.name}` : conv.name}
                    </span>
                    {Boolean(conv.unreadCount && conv.unreadCount > 0) ? (
                      <span
                        title="Unread messages"
                        className="w-2.5 h-2.5 rounded-full bg-[#5B5FC7] shrink-0 shadow-xs ring-2 ring-[#5B5FC7]/20"
                      />
                    ) : conv.lastMessageTime ? (
                      <span className="text-[10px] text-slate-400 shrink-0 font-normal">
                        {conv.lastMessageTime}
                      </span>
                    ) : null}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`text-xs truncate ${
                        conv.unreadCount && conv.unreadCount > 0
                          ? 'font-medium text-slate-800'
                          : 'text-slate-500 font-normal'
                      }`}
                    >
                      {conv.lastMessage || 'No messages yet'}
                    </p>
                    {Boolean(conv.unreadCount && conv.unreadCount > 0 && conv.lastMessageTime) && (
                      <span className="text-[10px] font-medium text-[#5B5FC7] shrink-0">
                        {conv.lastMessageTime}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

