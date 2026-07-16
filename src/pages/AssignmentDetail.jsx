import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MapPin, MessageCircle } from 'lucide-react'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Spinner } from '../components/ui/Spinner'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/layout/PageHeader'
import { useAuthStore } from '../store/authStore'
import * as assignmentsApi from '../api/assignments'
import * as conversationsApi from '../api/conversations'
import { ASSIGNMENT_STATUS_STYLES, PARTICIPANT_STATUS_STYLES } from '../lib/constants'

export default function AssignmentDetail() {
  const { assignmentId } = useParams()
  const navigate = useNavigate()
  const currentUser = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()

  const { data: assignment, isLoading } = useQuery({
    queryKey: ['assignment', assignmentId],
    queryFn: () => assignmentsApi.getAssignment(assignmentId),
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['assignment', assignmentId] })
    queryClient.invalidateQueries({ queryKey: ['assignments'] })
    queryClient.invalidateQueries({ queryKey: ['availability'] })
  }

  const respondMutation = useMutation({
    mutationFn: (status) => assignmentsApi.respondToInvite(assignmentId, currentUser.id, status),
    onSuccess: invalidate,
  })

  const statusMutation = useMutation({
    mutationFn: (status) => assignmentsApi.updateAssignmentStatus(assignmentId, status),
    onSuccess: invalidate,
  })

  const openChatMutation = useMutation({
    mutationFn: () => conversationsApi.getOrCreateDirectConversation(assignment.owner_id),
    onSuccess: (c) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      navigate(`/chats/${c.id}`)
    },
  })

  if (isLoading || !assignment) return <Spinner className="mx-auto my-16" />

  const isOwner = assignment.owner_id === currentUser?.id
  const myParticipant = assignment.participants.find((p) => p.user_id === currentUser?.id)
  const status = ASSIGNMENT_STATUS_STYLES[assignment.status]

  return (
    <div className="mx-auto max-w-3xl px-8 py-8">
      <PageHeader
        title={assignment.name}
        backTo="/assignments"
        backLabel="Back to assignments"
        actions={<Badge className={status.className}>{status.label}</Badge>}
      />

      <Card className="p-6">
        {assignment.location_text && (
          <p className="flex items-center gap-1.5 text-sm text-ink-600">
            <MapPin size={15} /> {assignment.location_text}
          </p>
        )}
        {assignment.description && <p className="mt-2 text-sm text-ink-600">{assignment.description}</p>}

        <section className="mt-6">
          <h3 className="font-bold text-ink-900">Schedule</h3>
          <div className="mt-2 flex flex-col gap-2">
            {assignment.days.map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-xl border border-ink-100 p-3">
                <span className="text-sm font-semibold text-ink-800">
                  {new Date(d.date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
                <span className="text-sm text-ink-400">
                  {d.punch_in_time ? d.punch_in_time.slice(0, 5) : ''} · {d.duration_type.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h3 className="font-bold text-ink-900">Team ({assignment.participants.length})</h3>
          <div className="mt-2 flex flex-col divide-y divide-ink-50">
            {assignment.participants.map((p) => (
              <div key={p.user_id} className="flex items-center gap-3 py-2.5">
                <Avatar src={p.user.avatar_url} name={p.user.full_name} size="sm" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink-900">
                    {p.user.full_name} {p.is_owner && <span className="text-xs text-ink-400">(Owner)</span>}
                  </p>
                  {p.role_title && <p className="text-xs text-ink-400">{p.role_title}</p>}
                </div>
                <Badge className={PARTICIPANT_STATUS_STYLES[p.status].className}>
                  {PARTICIPANT_STATUS_STYLES[p.status].label}
                </Badge>
              </div>
            ))}
          </div>
        </section>

        {!isOwner && myParticipant?.status === 'invited' && (
          <div className="mt-6 flex gap-2">
            <Button className="flex-1" loading={respondMutation.isPending} onClick={() => respondMutation.mutate('accepted')}>
              Accept
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              loading={respondMutation.isPending}
              onClick={() => respondMutation.mutate('declined')}
            >
              Decline
            </Button>
          </div>
        )}

        {isOwner && assignment.status !== 'cancelled' && assignment.status !== 'completed' && (
          <div className="mt-6 flex flex-wrap gap-2">
            {assignment.status !== 'approved' && (
              <Button size="sm" onClick={() => statusMutation.mutate('approved')}>
                Mark approved
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => statusMutation.mutate('completed')}>
              Mark completed
            </Button>
            <Button size="sm" variant="danger" onClick={() => statusMutation.mutate('cancelled')}>
              Cancel assignment
            </Button>
          </div>
        )}

        {!isOwner && (
          <button
            onClick={() => openChatMutation.mutate()}
            className="mt-6 flex items-center gap-2 text-sm font-semibold text-honey-600"
          >
            <MessageCircle size={16} /> Message owner
          </button>
        )}
      </Card>
    </div>
  )
}
