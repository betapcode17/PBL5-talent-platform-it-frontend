import axiosInstance from '@/api/axiosInstance'
import type { SeekerInterviewItem, SeekerInterviewsResponse } from '@/@types/seeker'

type GetMyInterviewsParams = {
  role?: 'all' | 'candidate' | 'interviewer'
  status?: 'all' | 'upcoming' | 'completed' | 'cancelled'
  page?: number
  limit?: number
}

type RawInterviewResponse = {
  interviews: Array<{
    id: number
    applicationId: number
    type: string
    schedule: string
    endTime: string
    duration: number
    link?: string | null
    status: string
    reason?: string | null
    feedback?: string | null
    rating?: number | null
    offer?: boolean | null
    application: {
      status: string
      currentStage?: string | null
    }
    job: {
      id: number
      title: string
    }
    company: {
      id: number
      name: string
      email?: string | null
    }
    interviewer: {
      id: number
      fullName?: string | null
      email?: string | null
    }
  }>
  total: number
}

const mapApplicationStatus = (status: string) => {
  const normalizedStatus = status.toUpperCase()

  if (normalizedStatus === 'PASSED' || normalizedStatus === 'HIRED') {
    return 'ACCEPTED'
  }

  if (normalizedStatus === 'FAILED' || normalizedStatus === 'REJECTED') {
    return 'REJECTED'
  }

  return 'PENDING'
}

const mapInterview = (interview: RawInterviewResponse['interviews'][number]): SeekerInterviewItem => ({
  id: interview.id,
  applicationId: interview.applicationId,
  type: interview.type,
  schedule: interview.schedule,
  endTime: interview.endTime,
  duration: interview.duration,
  link: interview.link,
  status: interview.status.toUpperCase(),
  reason: interview.reason,
  feedback: interview.feedback,
  rating: interview.rating,
  offer: interview.offer,
  company: interview.company,
  job: interview.job,
  interviewer: interview.interviewer,
  applicationStatus: mapApplicationStatus(interview.application.status),
  currentStage: interview.application.currentStage
})

export const getMyInterviewsApi = async (params?: GetMyInterviewsParams): Promise<SeekerInterviewsResponse> => {
  const response = await axiosInstance.get<RawInterviewResponse>('/interviews/me', {
    params: {
      role: params?.role ?? 'candidate',
      status: params?.status ?? 'all',
      page: params?.page ?? 1,
      limit: params?.limit ?? 100
    }
  })

  return {
    total: response.data.total,
    interviews: response.data.interviews.map(mapInterview)
  }
}
