import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Badge } from '../components/ui/Badge'
import { Spinner } from '../components/ui/Spinner'
import { EmptyState } from '../components/ui/EmptyState'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/layout/PageHeader'
import * as postsApi from '../api/posts'

export default function MyPosts() {
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['posts', 'me'],
    queryFn: () => postsApi.getMyPosts(),
  })

  return (
    <div className="mx-auto max-w-4xl px-8 py-8">
      <PageHeader title="My posts" backTo="/profile" />

      {isLoading ? (
        <Spinner className="mx-auto my-10" />
      ) : data?.items?.length === 0 ? (
        <Card>
          <EmptyState title="No posts yet" description="Share your work from the create button in the sidebar." />
        </Card>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
          {data.items.map((post) => (
            <button
              key={post.id}
              onClick={() => navigate(`/posts/${post.id}`)}
              className="relative aspect-square overflow-hidden rounded-xl bg-ink-100"
            >
              {post.media[0] && (
                post.media[0].media_type === 'video' ? (
                  <video src={post.media[0].url} className="h-full w-full object-cover" muted />
                ) : (
                  <img src={post.media[0].url} alt="" className="h-full w-full object-cover" />
                )
              )}
              {post.status === 'draft' && (
                <Badge className="absolute left-1 top-1 bg-ink-900/70 text-white">Draft</Badge>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
