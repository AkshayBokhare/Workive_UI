import clsx from 'clsx'
import { DURATION_OPTIONS } from '../../lib/constants'

export function DurationPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {DURATION_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={clsx(
            'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
            value === opt.value ? 'border-honey-500 bg-honey-500 text-ink-900' : 'border-ink-200 text-ink-600',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
