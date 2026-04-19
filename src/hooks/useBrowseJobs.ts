import { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import { useDebounce } from '@/hooks/useDebounce'
import { fetchBrowseJobs } from '@/api/browseJobs'
import { useBrowseJobsStore } from '@/store/browseJobsStore'
import type { BrowseJobsResponse } from '@/types/browse-jobs'

const EMPTY_RESULTS: BrowseJobsResponse = {
  jobs: [],
  pagination: {
    currentPage: 1,
    pageSize: 3,
    totalItems: 0,
    totalPages: 1,
    from: 0,
    to: 0
  }
}

export const useBrowseJobs = () => {
  const searchQuery = useBrowseJobsStore((state) => state.searchQuery)
  const selectedLanguages = useBrowseJobsStore((state) => state.selectedLanguages)
  const selectedExperience = useBrowseJobsStore((state) => state.selectedExperience)
  const selectedWorkTypes = useBrowseJobsStore((state) => state.selectedWorkTypes)
  const selectedJobTypes = useBrowseJobsStore((state) => state.selectedJobTypes)
  const selectedPostedWithin = useBrowseJobsStore((state) => state.selectedPostedWithin)
  const salaryMin = useBrowseJobsStore((state) => state.salaryMin)
  const salaryMax = useBrowseJobsStore((state) => state.salaryMax)
  const currentPage = useBrowseJobsStore((state) => state.currentPage)
  const pageSize = useBrowseJobsStore((state) => state.pageSize)

  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const queryParams = useMemo(
    () => ({
      searchQuery: debouncedSearchQuery,
      selectedLanguages,
      selectedExperience,
      selectedWorkTypes,
      selectedJobTypes,
      selectedPostedWithin,
      salaryMin,
      salaryMax,
      currentPage,
      pageSize
    }),
    [
      currentPage,
      debouncedSearchQuery,
      pageSize,
      salaryMax,
      salaryMin,
      selectedExperience,
      selectedJobTypes,
      selectedLanguages,
      selectedPostedWithin,
      selectedWorkTypes
    ]
  )

  const [data, setData] = useState<BrowseJobsResponse>(EMPTY_RESULTS)
  const [isLoading, setIsLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hasResolvedOnceRef = useRef(false)

  useEffect(() => {
    const controller = new AbortController()

    setIsFetching(true)
    setError(null)

    if (!hasResolvedOnceRef.current) {
      setIsLoading(true)
    }

    fetchBrowseJobs(queryParams, controller.signal)
      .then((response) => {
        setData(response)
        hasResolvedOnceRef.current = true

        if (response.pagination.currentPage !== currentPage) {
          useBrowseJobsStore.getState().setCurrentPage(response.pagination.currentPage)
        }
      })
      .catch((requestError) => {
        if (axios.isCancel(requestError)) {
          return
        }

        setError('Unable to load jobs right now.')
      })
      .finally(() => {
        if (controller.signal.aborted) {
          return
        }

        setIsLoading(false)
        setIsFetching(false)
      })

    return () => {
      controller.abort()
    }
  }, [currentPage, queryParams])

  const activeFilters = useMemo(
    () =>
      [...selectedWorkTypes, ...selectedExperience, ...selectedLanguages, ...selectedJobTypes].filter(
        (value, index, values) => values.indexOf(value) === index
      ),
    [selectedExperience, selectedJobTypes, selectedLanguages, selectedWorkTypes]
  )

  return {
    jobs: data.jobs,
    pagination: data.pagination,
    activeFilters,
    isLoading,
    isFetching,
    error
  }
}
