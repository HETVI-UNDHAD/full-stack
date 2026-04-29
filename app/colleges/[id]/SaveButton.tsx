'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SaveButton({ collegeId }: { collegeId: string }) {
  const [saved, setSaved] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      setUserId(data.user.id)
      const { data: row } = await supabase
        .from('saved_colleges')
        .select('id')
        .eq('user_id', data.user.id)
        .eq('college_id', collegeId)
        .maybeSingle()
      setSaved(!!row)
    })
  }, [collegeId])

  const toggle = async () => {
    if (!userId) { toast.error('Please login to save colleges'); return }
    if (saved) {
      await supabase.from('saved_colleges').delete().eq('user_id', userId).eq('college_id', collegeId)
      setSaved(false)
      toast.success('Removed from saved')
    } else {
      await supabase.from('saved_colleges').insert({ user_id: userId, college_id: collegeId })
      setSaved(true)
      toast.success('College saved!')
    }
  }

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition ${
        saved ? 'bg-white text-blue-700' : 'bg-white/20 text-white hover:bg-white/30'
      }`}
    >
      {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
      {saved ? 'Saved' : 'Save College'}
    </button>
  )
}
