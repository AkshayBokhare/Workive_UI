import { apiClient } from './client'

export const register = (payload) => apiClient.post('/auth/register', payload).then((r) => r.data)

export const login = (email, password) => {
  const form = new URLSearchParams()
  form.set('username', email)
  form.set('password', password)
  return apiClient
    .post('/auth/login', form, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
    .then((r) => r.data)
}

export const fetchMe = () => apiClient.get('/auth/me').then((r) => r.data)
