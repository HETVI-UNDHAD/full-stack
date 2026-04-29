'use client'

import { SlidersHorizontal } from 'lucide-react'

interface Props {
  locations: string[]
  selectedLocation: string
  onLocationChange: (val: string) => void
  minFees: string
  maxFees: string
  onMinFeesChange: (val: string) => void
  onMaxFeesChange: (val: string) => void
  onReset: () => void
}

export default function FilterPanel({
  locations, selectedLocation, onLocationChange,
  minFees, maxFees, onMinFeesChange, onMaxFeesChange, onReset,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 font-semibold text-slate-700">
          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
          Filters
        </div>
        <button onClick={onReset} className="text-xs text-blue-600 hover:underline">Reset</button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Location</label>
          <select
            value={selectedLocation}
            onChange={e => onLocationChange(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">All Locations</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Fees Range (₹)</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minFees}
              onChange={e => onMinFeesChange(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Max"
              value={maxFees}
              onChange={e => onMaxFeesChange(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
