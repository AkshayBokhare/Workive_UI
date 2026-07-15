import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Bell } from 'lucide-react'
import { EmptyState } from '../components/ui/EmptyState'
import { Spinner } from '../components/ui/Spinner'
import { NotificationItem } from '../components/notifications/NotificationItem'
import * as notificationsApi from '../api/notifications'

export default function Notifications() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.getNotifications(),
  })

  const markAllMutation = useMutation({
    mutationFn: notificationsApi.markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['unread-count'] })
    },
  })

  return (
    <div>
      <header className="safe-top sticky top-0 z-20 flex items-center justify-between bg-white/95 px-4 pb-3 pt-4 backdrop-blur">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="flex h-8 w-8 items-center justify-center">
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-bold text-ink-900">Notifications</h1>
        </div>
        <button onClick={() => markAllMutation.mutate()} className="text-sm font-medium text-honey-600">
          Mark all read
        </button>
      </header>

      {isLoading ? (
        <Spinner className="mx-auto my-10" />
      ) : data?.items?.length === 0 ? (
        <EmptyState icon={Bell} title="You're all caught up" description="New activity will show up here." />
      ) : (
        <div>
          {data.items.map((n) => (
            <NotificationItem key={n.id} notification={n} />
          ))}
        </div>
      )}
    </div>
  )
}
