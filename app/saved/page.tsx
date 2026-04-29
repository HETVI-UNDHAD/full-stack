'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { College, SavedComparison } from '@/lib/types'
import CollegeCard from '@/components/CollegeCard'
import CollegeCardSkeleton from '@/components/CollegeCardSkeleton'
import { Bookmark, GitCompare, LogIn, Trash2 } from 'lucide-react'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'
import toast from 'react-hot-toast'

export default function SavedPage() {
  const [user, setUser] = useState<User | null>(null)
  const [colleges, setColleges] = useState<College[]>([])
  const [comparisons, setComparisons] = useState<SavedComparison[]>([])
  const [collegeNames, setCollegeNames] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'colleges' | 'comparisons'>('colleges')

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user)
      if (!data.user) { setLoading(false); return }

      const [{ data: saved }, { data: comps }] = await Promise.all([
        supabase.from('saved_colleges').select('colleges(*)').eq('user_id', data.user.id),
        supabase.from('saved_comparisons').select('*').eq('user_id', data.user.id).order('created_at', { ascending: false }),
      ])

      const list = (saved ?? []).map((s: { colleges: unknown }) => s.colleges).filter(Boolean) as College[]
      setColleges(list)

      const compList = (comps ?? []) as SavedComparison[]
      setComparisons(compList)

      // Fetch college names for comparisons
      const allIds = [...new Set(compList.flatMap(c => c.college_ids))]
      if (allIds.length > 0) {
        const { data: names } = await supabase.from('colleges').select('id, name').in('id', allIds)
        const map: Record<string, string> = {}
        ;(names ?? []).forEach((n: { id: string; name: string }) => { map[n.id] = n.name })
        setCollegeNames(map)
      }

      setLoading(false)
    })
  }, [])

  const deleteComparison = async (id: string) => {
    await supabase.from('saved_comparisons').delete().eq('id', id)
    setComparisons(prev => prev.filter(c => c.id !== id))
    toast.success('Comparison deleted')
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="h-8 w-48 rounded skeleton mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => <CollegeCardSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
        <div className="text-center">
          <LogIn className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-700 mb-2">Login Required</h2>
          <p className="text-slate-400 mb-6">Please login to view your saved items</p>
          <Link href="/login" className="bg-blue-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-800 transition">
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Bookmark className="w-7 h-7 text-blue-700" />
        <h1 className="text-3xl font-bold text-slate-800">Saved Items</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('colleges')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
            tab === 'colleges' ? 'bg-blue-700 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          Colleges ({colleges.length})
        </button>
        <button
          onClick={() => setTab('comparisons')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
            tab === 'comparisons' ? 'bg-blue-700 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <GitCompare className="w-4 h-4" />
          Comparisons ({comparisons.length})
        </button>
      </div>

      {/* Saved Colleges */}
      {tab === 'colleges' && (
        colleges.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
            <Bookmark className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No saved colleges yet</h3>
            <p className="text-slate-400 text-sm mb-6">Browse colleges and click Save to add them here</p>
            <Link href="/colleges" className="bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-800 transition">
              Browse Colleges
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {colleges.map(c => <CollegeCard key={c.id} college={c} />)}
          </div>
        )
      )}

      {/* Saved Comparisons */}
      {tab === 'comparisons' && (
        comparisons.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
            <GitCompare className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No saved comparisons yet</h3>
            <p className="text-slate-400 text-sm mb-6">Compare colleges and save the comparison</p>
            <Link href="/compare" className="bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-800 transition">
              Compare Colleges
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {comparisons.map(comp => (
              <div key={comp.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex flex-wrap gap-2">
                    {comp.college_ids.map(cid => (
                      <span key={cid} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
                        {collegeNames[cid] ?? cid.slice(0, 8) + '...'}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/compare?ids=${comp.college_ids.join(',')}`}
                      className="flex items-center gap-1.5 bg-blue-700 text-white px-3 py-2 rounded-xl text-xs font-medium hover:bg-blue-800 transition"
                    >
                      <GitCompare className="w-3.5 h-3.5" />
                      View
                    </Link>
                    <button
                      onClick={() => deleteComparison(comp.id)}
                      className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-2 rounded-xl text-xs font-medium hover:bg-red-100 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-400">{new Date(comp.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}
