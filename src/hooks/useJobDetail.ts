import { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { createBookmark, deleteBookmark, getBookmarks } from '@/api/bookmarks'
import { getCompanyJobs, getJobDetail } from '@/api/jobs'
import { useAuthStore } from '@/store/authStore'
import type { CompanyJobSummary, JobDetailApiResponse } from '@/types/job-detail'

type JobDetailStatus = 'loading' | 'success' | 'error' | 'not-found'

type ToggleBookmarkResult = {
  ok: boolean
  bookmarked: boolean
  message?: string
}

export const useJobDetail = (jobId?: string) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)
  const canManageBookmarks = isAuthenticated && user?.role === 'SEEKER'

  const [job, setJob] = useState<JobDetailApiResponse | null>(null)
  const [similarJobs, setSimilarJobs] = useState<CompanyJobSummary[]>([])
  const [status, setStatus] = useState<JobDetailStatus>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarkId, setBookmarkId] = useState<number | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const numericJobId = useMemo(() => {
    if (!jobId) {
      return null
    }

    const parsed = Number(jobId)

    return Number.isFinite(parsed) ? parsed : null
  }, [jobId])

  const refreshBookmarkState = useCallback(
    async (targetJobId: number, signal?: AbortSignal) => {
      if (!canManageBookmarks) {
        setBookmarkId(null)
        setIsBookmarked(false)
        return
      }

      const response = await getBookmarks(targetJobId, signal)
      const matchedBookmark = response.bookmarks.find((item) => item.job.id === targetJobId) ?? null

      setBookmarkId(matchedBookmark?.id ?? null)
      setIsBookmarked(Boolean(matchedBookmark))
    },
    [canManageBookmarks]
  )

  const refetch = useCallback(() => {
    setReloadKey((value) => value + 1)
  }, [])

  useEffect(() => {
    if (!numericJobId) {
      setJob(null)
      setSimilarJobs([])
      setStatus('not-found')
      setErrorMessage(null)
      return
    }

    const controller = new AbortController()

    setStatus('loading')
    setErrorMessage(null)
    setJob(null)
    setSimilarJobs([])

    getJobDetail(numericJobId, controller.signal)
      .then((response) => {
        setJob(response)
        setStatus('success')
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          return
        }

        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setStatus('not-found')
          return
        }

        setStatus('error')
        setErrorMessage('Unable to load this job right now. Please try again in a moment.')
      })

    return () => {
      controller.abort()
    }
  }, [numericJobId, reloadKey])

  useEffect(() => {
    if (!job?.company?.company_id) {
      setSimilarJobs([])
      return
    }

    const controller = new AbortController()

    getCompanyJobs(job.company.company_id, { limit: 4, active: true }, controller.signal)
      .then((response) => {
        setSimilarJobs(response.jobs.filter((item) => item.id !== job.id).slice(0, 4))
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          return
        }

        setSimilarJobs([])
      })

    return () => {
      controller.abort()
    }
  }, [job?.company?.company_id, job?.id])

  useEffect(() => {
    if (!job?.id) {
      setBookmarkId(null)
      setIsBookmarked(false)
      return
    }

    const controller = new AbortController()

    refreshBookmarkState(job.id, controller.signal).catch((error) => {
      if (!axios.isCancel(error)) {
        setBookmarkId(null)
        setIsBookmarked(false)
      }
    })

    return () => {
      controller.abort()
    }
  }, [canManageBookmarks, job?.id, refreshBookmarkState])

  const toggleBookmark = useCallback(async (): Promise<ToggleBookmarkResult> => {
    if (!job?.id || !canManageBookmarks) {
      return {
        ok: false,
        bookmarked: isBookmarked
      }
    }

    setIsBookmarkLoading(true)

    try {
      if (isBookmarked && bookmarkId) {
        await deleteBookmark(bookmarkId)
        setBookmarkId(null)
        setIsBookmarked(false)

        return {
          ok: true,
          bookmarked: false
        }
      }

      const response = await createBookmark(job.id)
      setBookmarkId(response.bookmarkId)
      setIsBookmarked(true)

      return {
        ok: true,
        bookmarked: true
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        await refreshBookmarkState(job.id)

        return {
          ok: true,
          bookmarked: true,
          message: 'This job was already saved in your account.'
        }
      }

      return {
        ok: false,
        bookmarked: isBookmarked,
        message: 'We could not update your saved jobs right now.'
      }
    } finally {
      setIsBookmarkLoading(false)
    }
  }, [bookmarkId, canManageBookmarks, isBookmarked, job?.id, refreshBookmarkState])

  return {
    job,
    similarJobs,
    status,
    errorMessage,
    isBookmarked,
    isBookmarkLoading,
    canManageBookmarks,
    isAuthenticated,
    user,
    toggleBookmark,
    refetch
  }
}
