import { useQuery } from '@tanstack/react-query'
import { useParams, Outlet } from 'react-router-dom'
import { Search, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { EmptyState } from '../components/ui/EmptyState'
import { Spinner } from '../components/ui/Spinner'
import { ConversationListItem } from '../components/chat/ConversationListItem'
import * as conversationsApi from '../api/conversations'

export default function Chats() {
  const { conversationId } = useParams()
  const [query, setQuery] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => conversationsApi.getConversations(),
  })

  const items = (data?.items || []).filter((c) => {
    if (!query) return true
    const name = c.type === 'direct' ? c.participants.map((p) => p.full_name).join(' ') : c.name
    return name?.toLowerCase().includes(query.toLowerCase())
  })

  return (
    <div className="flex h-full">
      <div className="flex w-80 shrink-0 flex-col border-r border-ink-100 bg-white">
        <div className="border-b border-ink-100 px-4 py-4">
          <h1 className="mb-3 text-lg font-extrabold text-ink-900">Chats</h1>
          <div className="flex h-10 items-center gap-2 rounded-xl border border-ink-100 bg-honey-50/60 px-3">
            <Search size={16} className="text-ink-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name"
              className="w-full bg-transparent text-sm focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <Spinner className="mx-auto my-10" />
          ) : items.length === 0 ? (
            <div className="px-2">
              <EmptyState
                icon={MessageCircle}
                title="No conversations yet"
                description="Book an assignment or message a professional to get started."
              />
            </div>
          ) : (
            items.map((c) => (
              <ConversationListItem key={c.id} conversation={c} isActive={c.id === conversationId} />
            ))
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-honey-50/40">
        {conversationId ? (
          <Outlet />
        ) : (
          <div className="flex h-full items-center justify-center">
            <EmptyState
              icon={MessageCircle}
              title="Select a conversation"
              description="Pick a conversation from the list to start messaging."
            />
          </div>
        )}
      </div>
    </div>
  )
}
