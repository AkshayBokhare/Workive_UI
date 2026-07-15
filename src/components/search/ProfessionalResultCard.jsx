import { Link } from 'react-router-dom'
import { Star, MapPin } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { Badge } from '../ui/Badge'

export function ProfessionalResultCard({ professional }) {
  return (
    <Link
      to={`/profile/${professional.id}`}
      className="flex items-center gap-3 border-b border-ink-50 px-4 py-3.5 hover:bg-honey-50/60"
    >
      <Avatar src={professional.avatar_url} name={professional.full_name} size="md" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-ink-900">{professional.full_name}</p>
        <p className="flex items-center gap-1 truncate text-xs text-ink-400">
          {professional.city && (
            <>
              <MapPin size={12} /> {professional.city}
              {typeof professional.distance_km === 'number' && ` · ${professional.distance_km.toFixed(1)} km`}
            </>
          )}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <Badge className="bg-ink-100 text-ink-700 capitalize">{professional.level}</Badge>
        {professional.rating_count > 0 && (
          <span className="flex items-center gap-0.5 text-xs font-semibold text-honey-600">
            <Star size={12} className="fill-honey-500 text-honey-500" />
            {professional.rating_avg.toFixed(1)}
          </span>
        )}
      </div>
    </Link>
  )
}
