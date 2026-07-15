import { apiClient } from './client'

export const createAssignment = (payload) => apiClient.post('/assignments', payload).then((r) => r.data)
export const getMyAssignments = (params) => apiClient.get('/assignments/me', { params }).then((r) => r.data)
export const getAssignment = (id) => apiClient.get(`/assignments/${id}`).then((r) => r.data)
export const updateAssignment = (id, payload) => apiClient.patch(`/assignments/${id}`, payload).then((r) => r.data)
export const updateAssignmentStatus = (id, status) =>
  apiClient.patch(`/assignments/${id}/status`, { status }).then((r) => r.data)
export const addAssignmentDays = (id, days) => apiClient.post(`/assignments/${id}/days`, days).then((r) => r.data)
export const removeAssignmentDay = (id, dayId) =>
  apiClient.delete(`/assignments/${id}/days/${dayId}`).then((r) => r.data)
export const addParticipants = (id, participants) =>
  apiClient.post(`/assignments/${id}/participants`, participants).then((r) => r.data)
export const respondToInvite = (id, userId, status) =>
  apiClient.patch(`/assignments/${id}/participants/${userId}`, { status }).then((r) => r.data)
export const removeParticipant = (id, userId) =>
  apiClient.delete(`/assignments/${id}/participants/${userId}`).then((r) => r.data)
export const createReview = (assignmentId, payload) =>
  apiClient.post(`/assignments/${assignmentId}/reviews`, payload).then((r) => r.data)
