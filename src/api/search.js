import { apiClient } from './client'

export const searchProfessionals = (params) =>
  apiClient.get('/search/professionals', { params }).then((r) => r.data)
