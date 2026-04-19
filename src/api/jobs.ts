import axiosInstance from '@/api/axiosInstance'
import type { CompanyJobsResponse, JobDetailApiResponse } from '@/types/job-detail'

type GetCompanyJobsParams = {
  page?: number
  limit?: number
  active?: boolean
}

export const getJobDetail = async (jobId: number, signal?: AbortSignal) => {
  const response = await axiosInstance.get<JobDetailApiResponse>(`/jobs/${jobId}`, {
    signal
  })

  return response.data
}

export const getCompanyJobs = async (companyId: number, params: GetCompanyJobsParams = {}, signal?: AbortSignal) => {
  const response = await axiosInstance.get<CompanyJobsResponse>(`/jobs/company/${companyId}`, {
    params,
    signal
  })

  return response.data
}
