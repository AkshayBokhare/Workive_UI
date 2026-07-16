import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { useQuery } from '@tanstack/react-query'
import { Home, MessageCircle, CalendarDays, User, Search, Plus, Bell, LogOut } from 'lucide-react'
import { useState } from 'react'
import { CreateSheet } from './CreateSheet'
import { Avatar } from '../ui/Avatar'
import { useAuthStore } from '../../store/authStore'
import { useLogout } from '../../hooks/useAuth'
import * as notificationsApi from '../../api/notifications'

const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Home', end: true },
  { to: '/chats', icon: MessageCircle, label: 'Chats' },
  { to: '/assignments', icon: CalendarDays, label: 'Assignments' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export function AppShell() {
  const [createOpen, setCreateOpen] = useState(false)
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()

  const { data: unread } = useQuery({
    queryKey: ['unread-count'],
    queryFn: notificationsApi.getUnreadCount,
    refetchInterval: 30_000,
  })

  return (
    <div className="flex h-screen w-full bg-honey-50/40">
      <aside className="flex w-64 shrink-0 flex-col border-r border-ink-100 bg-white">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-900 text-lg font-black text-honey-400">
            W
          </div>
          <span className="text-lg font-extrabold text-ink-900">Workive</span>
        </div>

        <div className="px-3">
          <Link
            to="/search"
            className="flex h-10 items-center gap-2 rounded-xl border border-ink-100 bg-honey-50/60 px-3 text-sm text-ink-400 transition-colors hover:border-ink-200"
          >
            <Search size={16} />
            Search
          </Link>
        </div>

        <nav className="mt-5 flex flex-col gap-1 px-3">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>

        <div className="px-3 pt-4">
          <button
            onClick={() => setCreateOpen(true)}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-honey-500 text-sm font-semibold text-ink-900 shadow-sm shadow-honey-500/30 transition-colors hover:bg-honey-400"
          >
            <Plus size={17} strokeWidth={2.5} />
            Create
          </button>
        </div>

        <div className="flex-1" />

        <div className="border-t border-ink-100 p-3">
          <Link
            to="/notifications"
            className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-50"
          >
            <span className="relative flex h-6 w-6 items-center justify-center">
              <Bell size={18} />
              {unread?.unread_count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-coral-500 text-[9px] font-bold text-white">
                  {unread.unread_count > 9 ? '9+' : unread.unread_count}
                </span>
              )}
            </span>
            Notifications
          </Link>

          <div className="mt-1 flex items-center gap-2 rounded-xl px-2 py-2">
            <Link to="/profile" className="flex min-w-0 flex-1 items-center gap-2.5">
              <Avatar src={user?.avatar_url} name={user?.full_name} size="sm" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink-900">{user?.full_name}</p>
                <p className="truncate text-xs text-ink-400">{user?.city || 'Set your location'}</p>
              </div>
            </Link>
            <button
              onClick={() => logout()}
              aria-label="Log out"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-400 transition-colors hover:bg-ink-50 hover:text-coral-500"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      <CreateSheet
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onChoosePost={() => {
          setCreateOpen(false)
          navigate('/posts/new')
        }}
        onChooseAssignment={() => {
          setCreateOpen(false)
          navigate('/assignments/new')
        }}
      />
    </div>
  )
}

function NavItem({ to, icon: Icon, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        clsx(
          'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
          isActive ? 'bg-honey-100 text-honey-800' : 'text-ink-600 hover:bg-ink-50',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={18} strokeWidth={isActive ? 2.4 : 2} />
          {label}
        </>
      )}
    </NavLink>
  )
}
