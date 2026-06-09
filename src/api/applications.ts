import axiosInstance from '@/api/axiosInstance'

export type CreateApplicationRequest = {
  jobId: number
  coverLetter?: string
  cvUrl?: string
}

export type CreateApplicationResponse = {
  appId: number
  status: string
}

export type MyApplicationJobCompany = {
  company_id: number
  company_name: string
  company_image?: string | null
  city?: string | null
  country?: string | null
}

export type MyApplicationItem = {
  id: number
  status: string
  coverLetter?: string | null
  cvUrl?: string | null
  currentStage?: string | null
  rejectionReason?: string | null
  appliedDate: string
  updatedDate: string
  job: {
    id: number
    title: string
    name: string
    description?: string | null
    salary?: string | null
    workLocation?: string | null
    workType?: string | null
    deadline?: string | null
    isActive: boolean
    createdDate: string
    updatedDate: string
    company: MyApplicationJobCompany
    category?: {
      category_id: number
      name: string
    } | null
    jobType?: {
      job_type_id: number
      job_type: string
    } | null
  }
}

export type GetMyApplicationsResponse = {
  applications: MyApplicationItem[]
  total: number
}

export const createApplication = async (data: CreateApplicationRequest) => {
  const response = await axiosInstance.post<CreateApplicationResponse>('/applications', data)

  return response.data
}

export const getMyApplicationsApi = async (params?: {
  status?: string
  page?: number
  limit?: number
}): Promise<GetMyApplicationsResponse> => {
  const response = await axiosInstance.get<GetMyApplicationsResponse>('/applications/me', {
    params: {
      status: params?.status || undefined,
      page: params?.page || 1,
      limit: params?.limit || 100
    }
  })

  return response.data
}
