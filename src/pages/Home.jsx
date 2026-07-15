import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, Bell, Camera } from 'lucide-react'
import { Avatar } from '../components/ui/Avatar'
import { Spinner } from '../components/ui/Spinner'
import { EmptyState } from '../components/ui/EmptyState'
import { AssignmentCard } from '../components/assignments/AssignmentCard'
import { PostCard } from '../components/feed/PostCard'
import { useAuthStore } from '../store/authStore'
import * as assignmentsApi from '../api/assignments'
import * as conversationsApi from '../api/conversations'
import * as postsApi from '../api/posts'
import * as notificationsApi from '../api/notifications'

export default function Home() {
  const user = useAuthStore((s) => s.user)
  const today = new Date().toISOString().slice(0, 10)

  const { data: assignmentsPage } = useQuery({
    queryKey: ['assignments', 'me'],
    queryFn: () => assignmentsApi.getMyAssignments({ page_size: 20 }),
  })
  const { data: conversationsPage } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => conversationsApi.getConversations(),
  })
  const { data: feedPage, isLoading: feedLoading } = useQuery({
    queryKey: ['feed'],
    queryFn: () => postsApi.getFeed(),
  })
  const { data: unread } = useQuery({
    queryKey: ['unread-count'],
    queryFn: notificationsApi.getUnreadCount,
    refetchInterval: 30_000,
  })

  const todaysAssignments = (assignmentsPage?.items || []).filter((a) =>
    a.days.some((d) => d.date === today),
  )

  return (
    <div>
      <header className="safe-top sticky top-0 z-20 bg-honey-50/95 px-4 pb-3 pt-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <Link to="/profile">
            <Avatar src={user?.avatar_url} name={user?.full_name} size="sm" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold text-ink-900">{user?.full_name}</p>
            <p className="truncate text-xs text-ink-400">{user?.city || 'Set your location'}</p>
          </div>
          <Link
            to="/notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink-700 shadow-sm"
          >
            <Bell size={19} />
            {unread?.unread_count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-coral-500 text-[10px] font-bold text-white">
                {unread.unread_count > 9 ? '9+' : unread.unread_count}
              </span>
            )}
          </Link>
        </div>

        <Link
          to="/search"
          className="mt-3 flex h-11 items-center gap-2 rounded-xl border border-ink-100 bg-white px-3.5 text-sm text-ink-400 shadow-sm"
        >
          <Search size={17} />
          Search by name, role, category
        </Link>
      </header>

      <section className="px-4 pt-2">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-bold text-ink-900">Today's assignments</h2>
          <Link to="/assignments" className="text-sm font-medium text-honey-600">
            See all
          </Link>
        </div>
        {todaysAssignments.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-ink-200 px-4 py-5 text-center text-sm text-ink-400">
            Nothing booked for today.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {todaysAssignments.map((a) => (
              <AssignmentCard key={a.id} assignment={a} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-5 px-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-bold text-ink-900">Recent chats</h2>
          <Link to="/chats" className="text-sm font-medium text-honey-600">
            See all
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-1">
          {(conversationsPage?.items || []).slice(0, 8).map((c) => {
            const peer = c.type === 'direct' ? c.participants.find((p) => p.id !== user?.id) : null
            const title = c.type === 'direct' ? peer?.full_name : c.name
            return (
              <Link key={c.id} to={`/chats/${c.id}`} className="flex w-16 shrink-0 flex-col items-center gap-1">
                <Avatar src={peer?.avatar_url} name={title} size="md" />
                <span className="w-full truncate text-center text-xs text-ink-600">{title}</span>
              </Link>
            )
          })}
          {conversationsPage?.items?.length === 0 && (
            <p className="text-sm text-ink-400">No conversations yet.</p>
          )}
        </div>
      </section>

      <section className="mt-5 border-t border-ink-100">
        {feedLoading ? (
          <Spinner className="mx-auto my-8" />
        ) : feedPage?.items?.length ? (
          feedPage.items.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <EmptyState
            icon={Camera}
            title="Your feed is quiet"
            description="Follow other professionals to see their work here."
          />
        )}
      </section>
    </div>
  )
}
