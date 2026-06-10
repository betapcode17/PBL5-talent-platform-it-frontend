import axiosInstance from '@/api/axiosInstance'
import { getMeApi } from '@/api/auth'
import type {
  EmployerCandidatesResponse,
  EmployerDashboardResponse,
  EmployerInterviewItem,
  EmployerInterviewsResponse,
  EmployerJobItem,
  EmployerJobsResponse,
  EmployerProfileResponse
} from '@/@types/employer'
import type { CompanyJobsResponse, JobDetailApiResponse } from '@/types/job-detail'

type CategoryNode = {
  id: number
  name: string
  children?: CategoryNode[]
}

type JobTypeItem = {
  id: number
  name: string
}

type JobApplicationsResponse = {
  applications: Array<{
    id: number
    status: string
    currentStage: string | null
    rejectionReason: string | null
    appliedDate: string
    candidate: {
      id: number
      fullName?: string | null
      email?: string
      phone?: string | null
      userImage?: string | null
      githubUrl?: string | null
      linkedinUrl?: string | null
      portfolioUrl?: string | null
    }
  }>
  total: number
  job: {
    id: number
    title: string
  }
}

type MyInterviewsResponse = {
  interviews: Array<{
    id: number
    applicationId: number
    type: string
    schedule: string
    endTime: string
    duration: number
    link?: string | null
    status: string
    feedback?: string | null
    application: {
      status: string
      currentStage?: string | null
    }
    job: {
      id: number
      title: string
    }
    candidate: {
      id: number
      fullName?: string | null
      email?: string
    }
    interviewer: {
      id: number
      fullName?: string | null
    }
  }>
  total: number
}

type CreateJobInput = {
  title: string
  description: string
  categoryId: number
  jobTypeId: number
  companyId: number
  salaryRange: {
    min: number
    max: number
  }
  requirements: string[]
}

type UpdateJobInput = Partial<CreateJobInput>

type CreateInterviewInput = {
  applicationId: number
  type: 'video' | 'phone' | 'onsite'
  schedule: string
  link?: string
  duration: number
}

const flattenCategories = (nodes: CategoryNode[]): JobTypeItem[] =>
  nodes.flatMap((node) => [{ id: node.id, name: node.name }, ...flattenCategories(node.children ?? [])])

const requireEmployerProfile = async (): Promise<EmployerProfileResponse> => {
  const user = await getMeApi()
  const employee = user.employee

  if (!employee) {
    throw new Error('Employee profile is missing from the current account.')
  }

  return {
    employeeId: employee.employee_id,
    role: employee.role,
    joinedDate: employee.joined_date,
    user: {
      user_id: user.id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      user_image: user.user_image
    },
    company: {
      company_id: employee.company.company_id,
      company_name: employee.company.company_name,
      company_email: employee.company.company_email ?? undefined,
      company_image: employee.company.company_image ?? undefined,
      city: employee.company.city ?? undefined,
      company_website_url: employee.company.company_website_url ?? undefined,
      company_industry: employee.company.company_industry ?? undefined,
      company_size: employee.company.company_size ?? undefined
    }
  }
}

const mapJob = async (job: CompanyJobsResponse['jobs'][number]): Promise<EmployerJobItem> => {
  const [detailResult, applicationsResult] = await Promise.allSettled([
    axiosInstance.get<JobDetailApiResponse>(`/jobs/${job.id}`),
    axiosInstance.get<JobApplicationsResponse>(`/applications/job/${job.id}`, {
      params: { limit: 100 }
    })
  ])

  const detail = detailResult.status === 'fulfilled' ? detailResult.value.data : null
  const applications = applicationsResult.status === 'fulfilled' ? applicationsResult.value.data : null

  return {
    id: job.id,
    title: job.title,
    description: detail?.description ?? null,
    requirements: Array.isArray(detail?.requirements) ? detail.requirements.join('\n') : (detail?.requirements ?? null),
    salary: job.salary ?? detail?.salary ?? null,
    workLocation: detail?.workLocation ?? null,
    level: detail?.level ?? null,
    experience: detail?.experience ?? null,
    isActive: job.isActive ?? false,
    createdDate: job.createdDate ?? new Date().toISOString(),
    updatedDate: job.updatedDate ?? job.createdDate ?? new Date().toISOString(),
    applicantCount: applications?.total ?? 0,
    category: job.category,
    jobType: job.jobType
  }
}

const getCompanyJobsWithDetails = async (companyId: number, limit = 20) => {
  const response = await axiosInstance.get<CompanyJobsResponse>(`/jobs/company/${companyId}`, {
    params: { page: 1, limit }
  })

  const jobs = await Promise.all(response.data.jobs.map(mapJob))

  return {
    total: response.data.total,
    jobs
  }
}

