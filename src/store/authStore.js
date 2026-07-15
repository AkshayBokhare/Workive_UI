import { create } from 'zustand'

const STORAGE_KEY = 'workive.auth'

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const stored = loadStored()

export const useAuthStore = create((set) => ({
  token: stored?.token ?? null,
  user: stored?.user ?? null,
  isAuthenticated: Boolean(stored?.token),

  login: (token, user) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }))
    set({ token, user, isAuthenticated: true })
  },

  setUser: (user) => {
    set((state) => {
      const next = { token: state.token, user }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return { user }
    })
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY)
    set({ token: null, user: null, isAuthenticated: false })
  },
}))
