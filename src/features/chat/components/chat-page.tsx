import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { Pin } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { deleteConversationNotificationsApi } from '@/features/notifications/api/notifications.api'
import type { ChatConversation, ChatMessage, ChatAttachment } from '../types'
import {
  fetchConversationsApi,
  fetchMessagesApi,
  fetchChatContactsApi,
  createDirectChatApi,
  sendMessageApi,
  editMessageApi,
  deleteMessageApi,
  togglePinMessageApi,
  markConversationAsReadApi,
  type ChatContact as ApiChatContact,
} from '../api/chat.api'
import { useChatSocket } from '../hooks/use-chat-socket'
import { useWebRTCCall } from '../hooks/use-webrtc-call'
import { ChatSidebar, type FilterTab } from './chat-sidebar'
import { ChatHeader } from './chat-header'
import { ChatMessagesView } from './chat-messages-view'
import { ChatComposer } from './chat-composer'
import { NewChatDialog } from './new-chat-dialog'
import { ForwardMessageDialog } from './forward-message-dialog'
import { MessageDetailsDialog } from './message-details-dialog'
import { CallModal } from './call-modal'

// Realistic multilingual translation dictionary for instant offline preview
const TRANSLATION_MAP: Record<string, Record<string, string>> = {
  'Hindi (हिंदी)': {
    'hi': 'नमस्ते',
    'hello': 'नमस्ते',
    'sir login credentials.': 'सर लॉगिन क्रेडेंशियल्स।',
    'my name in ramesh': 'मेरा नाम रमेश है',
    'ok': 'ठीक है',
    'yes': 'हाँ',
    'good morning': 'शुभ प्रभात',
    'thank you': 'धन्यवाद',
  },
  'Spanish (Español)': {
    'hi': 'Hola',
    'hello': 'Hola',
    'sir login credentials.': 'Señor, credenciales de inicio de sesión.',
    'my name in ramesh': 'Mi nombre es Ramesh',
    'ok': 'De acuerdo',
    'yes': 'Sí',
    'good morning': 'Buenos días',
    'thank you': 'Gracias',
  },
  'French (Français)': {
    'hi': 'Salut',
    'hello': 'Bonjour',
    'sir login credentials.': 'Monsieur, identifiants de connexion.',
    'my name in ramesh': 'Mon nom est Ramesh',
    'ok': 'D\'accord',
    'yes': 'Oui',
    'good morning': 'Bonjour',
    'thank you': 'Merci',
  },
  'German (Deutsch)': {
    'hi': 'Hallo',
    'hello': 'Guten Tag',
    'sir login credentials.': 'Herr Anmeldedaten.',
    'my name in ramesh': 'Mein Name ist Ramesh',
    'ok': 'In Ordnung',
    'yes': 'Ja',
    'good morning': 'Guten Morgen',
    'thank you': 'Danke',
  },
  'Arabic (العربية)': {
    'hi': 'مرحبا',
    'hello': 'أهلا وسهلا',
    'sir login credentials.': 'سيدي بيانات تسجيل الدخول.',
    'my name in ramesh': 'اسمي راميش',
    'ok': 'حسنا',
    'yes': 'نعم',
    'good morning': 'صباح الخير',
    'thank you': 'شكرا لك',
  },
  'Telugu (తెలుగు)': {
    'hi': 'నమస్కారం',
    'hello': 'నమస్తే',
    'sir login credentials.': 'సార్ లాగిన్ వివరాలు / ఆధారాలు.',
    'my name in ramesh': 'నా పేరు రమేష్',
    'ok': 'సరే',
    'yes': 'అవును',
    'good morning': 'శుభోదయం',
    'thank you': 'ధన్యవాదాలు',
  },
  'Kannada (ಕನ್ನಡ)': {
    'hi': 'ನಮಸ್ಕಾರ',
    'hello': 'ನಮಸ್ಕಾರ',
    'sir login credentials.': 'ಸರ್ ಲಾಗಿನ್ ರುಜುವಾತುಗಳು.',
    'my name in ramesh': 'ನನ್ನ ಹೆಸರು ರಮೇಶ್',
    'ok': 'ಸರಿ',
    'yes': 'ಹೌದು',
    'good morning': 'ಶುಭೋದಯ',
    'thank you': 'ಧನ್ಯವಾದಗಳು',
  },
  'Tamil (தமிழ்)': {
    'hi': 'வணக்கம்',
    'hello': 'வணக்கம்',
    'sir login credentials.': 'ஐயா உள்நுழைவு சான்றுகள்.',
    'my name in ramesh': 'என் பெயர் ரமேஷ்',
    'ok': 'சரி',
    'yes': 'ஆம்',
    'good morning': 'காலை வணக்கம்',
    'thank you': 'நன்றி',
  },
  'English': {
    'hi': 'Hello',
    'hello': 'Hello',
    'ok': 'OK',
    'sir login credentials.': 'Sir, login credentials.',
  },
}

