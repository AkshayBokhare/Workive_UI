import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { WS_BASE_URL } from '../api/client'
import { useAuthStore } from '../store/authStore'

export function useRealtimeSync() {
  const token = useAuthStore((s) => s.token)
  const queryClient = useQueryClient()
  const wsRef = useRef(null)

  useEffect(() => {
    if (!token) return

    let closedByUs = false
    let retryTimer

    function connect() {
      const ws = new WebSocket(`${WS_BASE_URL}/ws?token=${token}`)
      wsRef.current = ws

      ws.onmessage = (event) => {
        let payload
        try {
          payload = JSON.parse(event.data)
        } catch {
          return
        }

        if (payload.type === 'message') {
          queryClient.invalidateQueries({ queryKey: ['conversations'] })
          queryClient.invalidateQueries({ queryKey: ['messages', payload.data.conversation_id] })
        } else if (payload.type === 'notification') {
          queryClient.invalidateQueries({ queryKey: ['notifications'] })
          queryClient.invalidateQueries({ queryKey: ['unread-count'] })
          queryClient.invalidateQueries({ queryKey: ['availability'] })
          queryClient.invalidateQueries({ queryKey: ['assignments'] })
        } else if (payload.type === 'typing') {
          window.dispatchEvent(new CustomEvent('workive:typing', { detail: payload }))
        }
      }

      ws.onclose = () => {
        if (!closedByUs) {
          retryTimer = setTimeout(connect, 2000)
        }
      }
    }

    connect()

    return () => {
      closedByUs = true
      clearTimeout(retryTimer)
      wsRef.current?.close()
    }
  }, [token, queryClient])
}
