import { useRef, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Star, Camera, Plus } from 'lucide-react'
import { Avatar } from '../components/ui/Avatar'
import { Button } from '../components/ui/Button'
import { Chip } from '../components/ui/Chip'
import { Spinner } from '../components/ui/Spinner'
import { Card } from '../components/ui/Card'
import { PortfolioGrid } from '../components/profile/PortfolioGrid'
import { AvailabilityWeekStrip } from '../components/profile/AvailabilityWeekStrip'
import { useAuthStore } from '../store/authStore'
import * as usersApi from '../api/users'
import * as followsApi from '../api/follows'
import * as conversationsApi from '../api/conversations'

export default function Profile() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const currentUser = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  const fileInputRef = useRef(null)
  const [newWorkArea, setNewWorkArea] = useState('')

  const isOwn = !userId || userId === currentUser?.id
  const targetId = isOwn ? currentUser?.id : userId

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', targetId],
    queryFn: () => usersApi.getUserProfile(targetId),
    enabled: Boolean(targetId),
  })

  const { data: followStatus } = useQuery({
    queryKey: ['follow-status', targetId],
    queryFn: () => followsApi.getFollowStatus(targetId),
    enabled: Boolean(targetId) && !isOwn,
  })

  const invalidateProfile = () => {
    queryClient.invalidateQueries({ queryKey: ['profile', targetId] })
    queryClient.invalidateQueries({ queryKey: ['follow-status', targetId] })
  }

  const followMutation = useMutation({
    mutationFn: () =>
      followStatus?.is_following ? followsApi.unfollowUser(targetId) : followsApi.followUser(targetId),
    onSuccess: invalidateProfile,
  })

  const messageMutation = useMutation({
    mutationFn: () => conversationsApi.getOrCreateDirectConversation(targetId),
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      navigate(`/chats/${conversation.id}`)
    },
  })

  const avatarMutation = useMutation({
    mutationFn: (file) => usersApi.uploadAvatar(file),
    onSuccess: invalidateProfile,
  })

  const portfolioMutation = useMutation({
    mutationFn: (file) => usersApi.uploadPortfolioMedia(file),
    onSuccess: invalidateProfile,
  })

  const workAreaMutation = useMutation({
    mutationFn: (names) => usersApi.addWorkAreas(names),
    onSuccess: () => {
      setNewWorkArea('')
      invalidateProfile()
    },
  })

  const removeWorkAreaMutation = useMutation({
    mutationFn: (id) => usersApi.removeWorkArea(id),
    onSuccess: invalidateProfile,
  })

  if (isLoading || !profile) {
    return <Spinner className="mx-auto my-16" />
  }

  return (
    <div className="w-full px-10 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[340px_1fr] lg:items-start">
        <div className="flex flex-col gap-6 lg:sticky lg:top-8">
          <Card className="p-6 text-center">
            <div className="relative mx-auto w-fit">
              <Avatar src={profile.avatar_url} name={profile.full_name} size="xl" />
              {isOwn && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-honey-500 text-ink-900 shadow"
                >
                  <Camera size={15} />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files[0] && avatarMutation.mutate(e.target.files[0])}
              />
            </div>

            <h1 className="mt-4 text-xl font-extrabold text-ink-900">{profile.full_name}</h1>
            <p className="text-sm text-ink-400">
              {[profile.city, profile.state, profile.country].filter(Boolean).join(', ') || 'Location not set'}
            </p>

            {isOwn ? (
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate('/profile/edit')}>
                  Edit profile
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Share
                </Button>
              </div>
            ) : (
              <div className="mt-4 flex gap-2">
                <Button
                  variant={followStatus?.is_following ? 'outline' : 'primary'}
                  size="sm"
                  className="flex-1"
                  loading={followMutation.isPending}
                  onClick={() => followMutation.mutate()}
                >
                  {followStatus?.is_following ? 'Following' : 'Follow'}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  loading={messageMutation.isPending}
                  onClick={() => messageMutation.mutate()}
                >
                  Message
                </Button>
              </div>
            )}

            <div className="mt-5 flex divide-x divide-ink-100 rounded-xl border border-ink-100 py-3">
              {isOwn ? (
                <button className="flex-1" onClick={() => navigate('/posts/mine')}>
                  <Stat label="Posts" value={profile.posts_count} />
                </button>
              ) : (
                <div className="flex-1">
                  <Stat label="Posts" value={profile.posts_count} />
                </div>
              )}
              <div className="flex-1">
                <Stat label="Followers" value={profile.followers_count} />
              </div>
              <div className="flex-1">
                <Stat label="Following" value={profile.following_count} />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-ink-900">Availability</h3>
              <Link to="/assignments" className="text-sm font-medium text-honey-600">
                Calendar
              </Link>
            </div>
            <div className="mt-3">
              <AvailabilityWeekStrip userId={targetId} />
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-ink-900">About me</h3>
              {profile.rating_count > 0 && (
                <span className="flex items-center gap-1 text-sm font-semibold text-honey-600">
                  <Star size={14} className="fill-honey-500 text-honey-500" />
                  {profile.rating_avg.toFixed(1)} ({profile.rating_count})
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-ink-600">{profile.bio || 'No bio yet.'}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Chip className="capitalize">{profile.level}</Chip>
              {profile.day_rate && (
                <Chip>
                  Starts at {profile.day_rate_currency} {profile.day_rate}
                </Chip>
              )}
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="p-6">
              <h3 className="font-bold text-ink-900">Work areas</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {profile.work_areas.map((wa) => (
                  <Chip key={wa.id} onRemove={isOwn ? () => removeWorkAreaMutation.mutate(wa.id) : undefined}>
                    {wa.name}
                  </Chip>
                ))}
                {isOwn && (
                  <form
                    className="flex items-center gap-1"
                    onSubmit={(e) => {
                      e.preventDefault()
                      if (newWorkArea.trim()) workAreaMutation.mutate([newWorkArea.trim()])
                    }}
                  >
                    <input
                      value={newWorkArea}
                      onChange={(e) => setNewWorkArea(e.target.value)}
                      placeholder="Add work area"
                      className="h-8 w-32 rounded-full border border-dashed border-ink-300 bg-transparent px-3 text-sm focus:outline-none"
                    />
                    <button type="submit" className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-100">
                      <Plus size={15} />
                    </button>
                  </form>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-ink-900">Equipments</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {profile.equipment.map((eq) => (
                  <Chip key={eq.id}>
                    {eq.name}
                    {eq.quantity > 1 ? ` (${eq.quantity})` : ''}
                  </Chip>
                ))}
                {profile.equipment.length === 0 && <p className="text-sm text-ink-400">No equipment listed.</p>}
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-bold text-ink-900">Portfolio</h3>
              {isOwn && (
                <button
                  onClick={() => document.getElementById('portfolio-upload-input').click()}
                  className="text-sm font-medium text-honey-600"
                >
                  Add
                </button>
              )}
              <input
                id="portfolio-upload-input"
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => e.target.files[0] && portfolioMutation.mutate(e.target.files[0])}
              />
            </div>
            <PortfolioGrid media={profile.portfolio_media} />
          </Card>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-lg font-extrabold text-ink-900">{value}</span>
      <span className="text-xs text-ink-400">{label}</span>
    </div>
  )
}
