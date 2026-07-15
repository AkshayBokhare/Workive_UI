import clsx from 'clsx'
import { X } from 'lucide-react'

export function Chip({ children, active, onClick, onRemove, className }) {
  const isButton = Boolean(onClick)
  const Comp = isButton ? 'button' : 'span'
  return (
    <Comp
      type={isButton ? 'button' : undefined}
      onClick={onClick}
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'border-honey-500 bg-honey-500 text-ink-900'
          : 'border-ink-200 bg-white text-ink-700 hover:border-honey-300',
        className,
      )}
    >
      {children}
      {onRemove && (
        <X
          size={14}
          className="text-ink-400 hover:text-coral-500"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
        />
      )}
    </Comp>
  )
}
