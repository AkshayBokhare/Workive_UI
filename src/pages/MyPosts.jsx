import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { Spinner } from '../components/ui/Spinner'
import { EmptyState } from '../components/ui/EmptyState'
import * as postsApi from '../api/posts'

export default function MyPosts() {
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['posts', 'me'],
    queryFn: () => postsApi.getMyPosts(),
  })

  return (
    <div>
      <header className="safe-top sticky top-0 z-20 flex items-center gap-2 bg-white/95 px-4 pb-3 pt-4 backdrop-blur">
        <button onClick={() => navigate(-1)} className="flex h-8 w-8 items-center justify-center">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-ink-900">My posts</h1>
      </header>

      {isLoading ? (
        <Spinner className="mx-auto my-10" />
      ) : data?.items?.length === 0 ? (
        <EmptyState title="No posts yet" description="Share your work from the create button on Home." />
      ) : (
        <div className="grid grid-cols-3 gap-1 p-1">
          {data.items.map((post) => (
            <button
              key={post.id}
              onClick={() => navigate(`/posts/${post.id}`)}
              className="relative aspect-square overflow-hidden bg-ink-100"
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
