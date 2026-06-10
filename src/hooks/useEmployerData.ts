import { useCallback, useEffect, useState } from 'react'

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

type ResourceCacheEntry<T> = {
  data?: T
  promise?: Promise<T>
  updatedAt: number
}

const resourceCache = new Map<string, ResourceCacheEntry<unknown>>()
const CACHE_TTL_MS = 30_000

const useAsyncResource = <T>(loader: () => Promise<T>, cacheKey: string): AsyncState<T> => {
  const cached = resourceCache.get(cacheKey) as ResourceCacheEntry<T> | undefined
  const [state, setState] = useState<AsyncState<T>>({
    data: cached?.data ?? null,
    isLoading: !cached?.data,
    error: null
  })

  useEffect(() => {
    let isMounted = true
    const cachedEntry = resourceCache.get(cacheKey) as ResourceCacheEntry<T> | undefined
    const hasFreshCache = cachedEntry?.data && Date.now() - cachedEntry.updatedAt < CACHE_TTL_MS

    const run = async () => {
      if (hasFreshCache) {
        setState({ data: cachedEntry.data as T, isLoading: false, error: null })
        return
      }

      setState((prev) => ({ ...prev, isLoading: !prev.data, error: null }))

      try {
        const existingPromise = cachedEntry?.promise
        const promise = existingPromise ?? loader()
        resourceCache.set(cacheKey, {
          data: cachedEntry?.data,
          promise,
          updatedAt: cachedEntry?.updatedAt ?? 0
        })

        const data = await promise
        resourceCache.set(cacheKey, {
          data,
          updatedAt: Date.now()
        })

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
  }, [cacheKey, loader])

  return state
}

export const useEmployerProfile = () => {
  const loader = useCallback(() => getEmployerProfileApi(), [])
  return useAsyncResource<EmployerProfileResponse>(loader, 'employer-profile')
}

export const useEmployerDashboard = () => {
  const loader = useCallback(() => getEmployerDashboardApi(), [])
  return useAsyncResource<EmployerDashboardResponse>(loader, 'employer-dashboard')
}

export const useEmployerJobs = (page = 1, limit = 10) => {
  const loader = useCallback(() => getEmployerJobsApi(page, limit), [page, limit])
  return useAsyncResource<EmployerJobsResponse>(loader, `employer-jobs:${page}:${limit}`)
}

export const useEmployerCandidates = (page = 1, limit = 10) => {
  const loader = useCallback(() => getEmployerCandidatesApi(page, limit), [page, limit])
  return useAsyncResource<EmployerCandidatesResponse>(loader, `employer-candidates:${page}:${limit}`)
}

export const useEmployerInterviews = (page = 1, limit = 10, refreshKey = 0) => {
  const loader = useCallback(() => getEmployerInterviewsApi(page, limit), [page, limit])
  return useAsyncResource<EmployerInterviewsResponse>(loader, `employer-interviews:${page}:${limit}:${refreshKey}`)
}
