'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { College } from '@/lib/types'
import { Brain, Search, MapPin, Star, IndianRupee } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

const EXAMS = ['JEE Main', 'JEE Advanced', 'NEET', 'CAT', 'GATE']

const RULES: Record<string, { min: number; max: number; minRating: number }[]> = {
  'JEE Main':     [{ min: 0, max: 1000, minRating: 4.7 }, { min: 1001, max: 10000, minRating: 4.0 }, { min: 10001, max: 999999, minRating: 0 }],
  'JEE Advanced': [{ min: 0, max: 500,  minRating: 4.8 }, { min: 501,  max: 5000,  minRating: 4.3 }, { min: 5001,  max: 999999, minRating: 0 }],
  'NEET':         [{ min: 0, max: 100,  minRating: 4.5 }, { min: 101,  max: 5000,  minRating: 4.0 }, { min: 5001,  max: 999999, minRating: 0 }],
  'CAT':          [{ min: 0, max: 500,  minRating: 4.5 }, { min: 501,  max: 3000,  minRating: 3.8 }, { min: 3001,  max: 999999, minRating: 0 }],
  'GATE':         [{ min: 0, max: 200,  minRating: 4.6 }, { min: 201,  max: 2000,  minRating: 4.0 }, { min: 2001,  max: 999999, minRating: 0 }],
}

const TIER_LABELS: Record<number, string> = { 0: 'Top Colleges', 1: 'Mid-Tier Colleges', 2: 'Other Colleges' }

export default function PredictorForm() {
  const [exam, setExam] = useState('')
  const [rank, setRank] = useState('')
  const [results, setResults] = useState<College[]>([])
  const [tierLabel, setTierLabel] = useState('')
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!exam || !rank) { toast.error('Please select exam and enter rank'); return }

    setLoading(true)
    setSearched(true)

    const rules = RULES[exam] ?? RULES['JEE Main']
    const rankNum = Number(rank)
    let tierIndex = 2
    let minRating = 0

    for (let i = 0; i < rules.length; i++) {
      if (rankNum >= rules[i].min && rankNum <= rules[i].max) {
        tierIndex = i
        minRating = rules[i].minRating
        break
      }
    }

    setTierLabel(TIER_LABELS[tierIndex])

    let query = supabase.from('colleges').select('*').order('rating', { ascending: false })
    if (minRating > 0) query = query.gte('rating', minRating)
    else query = query.lt('rating', 4.0)

    const { data, error } = await query.limit(6)
    if (error) { toast.error('Failed to fetch results'); setLoading(false); return }
    setResults((data as College[]) ?? [])
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-3">
          <div className="bg-purple-100 w-14 h-14 rounded-2xl flex items-center justify-center">
            <Brain className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">College Predictor</h1>
        <p className="text-slate-500">Enter your exam and rank to find matching colleges</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8">
        <form onSubmit={handlePredict} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Select Exam</label>
            <select
              value={exam}
              onChange={e => setExam(e.target.value)}
              required
              className="w-full border border-slate-200 rounded-xl px-3 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="">Choose exam...</option>
              {EXAMS.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Your Rank</label>
            <input
              type="number"
              min={1}
              value={rank}
              onChange={e => setRank(e.target.value)}
              placeholder="e.g. 5000"
              required
              className="w-full border border-slate-200 rounded-xl px-3 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-60"
            >
              <Search className="w-4 h-4" />
              {loading ? 'Predicting...' : 'Predict'}
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl skeleton" />
          ))}
        </div>
      )}

      {!loading && searched && (
        <>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">{tierLabel}</span>
            <span className="text-slate-500 text-sm">{results.length} colleges found for {exam} rank {rank}</span>
          </div>

          {results.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
              <Brain className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500">No colleges found for this rank range.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map(college => (
                <Link key={college.id} href={`/colleges/${college.id}`}>
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md hover:border-purple-200 transition">
                    <div className="flex items-start justify-between mb-3">
                      <div className="bg-purple-100 text-purple-700 font-bold w-10 h-10 rounded-xl flex items-center justify-center uppercase">
                        {college.name.charAt(0)}
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded-lg text-xs font-semibold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {college.rating?.toFixed(1)}
                      </div>
                    </div>
                    <h3 className="font-bold text-slate-800 mb-1 text-sm line-clamp-2">{college.name}</h3>
                    <div className="flex items-center gap-1 text-slate-400 text-xs mb-3">
                      <MapPin className="w-3 h-3" />
                      {college.location}
                    </div>
                    <div className="flex justify-between pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-0.5 text-slate-700 text-xs font-semibold">
                        <IndianRupee className="w-3 h-3" />
                        {college.fees?.toLocaleString('en-IN')}
                      </div>
                      <span className="text-green-600 text-xs font-semibold">{college.placement_percentage}% placement</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
