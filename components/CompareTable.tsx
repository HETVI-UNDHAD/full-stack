import { MapPin, IndianRupee, Star, TrendingUp } from 'lucide-react'
import type { College } from '@/lib/types'

interface Props {
  colleges: College[]
}

function getBest(colleges: College[], key: keyof College, higher = true): string {
  if (colleges.length === 0) return ''
  const vals = colleges.map(c => Number(c[key]))
  const best = higher ? Math.max(...vals) : Math.min(...vals)
  return colleges.find(c => Number(c[key]) === best)?.id ?? ''
}

export default function CompareTable({ colleges }: Props) {
  const bestRating = getBest(colleges, 'rating')
  const bestPlacement = getBest(colleges, 'placement_percentage')
  const bestFees = getBest(colleges, 'fees', false)

  const rows = [
    {
      label: 'Location',
      icon: <MapPin className="w-4 h-4 text-slate-400" />,
      render: (c: College) => <span className="text-slate-700">{c.location}</span>,
      bestId: null,
    },
    {
      label: 'Annual Fees',
      icon: <IndianRupee className="w-4 h-4 text-slate-400" />,
      render: (c: College) => <span>₹{c.fees?.toLocaleString('en-IN')}</span>,
      bestId: bestFees,
    },
    {
      label: 'Rating',
      icon: <Star className="w-4 h-4 text-slate-400" />,
      render: (c: College) => (
        <span className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          {c.rating?.toFixed(1)}
        </span>
      ),
      bestId: bestRating,
    },
    {
      label: 'Placement %',
      icon: <TrendingUp className="w-4 h-4 text-slate-400" />,
      render: (c: College) => <span className="text-green-600 font-semibold">{c.placement_percentage}%</span>,
      bestId: bestPlacement,
    },
  ]

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="text-left px-6 py-4 text-slate-500 font-medium w-36">Criteria</th>
            {colleges.map(c => (
              <th key={c.id} className="px-6 py-4 text-center">
                <div className="flex flex-col items-center gap-1">
                  <div className="bg-blue-100 text-blue-700 font-bold w-10 h-10 rounded-xl flex items-center justify-center text-base uppercase">
                    {c.name.charAt(0)}
                  </div>
                  <span className="font-semibold text-slate-800 text-sm leading-tight max-w-[140px]">{c.name}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.label} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
              <td className="px-6 py-4 text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  {row.icon}
                  {row.label}
                </div>
              </td>
              {colleges.map(c => (
                <td
                  key={c.id}
                  className={`px-6 py-4 text-center font-medium ${
                    row.bestId === c.id ? 'bg-green-50 text-green-700' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    {row.render(c)}
                    {row.bestId === c.id && (
                      <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full ml-1">Best</span>
                    )}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
