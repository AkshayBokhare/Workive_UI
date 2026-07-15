import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowLeft, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { EmptyState } from '../components/ui/EmptyState'
import { Spinner } from '../components/ui/Spinner'
import { ConversationListItem } from '../components/chat/ConversationListItem'
import * as conversationsApi from '../api/conversations'

export default function Chats() {
  const navigate = useNavigate()
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
    <div>
      <header className="safe-top sticky top-0 z-20 flex items-center gap-2 bg-honey-50/95 px-4 pb-3 pt-4 backdrop-blur">
        <button onClick={() => navigate('/')} className="flex h-9 w-9 items-center justify-center rounded-full">
          <ArrowLeft size={20} />
        </button>
        <div className="flex h-11 flex-1 items-center gap-2 rounded-xl border border-ink-100 bg-white px-3.5 shadow-sm">
          <Search size={17} className="text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name"
            className="w-full bg-transparent text-sm focus:outline-none"
          />
        </div>
      </header>

      {isLoading ? (
        <Spinner className="mx-auto my-10" />
      ) : items.length === 0 ? (
        <EmptyState icon={MessageCircle} title="No conversations yet" description="Book an assignment or message a professional to get started." />
      ) : (
        <div>
          {items.map((c) => (
            <ConversationListItem key={c.id} conversation={c} />
          ))}
        </div>
      )}
    </div>
  )
}
