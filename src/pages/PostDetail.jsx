import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { Avatar } from '../components/ui/Avatar'
import { Spinner } from '../components/ui/Spinner'
import { PostCard } from '../components/feed/PostCard'
import { useAuthStore } from '../store/authStore'
import * as postsApi from '../api/posts'

export default function PostDetail() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const currentUser = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()

  const { data: post, isLoading } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => postsApi.getPost(postId),
  })

  const { data: commentsPage } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => postsApi.getComments(postId),
    enabled: Boolean(post),
  })

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId) => postsApi.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
      queryClient.invalidateQueries({ queryKey: ['post', postId] })
    },
  })

  const deletePostMutation = useMutation({
    mutationFn: () => postsApi.deletePost(postId),
    onSuccess: () => navigate(-1),
  })

  if (isLoading || !post) return <Spinner className="mx-auto my-16" />

  const isOwner = post.author.id === currentUser?.id

  return (
    <div>
      <header className="safe-top sticky top-0 z-20 flex items-center justify-between bg-white/95 px-4 pb-3 pt-4 backdrop-blur">
        <button onClick={() => navigate(-1)} className="flex h-8 w-8 items-center justify-center">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-ink-900">Post</h1>
        {isOwner ? (
          <button onClick={() => deletePostMutation.mutate()} className="text-coral-500">
            <Trash2 size={18} />
          </button>
        ) : (
          <span className="w-8" />
        )}
      </header>

      <PostCard post={post} />

      <section className="px-4 py-3">
        <h3 className="mb-2 font-semibold text-ink-900">Comments</h3>
        <div className="flex flex-col gap-3">
          {(commentsPage?.items || []).map((c) => (
            <div key={c.id} className="flex items-start gap-2">
              <Avatar src={c.user.avatar_url} name={c.user.full_name} size="xs" />
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-semibold text-ink-900">{c.user.full_name}</span>{' '}
                  <span className="text-ink-700">{c.body}</span>
                </p>
              </div>
              {(c.user.id === currentUser?.id || isOwner) && (
                <button onClick={() => deleteCommentMutation.mutate(c.id)} className="text-ink-300">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
          {commentsPage?.items?.length === 0 && <p className="text-sm text-ink-400">No comments yet.</p>}
        </div>
      </section>
    </div>
  )
}
