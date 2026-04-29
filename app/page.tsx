import Link from 'next/link'
import { GraduationCap, Search, BookOpen, Star } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <GraduationCap className="w-16 h-16 text-blue-200" />
          </div>
          <h1 className="text-5xl font-bold mb-4 leading-tight">
            Find Your Dream College
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Explore thousands of colleges, compare programs, and make the right choice for your future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/colleges"
              className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition"
            >
              Browse Colleges
            </Link>
            <Link
              href="/compare"
              className="border-2 border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition"
            >
              Compare Colleges
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
          Everything You Need to Decide
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Search, title: 'Smart Search', desc: 'Search colleges by name, location, fees and more with instant results.' },
            { icon: BookOpen, title: 'Course Details', desc: 'Explore all courses offered by each college with duration and eligibility.' },
            { icon: Star, title: 'Compare & Save', desc: 'Compare up to 3 colleges side-by-side and save your favourites.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition">
              <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
