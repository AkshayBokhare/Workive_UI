import { apiClient } from './client'

export const getConversations = (page = 1) =>
  apiClient.get('/conversations', { params: { page } }).then((r) => r.data)

export const getOrCreateDirectConversation = (userId) =>
  apiClient.post(`/conversations/direct/${userId}`).then((r) => r.data)

export const getMessages = (conversationId, beforeId) =>
  apiClient
    .get(`/conversations/${conversationId}/messages`, { params: beforeId ? { before_id: beforeId } : {} })
    .then((r) => r.data)

export const sendMessage = (conversationId, { text, file }) => {
  const form = new FormData()
  if (text) form.append('text', text)
  if (file) form.append('file', file)
  return apiClient.post(`/conversations/${conversationId}/messages`, form).then((r) => r.data)
}

export const markConversationRead = (conversationId) => apiClient.post(`/conversations/${conversationId}/read`)
