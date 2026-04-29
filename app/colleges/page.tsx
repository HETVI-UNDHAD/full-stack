'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { College } from '@/lib/types'
import CollegeCard from '@/components/CollegeCard'
import SearchBar from '@/components/SearchBar'
import FilterPanel from '@/components/FilterPanel'
import CollegeCardSkeleton from '@/components/CollegeCardSkeleton'
import { ChevronLeft, ChevronRight, GitCompare, School } from 'lucide-react'
import Link from 'next/link'

const PAGE_SIZE = 10

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([])
  const [locations, setLocations] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)

  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [minFees, setMinFees] = useState('')
  const [maxFees, setMaxFees] = useState('')
  const [compareList, setCompareList] = useState<string[]>([])

  // Fetch distinct locations once
  useEffect(() => {
    supabase.from('colleges').select('location').then(({ data }) => {
      if (data) {
        const unique = [...new Set(data.map(d => d.location))].filter(Boolean).sort()
        setLocations(unique)
      }
    })
  }, [])

  const fetchColleges = useCallback(async () => {
    setLoading(true)
    let query = supabase.from('colleges').select('*', { count: 'exact' })

    if (search) query = query.ilike('name', `%${search}%`)
    if (location) query = query.eq('location', location)
    if (minFees) query = query.gte('fees', Number(minFees))
    if (maxFees) query = query.lte('fees', Number(maxFees))

    query = query.range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1).order('rating', { ascending: false })

    const { data, count } = await query
    setColleges(data ?? [])
    setTotal(count ?? 0)
    setLoading(false)
  }, [search, location, minFees, maxFees, page])

  useEffect(() => { fetchColleges() }, [fetchColleges])

  // Reset page on filter change
  useEffect(() => { setPage(0) }, [search, location, minFees, maxFees])

  const toggleCompare = (id: string) => {
    setCompareList(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev
    )
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-1">Explore Colleges</h1>
        <p className="text-slate-500">{total} colleges found</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-72 shrink-0 space-y-4">
          <SearchBar value={search} onChange={setSearch} />
          <FilterPanel
            locations={locations}
            selectedLocation={location}
            onLocationChange={setLocation}
            minFees={minFees}
            maxFees={maxFees}
            onMinFeesChange={setMinFees}
            onMaxFeesChange={setMaxFees}
            onReset={() => { setSearch(''); setLocation(''); setMinFees(''); setMaxFees('') }}
          />

          {compareList.length > 0 && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
              <p className="text-sm font-semibold text-indigo-700 mb-3">
                Compare ({compareList.length}/3)
              </p>
              <Link
                href={`/compare?ids=${compareList.join(',')}`}
                className="flex items-center justify-center gap-2 bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-800 transition w-full"
              >
                <GitCompare className="w-4 h-4" />
                Compare Now
              </Link>
            </div>
          )}
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <CollegeCardSkeleton key={i} />)}
            </div>
          ) : colleges.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <School className="w-16 h-16 text-slate-200 mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No colleges found</h3>
              <p className="text-slate-400 text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {colleges.map(c => (
                  <CollegeCard key={c.id} college={c} compareList={compareList} onToggleCompare={toggleCompare} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`w-9 h-9 rounded-xl text-sm font-medium transition ${
                        page === i ? 'bg-blue-700 text-white' : 'border border-slate-200 hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page === totalPages - 1}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
