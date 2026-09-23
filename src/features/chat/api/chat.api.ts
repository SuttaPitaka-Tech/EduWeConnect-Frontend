import { apiClient } from '@/lib/api-client';

export interface CreateGroupPayload {
  name: string;
  topic?: string;
  is_private?: boolean;
  member_ids?: string[];
  initial_message?: string;
}

export interface DirectChatPayload {
  recipient_id: string;
  recipient_role: string;
  recipient_name: string;
}

/**
 * Fetch all conversations for the authenticated user
 */
export async function fetchConversationsApi(): Promise<any[]> {
  const res = await apiClient.get('/chat/conversations');
  return res.data;
}

/**
 * Fetch message history for a conversation
 */
export async function fetchMessagesApi(conversationId: string): Promise<any[]> {
  const res = await apiClient.get(`/chat/conversations/${conversationId}/messages`);
  return res.data;
}

/**
 * Create a new group channel in MySQL
 */
export async function createGroupApi(payload: CreateGroupPayload): Promise<any> {
  const res = await apiClient.post('/chat/groups', payload);
  return res.data;
}

/**
 * Create or retrieve a direct conversation in MySQL
 */
export async function createDirectChatApi(payload: DirectChatPayload): Promise<any> {
  const res = await apiClient.post('/chat/direct', payload);
  return res.data;
}

/**
 * Upload an attachment/image to MinIO under chats-objects/ folder
 */
export async function uploadAttachmentApi(
  file: File,
  conversationId: string,
): Promise<{
  file_name: string;
  file_type: string;
  file_size: string;
  storage_key: string;
  url: string;
}> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await apiClient.post(`/chat/upload?conversationId=${encodeURIComponent(conversationId)}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

/**
 * Send message via REST API
 */
export async function sendMessageApi(payload: {
  conversation_id: string;
  content: string;
  message_type?: string;
  attachments?: any[];
  reply_to_id?: string | null;
}): Promise<any> {
  const res = await apiClient.post('/chat/messages', payload);
  return res.data;
}

/**
 * Edit message content
 */
export async function editMessageApi(messageId: string, content: string): Promise<any> {
  const res = await apiClient.patch(`/chat/messages/${messageId}`, { content });
  return res.data;
}

/**
 * Delete a message
 */
export async function deleteMessageApi(messageId: string): Promise<any> {
  const res = await apiClient.delete(`/chat/messages/${messageId}`);
  return res.data;
}

/**
 * Toggle pin status of a message
 */
export async function togglePinMessageApi(messageId: string): Promise<any> {
  const res = await apiClient.post(`/chat/messages/${messageId}/pin`);
  return res.data;
}

/**
 * Mark all messages in conversation as read
 */
export async function markConversationAsReadApi(conversationId: string): Promise<any> {
  const res = await apiClient.post(`/chat/conversations/${conversationId}/read`);
  return res.data;
}

export interface ChatContact {
  id: string;
  userId: string;
  name: string;
  email?: string;
  role: string;
  organizationName?: string;
  category: 'Admins' | 'Organization' | 'Staff & Teachers' | 'Students' | string;
  status?: 'online' | 'away' | 'offline';
}

/**
 * Fetch real registered users / contacts directory from database
 */
export async function fetchChatContactsApi(query?: string): Promise<ChatContact[]> {
  const params = query ? `?q=${encodeURIComponent(query)}` : '';
  const res = await apiClient.get(`/chat/contacts${params}`);
  return res.data;
}
