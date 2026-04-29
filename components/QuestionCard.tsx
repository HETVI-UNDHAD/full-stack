import Link from 'next/link'
import { MessageCircle, Clock, User } from 'lucide-react'
import type { Question } from '@/lib/types'

interface Props {
  question: Question
}

export default function QuestionCard({ question }: Props) {
  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  return (
    <Link href={`/questions/${question.id}`}>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md hover:border-blue-200 transition group">
        <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-blue-700 transition line-clamp-2">
          {question.title}
        </h3>
        {question.description && (
          <p className="text-slate-500 text-sm line-clamp-2 mb-4">{question.description}</p>
        )}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {question.user_id.slice(0, 8)}...
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {timeAgo(question.created_at)}
            </div>
          </div>
          <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded-lg font-medium">
            <MessageCircle className="w-3.5 h-3.5" />
            {question.answer_count ?? 0} answers
          </div>
        </div>
      </div>
    </Link>
  )
}
