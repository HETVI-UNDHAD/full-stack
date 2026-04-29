export interface College {
  id: string
  name: string
  location: string
  fees: number
  rating: number
  placement_percentage: number
  description: string
}

export interface Course {
  id: string
  college_id: string
  course_name: string
  duration: string
}

export interface SavedCollege {
  id: string
  user_id: string
  college_id: string
  colleges?: College
}

export interface SavedComparison {
  id: string
  user_id: string
  college_ids: string[]
  created_at: string
}

export interface Question {
  id: string
  title: string
  description: string
  user_id: string
  created_at: string
  answer_count?: number
}

export interface Answer {
  id: string
  question_id: string
  content: string
  user_id: string
  created_at: string
}

export interface PredictorRule {
  id: string
  exam: string
  min_rank: number
  max_rank: number
  tier: string
}
