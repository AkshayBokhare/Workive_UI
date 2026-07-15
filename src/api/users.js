import { apiClient } from './client'

export const getMyProfile = () => apiClient.get('/users/me').then((r) => r.data)
export const getUserProfile = (userId) => apiClient.get(`/users/${userId}`).then((r) => r.data)
export const updateMyProfile = (payload) => apiClient.patch('/users/me', payload).then((r) => r.data)

export const uploadAvatar = (file) => {
  const form = new FormData()
  form.append('file', file)
  return apiClient.post('/users/me/avatar', form).then((r) => r.data)
}

export const getWorkAreas = () => apiClient.get('/users/work-areas').then((r) => r.data)
export const addWorkAreas = (names) => apiClient.post('/users/me/work-areas', { names }).then((r) => r.data)
export const removeWorkArea = (id) => apiClient.delete(`/users/me/work-areas/${id}`)

export const addEquipment = (payload) => apiClient.post('/users/me/equipment', payload).then((r) => r.data)
export const updateEquipment = (id, payload) => apiClient.patch(`/users/me/equipment/${id}`, payload).then((r) => r.data)
export const deleteEquipment = (id) => apiClient.delete(`/users/me/equipment/${id}`)

export const uploadPortfolioMedia = (file, caption) => {
  const form = new FormData()
  form.append('file', file)
  return apiClient
    .post('/users/me/portfolio', form, { params: caption ? { caption } : {} })
    .then((r) => r.data)
}
export const deletePortfolioMedia = (id) => apiClient.delete(`/users/me/portfolio/${id}`)
export const reorderPortfolio = (items) => apiClient.patch('/users/me/portfolio/reorder', items)

export const getFollowers = (userId, page = 1) =>
  apiClient.get(`/users/${userId}/followers`, { params: { page } }).then((r) => r.data)
export const getFollowing = (userId, page = 1) =>
  apiClient.get(`/users/${userId}/following`, { params: { page } }).then((r) => r.data)
export const getUserReviews = (userId, page = 1) =>
  apiClient.get(`/users/${userId}/reviews`, { params: { page } }).then((r) => r.data)
export const getUserPosts = (userId, page = 1) =>
  apiClient.get(`/users/${userId}/posts`, { params: { page } }).then((r) => r.data)
