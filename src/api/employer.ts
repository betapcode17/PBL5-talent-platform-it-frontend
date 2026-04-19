import {
  mockEmployerCandidates,
  mockEmployerDashboard,
  mockEmployerInterviews,
  mockEmployerJobs,
  mockEmployerProfile
} from './mockEmployerData'
import type {
  EmployerCandidatesResponse,
  EmployerDashboardResponse,
  EmployerInterviewsResponse,
  EmployerJobsResponse,
  EmployerProfileResponse
} from '@/@types/employer'

// Using mock data for demonstration - ready to switch to API calls
export const getEmployerProfileApi = async (): Promise<EmployerProfileResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockEmployerProfile
}

export const getEmployerDashboardApi = async (): Promise<EmployerDashboardResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockEmployerDashboard
}

export const getEmployerJobsApi = async (page = 1, limit = 10): Promise<EmployerJobsResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return {
    total: mockEmployerJobs.total,
    jobs: mockEmployerJobs.jobs.slice((page - 1) * limit, page * limit)
  }
}

export const getEmployerCandidatesApi = async (page = 1, limit = 10): Promise<EmployerCandidatesResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return {
    total: mockEmployerCandidates.total,
    candidates: mockEmployerCandidates.candidates.slice((page - 1) * limit, page * limit)
  }
}

export const getEmployerInterviewsApi = async (page = 1, limit = 10): Promise<EmployerInterviewsResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return {
    total: mockEmployerInterviews.total,
    interviews: mockEmployerInterviews.interviews.slice((page - 1) * limit, page * limit)
  }
}
