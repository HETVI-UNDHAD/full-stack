'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { Answer } from '@/lib/types'
import { Send, User, Clock, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  questionId: string
  initialAnswers: Answer[]
  userId: string | null
}

export default function AnswerList({ questionId, initialAnswers, userId }: Props) {
  const [answers, setAnswers] = useState<Answer[]>(initialAnswers)
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) { toast.error('Please login to answer'); return }
    if (!content.trim()) return
    setSubmitting(true)

    const { data, error } = await supabase
      .from('answers')
      .insert({ question_id: questionId, content: content.trim(), user_id: userId })
      .select()
      .single()

    if (error) {
      toast.error('Failed to post answer')
    } else {
      setAnswers(prev => [...prev, data as Answer])
      setContent('')
      toast.success('Answer posted!')
    }
    setSubmitting(false)
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-bold text-slate-800">{answers.length} Answer{answers.length !== 1 ? 's' : ''}</h2>
      </div>

      {/* Answer list */}
      {answers.length === 0 ? (
        <div className="bg-slate-50 rounded-2xl p-8 text-center mb-6">
          <MessageCircle className="w-10 h-10 text-slate-200 mx-auto mb-2" />
          <p className="text-slate-400 text-sm">No answers yet. Be the first to answer!</p>
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          {answers.map((answer, i) => (
            <div key={answer.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center">
                  {i + 1}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    {answer.user_id.slice(0, 8)}...
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {timeAgo(answer.created_at)}
                  </div>
                </div>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">{answer.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Post answer form */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h3 className="font-semibold text-slate-700 mb-3 text-sm">Your Answer</h3>
        {userId ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write your answer here..."
              rows={4}
              required
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="flex items-center gap-2 bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-800 transition disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Posting...' : 'Post Answer'}
            </button>
          </form>
        ) : (
          <div className="text-center py-4">
            <p className="text-slate-400 text-sm mb-3">Login to post an answer</p>
            <a href="/login" className="bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-blue-800 transition">
              Login
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