const mapInterview = (interview: MyInterviewsResponse['interviews'][number]): EmployerInterviewItem => ({
  id: interview.id,
  round: 1,
  interviewType: interview.type,
  interviewDate: interview.schedule,
  startTime: new Date(interview.schedule).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  endTime: new Date(interview.endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  location: interview.link ?? interview.type,
  status: interview.status.toUpperCase(),
  note: interview.feedback ?? null,
  candidate: {
    id: interview.candidate.id,
    fullName: interview.candidate.fullName ?? undefined,
    email: interview.candidate.email
  },
  interviewer: {
    id: interview.interviewer.id,
    fullName: interview.interviewer.fullName ?? undefined,
    role: 'Interviewer'
  },
  job: interview.job,
  applicationStatus: interview.application.status
})

const getAllCompanyApplications = async (jobs: EmployerJobItem[]) => {
  const responses = await Promise.allSettled(
    jobs.map((job) =>
      axiosInstance.get<JobApplicationsResponse>(`/applications/job/${job.id}`, {
        params: { limit: 100 }
      })
    )
  )

  return responses.flatMap((response) => {
    if (response.status !== 'fulfilled') return []

    const { applications, job } = response.value.data

    return applications.map((application) => ({
      applicationId: application.id,
      appliedAt: application.appliedDate,
      stage: application.currentStage,
      status: application.status,
      rejectionReason: application.rejectionReason,
      seeker: {
        id: application.candidate.id,
        fullName: application.candidate.fullName ?? undefined,
        email: application.candidate.email,
        phone: application.candidate.phone ?? undefined,
        avatar: application.candidate.userImage ?? undefined,
        githubUrl: application.candidate.githubUrl ?? null,
        linkedinUrl: application.candidate.linkedinUrl ?? null,
        portfolioUrl: application.candidate.portfolioUrl ?? null,
        skills: []
      },
      job
    }))
  })
}

export const getEmployerProfileApi = async () => requireEmployerProfile()

export const getEmployerJobsApi = async (_page = 1, limit = 10): Promise<EmployerJobsResponse> => {
  const profile = await requireEmployerProfile()
  return getCompanyJobsWithDetails(profile.company.company_id, limit)
}

export const getEmployerCandidatesApi = async (_page = 1, limit = 100): Promise<EmployerCandidatesResponse> => {
  const profile = await requireEmployerProfile()
  const { jobs } = await getCompanyJobsWithDetails(profile.company.company_id, limit)
  const candidates = await getAllCompanyApplications(jobs)

  return {
    total: candidates.length,
    candidates
  }
}

export const getEmployerInterviewsApi = async (page = 1, limit = 20): Promise<EmployerInterviewsResponse> => {
  const response = await axiosInstance.get<MyInterviewsResponse>('/interviews/me', {
    params: { page, limit, status: 'all' }
  })

  return {
    total: response.data.total,
    interviews: response.data.interviews.map(mapInterview)
  }
}

export const getEmployerDashboardApi = async (): Promise<EmployerDashboardResponse> => {
  const [profile, jobsResponse, interviewsResponse] = await Promise.all([
    requireEmployerProfile(),
    getEmployerJobsApi(1, 8),
    getEmployerInterviewsApi(1, 20)
  ])
  const candidatesResponse = await getEmployerCandidatesApi(1, 100)
  const candidates = candidatesResponse.candidates
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const todayKey = now.toDateString()

  return {
    profile: {
      employeeId: profile.employeeId,
      role: profile.role,
      user: profile.user,
      company: profile.company
    },
    metrics: {
      openJobsCount: jobsResponse.jobs.filter((job) => job.isActive).length,
      totalApplicants: candidates.length,
      activeChatsCount: 0,
      scheduledInterviewsCount: interviewsResponse.interviews.filter((item) => item.status === 'SCHEDULED').length,
      hiredCount: candidates.filter((item) => item.status === 'ACCEPTED').length,
      newCandidatesCount: candidates.filter((item) => new Date(item.appliedAt) >= weekAgo).length
    },
    pipeline: {
      newApplicants: candidates.filter((item) => item.status === 'PENDING').length,
      shortlisted: candidates.filter((item) => item.status === 'ACCEPTED').length,
      interviews: interviewsResponse.interviews.filter((item) => item.status === 'SCHEDULED').length,
      hired: candidates.filter((item) => item.stage === 'HIRED').length,
      rejected: candidates.filter((item) => item.status === 'REJECTED').length
    },
    jobs: jobsResponse.jobs,
    candidates,
    todayInterviews: interviewsResponse.interviews
      .filter((item) => item.interviewDate && new Date(item.interviewDate).toDateString() === todayKey)
      .map((item) => ({
        id: item.id,
        interviewDate: item.interviewDate,
        interviewType: item.interviewType,
        status: item.status,
        candidateName: item.candidate.fullName,
        jobTitle: item.job.title,
        jobId: item.job.id
      }))
  }
}

export const getEmployerCategoryOptionsApi = async () => {
  const response = await axiosInstance.get<{ categories: CategoryNode[] }>('/categories')
  return flattenCategories(response.data.categories)
}

export const getEmployerJobTypeOptionsApi = async () => {
  const response = await axiosInstance.get<{ types: JobTypeItem[] }>('/job-types', {
    params: { active: true }
  })
  return response.data.types
}

export const createEmployerJobApi = async (data: CreateJobInput) => {
  const response = await axiosInstance.post<{ jobId: number }>('/jobs', data)
  return response.data
}

export const updateEmployerJobApi = async (jobId: number, data: UpdateJobInput) => {
  const response = await axiosInstance.put(`/jobs/${jobId}`, data)
  return response.data
}

export const deleteEmployerJobApi = async (jobId: number) => {
  const response = await axiosInstance.delete<{ message: string; jobId: number; rejectedApplications: number }>(`/jobs/${jobId}`)
  return response.data
}

export const createEmployerInterviewApi = async (data: CreateInterviewInput) => {
  const response = await axiosInstance.post<{ interviewId: number }>('/interviews', data)
  return response.data
}

export const acceptEmployerApplicationApi = async (applicationId: number) => {
  const response = await axiosInstance.patch<{ message: string; nextStep?: string }>(`/applications/${applicationId}/accept`)
  return response.data
}

export const rejectEmployerApplicationApi = async (applicationId: number, reason: string) => {
  const response = await axiosInstance.patch<{ message: string }>(`/applications/${applicationId}/reject`, { reason })
  return response.data
}
