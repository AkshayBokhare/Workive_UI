export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      {Icon && (
        <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-honey-100 text-honey-600">
          <Icon size={26} />
        </div>
      )}
      <p className="font-semibold text-ink-800">{title}</p>
      {description && <p className="max-w-xs text-sm text-ink-400">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}
