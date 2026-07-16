export function PortfolioGrid({ media = [] }) {
  if (!media.length) {
    return <p className="py-6 text-center text-sm text-ink-400">No portfolio items yet.</p>
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
      {media.map((item) => (
        <div key={item.id} className="aspect-square overflow-hidden rounded-xl bg-ink-100">
          {item.media_type === 'video' ? (
            <video src={item.url} className="h-full w-full object-cover" muted />
          ) : (
            <img src={item.url} alt={item.caption || 'portfolio'} className="h-full w-full object-cover" />
          )}
        </div>
      ))}
    </div>
  )
}
