export type SeekerApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | string

export type SeekerInterviewStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | string

export type SeekerInterviewType = 'video' | 'phone' | 'onsite' | string

export type SeekerInterviewItem = {
  id: number
  applicationId: number
  type: SeekerInterviewType
  schedule: string
  endTime: string
  duration: number
  link?: string | null
  status: SeekerInterviewStatus
  reason?: string | null
  feedback?: string | null
  rating?: number | null
  offer?: boolean | null
  company: {
    id: number
    name: string
    email?: string | null
  }
  job: {
    id: number
    title: string
  }
  interviewer: {
    id: number
    fullName?: string | null
    email?: string | null
  }
  applicationStatus: SeekerApplicationStatus
  currentStage?: string | null
}

export type SeekerApplicationTrackerItem = {
  applicationId: number
  status: SeekerApplicationStatus
  currentStage?: string | null
  rejectionReason?: string | null
  appliedDate: string
  updatedDate: string
  coverLetter?: string | null
  cvUrl?: string | null
  job: {
    id: number
    title: string
    salary?: string | null
    workLocation?: string | null
    workType?: string | null
    categoryName?: string | null
    jobTypeName?: string | null
    company: {
      id: number
      name: string
      image?: string | null
      city?: string | null
      country?: string | null
    }
  }
  interviews: SeekerInterviewItem[]
  nextInterview: SeekerInterviewItem | null
}

export type SeekerInterviewsResponse = {
  interviews: SeekerInterviewItem[]
  total: number
}
