import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Search as SearchIcon } from 'lucide-react'
import { Chip } from '../components/ui/Chip'
import { Spinner } from '../components/ui/Spinner'
import { EmptyState } from '../components/ui/EmptyState'
import { ProfessionalResultCard } from '../components/search/ProfessionalResultCard'
import * as searchApi from '../api/search'
import * as usersApi from '../api/users'
import { SUGGESTED_WORK_AREAS } from '../lib/constants'

export default function Search() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [workArea, setWorkArea] = useState('')
  const [city, setCity] = useState('')

  const { data: workAreas } = useQuery({ queryKey: ['work-areas'], queryFn: usersApi.getWorkAreas })

  const { data, isLoading, isFetched } = useQuery({
    queryKey: ['search', { q, workArea, city }],
    queryFn: () => searchApi.searchProfessionals({ q: q || undefined, work_area: workArea || undefined, city: city || undefined }),
  })

  const options = workAreas?.length ? workAreas.map((w) => w.name) : SUGGESTED_WORK_AREAS

  return (
    <div>
      <header className="safe-top sticky top-0 z-20 flex items-center gap-2 bg-honey-50/95 px-3 pb-3 pt-4 backdrop-blur">
        <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full">
          <ArrowLeft size={20} />
        </button>
        <div className="flex h-11 flex-1 items-center gap-2 rounded-xl border border-ink-100 bg-white px-3.5 shadow-sm">
          <SearchIcon size={17} className="text-ink-400" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, role, category"
            className="w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none"
          />
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto px-4 pb-1">
        {options.map((name) => (
          <Chip key={name} active={workArea === name} onClick={() => setWorkArea(workArea === name ? '' : name)}>
            {name}
          </Chip>
        ))}
      </div>

      <div className="px-4 pb-2 pt-2">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Filter by city..."
          className="h-9 w-full rounded-lg border border-ink-100 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400/40"
        />
      </div>

      <div className="mt-1">
        {isLoading && <Spinner className="mx-auto my-8" />}
        {isFetched && data?.items?.length === 0 && (
          <EmptyState title="No professionals found" description="Try a different name, role, or city." />
        )}
        {data?.items?.map((professional) => (
          <ProfessionalResultCard key={professional.id} professional={professional} />
        ))}
      </div>
    </div>
  )
}
