export default function CollegeCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 rounded-xl skeleton" />
        <div className="w-14 h-7 rounded-lg skeleton" />
      </div>
      <div className="h-5 rounded skeleton mb-2 w-3/4" />
      <div className="h-4 rounded skeleton mb-4 w-1/2" />
      <div className="border-t border-slate-100 pt-4 flex justify-between">
        <div className="h-8 w-24 rounded skeleton" />
        <div className="h-8 w-16 rounded skeleton" />
      </div>
    </div>
  )
}
