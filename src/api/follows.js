import { apiClient } from './client'

export const followUser = (userId) => apiClient.post(`/follows/${userId}`)
export const unfollowUser = (userId) => apiClient.delete(`/follows/${userId}`)
export const getFollowStatus = (userId) => apiClient.get(`/follows/status/${userId}`).then((r) => r.data)
