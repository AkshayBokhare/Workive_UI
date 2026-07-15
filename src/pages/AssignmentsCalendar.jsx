import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { MapPin, ChevronDown } from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { Avatar } from '../components/ui/Avatar'
import { Spinner } from '../components/ui/Spinner'
import * as availabilityApi from '../api/availability'
import * as assignmentsApi from '../api/assignments'
import { ASSIGNMENT_STATUS_STYLES, AVAILABILITY_STYLES } from '../lib/constants'

function isoDate(d) {
  return d.toISOString().slice(0, 10)
}

function startOfWeek(date) {
  const d = new Date(date)
  d.setDate(d.getDate() - d.getDay())
  return d
}

export default function AssignmentsCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const queryClient = useQueryClient()

  const weekStart = startOfWeek(selectedDate)
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    return d
  })
  const from = isoDate(weekDays[0])
  const to = isoDate(weekDays[6])

  const { data: availability, isLoading: availLoading } = useQuery({
    queryKey: ['availability', 'me', from, to],
    queryFn: () => availabilityApi.getMyAvailability(from, to),
  })

  const { data: assignmentsPage } = useQuery({
    queryKey: ['assignments', 'me'],
    queryFn: () => assignmentsApi.getMyAssignments({ page_size: 50 }),
  })

  const assignmentById = useMemo(() => {
    const map = {}
    for (const a of assignmentsPage?.items || []) map[a.id] = a
    return map
  }, [assignmentsPage])

  const availableCount = (availability || []).filter((d) => d.status === 'available').length

  const setAvailabilityMutation = useMutation({
    mutationFn: ({ date, status }) => availabilityApi.setAvailability(date, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['availability'] }),
  })

  return (
    <div>
      <header className="safe-top sticky top-0 z-20 bg-white/95 px-4 pb-3 pt-4 backdrop-blur">
        <p className="text-xs font-medium text-ink-400">
          {weekStart.toLocaleDateString([], { month: 'long', year: 'numeric' })}
        </p>
        <h1 className="text-lg font-extrabold text-ink-900">{availableCount} available dates this week</h1>

        <div className="mt-3 flex justify-between">
          {weekDays.map((d) => {
            const iso = isoDate(d)
            const isSelected = iso === isoDate(selectedDate)
            return (
              <button
                key={iso}
                onClick={() => setSelectedDate(d)}
                className="flex flex-col items-center gap-1"
              >
                <span className="text-[11px] text-ink-400">
                  {d.toLocaleDateString([], { weekday: 'short' })[0]}
                </span>
                <span
                  className={clsx(
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold',
                    isSelected ? 'bg-ink-900 text-white' : 'text-ink-700',
                  )}
                >
                  {d.getDate()}
                </span>
              </button>
            )
          })}
        </div>
      </header>

      {availLoading ? (
        <Spinner className="mx-auto my-10" />
      ) : (
        <div className="flex flex-col divide-y divide-ink-100 px-4">
          {(availability || []).map((day) => {
            const assignment = day.assignment_id ? assignmentById[day.assignment_id] : null
            const assignmentDay = assignment?.days.find((d) => d.date === day.date)
            const status = AVAILABILITY_STYLES[day.status]
            const date = new Date(day.date)

            return (
              <div key={day.date} className="py-4">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-ink-900">
                    {date.toLocaleDateString([], { month: 'short', day: '2-digit' })}{' '}
                    <span className="font-normal text-ink-400">
                      {date.toLocaleDateString([], { weekday: 'long' })}
                    </span>
                  </p>
                  {day.status === 'occupied' ? (
                    <Badge className={status.className}>{status.label}</Badge>
                  ) : (
                    <DayStatusDropdown
                      value={day.status}
                      onChange={(status) => setAvailabilityMutation.mutate({ date: day.date, status })}
                    />
                  )}
                </div>

                {assignment ? (
                  <Link
                    to={`/assignments/${assignment.id}`}
                    className="mt-2 flex items-start gap-3 rounded-2xl border border-ink-100 bg-white p-3"
                  >
                    <div>
                      {assignmentDay?.punch_in_time && (
                        <p className="text-xs font-semibold text-honey-600">
                          {assignmentDay.punch_in_time.slice(0, 5)}
                        </p>
                      )}
                      <p className="font-semibold text-ink-900">{assignment.name}</p>
                      {assignment.location_text && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-ink-400">
                          <MapPin size={12} /> {assignment.location_text}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {assignment.participants.slice(0, 4).map((p) => (
                            <Avatar key={p.user_id} src={p.user.avatar_url} name={p.user.full_name} size="xs" ring />
                          ))}
                        </div>
                        <span className="text-xs text-ink-400">Team of {assignment.participants.length}</span>
                      </div>
                    </div>
                    <Badge className={clsx('ml-auto', ASSIGNMENT_STATUS_STYLES[assignment.status]?.className)}>
                      {ASSIGNMENT_STATUS_STYLES[assignment.status]?.label}
                    </Badge>
                  </Link>
                ) : (
                  <p className="mt-1 text-sm text-ink-400">No events</p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function DayStatusDropdown({ value, onChange }) {
  const style = AVAILABILITY_STYLES[value]
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={clsx(
          'appearance-none rounded-full py-1 pl-3 pr-7 text-xs font-semibold focus:outline-none',
          style.className,
        )}
      >
        <option value="available">Available</option>
        <option value="unavailable">Unavailable</option>
      </select>
      <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
    </div>
  )
}
