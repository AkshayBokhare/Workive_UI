import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Paperclip, Send } from 'lucide-react'
import { Avatar } from '../components/ui/Avatar'
import { Spinner } from '../components/ui/Spinner'
import { MessageBubble } from '../components/chat/MessageBubble'
import { useAuthStore } from '../store/authStore'
import * as conversationsApi from '../api/conversations'

export default function ChatDetail() {
  const { conversationId } = useParams()
  const currentUser = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  const [text, setText] = useState('')
  const [file, setFile] = useState(null)
  const bottomRef = useRef(null)
  const fileInputRef = useRef(null)

  const { data: conversationsPage } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => conversationsApi.getConversations(),
  })
  const conversation = conversationsPage?.items.find((c) => c.id === conversationId)

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => conversationsApi.getMessages(conversationId),
    refetchInterval: 15_000,
  })

  const sendMutation = useMutation({
    mutationFn: () => conversationsApi.sendMessage(conversationId, { text: text.trim() || undefined, file }),
    onSuccess: () => {
      setText('')
      setFile(null)
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] })
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })

  useEffect(() => {
    conversationsApi.markConversationRead(conversationId).then(() => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    })
  }, [conversationId, queryClient])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const isDirect = conversation?.type === 'direct'
  const peer = isDirect ? conversation?.participants.find((p) => p.id !== currentUser?.id) : null
  const title = isDirect ? peer?.full_name : conversation?.name

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 border-b border-ink-100 bg-white px-5 py-4">
        <Avatar src={peer?.avatar_url} name={title} size="sm" />
        <p className="font-bold text-ink-900">{title || 'Conversation'}</p>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {isLoading ? (
          <Spinner className="mx-auto my-8" />
        ) : (
          <div className="flex flex-col gap-2">
            {(messages || []).map((m) => (
              <MessageBubble key={m.id} message={m} isMine={m.sender_id === currentUser?.id} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="border-t border-ink-100 bg-white p-4">
        {file && (
          <div className="mb-2 flex items-center gap-2 rounded-lg bg-ink-50 px-3 py-1.5 text-xs text-ink-600">
            {file.name}
            <button onClick={() => setFile(null)} className="ml-auto font-bold text-coral-500">
              ×
            </button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-500 hover:bg-ink-100"
          >
            <Paperclip size={19} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0] || null)}
          />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Message..."
            className="h-10 flex-1 rounded-full border border-ink-200 bg-honey-50/60 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400/40"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (text.trim() || file)) sendMutation.mutate()
            }}
          />
          <button
            disabled={!text.trim() && !file}
            onClick={() => sendMutation.mutate()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-honey-500 text-ink-900 disabled:opacity-40"
          >
            <Send size={17} />
          </button>
        </div>
      </div>
    </div>
  )
}
