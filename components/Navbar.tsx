'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { GraduationCap, Menu, X } from 'lucide-react'
import toast from 'react-hot-toast'
import type { User } from '@supabase/supabase-js'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Logged out successfully')
  }

  const links = [
    { href: '/colleges', label: 'Colleges' },
    { href: '/compare', label: 'Compare' },
    { href: '/predictor', label: 'Predictor' },
    { href: '/questions', label: 'Q&A' },
    ...(user ? [{ href: '/saved', label: 'Saved' }] : []),
  ]

  const isActive = (href: string) => pathname === href

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-700">
          <GraduationCap className="w-7 h-7" />
          CollegeFind
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive(l.href)
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="ml-2 flex gap-2">
            {user ? (
              <button onClick={handleLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition">
                Logout
              </button>
            ) : (
              <>
                <Link href="/login" className="text-slate-600 hover:text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition">
                  Login
                </Link>
                <Link href="/signup" className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 flex flex-col gap-3">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className={`font-medium py-1 ${isActive(l.href) ? 'text-blue-700' : 'text-slate-700'}`}
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="text-red-600 font-medium py-1 text-left">
              Logout
            </button>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)} className="text-slate-700 font-medium py-1">Login</Link>
              <Link href="/signup" onClick={() => setMenuOpen(false)} className="text-blue-700 font-medium py-1">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
