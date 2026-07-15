import { forwardRef } from 'react'
import clsx from 'clsx'

export const Input = forwardRef(function Input({ className, label, error, icon, ...props }, ref) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-medium text-ink-700">{label}</span>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">{icon}</span>}
        <input
          ref={ref}
          className={clsx(
            'h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-ink-900 placeholder:text-ink-300',
            'focus:outline-none focus:ring-2 focus:ring-honey-400/50 focus:border-honey-400',
            icon && 'pl-10',
            error ? 'border-coral-500' : 'border-ink-200',
            className,
          )}
          {...props}
        />
      </div>
      {error && <span className="mt-1 block text-xs text-coral-600">{error}</span>}
    </label>
  )
})

export const Textarea = forwardRef(function Textarea({ className, label, error, ...props }, ref) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-medium text-ink-700">{label}</span>}
      <textarea
        ref={ref}
        className={clsx(
          'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-300',
          'focus:outline-none focus:ring-2 focus:ring-honey-400/50 focus:border-honey-400',
          error ? 'border-coral-500' : 'border-ink-200',
          className,
        )}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-coral-600">{error}</span>}
    </label>
  )
})
