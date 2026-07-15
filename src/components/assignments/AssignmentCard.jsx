import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { Avatar } from '../ui/Avatar'
import { ASSIGNMENT_STATUS_STYLES } from '../../lib/constants'

export function AssignmentCard({ assignment }) {
  const day = assignment.days?.[0]
  const status = ASSIGNMENT_STATUS_STYLES[assignment.status] || ASSIGNMENT_STATUS_STYLES.pending

  return (
    <Link
      to={`/assignments/${assignment.id}`}
      className="block rounded-2xl border border-ink-100 bg-white p-4 shadow-sm shadow-ink-900/5"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          {day?.punch_in_time && (
            <p className="text-xs font-semibold text-honey-600">{day.punch_in_time.slice(0, 5)}</p>
          )}
          <p className="mt-0.5 font-bold text-ink-900">{assignment.name}</p>
        </div>
        <Badge className={status.className}>{status.label}</Badge>
      </div>

      {assignment.location_text && (
        <p className="mt-2 flex items-center gap-1 text-sm text-ink-400">
          <MapPin size={14} />
          {assignment.location_text}
        </p>
      )}

      <div className="mt-3 flex items-center gap-2">
        <div className="flex -space-x-2">
          {assignment.participants.slice(0, 4).map((p) => (
            <Avatar key={p.user_id} src={p.user.avatar_url} name={p.user.full_name} size="xs" ring />
          ))}
        </div>
        <span className="text-xs text-ink-400">Team of {assignment.participants.length}</span>
      </div>
    </Link>
  )
}
