'use client'

import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Props {
  value: string
  onChange: (val: string) => void
  placeholder?: string
}

export default function SearchBar({ value, onChange, placeholder = 'Search colleges...' }: Props) {
  const [local, setLocal] = useState(value)

  useEffect(() => {
    const t = setTimeout(() => onChange(local), 400)
    return () => clearTimeout(t)
  }, [local, onChange])

  useEffect(() => { setLocal(value) }, [value])

  return (
    <div className="relative">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type="text"
        value={local}
        onChange={e => setLocal(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      />
    </div>
  )
}
