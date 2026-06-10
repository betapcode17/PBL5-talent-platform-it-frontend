import { useEffect, useState, type DependencyList } from 'react'

import type {
  EmployerCandidatesResponse,
  EmployerDashboardResponse,
  EmployerInterviewsResponse,
  EmployerJobsResponse,
  EmployerProfileResponse
} from '@/@types/employer'
import {
  getEmployerCandidatesApi,
  getEmployerDashboardApi,
  getEmployerInterviewsApi,
  getEmployerJobsApi,
  getEmployerProfileApi
} from '@/api/employer'

type AsyncState<T> = {
  data: T | null
  isLoading: boolean
  error: string | null
}

const useAsyncResource = <T,>(loader: () => Promise<T>, deps: DependencyList): AsyncState<T> => {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    isLoading: true,
    error: null
  })

  useEffect(() => {
    let isMounted = true

    const run = async () => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      try {
        const data = await loader()
        if (!isMounted) return
        setState({ data, isLoading: false, error: null })
      } catch (error) {
        if (!isMounted) return
        const message = error instanceof Error ? error.message : 'Unable to load employer data'
        setState({ data: null, isLoading: false, error: message })
      }
    }

    void run()

    return () => {
      isMounted = false
    }
  }, deps)

  return state
}

export const useEmployerProfile = () => useAsyncResource<EmployerProfileResponse>(() => getEmployerProfileApi(), [])

export const useEmployerDashboard = () =>
  useAsyncResource<EmployerDashboardResponse>(() => getEmployerDashboardApi(), [])

export const useEmployerJobs = (page = 1, limit = 10) =>
  useAsyncResource<EmployerJobsResponse>(() => getEmployerJobsApi(page, limit), [page, limit])

export const useEmployerCandidates = (page = 1, limit = 10) =>
  useAsyncResource<EmployerCandidatesResponse>(() => getEmployerCandidatesApi(page, limit), [page, limit])

export const useEmployerInterviews = (page = 1, limit = 10) =>
  useAsyncResource<EmployerInterviewsResponse>(() => getEmployerInterviewsApi(page, limit), [page, limit])
