import { useQuery } from '@tanstack/react-query'

import type { SeekerApplicationTrackerItem, SeekerInterviewItem, SeekerInterviewsResponse } from '@/@types/seeker'
import { getMyApplicationsApi } from '@/api/applications'
import { getMyInterviewsApi } from '@/api/interviews'

const sortInterviews = (interviews: SeekerInterviewItem[]) =>
  [...interviews].sort((firstInterview, secondInterview) => {
    const firstTime = new Date(firstInterview.schedule).getTime()
    const secondTime = new Date(secondInterview.schedule).getTime()

    return firstTime - secondTime
  })

const getNextInterview = (interviews: SeekerInterviewItem[]) => {
  const now = Date.now()

  return (
    interviews.find((interview) => interview.status === 'SCHEDULED' && new Date(interview.schedule).getTime() >= now) ??
    interviews.find((interview) => interview.status === 'SCHEDULED') ??
    null
  )
}

export const useSeekerApplicationsTracker = () =>
  useQuery({
    queryKey: ['seeker', 'applications-tracker'],
    queryFn: async (): Promise<SeekerApplicationTrackerItem[]> => {
      const [applicationsResponse, interviewsResponse] = await Promise.all([
        getMyApplicationsApi({ page: 1, limit: 100 }),
        getMyInterviewsApi({ role: 'candidate', status: 'all', page: 1, limit: 100 })
      ])

      const interviewsByApplicationId = interviewsResponse.interviews.reduce<Map<number, SeekerInterviewItem[]>>((map, interview) => {
        const currentInterviews = map.get(interview.applicationId) ?? []
        currentInterviews.push(interview)
        map.set(interview.applicationId, currentInterviews)
        return map
      }, new Map())

      return applicationsResponse.applications
        .map((application) => {
          const interviews = sortInterviews(interviewsByApplicationId.get(application.id) ?? [])

          return {
            applicationId: application.id,
            status: application.status.toUpperCase(),
            currentStage: application.currentStage,
            rejectionReason: application.rejectionReason,
            appliedDate: application.appliedDate,
            updatedDate: application.updatedDate,
            coverLetter: application.coverLetter,
            cvUrl: application.cvUrl,
            job: {
              id: application.job.id,
              title: application.job.title || application.job.name,
              salary: application.job.salary,
              workLocation: application.job.workLocation,
              workType: application.job.workType,
              categoryName: application.job.category?.name,
              jobTypeName: application.job.jobType?.job_type,
              company: {
                id: application.job.company.company_id,
                name: application.job.company.company_name,
                image: application.job.company.company_image,
                city: application.job.company.city,
                country: application.job.company.country
              }
            },
            interviews,
            nextInterview: getNextInterview(interviews)
          }
        })
        .sort((firstApplication, secondApplication) => new Date(secondApplication.appliedDate).getTime() - new Date(firstApplication.appliedDate).getTime())
    }
  })

export const useSeekerInterviewsTracker = () =>
  useQuery({
    queryKey: ['seeker', 'interviews-tracker'],
    queryFn: async (): Promise<SeekerInterviewsResponse> => {
      const response = await getMyInterviewsApi({ role: 'candidate', status: 'all', page: 1, limit: 100 })

      const now = Date.now()
      const interviews = [...response.interviews].sort((firstInterview, secondInterview) => {
        const firstTime = new Date(firstInterview.schedule).getTime()
        const secondTime = new Date(secondInterview.schedule).getTime()
        const firstPriority =
          firstInterview.status === 'SCHEDULED' && firstTime >= now ? 0 : firstInterview.status === 'SCHEDULED' ? 1 : 2
        const secondPriority =
          secondInterview.status === 'SCHEDULED' && secondTime >= now ? 0 : secondInterview.status === 'SCHEDULED' ? 1 : 2

        if (firstPriority !== secondPriority) {
          return firstPriority - secondPriority
        }

        if (firstPriority === 2) {
          return secondTime - firstTime
        }

        return firstTime - secondTime
      })

      return {
        total: response.total,
        interviews
      }
    }
  })
