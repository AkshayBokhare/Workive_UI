import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Camera } from 'lucide-react'
import { Avatar } from '../components/ui/Avatar'
import { Spinner } from '../components/ui/Spinner'
import { EmptyState } from '../components/ui/EmptyState'
import { Card } from '../components/ui/Card'
import { AssignmentCard } from '../components/assignments/AssignmentCard'
import { PostCard } from '../components/feed/PostCard'
import { useAuthStore } from '../store/authStore'
import * as assignmentsApi from '../api/assignments'
import * as conversationsApi from '../api/conversations'
import * as postsApi from '../api/posts'

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

  const todaysAssignments = (assignmentsPage?.items || []).filter((a) =>
    a.days.some((d) => d.date === today),
  )

  return (
    <div className="w-full px-10 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-ink-900">Welcome back, {user?.full_name?.split(' ')[0]}</h1>
        <p className="mt-0.5 text-sm text-ink-400">Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          <h2 className="mb-3 font-bold text-ink-900">Feed</h2>
          {feedLoading ? (
            <Spinner className="mx-auto my-8" />
          ) : feedPage?.items?.length ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
              {feedPage.items.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <Card>
              <EmptyState
                icon={Camera}
                title="Your feed is quiet"
                description="Follow other professionals to see their work here."
              />
            </Card>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <section>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-bold text-ink-900">Today's assignments</h2>
              <Link to="/assignments" className="text-sm font-medium text-honey-600">
                See all
              </Link>
            </div>
            {todaysAssignments.length === 0 ? (
              <Card className="px-4 py-5 text-center text-sm text-ink-400">Nothing booked for today.</Card>
            ) : (
              <div className="flex flex-col gap-3">
                {todaysAssignments.map((a) => (
                  <AssignmentCard key={a.id} assignment={a} />
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-bold text-ink-900">Recent chats</h2>
              <Link to="/chats" className="text-sm font-medium text-honey-600">
                See all
              </Link>
            </div>
            <Card className="p-2">
              {(conversationsPage?.items || []).length === 0 ? (
                <p className="px-2 py-3 text-sm text-ink-400">No conversations yet.</p>
              ) : (
                <div className="flex flex-col">
                  {(conversationsPage?.items || []).slice(0, 6).map((c) => {
                    const peer = c.type === 'direct' ? c.participants.find((p) => p.id !== user?.id) : null
                    const title = c.type === 'direct' ? peer?.full_name : c.name
                    return (
                      <Link
                        key={c.id}
                        to={`/chats/${c.id}`}
                        className="flex items-center gap-2.5 rounded-xl px-2 py-2 hover:bg-honey-50/60"
                      >
                        <Avatar src={peer?.avatar_url} name={title} size="sm" />
                        <span className="truncate text-sm font-medium text-ink-700">{title}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}
