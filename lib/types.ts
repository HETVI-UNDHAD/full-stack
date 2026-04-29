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
