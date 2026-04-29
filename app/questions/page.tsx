'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { Question } from '@/lib/types'
import QuestionCard from '@/components/QuestionCard'
import { MessageCircle, Plus, X } from 'lucide-react'
import toast from 'react-hot-toast'
import type { User } from '@supabase/supabase-js'

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('questions')
      .select('*, answers(count)')
      .order('created_at', { ascending: false })

    const mapped = (data ?? []).map((q: Question & { answers: { count: number }[] }) => ({
      ...q,
      answer_count: q.answers?.[0]?.count ?? 0,
    }))
    setQuestions(mapped as Question[])
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) { toast.error('Please login to ask a question'); return }
    setSubmitting(true)

    const { error } = await supabase
      .from('questions')
      .insert({ title: title.trim(), description: description.trim(), user_id: user.id })

    if (error) {
      toast.error('Failed to post question')
    } else {
      toast.success('Question posted!')
      setTitle('')
      setDescription('')
      setShowForm(false)
      fetchQuestions()
    }
    setSubmitting(false)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <MessageCircle className="w-7 h-7 text-blue-700" />
            <h1 className="text-3xl font-bold text-slate-800">Q&A Forum</h1>
          </div>
          <p className="text-slate-500 text-sm">Ask questions, get answers from the community</p>
        </div>
        <button
          onClick={() => { if (!user) { toast.error('Please login first'); return } setShowForm(!showForm) }}
          className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-800 transition"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Ask Question'}
        </button>
      </div>

      {/* Ask form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-slate-700 mb-4">Ask a Question</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="What is your question?"
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Description (optional)</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Add more details..."
                rows={3}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !title.trim()}
              className="bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-800 transition disabled:opacity-60"
            >
              {submitting ? 'Posting...' : 'Post Question'}
            </button>
          </form>
        </div>
      )}

      {/* Questions list */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl skeleton" />
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
          <MessageCircle className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">No questions yet</h3>
          <p className="text-slate-400 text-sm">Be the first to ask a question!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map(q => <QuestionCard key={q.id} question={q} />)}
        </div>
      )}
    </div>
  )
}
