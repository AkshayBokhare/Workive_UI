import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { Avatar } from '../ui/Avatar'
import { useAuthStore } from '../../store/authStore'

function formatTime(iso) {
  if (!iso) return ''
  const date = new Date(iso)
  const now = new Date()
  const sameDay = date.toDateString() === now.toDateString()
  if (sameDay) return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

export function ConversationListItem({ conversation, isActive }) {
  const currentUser = useAuthStore((s) => s.user)
  const isDirect = conversation.type === 'direct'
  const peer = isDirect ? conversation.participants.find((p) => p.id !== currentUser?.id) : null

  const title = isDirect ? peer?.full_name : conversation.name
  const avatarSrc = isDirect ? peer?.avatar_url : null

  return (
    <Link
      to={`/chats/${conversation.id}`}
      className={clsx(
        'flex items-center gap-3 border-b border-ink-50 px-4 py-3 transition-colors',
        isActive ? 'bg-honey-100/70' : 'hover:bg-honey-50/60',
      )}
    >
      <Avatar src={avatarSrc} name={title} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate font-semibold text-ink-900">{title}</p>
          <span className="shrink-0 text-xs text-ink-400">{formatTime(conversation.last_message_at)}</span>
        </div>
        <p className="truncate text-sm text-ink-400">
          {conversation.last_message?.body ||
            (conversation.last_message?.attachment_url ? 'Sent an attachment' : 'No messages yet')}
        </p>
      </div>
      {conversation.unread_count > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-honey-500 px-1.5 text-xs font-bold text-ink-900">
          {conversation.unread_count}
        </span>
      )}
    </Link>
  )
}
