import axiosInstance from '@/api/axiosInstance'
import type {
  AiScreeningQueuedResponse,
  AiScreeningRunResponse,
  EmployerCandidatesResponse,
  EmployerDashboardResponse,
  EmployerJobApplicationsResponse,
  EmployerInterviewsResponse,
  EmployerJobsResponse,
  EmployerProfileResponse,
  RunAiScreeningInput
} from '@/@types/employer'

type CategoryNode = {
  id: number
  name: string
  children?: CategoryNode[]
}

type JobTypeItem = {
  id: number
  name: string
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

type CreateInterviewInput = {
  applicationId: number
  type: 'video' | 'phone' | 'onsite'
  schedule: string
  link?: string
  duration: number
}

type RescheduleInterviewInput = {
  newDate: string
  newLink?: string
}

const flattenCategories = (nodes: CategoryNode[]): JobTypeItem[] =>
  nodes.flatMap((node) => [{ id: node.id, name: node.name }, ...flattenCategories(node.children ?? [])])

export const getEmployerProfileApi = async () => {
  const response = await axiosInstance.get<EmployerProfileResponse>('/employees/me/profile')
  return response.data
}

export const getEmployerJobsApi = async (_page = 1, limit = 10): Promise<EmployerJobsResponse> => {
  const response = await axiosInstance.get<EmployerJobsResponse>('/employees/me/jobs', {
    params: { page: _page, limit }
  })
  return response.data
}

export const getEmployerCandidatesApi = async (_page = 1, limit = 100): Promise<EmployerCandidatesResponse> => {
  const response = await axiosInstance.get<EmployerCandidatesResponse>('/employees/me/candidates', {
    params: { page: _page, limit }
  })
  return response.data
}

export const getEmployerJobApplicationsApi = async (
  jobPostId: number,
  page = 1,
  limit = 100,
  status?: string
): Promise<EmployerJobApplicationsResponse> => {
  const response = await axiosInstance.get<EmployerJobApplicationsResponse>(`/applications/job/${jobPostId}`, {
    params: {
      page,
      limit,
      ...(status ? { status } : {})
    }
  })
  return response.data
}

export const runEmployerAiScreeningApi = async (
  jobId: number,
  data: RunAiScreeningInput
): Promise<AiScreeningQueuedResponse> => {
  const response = await axiosInstance.post<AiScreeningQueuedResponse>(`/employees/me/jobs/${jobId}/ai-screening`, data)
  return response.data
}

export const getEmployerAiScreeningRunApi = async (runId: number): Promise<AiScreeningRunResponse> => {
  const response = await axiosInstance.get<AiScreeningRunResponse>(`/employees/me/ai-screening-runs/${runId}`)
  return response.data
}

export const getEmployerActiveAiScreeningRunApi = async (jobId?: number): Promise<AiScreeningRunResponse | null> => {
  const response = await axiosInstance.get<AiScreeningRunResponse | null>(
    jobId ? `/employees/me/jobs/${jobId}/ai-screening/active` : '/employees/me/ai-screening-runs/active'
  )
  return response.data
}

export const getEmployerInterviewsApi = async (page = 1, limit = 20): Promise<EmployerInterviewsResponse> => {
  const response = await axiosInstance.get<EmployerInterviewsResponse>('/employees/me/interviews', {
    params: { page, limit }
  })
  return response.data
}

export const getEmployerDashboardApi = async (): Promise<EmployerDashboardResponse> => {
  const response = await axiosInstance.get<EmployerDashboardResponse>('/employees/me/dashboard')
  return response.data
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

export const createEmployerInterviewApi = async (data: CreateInterviewInput) => {
  const response = await axiosInstance.post<{ interviewId: number }>('/interviews', data)
  return response.data
}

export const rescheduleEmployerInterviewApi = async (interviewId: number, data: RescheduleInterviewInput) => {
  const response = await axiosInstance.patch<{ updatedInterview: MyInterviewsResponse['interviews'][number] }>(
    `/interviews/${interviewId}/reschedule`,
    data
  )
  return response.data
}

export const acceptEmployerApplicationApi = async (applicationId: number) => {
  const response = await axiosInstance.patch<{ message: string; nextStep?: string }>(
    `/applications/${applicationId}/accept`
  )
  return response.data
}

export const rejectEmployerApplicationApi = async (applicationId: number, reason: string) => {
  const response = await axiosInstance.patch<{ message: string }>(`/applications/${applicationId}/reject`, { reason })
  return response.data
}
