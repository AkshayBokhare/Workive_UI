import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Bell } from 'lucide-react'
import { EmptyState } from '../components/ui/EmptyState'
import { Spinner } from '../components/ui/Spinner'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/layout/PageHeader'
import { NotificationItem } from '../components/notifications/NotificationItem'
import * as notificationsApi from '../api/notifications'

export default function Notifications() {
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
    <div className="mx-auto max-w-2xl px-8 py-8">
      <PageHeader
        title="Notifications"
        backTo="/"
        actions={
          <button onClick={() => markAllMutation.mutate()} className="text-sm font-medium text-honey-600">
            Mark all read
          </button>
        }
      />

      <Card className="overflow-hidden p-0">
        {isLoading ? (
          <Spinner className="mx-auto my-10" />
        ) : data?.items?.length === 0 ? (
          <EmptyState icon={Bell} title="You're all caught up" description="New activity will show up here." />
        ) : (
          <div className="divide-y divide-ink-50">
            {data.items.map((n) => (
              <NotificationItem key={n.id} notification={n} />
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
