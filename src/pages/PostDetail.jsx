import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { Avatar } from '../components/ui/Avatar'
import { Spinner } from '../components/ui/Spinner'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/layout/PageHeader'
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
    <div className="mx-auto max-w-2xl px-8 py-8">
      <PageHeader
        title="Post"
        backTo="/"
        actions={
          isOwner && (
            <button
              onClick={() => deletePostMutation.mutate()}
              className="flex items-center gap-1.5 text-sm font-medium text-coral-500 hover:text-coral-600"
            >
              <Trash2 size={16} /> Delete
            </button>
          )
        }
      />

      <PostCard post={post} />

      <Card className="mt-6 p-5">
        <h3 className="mb-3 font-semibold text-ink-900">Comments</h3>
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
                <button onClick={() => deleteCommentMutation.mutate(c.id)} className="text-ink-300 hover:text-coral-500">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
          {commentsPage?.items?.length === 0 && <p className="text-sm text-ink-400">No comments yet.</p>}
        </div>
      </Card>
    </div>
  )
}
