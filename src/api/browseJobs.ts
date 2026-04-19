import axios, { AxiosHeaders, CanceledError, type InternalAxiosRequestConfig } from 'axios'
import { browseJobs as browseJobsDataset } from '@/data/browse-jobs/jobs'
import type { BrowseJob, BrowseJobsQueryParams, BrowseJobsResponse } from '@/types/browse-jobs'

const SIMULATED_NETWORK_DELAY = 350

const parseSalaryRange = (salary: string) => {
  const [minSalary, maxSalary] = salary
    .replace(/\$/g, '')
    .split('-')
    .map((value) => Number(value.replace(/[^\d]/g, '')))

  return { minSalary, maxSalary }
}

const normalizeSalaryRange = (salaryMin: string, salaryMax: string) => {
  const rawMin = salaryMin ? Number(salaryMin) : null
  const rawMax = salaryMax ? Number(salaryMax) : null

  return {
    normalizedMin: rawMin !== null && rawMax !== null ? Math.min(rawMin, rawMax) : rawMin,
    normalizedMax: rawMin !== null && rawMax !== null ? Math.max(rawMin, rawMax) : rawMax
  }
}

const applyBrowseJobsFilters = (jobs: BrowseJob[], params: BrowseJobsQueryParams) => {
  const normalizedQuery = params.searchQuery.trim().toLowerCase()
  const { normalizedMin, normalizedMax } = normalizeSalaryRange(params.salaryMin, params.salaryMax)

  return jobs.filter((job) => {
    const { minSalary, maxSalary } = parseSalaryRange(job.salary)
    const matchesQuery =
      !normalizedQuery ||
      job.title.toLowerCase().includes(normalizedQuery) ||
      job.company.toLowerCase().includes(normalizedQuery) ||
      job.skills.some((skill) => skill.toLowerCase().includes(normalizedQuery))

    const matchesLanguage =
      params.selectedLanguages.length === 0 || params.selectedLanguages.includes(job.language)
    const matchesExperience =
      params.selectedExperience.length === 0 || params.selectedExperience.includes(job.experience)
    const matchesWorkType =
      params.selectedWorkTypes.length === 0 || params.selectedWorkTypes.includes(job.workType)
    const matchesJobType =
      params.selectedJobTypes.length === 0 || params.selectedJobTypes.includes(job.employmentType)
    const matchesSalaryMin = normalizedMin === null || maxSalary >= normalizedMin
    const matchesSalaryMax = normalizedMax === null || minSalary <= normalizedMax

    return (
      matchesQuery &&
      matchesLanguage &&
      matchesExperience &&
      matchesWorkType &&
      matchesJobType &&
      matchesSalaryMin &&
      matchesSalaryMax
    )
  })
}

const buildBrowseJobsResponse = (params: BrowseJobsQueryParams): BrowseJobsResponse => {
  const filteredJobs = applyBrowseJobsFilters(browseJobsDataset, params)
  const totalItems = filteredJobs.length
  const totalPages = Math.max(1, Math.ceil(totalItems / params.pageSize))
  const safeCurrentPage = Math.min(params.currentPage, totalPages)
  const startIndex = (safeCurrentPage - 1) * params.pageSize
  const jobs = filteredJobs.slice(startIndex, startIndex + params.pageSize)

  return {
    jobs,
    pagination: {
      currentPage: safeCurrentPage,
      pageSize: params.pageSize,
      totalItems,
      totalPages,
      from: totalItems === 0 ? 0 : startIndex + 1,
      to: totalItems === 0 ? 0 : Math.min(startIndex + params.pageSize, totalItems)
    }
  }
}

const browseJobsClient = axios.create({
  adapter: async (config) => {
    const signal = config.signal as AbortSignal | undefined

    if (signal?.aborted) {
      throw new CanceledError()
    }

    await new Promise<void>((resolve, reject) => {
      const handleAbort = () => {
        window.clearTimeout(timer)
        reject(new CanceledError())
      }

      const timer = window.setTimeout(() => {
        if (signal) {
          signal.removeEventListener('abort', handleAbort)
        }
        resolve()
      }, SIMULATED_NETWORK_DELAY)

      if (signal) {
        signal.addEventListener('abort', handleAbort, { once: true })
      }
    })

    const data = buildBrowseJobsResponse(config.params as BrowseJobsQueryParams)

    return {
      data,
      status: 200,
      statusText: 'OK',
      headers: new AxiosHeaders(),
      config: config as InternalAxiosRequestConfig,
      request: null
    }
  }
})

export const fetchBrowseJobs = async (params: BrowseJobsQueryParams, signal?: AbortSignal) => {
  const response = await browseJobsClient.get<BrowseJobsResponse>('/browse-jobs', {
    params,
    signal
  })

  return response.data
}
