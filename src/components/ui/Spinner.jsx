import clsx from 'clsx'

export function Spinner({ className, size = 20 }) {
  return (
    <span
      className={clsx('block animate-spin rounded-full border-2 border-ink-200 border-t-honey-500', className)}
      style={{ width: size, height: size }}
    />
  )
}

export function FullPageSpinner() {
  return (
    <div className="flex h-full min-h-[50vh] w-full items-center justify-center">
      <Spinner size={28} />
    </div>
  )
}
