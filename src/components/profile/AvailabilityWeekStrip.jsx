import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import * as availabilityApi from '../../api/availability'

function isoDate(d) {
  return d.toISOString().slice(0, 10)
}

export function AvailabilityWeekStrip({ userId, days = 7 }) {
  const from = new Date()
  const to = new Date()
  to.setDate(to.getDate() + days - 1)
  const fromIso = isoDate(from)
  const toIso = isoDate(to)

  const { data } = useQuery({
    queryKey: ['availability', userId, fromIso, toIso],
    queryFn: () => availabilityApi.getUserAvailability(userId, fromIso, toIso),
    enabled: Boolean(userId),
  })

  return (
    <div className="flex gap-2 overflow-x-auto">
      {(data || []).map((day) => {
        const date = new Date(day.date)
        const isToday = day.date === isoDate(new Date())
        return (
          <div
            key={day.date}
            className={clsx(
              'flex w-11 shrink-0 flex-col items-center rounded-xl border py-2',
              day.status === 'available' && 'border-emerald-500/30 bg-emerald-500/10',
              day.status === 'unavailable' && 'border-ink-200 bg-ink-50',
              day.status === 'occupied' && 'border-honey-500/40 bg-honey-100',
              isToday && 'ring-2 ring-ink-900',
            )}
          >
            <span className="text-[10px] font-medium text-ink-400">
              {date.toLocaleDateString([], { weekday: 'short' })[0]}
            </span>
            <span className="text-sm font-bold text-ink-900">{date.getDate()}</span>
          </div>
        )
      })}
    </div>
  )
}
