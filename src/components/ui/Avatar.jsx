import clsx from 'clsx'

const SIZES = {
  xs: 'h-7 w-7 text-xs',
  sm: 'h-9 w-9 text-sm',
  md: 'h-12 w-12 text-base',
  lg: 'h-16 w-16 text-lg',
  xl: 'h-24 w-24 text-2xl',
}

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

export function Avatar({ src, name, size = 'md', className, ring = false }) {
  const dimension = SIZES[size]
  return (
    <div
      className={clsx(
        'relative shrink-0 overflow-hidden rounded-full bg-ink-100 flex items-center justify-center font-semibold text-ink-600',
        dimension,
        ring && 'ring-2 ring-white shadow',
        className,
      )}
    >
      {src ? (
        <img src={src} alt={name || 'avatar'} className="h-full w-full object-cover" />
      ) : (
        <span>{initials(name) || '?'}</span>
      )}
    </div>
  )
}
