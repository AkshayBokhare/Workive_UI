import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import * as authApi from '../api/auth'
import { useAuthStore } from '../store/authStore'

export function useLogin() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  return useMutation({
    mutationFn: ({ email, password }) => authApi.login(email, password),
    onSuccess: (data) => {
      login(data.access_token, data.user)
      navigate('/')
    },
  })
}

export function useRegister() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  return useMutation({
    mutationFn: (payload) => authApi.register(payload),
    onSuccess: (data) => {
      login(data.access_token, data.user)
      navigate('/')
    },
  })
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  return () => {
    logout()
    queryClient.clear()
    navigate('/login')
  }
}
