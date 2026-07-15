import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Heart, MessageCircle, Bookmark, Send } from 'lucide-react'
import clsx from 'clsx'
import { Avatar } from '../ui/Avatar'
import * as postsApi from '../../api/posts'

export function PostCard({ post }) {
  const queryClient = useQueryClient()
  const [commentText, setCommentText] = useState('')
  const [showComments, setShowComments] = useState(false)

  const invalidatePosts = () => {
    queryClient.invalidateQueries({ queryKey: ['feed'] })
    queryClient.invalidateQueries({ queryKey: ['post', post.id] })
    queryClient.invalidateQueries({ queryKey: ['saved-posts'] })
  }

  const likeMutation = useMutation({
    mutationFn: () => (post.is_liked ? postsApi.unlikePost(post.id) : postsApi.likePost(post.id)),
    onSuccess: invalidatePosts,
  })

  const saveMutation = useMutation({
    mutationFn: () => (post.is_saved ? postsApi.unsavePost(post.id) : postsApi.savePost(post.id)),
    onSuccess: invalidatePosts,
  })

  const commentMutation = useMutation({
    mutationFn: (body) => postsApi.addComment(post.id, body),
    onSuccess: () => {
      setCommentText('')
      invalidatePosts()
    },
  })

  const media = post.media?.[0]

  return (
    <article className="border-b border-ink-100 bg-white pb-3">
      <Link to={`/profile/${post.author.id}`} className="flex items-center gap-3 px-4 py-3">
        <Avatar src={post.author.avatar_url} name={post.author.full_name} size="sm" />
        <div>
          <p className="text-sm font-semibold text-ink-900">{post.author.full_name}</p>
        </div>
      </Link>

      {media && (
        <div className="aspect-square w-full bg-ink-100">
          {media.media_type === 'video' ? (
            <video src={media.url} controls className="h-full w-full object-cover" />
          ) : (
            <img src={media.url} alt={post.caption || 'post media'} className="h-full w-full object-cover" />
          )}
        </div>
      )}

      <div className="flex items-center gap-4 px-4 pt-3">
        <button onClick={() => likeMutation.mutate()} className="flex items-center gap-1.5">
          <Heart
            size={22}
            className={post.is_liked ? 'fill-coral-500 text-coral-500' : 'text-ink-700'}
          />
        </button>
        <button onClick={() => setShowComments((v) => !v)} className="flex items-center gap-1.5">
          <MessageCircle size={22} className="text-ink-700" />
        </button>
        <button onClick={() => saveMutation.mutate()} className="ml-auto flex items-center gap-1.5">
          <Bookmark size={22} className={post.is_saved ? 'fill-honey-500 text-honey-500' : 'text-ink-700'} />
        </button>
      </div>

      <div className="px-4 pt-1.5">
        <p className="text-sm font-semibold text-ink-900">{post.likes_count} likes</p>
        {post.caption && (
          <p className="mt-0.5 text-sm text-ink-700">
            <span className="font-semibold text-ink-900">{post.author.full_name}</span> {post.caption}
          </p>
        )}
        {post.comments_count > 0 && (
          <button
            onClick={() => setShowComments(true)}
            className="mt-1 block text-sm text-ink-400"
          >
            View all {post.comments_count} comments
          </button>
        )}
      </div>

      {showComments && (
        <div className="mt-2 flex items-center gap-2 border-t border-ink-100 px-4 pt-2">
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="h-9 flex-1 rounded-full border border-ink-200 bg-honey-50 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400/50"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && commentText.trim()) commentMutation.mutate(commentText.trim())
            }}
          />
          <button
            disabled={!commentText.trim()}
            onClick={() => commentMutation.mutate(commentText.trim())}
            className={clsx('text-honey-600', !commentText.trim() && 'opacity-40')}
          >
            <Send size={18} />
          </button>
        </div>
      )}
    </article>
  )
}
