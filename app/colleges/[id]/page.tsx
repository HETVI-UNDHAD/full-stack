'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { notFound } from 'next/navigation'
import { MapPin, IndianRupee, Star, TrendingUp, BookOpen, Clock, MessageSquare } from 'lucide-react'
import type { College, Course } from '@/lib/types'
import SaveButton from './SaveButton'

const mockReviews = [
  { name: 'Rahul S.', rating: 4, text: 'Great faculty and excellent placement support. Campus life is vibrant.', date: '2 months ago' },
  { name: 'Priya M.', rating: 5, text: 'Best decision of my life. Infrastructure is world-class.', date: '4 months ago' },
  { name: 'Arjun K.', rating: 3, text: 'Good college overall. Fees are a bit high but worth it.', date: '6 months ago' },
]

export default function CollegeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [college, setCollege] = useState<College | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    Promise.all([
      supabase.from('colleges').select('*').eq('id', id).single<College>(),
      supabase.from('courses').select('*').eq('college_id', id),
    ]).then(([{ data: col }, { data: crs }]) => {
      if (!col) { notFound(); return }
      setCollege(col)
      setCourses((crs as Course[]) ?? [])
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <div className="h-56 rounded-3xl skeleton" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-40 rounded-2xl skeleton" />
            <div className="h-64 rounded-2xl skeleton" />
          </div>
          <div className="space-y-6">
            <div className="h-48 rounded-2xl skeleton" />
            <div className="h-40 rounded-2xl skeleton" />
          </div>
        </div>
      </div>
    )
  }

  if (!college) return null

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Hero Card */}
      <div className="bg-gradient-to-br from-blue-700 to-indigo-700 rounded-3xl p-8 text-white mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="bg-white/20 backdrop-blur w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold uppercase">
              {college.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{college.name}</h1>
              <div className="flex items-center gap-1.5 text-blue-100">
                <MapPin className="w-4 h-4" />
                {college.location}
              </div>
            </div>
          </div>
          <SaveButton collegeId={college.id} />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-white/10 rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-300 font-bold text-xl mb-1">
              <Star className="w-5 h-5 fill-amber-300" />
              {college.rating?.toFixed(1)}
            </div>
            <p className="text-blue-100 text-xs">Rating</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center gap-0.5 font-bold text-xl mb-1">
              <IndianRupee className="w-4 h-4" />
              {(college.fees / 100000).toFixed(1)}L
            </div>
            <p className="text-blue-100 text-xs">Annual Fees</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 text-center">
            <div className="font-bold text-xl text-green-300 mb-1">{college.placement_percentage}%</div>
            <p className="text-blue-100 text-xs">Placement</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          {college.description && (
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-3">About</h2>
              <p className="text-slate-600 leading-relaxed text-sm">{college.description}</p>
            </section>
          )}

          {/* Courses */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-800">Courses Offered</h2>
            </div>
            {courses.length > 0 ? (
              <div className="space-y-3">
                {courses.map(course => (
                  <div key={course.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="font-medium text-slate-700 text-sm">{course.course_name}</span>
                    <div className="flex items-center gap-1 text-slate-400 text-xs">
                      <Clock className="w-3.5 h-3.5" />
                      {course.duration}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm">No courses listed yet.</p>
            )}
          </section>

          {/* Reviews */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-800">Student Reviews</h2>
            </div>
            <div className="space-y-4">
              {mockReviews.map((r, i) => (
                <div key={i} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center">
                        {r.name.charAt(0)}
                      </div>
                      <span className="font-medium text-slate-700 text-sm">{r.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`w-3.5 h-3.5 ${j < r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm">{r.text}</p>
                  <p className="text-slate-300 text-xs mt-1">{r.date}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-bold text-slate-800">Placements</h2>
            </div>
            <div className="text-center py-4">
              <div className="text-5xl font-bold text-green-600 mb-1">{college.placement_percentage}%</div>
              <p className="text-slate-400 text-sm">Placement Rate</p>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 mt-4">
              <div
                className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all"
                style={{ width: `${college.placement_percentage}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-800">Quick Info</h2>
            {[
              { label: 'Location', value: college.location },
              { label: 'Annual Fees', value: `₹${college.fees?.toLocaleString('en-IN')}` },
              { label: 'Rating', value: `${college.rating?.toFixed(1)} / 5.0` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-slate-400">{label}</span>
                <span className="font-medium text-slate-700">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
