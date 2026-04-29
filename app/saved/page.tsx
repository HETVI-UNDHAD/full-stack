'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { College } from '@/lib/types'
import CollegeCard from '@/components/CollegeCard'
import CollegeCardSkeleton from '@/components/CollegeCardSkeleton'
import { Bookmark, LogIn } from 'lucide-react'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'

export default function SavedPage() {
  const [user, setUser] = useState<User | null>(null)
  const [colleges, setColleges] = useState<College[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user)
      if (!data.user) { setLoading(false); return }

      const { data: saved } = await supabase
        .from('saved_colleges')
        .select('colleges(*)')
        .eq('user_id', data.user.id)

      const list = (saved ?? []).map((s: { colleges: unknown }) => s.colleges).filter(Boolean) as College[]
      setColleges(list)
      setLoading(false)
    })
  }, [])

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
          <p className="text-slate-400 mb-6">Please login to view your saved colleges</p>
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
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Saved Colleges</h1>
          <p className="text-slate-500 text-sm">{colleges.length} college{colleges.length !== 1 ? 's' : ''} saved</p>
        </div>
      </div>

      {colleges.length === 0 ? (
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
      )}
    </div>
  )
}
