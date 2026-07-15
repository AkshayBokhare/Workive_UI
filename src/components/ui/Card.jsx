import clsx from 'clsx'

export function Card({ children, className, ...props }) {
  return (
    <div
      className={clsx('rounded-2xl border border-ink-100 bg-white shadow-sm shadow-ink-900/5', className)}
      {...props}
    >
      {children}
    </div>
  )
}
