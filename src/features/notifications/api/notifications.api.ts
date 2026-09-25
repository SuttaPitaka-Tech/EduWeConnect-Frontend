import { apiClient } from '@/lib/api-client'
import type { NotificationItem } from '../types/types'

/**
 * Fetch all active notifications for the current authenticated user
 */
export async function fetchNotificationsApi(): Promise<NotificationItem[]> {
  try {
    const res = await apiClient.get('/notifications')
    return res.data || []
  } catch (err) {
    console.warn('Failed to fetch notifications from backend:', err)
    return []
  }
}

/**
 * Delete a specific notification by ID (frees table space)
 */
export async function deleteNotificationApi(id: string): Promise<{ affected: number }> {
  try {
    const res = await apiClient.delete(`/notifications/${id}`)
    return res.data
  } catch (err) {
    console.warn('Failed to delete notification:', err)
    return { affected: 0 }
  }
}

/**
 * Delete notifications for a specific conversation (e.g. when user opens the chat)
 */
export async function deleteConversationNotificationsApi(conversationId: string): Promise<{ affected: number }> {
  try {
    const res = await apiClient.delete(`/notifications/conversation/${conversationId}`)
    return res.data
  } catch (err) {
    console.warn('Failed to delete conversation notifications:', err)
    return { affected: 0 }
  }
}

/**
 * Clear all notifications for user
 */
export async function clearAllNotificationsApi(): Promise<{ affected: number }> {
  try {
    const res = await apiClient.delete('/notifications/clear-all')
    return res.data
  } catch (err) {
    console.warn('Failed to clear all notifications:', err)
    return { affected: 0 }
  }
}

/**
 * Mark all notifications as read (deletes them from table to free space)
 */
export async function markAllNotificationsReadApi(): Promise<{ affected: number }> {
  try {
    const res = await apiClient.post('/notifications/mark-all-read')
    return res.data
  } catch (err) {
    console.warn('Failed to mark all as read:', err)
    return { affected: 0 }
  }
}
