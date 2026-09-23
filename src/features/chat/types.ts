export type PresenceStatus = 'online' | 'offline' | 'away' | 'busy'

export interface ChatParticipant {
  id: string
  name: string
  role: string
  email?: string
  organizationName?: string
  avatar?: string
  status: PresenceStatus
}

export interface ChatAttachment {
  name: string
  size: string
  type: 'pdf' | 'image' | 'doc'
  url?: string
}

export interface ChatMessage {
  id: string
  conversationId?: string
  senderId: string
  senderName: string
  senderRole?: string
  senderEmail?: string
  senderOrganizationName?: string
  senderAvatar?: string
  content: string
  timestamp: string
  isOutgoing: boolean
  attachments?: ChatAttachment[]
  reactions?: Record<string, number>
  status?: 'sent' | 'delivered' | 'read'
  replyToId?: string | null
  replyTo?: { id: string; senderName: string; content: string } | null
  isPinned?: boolean
  isSaved?: boolean
  isEdited?: boolean
  translation?: { language: string; text: string } | null
  createdAt?: string
}

export interface ChatConversation {
  id: string
  name: string
  type: 'channel' | 'direct'
  subtitle?: string
  email?: string
  organizationName?: string
  avatar?: string
  status?: PresenceStatus
  role?: string
  unreadCount?: number
  lastMessage?: string
  lastMessageTime?: string
  lastMessageTimestamp?: number
  messages: ChatMessage[]
  members?: ChatParticipant[]
}

export interface ChatContact {
  id: string
  userId?: string
  name: string
  role: string
  email?: string
  organizationName?: string
  avatar?: string
  organizationId?: string
  category?: string
  status?: string
}

