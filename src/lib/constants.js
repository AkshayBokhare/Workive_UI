export const DURATION_OPTIONS = [
  { value: 'all_day', label: 'All day' },
  { value: '2h', label: '2 hours' },
  { value: '4h', label: '4 hours' },
  { value: '6h', label: '6 hours' },
  { value: '8h', label: '8 hours' },
  { value: 'custom', label: 'Custom' },
]

export const USER_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'professional', label: 'Professional' },
  { value: 'expert', label: 'Expert' },
]

export const ASSIGNMENT_STATUS_STYLES = {
  pending: { label: 'Pending', className: 'bg-honey-100 text-honey-800' },
  approved: { label: 'Approved', className: 'bg-emerald-500/15 text-emerald-600' },
  unapproved: { label: 'Unapproved', className: 'bg-ink-100 text-ink-600' },
  cancelled: { label: 'Cancelled', className: 'bg-coral-500/15 text-coral-600' },
  completed: { label: 'Completed', className: 'bg-ink-600 text-white' },
}

export const AVAILABILITY_STYLES = {
  available: { label: 'Available', className: 'bg-emerald-500/15 text-emerald-600' },
  unavailable: { label: 'Unavailable', className: 'bg-ink-100 text-ink-600' },
  occupied: { label: 'Occupied', className: 'bg-honey-500 text-white' },
}

export const PARTICIPANT_STATUS_STYLES = {
  invited: { label: 'Invited', className: 'bg-ink-100 text-ink-600' },
  accepted: { label: 'Accepted', className: 'bg-emerald-500/15 text-emerald-600' },
  declined: { label: 'Declined', className: 'bg-coral-500/15 text-coral-600' },
}

export const SUGGESTED_WORK_AREAS = [
  'Portfolio Shoot',
  'Boudoir Photography',
  'Post Wedding',
  'Candid Photography',
  'Drone Photography',
  'Cinematic Videography',
  'Photo Editing',
  'Video Editing',
]
