'use client'

import Link from 'next/link'
import { MapPin, IndianRupee, Star, Bookmark, BookmarkCheck, GitCompare } from 'lucide-react'
import type { College } from '@/lib/types'
import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface Props {
  college: College
  compareList?: string[]
  onToggleCompare?: (id: string) => void
}

export default function CollegeCard({ college, compareList = [], onToggleCompare }: Props) {
  const [saved, setSaved] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const inCompare = compareList.includes(college.id)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      setUserId(data.user.id)
      const { data: row } = await supabase
        .from('saved_colleges')
        .select('id')
        .eq('user_id', data.user.id)
        .eq('college_id', college.id)
        .maybeSingle()
      setSaved(!!row)
    })
  }, [college.id])

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!userId) { toast.error('Please login to save colleges'); return }
    if (saved) {
      await supabase.from('saved_colleges').delete().eq('user_id', userId).eq('college_id', college.id)
      setSaved(false)
      toast.success('Removed from saved')
    } else {
      await supabase.from('saved_colleges').insert({ user_id: userId, college_id: college.id })
      setSaved(true)
      toast.success('College saved!')
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
      <Link href={`/colleges/${college.id}`} className="block p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="bg-blue-100 text-blue-700 font-bold w-12 h-12 rounded-xl flex items-center justify-center text-lg uppercase">
            {college.name.charAt(0)}
          </div>
          <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded-lg text-sm font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {college.rating?.toFixed(1)}
          </div>
        </div>

        <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-blue-700 transition line-clamp-2">
          {college.name}
        </h3>

        <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
          <MapPin className="w-3.5 h-3.5" />
          {college.location}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Annual Fees</p>
            <div className="flex items-center gap-0.5 font-bold text-slate-800">
              <IndianRupee className="w-3.5 h-3.5" />
              {college.fees?.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 mb-0.5">Placement</p>
            <p className="font-bold text-green-600">{college.placement_percentage}%</p>
          </div>
        </div>
      </Link>

      <div className="px-6 pb-4 flex gap-2">
        <button
          onClick={toggleSave}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition ${
            saved ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
          }`}
        >
          {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          {saved ? 'Saved' : 'Save'}
        </button>
        {onToggleCompare && (
          <button
            onClick={() => onToggleCompare(college.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition ${
              inCompare ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
            }`}
          >
            <GitCompare className="w-4 h-4" />
            {inCompare ? 'Added' : 'Compare'}
          </button>
        )}
      </div>
    </div>
  )
}