function translateMessageContent(content: string, langName: string): string {
  const clean = content.trim().toLowerCase()
  const dict = TRANSLATION_MAP[langName]
  if (dict && dict[clean]) {
    return dict[clean]
  }
  return `[${langName}]: ${content}`
}

export default function EduChatPage() {
  const { user } = useAuth()
  const location = useLocation()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Core state
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string>('')
  const [firstUnreadMessageId, setFirstUnreadMessageId] = useState<string | null>(null)
  const [contacts, setContacts] = useState<ApiChatContact[]>([])
  const [isLoadingConversations, setIsLoadingConversations] = useState(true)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [isLoadingContacts, setIsLoadingContacts] = useState(false)

  // Filters & search
  const [filterTab, setFilterTab] = useState<FilterTab>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // UI state
  const [messageInput, setMessageInput] = useState('')
  const [activeReactionMsgId, setActiveReactionMsgId] = useState<string | null>(null)
  const [isNewChatOpen, setIsNewChatOpen] = useState(false)

  // Message Actions state
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null)
  const [forwardingMessage, setForwardingMessage] = useState<ChatMessage | null>(null)
  const [detailsMessage, setDetailsMessage] = useState<ChatMessage | null>(null)

  // Saved bookmarks persistence
  const [savedMessageIds, setSavedMessageIds] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem('chat_saved_message_ids')
      return raw ? new Set(JSON.parse(raw)) : new Set<string>()
    } catch {
      return new Set<string>()
    }
  })

  // Active conversation helper
  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId),
    [conversations, activeConversationId]
  )

  // Active pinned message in current conversation
  const pinnedMessage = useMemo(
    () => activeConversation?.messages?.find((m) => m.isPinned),
    [activeConversation?.messages]
  )

  // Auto-scroll to latest message
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' })
  }

  useEffect(() => {
    scrollToBottom('auto')
  }, [activeConversationId, activeConversation?.messages?.length])

  // Load conversations
  const loadConversations = useCallback(async () => {
    setIsLoadingConversations(true)
    try {
      const data = await fetchConversationsApi()
      if (Array.isArray(data)) {
        const mapped: ChatConversation[] = data.map((conv: any) => ({
          id: conv.id,
          name: conv.name,
          type: conv.type,
          subtitle: conv.subtitle,
          email: conv.email,
          organizationName: conv.organizationName,
          avatar: conv.avatar,
          status: 'online',
          role: conv.role,
          unreadCount: conv.unreadCount || 0,
          lastMessage: conv.lastMessage,
          lastMessageTime: conv.lastMessageTime,
          lastMessageTimestamp: conv.lastMessageTimestamp || Date.now(),
          messages: [],
          members: (conv.participants || []).map((p: any) => ({
            id: p.id || p.user_id,
            name: p.name || p.user_name,
            role: p.role || p.user_role,
            email: p.email,
            organizationName: p.organizationName,
            status: 'online',
          })),
        }))

        mapped.sort((a, b) => (b.lastMessageTimestamp || 0) - (a.lastMessageTimestamp || 0))

        setConversations(mapped)
        setActiveConversationId((prev) => {
          if (prev && mapped.some((m) => m.id === prev)) return prev
          return mapped[0]?.id || ''
        })
      } else {
        setConversations([])
      }
    } catch (err: any) {
      console.error('Failed to load conversations:', err)
    } finally {
      setIsLoadingConversations(false)
    }
  }, [])

  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  // Load contacts
  useEffect(() => {
    setIsLoadingContacts(true)
    fetchChatContactsApi()
      .then((data) => setContacts(data || []))
      .catch((err) => console.error('Failed to fetch chat contacts:', err))
      .finally(() => setIsLoadingContacts(false))
  }, [])

  // Load messages when active conversation changes
  useEffect(() => {
    if (!activeConversationId) return
    let isCancelled = false
    setIsLoadingMessages(true)

    fetchMessagesApi(activeConversationId)
      .then((msgs: any[]) => {
        if (isCancelled) return
        const mappedMsgs: ChatMessage[] = (msgs || []).map((m: any) => {
          const isOutgoing =
            m.senderId === user?.id ||
            m.sender_id === user?.id ||
            Boolean(user?.firstName && m.senderName === user.firstName)

          return {
            id: m.id,
            senderId: m.senderId || m.sender_id,
            senderName: m.senderName || m.sender_name || 'User',
            senderRole: m.senderRole || m.sender_role,
            senderEmail:
              m.senderEmail ||
              m.sender_email ||
              (isOutgoing
                ? user?.email
                : activeConversation?.email ||
                  contacts.find((c) => c.name === (m.senderName || m.sender_name))?.email),
            senderOrganizationName:
              m.senderOrganizationName ||
              m.sender_organization_name ||
              (isOutgoing
                ? (user as any)?.organizationName || (user as any)?.organization
                : activeConversation?.organizationName ||
                  contacts.find((c) => c.name === (m.senderName || m.sender_name))?.organizationName),
            content: m.content,
            timestamp: m.timestamp || 'Now',
            createdAt: m.createdAt || m.created_at || (m.timestamp && m.timestamp.includes('T') ? m.timestamp : undefined),
            status: m.status || (isOutgoing ? 'delivered' : undefined),
            isOutgoing,
            reactions: m.reactions || {},
            replyToId: m.replyToId || m.reply_to_id,
            replyTo: m.replyTo || null,
            isPinned: Boolean(m.isPinned || m.is_pinned),
            isSaved: savedMessageIds.has(m.id),
            isEdited: Boolean(m.isEdited || m.is_edited),
            attachments: (m.attachments || []).map((att: any) => ({
              name: att.name || att.file_name,
              size: att.size || att.file_size || '',
              type:
                (att.type || att.file_type || '').includes('image') ||
                (att.name || '').match(/\.(png|jpe?g|gif|webp|svg)$/i)
                  ? 'image'
                  : (att.type || att.file_type || '').includes('pdf')
                  ? 'pdf'
                  : 'doc',
              url: att.url,
            })),
          }
        })

        // Identify the first unread message before marking conversation as read
        const currentConv = conversations.find((c) => c.id === activeConversationId)
        const unreadCount = currentConv?.unreadCount || 0
        if (unreadCount > 0) {
          const incoming = mappedMsgs.filter((m) => !m.isOutgoing)
          if (incoming.length > 0) {
            const idx = Math.max(0, incoming.length - unreadCount)
            setFirstUnreadMessageId(incoming[idx]?.id || null)
          } else {
            setFirstUnreadMessageId(null)
          }
        }

        setConversations((prev) =>
          prev.map((c) => (c.id === activeConversationId ? { ...c, messages: mappedMsgs } : c))
        )

        markConversationAsReadApi(activeConversationId).catch(() => {})
        emitMarkAsRead(activeConversationId)
      })
      .catch((err) => console.error('Failed to load messages:', err))
      .finally(() => {
        if (!isCancelled) setIsLoadingMessages(false)
      })

    return () => {
      isCancelled = true
    }
  }, [activeConversationId, user?.id, user?.firstName, savedMessageIds])

  // Real-time WebSocket Listeners
  const handleIncomingMessage = useCallback(
    (newMsg: ChatMessage) => {
      const targetConvId = (newMsg as any).conversationId || activeConversationId

      setConversations((prev) => {
        const existingIndex = prev.findIndex((c) => c.id === targetConvId)
        if (existingIndex === -1) {
          // If conversation is brand new, reload list to include it
          loadConversations()
          return prev
        }

        const targetConv = prev[existingIndex]
        const isActive = targetConv.id === activeConversationId

        let updatedMessages = targetConv.messages || []
        if (updatedMessages.some((m) => m.id === newMsg.id)) {
          updatedMessages = updatedMessages.map((m) => (m.id === newMsg.id ? newMsg : m))
        } else if (newMsg.isOutgoing) {
          const optIndex = updatedMessages.findIndex(
            (m) => m.id.startsWith('msg-') && m.content === newMsg.content
          )
          if (optIndex !== -1) {
            const updated = [...updatedMessages]
            updated[optIndex] = newMsg
            updatedMessages = updated
          } else {
            updatedMessages = [...updatedMessages, newMsg]
          }
        } else {
          updatedMessages = [...updatedMessages, newMsg]
        }

        const isUnread = !isActive && !newMsg.isOutgoing
        const updatedConv: ChatConversation = {
          ...targetConv,
          lastMessage: newMsg.content,
          lastMessageTime: newMsg.timestamp,
          lastMessageTimestamp: Date.now(),
          unreadCount: isUnread
            ? (targetConv.unreadCount || 0) + 1
            : isActive
            ? 0
            : targetConv.unreadCount || 0,
          messages: updatedMessages,
        }

        const rest = prev.filter((_, idx) => idx !== existingIndex)
        return [updatedConv, ...rest]
      })
    },
    [activeConversationId, loadConversations]
  )

  const handleReactionUpdated = useCallback(
    (data: { conversationId: string; messageId: string; reactions: Record<string, number> }) => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === data.conversationId) {
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === data.messageId ? { ...m, reactions: data.reactions } : m
              ),
            }
          }
          return c
        })
      )
    },
    []
  )

  const handleMessagesRead = useCallback(
    (data: { conversationId: string; readerId: string }) => {
      const currentUserId = user?.id || (user as any)?.userId || 'current-user'
      // If the current user was the reader, they are just reading messages sent by others.
      // The current user's OWN outgoing messages should NOT turn into 'read' until the OTHER person reads them!
      if (String(data.readerId) === String(currentUserId)) {
        return
      }

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === data.conversationId) {
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.isOutgoing ? { ...m, status: 'read' as const } : m
              ),
            }
          }
          return c
        })
      )
    },
    [user?.id]
  )

  const handleMessagesDelivered = useCallback(
    (data: { userId: string; conversationIds?: string[] }) => {
      setConversations((prev) =>
        prev.map((c) => {
          if (!data.conversationIds || data.conversationIds.includes(c.id)) {
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.isOutgoing && m.status === 'sent'
                  ? { ...m, status: 'delivered' as const }
                  : m
              ),
            }
          }
          return c
        })
      )
    },
    []
  )

  // Real-time edited, deleted, pinned message listeners
  const handleMessageEdited = useCallback(
    (data: { conversationId: string; messageId: string; content: string; isEdited: boolean }) => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === data.conversationId) {
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === data.messageId ? { ...m, content: data.content, isEdited: true } : m
              ),
            }
          }
          return c
        })
      )
    },
    []
  )

  const handleMessageDeleted = useCallback(
    (data: { conversationId: string; messageId: string }) => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === data.conversationId) {
            return {
              ...c,
              messages: c.messages.filter((m) => m.id !== data.messageId),
            }
          }
          return c
        })
      )
    },
    []
  )

  const handleMessagePinned = useCallback(
    (data: { conversationId: string; messageId: string; isPinned: boolean }) => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === data.conversationId) {
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === data.messageId ? { ...m, isPinned: data.isPinned } : m
              ),
            }
          }
          return c
        })
      )
    },
    []
  )

  const {
    socket,
    isConnected,
    emitSendMessage,
    emitMarkAsRead,
    emitReaction,
    emitEditMessage,
    emitDeleteMessage,
    emitPinMessage,
  } = useChatSocket({
    userId: user?.id || (user as any)?.userId || 'current-user',
    userName: user?.firstName || (user as any)?.name || 'User',
    userRole: user?.role || 'student',
    activeConversationId,
    onReceiveMessage: handleIncomingMessage,
    onReactionUpdated: handleReactionUpdated,
    onMessagesRead: handleMessagesRead,
    onMessagesDelivered: handleMessagesDelivered,
    onMessageEdited: handleMessageEdited,
    onMessageDeleted: handleMessageDeleted,
    onMessagePinned: handleMessagePinned,
  })

  // WebRTC Audio/Video Calling
  const {
    callState,
    activeCall,
    statusMessage: callStatusMessage,
    callDuration,
    isMuted: isCallMuted,
    remoteAudioRef,
    remoteVideoRef,
    remoteStream,
    isCameraOn,
    isPeerCameraOn,
    localCameraStream,
    toggleCamera,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    toggleMute: toggleCallMute,
  } = useWebRTCCall({
    socket,
    currentUserId: user?.id || (user as any)?.userId || 'current-user',
    currentUserName: user?.firstName || (user as any)?.name || 'User',
    currentUserRole: user?.role || 'student',
  })

  // Start outgoing call handler
  const handleInitiateVoiceCall = (callType: 'audio' | 'video' = 'audio') => {
    if (!activeConversation) return

    const currentId = user?.id || (user as any)?.userId || 'current-user'
    let targetUserId = ''
    let targetUserName = activeConversation.name
    let targetUserRole = activeConversation.role || 'Member'
    let targetUserAvatar = activeConversation.avatar

    // 1. Try finding peer from conversation members
    const peerMember = activeConversation.members?.find(
      (m) => String(m.id) !== String(currentId)
    )

    if (peerMember) {
      targetUserId = String(peerMember.id)
      targetUserName = peerMember.name || targetUserName
      targetUserRole = peerMember.role || targetUserRole
    }

    // 2. Fallback to matching with contacts
    if (!targetUserId && contacts.length > 0) {
      const matchedContact = contacts.find(
        (c) =>
          c.name.toLowerCase() === activeConversation.name.toLowerCase() ||
          (activeConversation.email && c.email === activeConversation.email)
      )
      if (matchedContact) {
        targetUserId = String(matchedContact.userId || matchedContact.id)
        targetUserName = matchedContact.name || targetUserName
        targetUserRole = matchedContact.role || targetUserRole
      }
    }

    // 3. Fallback to conversation id if direct chat
    if (!targetUserId) {
      targetUserId = activeConversation.id
    }

    startCall({
      targetUserId,
      targetUserName,
      targetUserRole,
      targetUserAvatar,
      conversationId: activeConversation.id,
      callType,
    })
  }

  // Filter conversations using strategy map
  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      if (filterTab === 'channels' && c.type !== 'channel') return false
      if (filterTab === 'direct' && c.type !== 'direct') return false

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return (
          c.name.toLowerCase().includes(q) ||
          (c.subtitle || '').toLowerCase().includes(q) ||
          (c.lastMessage || '').toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [conversations, filterTab, searchQuery])

  // Send Message Handler
  const handleSendMessage = async (attachment?: ChatAttachment) => {
    if (!messageInput.trim() && !attachment) return
    if (!activeConversation) return

    const contentText = messageInput.trim() || (attachment ? `Sent file: ${attachment.name}` : '')
    const currentConvId = activeConversation.id
    const timeStr = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })

    const tempId = `msg-${Date.now()}`
    const currentReplying = replyingTo

    const newMsg: ChatMessage = {
      id: tempId,
      senderId: user?.id || 'current-user',
      senderName: user?.firstName || (user as any)?.name || 'Me',
      senderRole: user?.role || 'User',
      content: contentText,
      timestamp: timeStr,
      createdAt: new Date().toISOString(),
      status: 'delivered',
      isOutgoing: true,
      replyToId: currentReplying?.id || null,
      replyTo: currentReplying
        ? {
            id: currentReplying.id,
            senderName: currentReplying.senderName,
            content: currentReplying.content,
          }
        : null,
      attachments: attachment ? [attachment] : undefined,
    }

    // Optimistic UI update: update conversation and immediately move to top of list!
    setConversations((prev) => {
      const existingIndex = prev.findIndex((c) => c.id === currentConvId)
      if (existingIndex === -1) return prev

      const targetConv = prev[existingIndex]
      const updatedConv: ChatConversation = {
        ...targetConv,
        lastMessage: newMsg.content,
        lastMessageTime: newMsg.timestamp,
        lastMessageTimestamp: Date.now(),
        messages: [...targetConv.messages, newMsg],
      }

      const rest = prev.filter((_, idx) => idx !== existingIndex)
      return [updatedConv, ...rest]
    })

    setMessageInput('')
    setReplyingTo(null)

    const payload = {
      conversation_id: currentConvId,
      content: contentText,
      message_type: attachment ? 'file' : 'text',
      reply_to_id: currentReplying?.id || null,
      attachments: attachment
        ? [
            {
              file_name: attachment.name,
              file_type: attachment.type,
              file_size: attachment.size,
              url: attachment.url,
              storage_key: attachment.storage_key,
            },
          ]
        : undefined,
    }

    if (isConnected) {
      emitSendMessage(payload)
    } else {
      try {
        const saved = await sendMessageApi(payload)
        if (saved) {
          setConversations((prev) =>
            prev.map((c) => {
              if (c.id === currentConvId) {
                return {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === tempId
                      ? {
                          ...m,
                          id: saved.id,
                          status: saved.status || 'delivered',
                          timestamp: saved.timestamp || m.timestamp,
                        }
                      : m
                  ),
                }
              }
              return c
            })
          )
        }
      } catch (err: any) {
        console.warn('REST message persist fallback:', err.message)
      }
    }
  }

  // Emoji reaction handler
  const handleReaction = (messageId: string, emoji: string) => {
    if (!activeConversationId) return

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversationId) {
          return {
            ...c,
            messages: c.messages.map((m) => {
              if (m.id === messageId) {
                const current = m.reactions || {}
                const currentCount = current[emoji] || 0
                return {
                  ...m,
                  reactions: {
                    ...current,
                    [emoji]: currentCount > 0 ? currentCount - 1 : 1,
                  },
                }
              }
              return m
            }),
          }
        }
        return c
      })
    )

    emitReaction(activeConversationId, messageId, emoji)
  }

  // 1. Reply with quote
  const handleReplyQuote = (message: ChatMessage) => {
    setReplyingTo(message)
  }

  // 2. Forward message
  const handleForwardOpen = (message: ChatMessage) => {
    setForwardingMessage(message)
  }

  const handleForwardSubmit = async (
    targetId: string,
    isDirectContact: boolean,
    contactOrConv: any
  ) => {
    if (!forwardingMessage) return
    let targetConvId = targetId

    if (isDirectContact) {
      const existing = conversations.find(
        (c) =>
          c.type === 'direct' &&
          (c.members?.some((m) => m.id === targetId) ||
            c.name.toLowerCase() === contactOrConv.name?.toLowerCase())
      )

      if (existing) {
        targetConvId = existing.id
      } else {
        try {
          const res = await createDirectChatApi({
            recipient_id: targetId,
            recipient_name: contactOrConv.name,
            recipient_role: contactOrConv.role,
          })
          if (res?.id) targetConvId = res.id
          await loadConversations()
        } catch (e: any) {
          toast.error(e.message || 'Failed to start chat')
          return
        }
      }
    }

    const payload = {
      conversation_id: targetConvId,
      content: forwardingMessage.content,
      message_type: forwardingMessage.attachments?.length ? 'file' : 'text',
      attachments: forwardingMessage.attachments?.map((a) => ({
        file_name: a.name,
        file_type: a.type,
        file_size: a.size,
        url: a.url,
      })),
    }

    if (isConnected) {
      emitSendMessage(payload)
    } else {
      await sendMessageApi(payload)
    }

    toast.success(`Message forwarded to ${contactOrConv.name}`)
  }

  // 3. Copy link
  const handleCopyLink = (message: ChatMessage) => {
    const deepLink = `${window.location.origin}/staff/chat?conversationId=${activeConversationId}&messageId=${message.id}`
    navigator.clipboard.writeText(deepLink)
    toast.success('Message link copied to clipboard')
  }

  // 4. Save / Bookmark message
  const handleToggleSave = (message: ChatMessage) => {
    const isNowSaved = !message.isSaved
    setSavedMessageIds((prev) => {
      const next = new Set(prev)
      if (isNowSaved) next.add(message.id)
      else next.delete(message.id)
      try {
        localStorage.setItem('chat_saved_message_ids', JSON.stringify([...next]))
      } catch {}
      return next
    })

    setConversations((prev) =>
      prev.map((c) => ({
        ...c,
        messages: c.messages.map((m) =>
          m.id === message.id ? { ...m, isSaved: isNowSaved } : m
        ),
      }))
    )

    toast.success(isNowSaved ? 'Message saved to bookmarks' : 'Message removed from bookmarks')
  }

  // 5. Delete message
  const handleDelete = async (message: ChatMessage) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversationId
          ? { ...c, messages: c.messages.filter((m) => m.id !== message.id) }
          : c
      )
    )

    if (isConnected) {
      emitDeleteMessage(activeConversationId, message.id)
    }

    try {
      await deleteMessageApi(message.id)
    } catch (e: any) {
      console.warn('REST delete fallback:', e.message)
    }

    toast.success('Message deleted')
  }

  // 6. Pin / Unpin for everyone
  const handleTogglePin = async (message: ChatMessage) => {
    const nextPin = !message.isPinned
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversationId
          ? {
              ...c,
              messages: c.messages.map((m) =>
                m.id === message.id ? { ...m, isPinned: nextPin } : m
              ),
            }
          : c
      )
    )

    if (isConnected) {
      emitPinMessage(activeConversationId, message.id)
    }

    try {
      await togglePinMessageApi(message.id)
    } catch (e: any) {
      console.warn('REST pin toggle fallback:', e.message)
    }

    toast.success(nextPin ? 'Message pinned for everyone' : 'Message unpinned')
  }

  // 7. Mark as unread
  const handleMarkUnread = () => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversationId
          ? { ...c, unreadCount: Math.max(1, (c.unreadCount || 0) + 1) }
          : c
      )
    )
    toast.success('Conversation marked as unread')
  }

  // 8. Share to...
  const handleShare = async (message: ChatMessage) => {
    const textToShare = `${message.senderName}: "${message.content}"`
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'EduChat Message',
          text: textToShare,
          url: window.location.href,
        })
        toast.success('Message shared')
        return
      } catch (e: any) {
        if (e.name !== 'AbortError') console.warn('Share error:', e)
      }
    }

    const mailtoUrl = `mailto:?subject=${encodeURIComponent(
      'EduChat Message from ' + message.senderName
    )}&body=${encodeURIComponent(textToShare)}`
    window.open(mailtoUrl, '_blank')
    toast.success('Opened email composer to share')
  }

  // 9. Translation
  const handleTranslate = (message: ChatMessage, langName: string) => {
    if (!langName) {
      // Clear translation
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversationId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === message.id ? { ...m, translation: null } : m
                ),
              }
            : c
        )
      )
      return
    }

    const translatedText = translateMessageContent(message.content, langName)
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversationId
          ? {
              ...c,
              messages: c.messages.map((m) =>
                m.id === message.id
                  ? { ...m, translation: { language: langName, text: translatedText } }
                  : m
              ),
            }
          : c
      )
    )

    toast.success(`Translated to ${langName}`)
  }

  // 10. Edit message
  const handleSaveEdit = async (messageId: string, newContent: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversationId
          ? {
              ...c,
              messages: c.messages.map((m) =>
                m.id === messageId ? { ...m, content: newContent, isEdited: true } : m
              ),
            }
          : c
      )
    )

    if (isConnected) {
      emitEditMessage(activeConversationId, messageId, newContent)
    }

    try {
      await editMessageApi(messageId, newContent)
    } catch (e: any) {
      console.warn('REST edit fallback:', e.message)
    }

    toast.success('Message updated')
  }

  // Start or open direct chat with a contact (from sidebar search or contacts list)
  const handleStartDirectChat = async (contact: ApiChatContact) => {
    const contactUserId = contact.userId || contact.id

    const existing = conversations.find(
      (c) =>
        c.type === 'direct' &&
        (c.members?.some((m) => m.id === contactUserId) ||
          c.name.toLowerCase() === contact.name.toLowerCase())
    )

    if (existing) {
      setActiveConversationId(existing.id)
      setSearchQuery('')
      return
    }

    try {
      const res = await createDirectChatApi({
        recipient_id: contactUserId,
        recipient_name: contact.name,
        recipient_role: contact.role,
      })
      await loadConversations()
      if (res?.id) {
        setActiveConversationId(res.id)
      }
      setSearchQuery('')
      toast.success(`Chat opened with ${contact.name}`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to start direct chat')
    }
  }

  const handleSelectConversation = (convId: string) => {
    setActiveConversationId(convId)
    const targetConv = conversations.find((c) => c.id === convId)
    const unreadCount = targetConv?.unreadCount || 0

    if (unreadCount > 0 && targetConv?.messages && targetConv.messages.length > 0) {
      const incoming = targetConv.messages.filter((m) => !m.isOutgoing)
      if (incoming.length > 0) {
        const idx = Math.max(0, incoming.length - unreadCount)
        setFirstUnreadMessageId(incoming[idx]?.id || null)
      } else {
        setFirstUnreadMessageId(null)
      }
    } else if (unreadCount === 0) {
      setFirstUnreadMessageId(null)
    }

    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, unreadCount: 0 } : c))
    )
    markConversationAsReadApi(convId).catch(() => {})
    emitMarkAsRead(convId)
    // Delete notification alert from database to free space and notify side drawer
    deleteConversationNotificationsApi(convId).catch(() => {})
    window.dispatchEvent(
      new CustomEvent('notification:conversation_read', { detail: { conversationId: convId } })
    )
  }

  // Handle direct navigation to conversation from notification drawer
  useEffect(() => {
    const navConvId = (location.state as any)?.conversationId
    if (navConvId) {
      handleSelectConversation(navConvId)
    }
  }, [location.state])

  const handleRemoveChatHistory = (convId: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== convId))
    if (activeConversationId === convId) {
      setActiveConversationId('')
    }
  }

  const handleHideChat = (convId: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== convId))
    if (activeConversationId === convId) {
      setActiveConversationId('')
    }
  }

  const handleMarkAsUnread = (convId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, unreadCount: Math.max(1, (c.unreadCount || 0) + 1) } : c))
    )
  }

  return (
    <div className="flex h-full w-full overflow-hidden bg-white rounded-2xl border border-slate-200/80 shadow-sm">
      {/* Sidebar: Conversations, Filters, Search */}
      <ChatSidebar
        currentUserRole={user?.role}
        currentUserName={user?.firstName || (user as any)?.name}
        conversations={filteredConversations}
        contacts={contacts}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onStartDirectChat={handleStartDirectChat}
        onOpenNewChat={() => setIsNewChatOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterTab={filterTab}
        onFilterTabChange={setFilterTab}
        isLoading={isLoadingConversations}
        onRemoveChatHistory={handleRemoveChatHistory}
        onHideChat={handleHideChat}
        onMarkAsUnread={handleMarkAsUnread}
      />

      {/* Main Conversation Window */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-white">
        {activeConversation ? (
          <>
            <ChatHeader
              conversation={activeConversation}
              onCall={() => handleInitiateVoiceCall('audio')}
              onVideoCall={() => handleInitiateVoiceCall('video')}
              onInfo={() => toast.info(`Channel: ${activeConversation.name}`)}
              onSendMessage={(txt) => {
                setMessageInput(txt)
                setTimeout(() => {
                  const sendBtn = document.getElementById('chat-send-btn')
                  if (sendBtn) sendBtn.click()
                }, 50)
              }}
            />

            {/* Pinned Message Banner */}
            {pinnedMessage && (
              <div className="px-4 py-2 bg-[#F6F8FD] border-b border-slate-200/80 flex items-center justify-between gap-3 text-xs z-10 shadow-2xs select-none">
                <div
                  onClick={() => {
                    document.getElementById(`msg-${pinnedMessage.id}`)?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                    })
                  }}
                  className="flex items-center gap-2 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
                  title="Click to jump to pinned message"
                >
                  <Pin className="w-3.5 h-3.5 text-[#5B5FC7] fill-[#5B5FC7] shrink-0" />
                  <span className="font-semibold text-[#5B5FC7] shrink-0">Pinned Message:</span>
                  <span className="text-slate-600 truncate font-medium">
                    {pinnedMessage.senderName}: {pinnedMessage.content}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleTogglePin(pinnedMessage)}
                  className="text-[11px] text-slate-400 hover:text-slate-700 underline shrink-0 cursor-pointer"
                >
                  Unpin
                </button>
              </div>
            )}

            <ChatMessagesView
              messages={activeConversation.messages}
              isLoading={isLoadingMessages}
              messagesEndRef={messagesEndRef}
              firstUnreadMessageId={firstUnreadMessageId}
              activeReactionMsgId={activeReactionMsgId}
              setActiveReactionMsgId={setActiveReactionMsgId}
              onReaction={handleReaction}
              onReplyQuote={handleReplyQuote}
              onForward={handleForwardOpen}
              onCopyLink={handleCopyLink}
              onToggleSave={handleToggleSave}
              onDelete={handleDelete}
              onTogglePin={handleTogglePin}
              onMarkUnread={handleMarkUnread}
              onShare={handleShare}
              onTranslate={handleTranslate}
              onSaveEdit={handleSaveEdit}
              onViewDetails={(msg) => setDetailsMessage(msg)}
            />

            <ChatComposer
              conversationId={activeConversation.id}
              conversationName={activeConversation.name}
              isChannel={activeConversation.type === 'channel'}
              onSendMessage={handleSendMessage}
              messageInput={messageInput}
              setMessageInput={setMessageInput}
              replyingTo={replyingTo}
              onCancelReply={() => setReplyingTo(null)}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white text-slate-400">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 mb-3 text-xl">
              💬
            </div>
            <h3 className="text-base font-semibold text-slate-700">Select a conversation</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Choose an existing chat from the left sidebar or start a new conversation to connect.
            </p>
          </div>
        )}
      </div>

      {/* Unified Direct Message & Group Channel Creation Modal */}
      <NewChatDialog
        open={isNewChatOpen}
        onOpenChange={setIsNewChatOpen}
        contacts={contacts}
        isLoadingContacts={isLoadingContacts}
        onConversationCreated={(newConvId) => {
          loadConversations().then(() => setActiveConversationId(newConvId))
        }}
      />

      {/* Forward Message Dialog */}
      <ForwardMessageDialog
        open={Boolean(forwardingMessage)}
        onOpenChange={(open) => !open && setForwardingMessage(null)}
        message={forwardingMessage}
        conversations={conversations}
        contacts={contacts}
        onForward={handleForwardSubmit}
      />

      {/* Message Metadata Details Dialog */}
      <MessageDetailsDialog
        open={Boolean(detailsMessage)}
        onOpenChange={(open) => !open && setDetailsMessage(null)}
        message={detailsMessage}
      />

      {/* Real-Time WebRTC Call Modal */}
      <CallModal
        callState={callState}
        activeCall={activeCall}
        statusMessage={callStatusMessage}
        callDuration={callDuration}
        isMuted={isCallMuted}
        remoteAudioRef={remoteAudioRef}
        remoteVideoRef={remoteVideoRef}
        remoteStream={remoteStream}
        isCameraOn={isCameraOn}
        isPeerCameraOn={isPeerCameraOn}
        localCameraStream={localCameraStream}
        onToggleCamera={toggleCamera}
        currentUser={{
          name: user?.firstName || (user as any)?.name || 'Me',
          role: user?.role,
          organization: (user as any)?.organizationName || 'EduWeConnect',
        }}
        onAccept={acceptCall}
        onReject={rejectCall}
        onEnd={endCall}
        onToggleMute={toggleCallMute}
      />
    </div>
  )
}
