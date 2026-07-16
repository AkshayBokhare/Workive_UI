import { Link } from 'react-router-dom'
import { Bell, CalendarCheck, Heart, MessageSquare, UserPlus } from 'lucide-react'
import clsx from 'clsx'

const ICONS = {
  assignment_invite: CalendarCheck,
  assignment_status_change: CalendarCheck,
  new_follower: UserPlus,
  post_like: Heart,
  post_comment: MessageSquare,
  new_message: MessageSquare,
}

function describe(notification) {
  const p = notification.payload || {}
  switch (notification.type) {
    case 'assignment_invite':
      return `You were added to "${p.assignment_name}"`
    case 'assignment_status_change':
      return `"${p.assignment_name}" is now ${p.status}`
    case 'new_follower':
      return 'Someone started following you'
    case 'post_like':
      return 'Someone liked your post'
    case 'post_comment':
      return 'Someone commented on your post'
    case 'new_message':
      return 'You have a new message'
    default:
      return 'New notification'
  }
}

function linkFor(notification) {
  const p = notification.payload || {}
  if (p.assignment_id) return `/assignments/${p.assignment_id}`
  if (p.post_id) return `/posts/${p.post_id}`
  if (p.conversation_id) return `/chats/${p.conversation_id}`
  return '#'
}

export function NotificationItem({ notification }) {
  const Icon = ICONS[notification.type] || Bell

  return (
    <Link
      to={linkFor(notification)}
      className={clsx(
        'flex items-start gap-3 px-5 py-4 transition-colors hover:bg-ink-50',
        !notification.is_read && 'bg-honey-50/60 hover:bg-honey-50',
      )}
    >
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-honey-100 text-honey-600">
        <Icon size={17} />
      </span>
      <div>
        <p className="text-sm text-ink-800">{describe(notification)}</p>
        <p className="mt-0.5 text-xs text-ink-400">{new Date(notification.created_at).toLocaleString()}</p>
      </div>
      {!notification.is_read && <span className="ml-auto mt-2 h-2 w-2 shrink-0 rounded-full bg-honey-500" />}
    </Link>
  )
}
