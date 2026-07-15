import clsx from 'clsx'

export function MessageBubble({ message, isMine }) {
  return (
    <div className={clsx('flex', isMine ? 'justify-end' : 'justify-start')}>
      <div
        className={clsx(
          'max-w-[75%] rounded-2xl px-3.5 py-2 text-sm',
          isMine ? 'rounded-br-sm bg-honey-500 text-ink-900' : 'rounded-bl-sm bg-white text-ink-800 shadow-sm',
        )}
      >
        {message.attachment_url &&
          (message.attachment_type === 'video' ? (
            <video src={message.attachment_url} controls className="mb-1 max-h-64 rounded-lg" />
          ) : (
            <img src={message.attachment_url} alt="attachment" className="mb-1 max-h-64 rounded-lg" />
          ))}
        {message.body && <p className="whitespace-pre-wrap">{message.body}</p>}
        <p className={clsx('mt-1 text-[10px]', isMine ? 'text-ink-900/60' : 'text-ink-400')}>
          {new Date(message.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
        </p>
      </div>
    </div>
  )
}
