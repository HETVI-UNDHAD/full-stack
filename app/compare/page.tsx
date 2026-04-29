import { Suspense } from 'react'
import CompareContent from './CompareContent'

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="h-10 w-64 rounded skeleton mb-8" />
        <div className="h-24 rounded-2xl skeleton mb-8" />
        <div className="h-64 rounded-2xl skeleton" />
      </div>
    }>
      <CompareContent />
    </Suspense>
  )
}
