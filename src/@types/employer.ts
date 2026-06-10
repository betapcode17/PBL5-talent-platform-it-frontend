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
  requirements?: string[] | string | null
  description?: string | null
  numberOfPositions?: number | null
  experienceRequired?: string | null
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
    location?: string | null
    experience?: string | null
    id: number
    fullName?: string
    email?: string
    phone?: string
    avatar?: string
    cvUrl?: string | null
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

export interface EmployerJobApplicationItem {
  id: number
  status: string
  coverLetter?: string | null
  cvUrl?: string | null
  currentStage?: string | null
  rejectionReason?: string | null
  appliedDate: string
  updatedDate: string
  aiScore?: number | null
  aiRecommendation?: string | null
  aiSummary?: string | null
  aiStrengths?: string[]
  aiConcerns?: string[]
  aiScreenedAt?: string | null
  aiScreenedById?: number | null
  aiModel?: string | null
  ruleScore?: number | null
  llmScore?: number | null
  finalScore?: number | null
  screeningMode?: 'fast' | 'deep' | null
  judgeTopN?: number | null
  llmJudgeStatus?: 'success' | 'failed' | 'skipped_fast_mode' | 'skipped_not_top_n' | null
  weights?: Record<string, number>
  weightReasoning?: Record<string, string>
  scoreBreakdown?: Record<
    string,
    {
      score?: number | null
      scorePercent?: number | null
      weight?: number | null
      contribution?: number | null
      weightedScore?: number | null
      candidateValue?: unknown
      requiredValue?: unknown
      maxFit?: unknown
      flags?: string[]
      [key: string]: unknown
    }
  >
  flags?: string[]
  riskFlags?: string[]
  aiRawResult?: Record<string, unknown> | null
  candidate: {
    id: number
    fullName?: string | null
    email?: string | null
    phone?: string | null
    userImage?: string | null
    githubUrl?: string | null
    linkedinUrl?: string | null
    portfolioUrl?: string | null
    defaultCvUrl?: string | null
  }
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

export interface EmployerJobApplicationsResponse {
  applications: EmployerJobApplicationItem[]
  total: number
  job: {
    id: number
    title: string
  }
}

export interface RunAiScreeningInput {
  applicationId?: number
  limit?: number
  force?: boolean
  mode?: 'fast' | 'deep'
  judgeTopN?: number
}

export interface AiScreeningQueuedResponse {
  runId: number
  status: 'PENDING'
  message: string
}

export interface AiScreeningRunResponse {
  runId: number
  jobId: number | null
  applicationId: number | null
  mode: 'fast' | 'deep' | null
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  totalCount: number
  processedCount: number
  successCount: number
  failedCount: number
  progressPercent: number
  startedAt: string | null
  completedAt: string | null
  errorMessage: string | null
  processingRatePerMinute: number
  estimatedRemainingSeconds: number | null
}

export interface EmployerInterviewsResponse {
  total: number
  interviews: EmployerInterviewItem[]
}
