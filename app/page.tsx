import Link from 'next/link'
import { GraduationCap, Search, BookOpen, Star, Brain, MessageCircle, GitCompare, Bookmark } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <GraduationCap className="w-16 h-16 text-blue-200" />
          </div>
          <h1 className="text-5xl font-bold mb-4 leading-tight">Find Your Dream College</h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Explore colleges, predict admissions, compare programs, and connect with the community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/colleges" className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition">
              Browse Colleges
            </Link>
            <Link href="/predictor" className="border-2 border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition">
              Predict My College
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">Everything You Need</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Search,         title: 'College Search',   desc: 'Search and filter colleges by location, fees, and rating.',     href: '/colleges',  color: 'bg-blue-50 text-blue-600' },
            { icon: Brain,          title: 'College Predictor',desc: 'Enter your rank and get matched colleges instantly.',            href: '/predictor', color: 'bg-purple-50 text-purple-600' },
            { icon: GitCompare,     title: 'Compare Colleges', desc: 'Compare up to 3 colleges side by side with key metrics.',       href: '/compare',   color: 'bg-indigo-50 text-indigo-600' },
            { icon: MessageCircle,  title: 'Q&A Forum',        desc: 'Ask questions and get answers from students and experts.',      href: '/questions', color: 'bg-green-50 text-green-600' },
          ].map(({ icon: Icon, title, desc, href, color }) => (
            <Link key={title} href={href}>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition h-full">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-800 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Bookmark className="w-10 h-10 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">Save Your Favourites</h2>
          <p className="text-slate-400 mb-6">Create a free account to save colleges and comparisons for later.</p>
          <Link href="/signup" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  )
}
