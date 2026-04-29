'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import type { Question, Answer } from '@/lib/types'
import AnswerList from '@/components/AnswerList'
import { ArrowLeft, Clock, User } from 'lucide-react'
import Link from 'next/link'
import type { User as SupaUser } from '@supabase/supabase-js'

export default function QuestionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [question, setQuestion] = useState<Question | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [user, setUser] = useState<SupaUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    if (!id) return

    Promise.all([
      supabase.from('questions').select('*').eq('id', id).single(),
      supabase.from('answers').select('*').eq('question_id', id).order('created_at', { ascending: true }),
    ]).then(([{ data: q }, { data: a }]) => {
      setQuestion(q as Question)
      setAnswers((a as Answer[]) ?? [])
      setLoading(false)
    })
  }, [id])

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
        <div className="h-8 w-32 rounded skeleton" />
        <div className="h-40 rounded-2xl skeleton" />
        <div className="h-64 rounded-2xl skeleton" />
      </div>
    )
  }

  if (!question) return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-center">
      <p className="text-slate-500">Question not found.</p>
      <Link href="/questions" className="text-blue-700 hover:underline text-sm mt-2 inline-block">← Back to questions</Link>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/questions" className="flex items-center gap-1.5 text-slate-500 hover:text-blue-700 text-sm mb-6 transition">
        <ArrowLeft className="w-4 h-4" />
        Back to Questions
      </Link>

      {/* Question */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <h1 className="text-xl font-bold text-slate-800 mb-3">{question.title}</h1>
        {question.description && (
          <p className="text-slate-600 text-sm leading-relaxed mb-4">{question.description}</p>
        )}
        <div className="flex items-center gap-4 text-xs text-slate-400 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            {question.user_id.slice(0, 8)}...
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {timeAgo(question.created_at)}
          </div>
        </div>
      </div>

      {/* Answers */}
      <AnswerList questionId={question.id} initialAnswers={answers} userId={user?.id ?? null} />
    </div>
  )
}
