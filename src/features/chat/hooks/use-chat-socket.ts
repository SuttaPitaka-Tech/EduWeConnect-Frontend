import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { getToken } from '@/lib/auth-storage';
import type { ChatMessage } from '../types';

const SOCKET_SERVER_URL = import.meta.env.VITE_NOTIFICATION_WS_URL || 'http://localhost:7003';

interface UseChatSocketProps {
  userId?: string;
  userName?: string;
  userRole?: string;
  activeConversationId?: string;
  onReceiveMessage?: (message: ChatMessage) => void;
  onUserTyping?: (data: { conversationId: string; userId: string; userName: string; isTyping: boolean }) => void;
  onReactionUpdated?: (data: { conversationId: string; messageId: string; reactions: Record<string, number> }) => void;
  onMessagesRead?: (data: { conversationId: string; readerId: string }) => void;
  onMessagesDelivered?: (data: { userId: string; conversationIds?: string[] }) => void;
  onMessageEdited?: (data: { conversationId: string; messageId: string; content: string; isEdited: boolean }) => void;
  onMessageDeleted?: (data: { conversationId: string; messageId: string }) => void;
  onMessagePinned?: (data: { conversationId: string; messageId: string; isPinned: boolean }) => void;
}

export function useChatSocket({
  userId,
  userName,
  userRole,
  activeConversationId,
  onReceiveMessage,
  onUserTyping,
  onReactionUpdated,
  onMessagesRead,
  onMessagesDelivered,
  onMessageEdited,
  onMessageDeleted,
  onMessagePinned,
}: UseChatSocketProps) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const callbacksRef = useRef({
    onReceiveMessage,
    onUserTyping,
    onReactionUpdated,
    onMessagesRead,
    onMessagesDelivered,
    onMessageEdited,
    onMessageDeleted,
    onMessagePinned,
  });

  useEffect(() => {
    callbacksRef.current = {
      onReceiveMessage,
      onUserTyping,
      onReactionUpdated,
      onMessagesRead,
      onMessagesDelivered,
      onMessageEdited,
      onMessageDeleted,
      onMessagePinned,
    };
  });

  // Initialize socket connection
  useEffect(() => {
    const token = getToken();

    const socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket', 'polling'],
      auth: { token: token ? `Bearer ${token}` : undefined },
      query: {
        userId: userId || 'current-user',
        userName: userName || 'User',
        userRole: userRole || 'student',
      },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('receive_message', (msg: any) => {
      if (callbacksRef.current.onReceiveMessage) {
        callbacksRef.current.onReceiveMessage({
          id: msg.id,
          conversationId: msg.conversationId || msg.conversation_id,
          senderId: msg.senderId || msg.sender_id,
          senderName: msg.senderName || msg.sender_name,
          senderRole: msg.senderRole || msg.sender_role,
          content: msg.content,
          status: msg.status || 'delivered',
          timestamp: msg.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOutgoing: String(msg.senderId) === String(userId) || (Boolean(userName) && msg.senderName === userName),
          attachments: msg.attachments?.map((a: any) => {
            const rawType = (a.type || a.file_type || '').toLowerCase();
            const name = (a.name || a.file_name || '').toLowerCase();
            const isImg = rawType.includes('image') || /\.(png|jpe?g|gif|webp|svg)$/i.test(name);
            const isPdf = rawType.includes('pdf') || /\.pdf$/i.test(name);
            return {
              id: a.id,
              name: a.name || a.file_name,
              size: a.size || a.file_size,
              type: isImg ? 'image' : isPdf ? 'pdf' : 'doc',
              url: a.url,
              storage_key: a.storage_key || a.storageKey,
            };
          }),
          reactions: msg.reactions || {},
          replyToId: msg.replyToId || msg.reply_to_id,
          replyTo: msg.replyTo || null,
          isPinned: Boolean(msg.isPinned || msg.is_pinned),
          isEdited: Boolean(msg.isEdited || msg.is_edited),
        });
      }
    });

    socket.on('user_typing', (data: any) => {
      if (callbacksRef.current.onUserTyping) callbacksRef.current.onUserTyping(data);
    });

    socket.on('message_reacted', (data: any) => {
      if (callbacksRef.current.onReactionUpdated) callbacksRef.current.onReactionUpdated(data);
    });

    socket.on('messages_read', (data: any) => {
      if (callbacksRef.current.onMessagesRead) callbacksRef.current.onMessagesRead(data);
    });

    socket.on('messages_delivered', (data: any) => {
      if (callbacksRef.current.onMessagesDelivered) callbacksRef.current.onMessagesDelivered(data);
    });

    socket.on('message_edited', (data: any) => {
      if (callbacksRef.current.onMessageEdited) callbacksRef.current.onMessageEdited(data);
    });

    socket.on('message_deleted', (data: any) => {
      if (callbacksRef.current.onMessageDeleted) callbacksRef.current.onMessageDeleted(data);
    });

    socket.on('message_pinned', (data: any) => {
      if (callbacksRef.current.onMessagePinned) callbacksRef.current.onMessagePinned(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, userName, userRole]);

  // Join/leave conversation room on conversation change
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !isConnected || !activeConversationId) return;

    socket.emit('join_conversation', { conversationId: activeConversationId });

    return () => {
      socket.emit('leave_conversation', { conversationId: activeConversationId });
    };
  }, [activeConversationId, isConnected]);

  // Send real-time message
  const emitSendMessage = useCallback(
    (messageData: {
      conversation_id: string;
      content: string;
      message_type?: string;
      attachments?: any[];
      reply_to_id?: string | null;
    }) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit('send_message', messageData);
      }
    },
    [isConnected],
  );

  // Send mark as read event
  const emitMarkAsRead = useCallback(
    (conversationId: string) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit('mark_as_read', { conversationId });
      }
    },
    [isConnected],
  );

  // Send typing event
  const emitTyping = useCallback(
    (conversationId: string, isTyping: boolean) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit('typing', { conversationId, isTyping });
      }
    },
    [isConnected],
  );

  // Send reaction event
  const emitReaction = useCallback(
    (conversationId: string, messageId: string, emoji: string) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit('react_message', { conversationId, messageId, emoji });
      }
    },
    [isConnected],
  );

  // Send edit message event
  const emitEditMessage = useCallback(
    (conversationId: string, messageId: string, content: string) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit('edit_message', { conversationId, messageId, content });
      }
    },
    [isConnected],
  );

  // Send delete message event
  const emitDeleteMessage = useCallback(
    (conversationId: string, messageId: string) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit('delete_message', { conversationId, messageId });
      }
    },
    [isConnected],
  );

  // Send pin message event
  const emitPinMessage = useCallback(
    (conversationId: string, messageId: string) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit('pin_message', { conversationId, messageId });
      }
    },
    [isConnected],
  );

  return {
    socket: socketRef.current,
    isConnected,
    emitSendMessage,
    emitMarkAsRead,
    emitTyping,
    emitReaction,
    emitEditMessage,
    emitDeleteMessage,
    emitPinMessage,
  };
}
