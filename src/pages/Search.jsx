import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search as SearchIcon } from 'lucide-react'
import { Chip } from '../components/ui/Chip'
import { Spinner } from '../components/ui/Spinner'
import { EmptyState } from '../components/ui/EmptyState'
import { Card } from '../components/ui/Card'
import { ProfessionalResultCard } from '../components/search/ProfessionalResultCard'
import * as searchApi from '../api/search'
import * as usersApi from '../api/users'
import { SUGGESTED_WORK_AREAS } from '../lib/constants'

export default function Search() {
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
    <div className="w-full px-10 py-8">
      <h1 className="mb-6 text-xl font-extrabold text-ink-900">Find professionals</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <Card className="h-fit p-5">
          <div className="flex h-10 items-center gap-2 rounded-xl border border-ink-100 bg-honey-50/60 px-3">
            <SearchIcon size={16} className="text-ink-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Name, role, category"
              className="w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none"
            />
          </div>

          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Filter by city..."
            className="mt-3 h-10 w-full rounded-xl border border-ink-100 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400/40"
          />

          <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wide text-ink-400">Work areas</p>
          <div className="flex flex-wrap gap-2">
            {options.map((name) => (
              <Chip key={name} active={workArea === name} onClick={() => setWorkArea(workArea === name ? '' : name)}>
                {name}
              </Chip>
            ))}
          </div>
        </Card>

        <Card className="min-w-0 overflow-hidden p-0">
          {isLoading ? (
            <Spinner className="mx-auto my-10" />
          ) : isFetched && data?.items?.length === 0 ? (
            <EmptyState title="No professionals found" description="Try a different name, role, or city." />
          ) : (
            <div className="divide-y divide-ink-50">
              {data?.items?.map((professional) => (
                <ProfessionalResultCard key={professional.id} professional={professional} />
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
