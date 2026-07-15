import { ImagePlus, CalendarPlus } from 'lucide-react'
import { Sheet } from '../ui/Sheet'

export function CreateSheet({ open, onClose, onChoosePost, onChooseAssignment }) {
  return (
    <Sheet open={open} onClose={onClose} title="Create">
      <div className="flex flex-col gap-3">
        <button
          onClick={onChoosePost}
          className="flex items-center gap-3 rounded-2xl border border-ink-100 bg-honey-50 p-4 text-left transition-colors hover:border-honey-300"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-honey-500 text-ink-900">
            <ImagePlus size={20} />
          </span>
          <span>
            <span className="block font-semibold text-ink-900">Post</span>
            <span className="block text-sm text-ink-400">Share a photo or video</span>
          </span>
        </button>

        <button
          onClick={onChooseAssignment}
          className="flex items-center gap-3 rounded-2xl border border-ink-100 bg-ink-50 p-4 text-left transition-colors hover:border-ink-300"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink-900 text-white">
            <CalendarPlus size={20} />
          </span>
          <span>
            <span className="block font-semibold text-ink-900">Assignment</span>
            <span className="block text-sm text-ink-400">Book a team for a gig</span>
          </span>
        </button>
      </div>
    </Sheet>
  )
}
