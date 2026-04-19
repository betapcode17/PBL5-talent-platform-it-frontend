export interface EmployerProfileResponse {
  employeeId: number
  role: string
  joinedDate: string | null
  user: {
    user_id: number
    full_name?: string
    email: string
    phone?: string
    user_image?: string
  }
  company: {
    company_id: number
    company_name: string
    company_email?: string
    company_image?: string
    city?: string
    company_website_url?: string
    company_industry?: string
    company_size?: string
  }
}

export interface EmployerMetricSummary {
  openJobsCount: number
  totalApplicants: number
  activeChatsCount: number
  scheduledInterviewsCount: number
  hiredCount: number
  newCandidatesCount: number
}

export interface EmployerPipelineSummary {
  newApplicants: number
  shortlisted: number
  interviews: number
  hired: number
  rejected: number
}

export interface EmployerJobItem {
  id: number
  title: string
  salary: string | null
  workLocation?: string | null
  level?: string | null
  experience?: string | null
  isActive: boolean
  createdDate: string
  updatedDate: string
  applicantCount: number
  category?: {
    category_id: number
    name: string
  } | null
  jobType?: {
    job_type_id: number
    job_type: string
  } | null
}

export interface EmployerCandidateItem {
  applicationId: number
  appliedAt: string
  stage: string | null
  status: string
  rejectionReason?: string | null
  seeker: {
    id: number
    fullName?: string
    email?: string
    phone?: string
    avatar?: string
    githubUrl?: string | null
    linkedinUrl?: string | null
    portfolioUrl?: string | null
    skills: string[]
  }
  job: {
    id: number
    title: string
  }
  nextInterview?: {
    id: number
    interview_date: string | null
    interview_type?: string | null
    status: string
  } | null
}

export interface EmployerInterviewItem {
  id: number
  round: number
  interviewType?: string | null
  interviewDate?: string | null
  startTime?: string | null
  endTime?: string | null
  location?: string | null
  status: string
  note?: string | null
  candidate: {
    id: number
    fullName?: string
    email?: string
    phone?: string
  }
  interviewer: {
    id: number
    fullName?: string
    role?: string | null
  }
  job: {
    id: number
    title: string
  }
  applicationStatus: string
}

export interface EmployerDashboardResponse {
  profile: {
    employeeId: number
    role: string
    user: EmployerProfileResponse['user']
    company: EmployerProfileResponse['company']
  }
  metrics: EmployerMetricSummary
  pipeline: EmployerPipelineSummary
  jobs: EmployerJobItem[]
  candidates: EmployerCandidateItem[]
  todayInterviews: Array<{
    id: number
    interviewDate?: string | null
    interviewType?: string | null
    status: string
    candidateName?: string
    jobTitle: string
    jobId: number
  }>
}

export interface EmployerJobsResponse {
  total: number
  jobs: EmployerJobItem[]
}

export interface EmployerCandidatesResponse {
  total: number
  candidates: EmployerCandidateItem[]
}

export interface EmployerInterviewsResponse {
  total: number
  interviews: EmployerInterviewItem[]
}
