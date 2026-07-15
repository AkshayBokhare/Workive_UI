import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { Home, MessageCircle, Plus, CalendarDays, User } from 'lucide-react'
import { useState } from 'react'
import { CreateSheet } from './CreateSheet'

const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Home', end: true },
  { to: '/chats', icon: MessageCircle, label: 'Chats' },
  { to: '/assignments', icon: CalendarDays, label: 'Assignments' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export function AppShell() {
  const [createOpen, setCreateOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col bg-honey-50">
      <main className="flex-1 pb-24">
        <Outlet />
      </main>

      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-lg border-t border-ink-100 bg-white/95 backdrop-blur">
        <div className="flex items-center justify-between px-2 py-2">
          {NAV_ITEMS.slice(0, 2).map((item) => (
            <NavItem key={item.to} {...item} />
          ))}

          <button
            onClick={() => setCreateOpen(true)}
            className="flex h-12 w-12 -translate-y-3 items-center justify-center rounded-2xl bg-honey-500 text-ink-900 shadow-lg shadow-honey-500/40 active:scale-95 transition-transform"
            aria-label="Create"
          >
            <Plus size={24} strokeWidth={2.5} />
          </button>

          {NAV_ITEMS.slice(2).map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </div>
      </nav>

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
          'flex flex-1 flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[11px] font-medium transition-colors',
          isActive ? 'text-honey-600' : 'text-ink-400 hover:text-ink-600',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={22} strokeWidth={isActive ? 2.4 : 2} />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  )
}
