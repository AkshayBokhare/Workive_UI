import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { Input, Textarea } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useAuthStore } from '../store/authStore'
import * as usersApi from '../api/users'
import { USER_LEVELS } from '../lib/constants'

export default function EditProfile() {
  const navigate = useNavigate()
  const currentUser = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)
  const queryClient = useQueryClient()

  const { data: profile } = useQuery({
    queryKey: ['profile', currentUser?.id],
    queryFn: () => usersApi.getUserProfile(currentUser.id),
    enabled: Boolean(currentUser?.id),
  })

  const { register, handleSubmit } = useForm({
    values: profile
      ? {
          full_name: profile.full_name,
          bio: profile.bio || '',
          level: profile.level,
          day_rate: profile.day_rate || '',
          city: profile.city || '',
          state: profile.state || '',
          country: profile.country || '',
        }
      : undefined,
  })

  const mutation = useMutation({
    mutationFn: (payload) =>
      usersApi.updateMyProfile({
        ...payload,
        day_rate: payload.day_rate ? Number(payload.day_rate) : null,
      }),
    onSuccess: (updated) => {
      setUser({ ...currentUser, full_name: updated.full_name })
      queryClient.invalidateQueries({ queryKey: ['profile', currentUser.id] })
      navigate('/profile')
    },
  })

  return (
    <div>
      <header className="safe-top sticky top-0 z-20 flex items-center gap-2 bg-white/95 px-4 pb-3 pt-4 backdrop-blur">
        <button onClick={() => navigate(-1)} className="flex h-8 w-8 items-center justify-center">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-ink-900">Edit profile</h1>
      </header>

      <form className="flex flex-col gap-4 px-4 pb-8 pt-2" onSubmit={handleSubmit((v) => mutation.mutate(v))}>
        <Input label="Full name" {...register('full_name')} />
        <Textarea label="About me" rows={4} {...register('bio')} />

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink-700">Level</span>
          <select
            className="h-11 w-full rounded-xl border border-ink-200 bg-white px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400/50"
            {...register('level')}
          >
            {USER_LEVELS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </label>

        <Input label="Per-day rate (INR)" type="number" min="0" {...register('day_rate')} />

        <div className="grid grid-cols-2 gap-3">
          <Input label="City" {...register('city')} />
          <Input label="State" {...register('state')} />
        </div>
        <Input label="Country" {...register('country')} />

        <Button type="submit" size="lg" loading={mutation.isPending} className="mt-2">
          Save changes
        </Button>
      </form>
    </div>
  )
}
