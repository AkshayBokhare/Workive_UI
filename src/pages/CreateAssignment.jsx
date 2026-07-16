import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { X, Plus, Search } from 'lucide-react'
import { Input, Textarea } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Avatar } from '../components/ui/Avatar'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/layout/PageHeader'
import { DurationPicker } from '../components/assignments/DurationPicker'
import { apiErrorMessage } from '../api/client'
import * as searchApi from '../api/search'
import * as assignmentsApi from '../api/assignments'

function emptyDay() {
  return { date: '', duration_type: 'all_day', punch_in_time: '' }
}

export default function CreateAssignment() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [days, setDays] = useState([emptyDay()])
  const [participants, setParticipants] = useState([])
  const [participantQuery, setParticipantQuery] = useState('')
  const [pickerOpen, setPickerOpen] = useState(false)

  const { data: searchResults } = useQuery({
    queryKey: ['search', 'participants', participantQuery],
    queryFn: () => searchApi.searchProfessionals({ q: participantQuery, page_size: 8 }),
    enabled: pickerOpen && participantQuery.length > 1,
  })

  const createMutation = useMutation({
    mutationFn: () =>
      assignmentsApi.createAssignment({
        name,
        description: description || null,
        location_text: location || null,
        participants: participants.map((p) => ({ user_id: p.id, role_title: p.role_title || null })),
        days: days
          .filter((d) => d.date)
          .map((d) => ({
            date: d.date,
            duration_type: d.duration_type,
            punch_in_time: d.punch_in_time || null,
          })),
      }),
    onSuccess: (assignment) => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] })
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      navigate(`/assignments/${assignment.id}`)
    },
  })

  function addParticipant(user) {
    if (participants.some((p) => p.id === user.id)) return
    setParticipants((prev) => [...prev, { ...user, role_title: '' }])
    setParticipantQuery('')
    setPickerOpen(false)
  }

  function updateDay(index, patch) {
    setDays((prev) => prev.map((d, i) => (i === index ? { ...d, ...patch } : d)))
  }

  return (
    <div className="mx-auto max-w-2xl px-8 py-8">
      <PageHeader title="New assignment" backTo="/assignments" backLabel="Cancel" />

      <Card className="flex flex-col gap-5 p-6">
        <Input
          label="Assignment name"
          placeholder="Assignment name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div>
          <p className="mb-2 text-sm font-medium text-ink-700">Add participants</p>
          <div className="flex flex-col gap-2">
            {participants.map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-xl border border-ink-100 p-2">
                <Avatar src={p.avatar_url} name={p.full_name} size="sm" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink-900">{p.full_name}</p>
                  <input
                    value={p.role_title}
                    onChange={(e) =>
                      setParticipants((prev) =>
                        prev.map((x) => (x.id === p.id ? { ...x, role_title: e.target.value } : x)),
                      )
                    }
                    placeholder="Role (e.g. Drone Operator)"
                    className="w-full bg-transparent text-xs text-ink-400 focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => setParticipants((prev) => prev.filter((x) => x.id !== p.id))}
                  className="text-ink-400 hover:text-coral-500"
                >
                  <X size={16} />
                </button>
              </div>
            ))}

            <div className="relative">
              <div className="flex h-11 items-center gap-2 rounded-xl border border-dashed border-ink-300 px-3.5">
                <Search size={16} className="text-ink-400" />
                <input
                  value={participantQuery}
                  onChange={(e) => {
                    setParticipantQuery(e.target.value)
                    setPickerOpen(true)
                  }}
                  onFocus={() => setPickerOpen(true)}
                  placeholder="Search by name..."
                  className="w-full bg-transparent text-sm focus:outline-none"
                />
              </div>
              {pickerOpen && searchResults?.items?.length > 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-xl border border-ink-100 bg-white shadow-lg">
                  {searchResults.items.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => addParticipant(user)}
                      className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-honey-50"
                    >
                      <Avatar src={user.avatar_url} name={user.full_name} size="xs" />
                      <span className="text-sm font-medium text-ink-900">{user.full_name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium text-ink-700">Schedule</p>
          {days.map((day, index) => (
            <div key={index} className="rounded-xl border border-ink-100 p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-ink-800">Day {index + 1}</p>
                {days.length > 1 && (
                  <button onClick={() => setDays((prev) => prev.filter((_, i) => i !== index))}>
                    <X size={16} className="text-ink-400" />
                  </button>
                )}
              </div>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <Input
                  type="date"
                  value={day.date}
                  onChange={(e) => updateDay(index, { date: e.target.value })}
                />
                <Input
                  type="time"
                  value={day.punch_in_time}
                  onChange={(e) => updateDay(index, { punch_in_time: e.target.value })}
                  placeholder="Punch in time"
                />
              </div>
              <div className="mt-3">
                <DurationPicker
                  value={day.duration_type}
                  onChange={(duration_type) => updateDay(index, { duration_type })}
                />
              </div>
            </div>
          ))}
          <button
            onClick={() => setDays((prev) => [...prev, emptyDay()])}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-ink-300 py-2.5 text-sm font-medium text-ink-600 hover:bg-ink-50"
          >
            <Plus size={15} /> Add more days
          </button>
        </div>

        <Input label="Location" placeholder="Add location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <Textarea label="Description" placeholder="Description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />

        {createMutation.isError && (
          <p className="text-sm text-coral-600">{apiErrorMessage(createMutation.error)}</p>
        )}

        <div className="flex justify-end border-t border-ink-100 pt-5">
          <Button
            size="lg"
            disabled={!name.trim() || !days.some((d) => d.date)}
            loading={createMutation.isPending}
            onClick={() => createMutation.mutate()}
          >
            Create assignment
          </Button>
        </div>
      </Card>
    </div>
  )
}
