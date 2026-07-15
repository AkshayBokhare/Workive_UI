import { apiClient } from './client'

export const createPost = ({ caption, publish, files }) => {
  const form = new FormData()
  if (caption) form.append('caption', caption)
  form.append('publish', publish ? 'true' : 'false')
  files.forEach((f) => form.append('files', f))
  return apiClient.post('/posts', form).then((r) => r.data)
}

export const getFeed = (page = 1) => apiClient.get('/posts/feed', { params: { page } }).then((r) => r.data)
export const getMyPosts = (status, page = 1) =>
  apiClient.get('/posts/me', { params: { status, page } }).then((r) => r.data)
export const getSavedPosts = (page = 1) => apiClient.get('/posts/saved/me', { params: { page } }).then((r) => r.data)
export const getPost = (id) => apiClient.get(`/posts/${id}`).then((r) => r.data)
export const updatePost = (id, payload) => apiClient.patch(`/posts/${id}`, payload).then((r) => r.data)
export const deletePost = (id) => apiClient.delete(`/posts/${id}`)
export const likePost = (id) => apiClient.post(`/posts/${id}/like`)
export const unlikePost = (id) => apiClient.delete(`/posts/${id}/like`)
export const savePost = (id) => apiClient.post(`/posts/${id}/save`)
export const unsavePost = (id) => apiClient.delete(`/posts/${id}/save`)
export const getComments = (id, page = 1) => apiClient.get(`/posts/${id}/comments`, { params: { page } }).then((r) => r.data)
export const addComment = (id, body) => apiClient.post(`/posts/${id}/comments`, { body }).then((r) => r.data)
export const deleteComment = (commentId) => apiClient.delete(`/posts/comments/${commentId}`)
