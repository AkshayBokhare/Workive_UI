import clsx from 'clsx'

const VARIANTS = {
  primary: 'bg-honey-500 text-ink-900 hover:bg-honey-400 active:bg-honey-600 shadow-sm shadow-honey-500/30',
  secondary: 'bg-ink-900 text-white hover:bg-ink-800 active:bg-ink-700',
  outline: 'border border-ink-200 text-ink-800 hover:bg-ink-50 bg-white',
  ghost: 'text-ink-700 hover:bg-ink-100',
  danger: 'bg-coral-500 text-white hover:bg-coral-600',
}

const SIZES = {
  sm: 'h-8 px-3 text-sm rounded-lg gap-1.5',
  md: 'h-11 px-4 text-sm rounded-xl gap-2',
  lg: 'h-12 px-5 text-base rounded-xl gap-2',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  loading,
  children,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center font-semibold transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        children
      )}
    </button>
  )
}
