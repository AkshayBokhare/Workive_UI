import { apiClient } from './client'

export const getMyAvailability = (from, to) =>
  apiClient.get('/availability/me', { params: { date_from: from, date_to: to } }).then((r) => r.data)

export const getUserAvailability = (userId, from, to) =>
  apiClient.get(`/availability/${userId}`, { params: { date_from: from, date_to: to } }).then((r) => r.data)

export const setAvailability = (date, status) => apiClient.put(`/availability/me/${date}`, { status })
export const clearAvailability = (date) => apiClient.delete(`/availability/me/${date}`)
