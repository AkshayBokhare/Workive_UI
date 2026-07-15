import { apiClient } from './client'

export const getNotifications = (page = 1, unreadOnly = false) =>
  apiClient.get('/notifications', { params: { page, unread_only: unreadOnly } }).then((r) => r.data)
export const getUnreadCount = () => apiClient.get('/notifications/unread-count').then((r) => r.data)
export const markNotificationRead = (id) => apiClient.post(`/notifications/${id}/read`)
export const markAllNotificationsRead = () => apiClient.post('/notifications/read-all')
