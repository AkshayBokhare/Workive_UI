import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Input, Textarea } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/layout/PageHeader'
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
    <div className="mx-auto max-w-2xl px-8 py-8">
      <PageHeader title="Edit profile" backTo="/profile" />

      <Card className="p-6">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit((v) => mutation.mutate(v))}>
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

          <div className="flex justify-end border-t border-ink-100 pt-5">
            <Button type="submit" size="lg" loading={mutation.isPending}>
              Save changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
