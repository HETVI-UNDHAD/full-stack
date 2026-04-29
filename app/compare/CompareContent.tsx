'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import type { College } from '@/lib/types'
import CompareTable from '@/components/CompareTable'
import { GitCompare, X, Plus, Bookmark } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import type { User } from '@supabase/supabase-js'

export default function CompareContent() {
  const searchParams = useSearchParams()
  const [colleges, setColleges] = useState<College[]>([])
  const [allColleges, setAllColleges] = useState<College[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const ids = searchParams.get('ids')?.split(',').filter(Boolean) ?? []
    setSelectedIds(ids)
  }, [searchParams])

  useEffect(() => {
    supabase.from('colleges').select('id, name').order('name').then(({ data }) => {
      setAllColleges((data as College[]) ?? [])
    })
  }, [])

  useEffect(() => {
    if (selectedIds.length === 0) { setColleges([]); setLoading(false); return }
    setLoading(true)
    supabase.from('colleges').select('*').in('id', selectedIds).then(({ data }) => {
      setColleges((data as College[]) ?? [])
      setLoading(false)
    })
  }, [selectedIds])

  const addCollege = (id: string) => {
    if (selectedIds.includes(id) || selectedIds.length >= 3) return
    setSelectedIds(prev => [...prev, id])
  }

  const removeCollege = (id: string) => setSelectedIds(prev => prev.filter(x => x !== id))

  const saveComparison = async () => {
    if (!user) { toast.error('Please login to save comparison'); return }
    if (selectedIds.length < 2) { toast.error('Select at least 2 colleges'); return }
    setSaving(true)
    const { error } = await supabase
      .from('saved_comparisons')
      .insert({ user_id: user.id, college_ids: selectedIds })
    if (error) {
      toast.error('Failed to save comparison')
    } else {
      toast.success('Comparison saved!')
    }
    setSaving(false)
  }

  const available = allColleges.filter(c => !selectedIds.includes(c.id))

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <GitCompare className="w-7 h-7 text-blue-700" />
          <h1 className="text-3xl font-bold text-slate-800">Compare Colleges</h1>
        </div>
        <p className="text-slate-500">Select up to 3 colleges to compare side by side</p>
      </div>

      {/* Selector */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8">
        <div className="flex flex-wrap gap-3 items-center">
          {selectedIds.map(id => {
            const c = allColleges.find(x => x.id === id)
            return c ? (
              <div key={id} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-xl text-sm font-medium">
                {c.name}
                <button onClick={() => removeCollege(id)} className="hover:text-red-500 transition">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : null
          })}

          {selectedIds.length < 3 && (
            <div className="relative">
              <select
                onChange={e => { if (e.target.value) addCollege(e.target.value); e.target.value = '' }}
                className="appearance-none bg-slate-100 text-slate-600 pl-8 pr-4 py-2 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>Add college...</option>
                {available.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <Plus className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            </div>
          )}

          {selectedIds.length === 0 && (
            <p className="text-slate-400 text-sm">No colleges selected. Add colleges above to compare.</p>
          )}

          {selectedIds.length >= 2 && (
            <button
              onClick={saveComparison}
              disabled={saving}
              className="flex items-center gap-1.5 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition disabled:opacity-60 ml-auto"
            >
              <Bookmark className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Comparison'}
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : colleges.length < 2 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
          <GitCompare className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">Select at least 2 colleges</h3>
          <p className="text-slate-400 text-sm mb-6">Use the selector above or browse colleges first</p>
          <Link href="/colleges" className="bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-800 transition">
            Browse Colleges
          </Link>
        </div>
      ) : (
        <CompareTable colleges={colleges} />
      )}
    </div>
  )
}
