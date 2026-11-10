import axios, { AxiosError } from 'axios'
import axiosInstance from '@/api/axiosInstance'
import { getMyApplicationsApi } from '@/api/applications'
import { getBookmarks } from '@/api/bookmarks'
import { useAuthStore } from '@/store/authStore'
import type { BrowseJob, BrowseJobsFilterOptions, BrowseJobsQueryParams, BrowseJobsResponse } from '@/types/browse-jobs'
import { formatSalaryDisplay } from '@/utils/salary'

type SearchJobsApiItem = {
  id: number
  title: string
  description?: string | null
  requirements?: string | null
  salary?: string | null
  salaryRange?: {
    min: number | null
    max: number | null
  } | null
  location?: string | null
  workType?: string | null
  level?: string | null
  skills?: string[]
  createdDate?: string | null
  isActive?: boolean
  company?: {
    company_id: number
    company_name: string
    city?: string | null
    is_active?: boolean
  } | null
  category?: {
    category_id: number
    name: string
  } | null
  jobType?: {
    job_type_id: number
    job_type: string
  } | null
}

type SearchJobsApiResponse = {
  jobs: SearchJobsApiItem[]
  total: number
  filters?: {
    locations?: string[]
    programmingLanguages?: Array<{
      label: string
      value: string
      count: number
    }>
    jobTypes?: Array<{
      label: string
      value: string
      count: number
    }>
  }
}

const KNOWN_TECH = [
  'React',
  'TypeScript',
  'JavaScript',
  'Node.js',
  'NestJS',
  'Python',
  'Java',
  'Go',
  'PostgreSQL',
  'Docker',
  'AWS',
  'Figma'
]

const logoTones = [
  'from-amber-200 to-emerald-200',
  'from-emerald-950 to-teal-800',
  'from-slate-950 to-cyan-950',
  'from-sky-950 to-indigo-900',
  'from-violet-100 to-fuchsia-100'
]

const getCompanyInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'JB'

const formatSalary = (job: SearchJobsApiItem) => {
  if (job.salary?.trim()) {
    return formatSalaryDisplay(job.salary) ?? job.salary
  }

  const min = job.salaryRange?.min
  const max = job.salaryRange?.max

  if (typeof min === 'number' && typeof max === 'number') {
    return formatSalaryDisplay(`${min}-${max}`) ?? `${min.toLocaleString()} - ${max.toLocaleString()} VND`
  }

  if (typeof min === 'number') {
    return formatSalaryDisplay(String(min)) ?? `From ${min.toLocaleString()} VND`
  }

  if (typeof max === 'number') {
    return formatSalaryDisplay(String(max)) ?? `Up to ${max.toLocaleString()} VND`
  }

  return 'Salary negotiable'
}

const formatPostedAt = (createdDate?: string | null) => {
  if (!createdDate) {
    return 'Recently posted'
  }

  const timestamp = new Date(createdDate).getTime()

  if (Number.isNaN(timestamp)) {
    return 'Recently posted'
  }

  const diffMs = Date.now() - timestamp
  const diffHours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)))

  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours} hours ago`

  const diffDays = Math.floor(diffHours / 24)
  return diffDays === 1 ? 'Yesterday' : `${diffDays} days ago`
}

const parseSalaryRange = (job: SearchJobsApiItem) => {
  if (job.salaryRange?.min !== null || job.salaryRange?.max !== null) {
    return job.salaryRange ?? { min: null, max: null }
  }

  if (!job.salary) {
    return { min: null, max: null }
  }

  const [min, max] = job.salary
    .split('-')
    .map((part) => Number(part.replace(/[^\d]/g, '')))
    .map((value) => (Number.isFinite(value) && value > 0 ? value : null))

  return {
    min: min ?? max ?? null,
    max: max ?? min ?? null
  }
}

const getSkills = (job: SearchJobsApiItem) => {
  if (job.skills && job.skills.length > 0) {
    return job.skills.filter(Boolean).slice(0, 6)
  }

  const source = [job.title, job.description, job.requirements, job.category?.name, job.jobType?.job_type]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  const matched = KNOWN_TECH.filter((skill) => source.includes(skill.toLowerCase()))

  if (matched.length > 0) {
    return matched.slice(0, 3)
  }

  return [job.category?.name, job.jobType?.job_type].filter((value): value is string => Boolean(value)).slice(0, 3)
}

const formatCount = (count: number) => count.toLocaleString()

const mapFilterOptions = (filters?: SearchJobsApiResponse['filters']): BrowseJobsFilterOptions => ({
  locations:
    filters?.locations?.map((location) => ({
      label: location,
      value: location
    })) ?? [],
  programmingLanguages:
    filters?.programmingLanguages?.map((option) => ({
      label: option.label,
      value: option.value,
      count: formatCount(option.count)
    })) ?? [],
  jobTypes:
    filters?.jobTypes?.map((option) => ({
      label: option.label,
      value: option.value,
      count: formatCount(option.count)
    })) ?? []
})

const normalizeJobType = (jobType?: string | null): BrowseJob['employmentType'] => {
  const normalized = jobType?.toLowerCase() ?? ''

  if (normalized.includes('contract')) return 'Contract'
  if (normalized.includes('part')) return 'Part-time'

  return 'Full-time'
}

const normalizeWorkType = (location?: string | null): BrowseJob['workType'] => {
  const normalized = location?.toLowerCase() ?? ''

  if (normalized.includes('remote')) return 'Remote'
  if (normalized.includes('hybrid')) return 'Hybrid'

  return 'On-site'
}

const normalizeApiWorkType = (workType?: string | null, location?: string | null): BrowseJob['workType'] => {
  const normalized = workType?.toLowerCase() ?? ''

  if (normalized.includes('remote')) return 'Remote'
  if (normalized.includes('hybrid')) return 'Hybrid'
  if (normalized.includes('onsite') || normalized.includes('on-site')) return 'On-site'

  return normalizeWorkType(location)
}

const normalizeExperience = (job: SearchJobsApiItem) => {
  const source = [job.level, job.title, job.description, job.requirements].filter(Boolean).join(' ').toLowerCase()

  if (/\b(lead|architect|principal|staff)\b/.test(source)) {
    return 'Lead / Architect'
  }

  if (/\b(senior|sr\.?|sen)\b/.test(source)) {
    return 'Senior'
  }

  if (/\b(junior|jr\.?|fresher|entry|intern)\b/.test(source)) {
    return 'Junior'
  }

  return job.level?.trim() || 'All levels'
}

const toBrowseJob = (job: SearchJobsApiItem, index: number): BrowseJob => {
  const companyName = job.company?.company_name || 'Company'
  const skills = getSkills(job)

  return {
    id: String(job.id),
    title: job.title,
    company: companyName,
    location: job.location || job.company?.city || 'Location flexible',
    salary: formatSalary(job),
    postedAt: formatPostedAt(job.createdDate),
    skills,
    logoText: getCompanyInitials(companyName),
    logoTone: logoTones[index % logoTones.length],
    language: skills[0] || job.category?.name || 'General',
    experience: normalizeExperience(job),
    employmentType: normalizeJobType(job.jobType?.job_type),
    workType: normalizeApiWorkType(job.workType, job.location)
  }
}

const applyClientFilters = (
  jobs: SearchJobsApiItem[],
  params: BrowseJobsQueryParams,
  savedJobIds?: Set<number> | null
) => {
  const rawMax = params.salaryMax ? Number(params.salaryMax) : null
  const normalizedMax = rawMax !== null && Number.isFinite(rawMax) ? rawMax : null

  return jobs.filter((job) => {
    const isVisible = job.isActive !== false && job.company?.is_active !== false
    if (!isVisible) {
      return false
    }

    if (params.activeTab === 'savedJobs') {
      if (!savedJobIds || !savedJobIds.has(job.id)) {
        return false
      }
    }

    const mapped = toBrowseJob(job, 0)
    const salaryRange = parseSalaryRange(job)

    const jobText = [
      job.title,
      job.description,
      job.requirements,
      job.level,
      job.location,
      job.workType,
      job.jobType?.job_type,
      job.category?.name,
      ...(job.skills || [])
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    const matchesLanguage =
      params.selectedLanguages.length === 0 ||
      params.selectedLanguages.some((language) => {
        const langLower = language.toLowerCase()
        return (
          mapped.skills.some((s) => s.toLowerCase() === langLower) ||
          jobText.includes(langLower)
        )
      })

    const matchesExperience =
      params.selectedExperience.length === 0 ||
      params.selectedExperience.some((exp) => {
        if (exp === mapped.experience) return true
        if (exp === 'Junior') {
          return /\b(junior|jr\.?|fresher|intern|entry|thực tập)\b/i.test(jobText)
        }
        if (exp === 'Senior') {
          return /\b(senior|sr\.?|chuyên viên)\b/i.test(jobText)
        }
        if (exp.includes('Lead') || exp.includes('Architect')) {
          return /\b(lead|architect|principal|trưởng|quản lý|manager)\b/i.test(jobText)
        }
        return false
      })

    const matchesWorkType =
      params.selectedWorkTypes.length === 0 ||
      params.selectedWorkTypes.some((wt) => {
        if (wt === mapped.workType) return true
        if (wt === 'Remote') return /\b(remote|từ xa)\b/i.test(jobText)
        if (wt === 'Hybrid') return /\b(hybrid|linh hoạt)\b/i.test(jobText)
        if (wt === 'On-site') return /\b(on-site|onsite|văn phòng)\b/i.test(jobText)
        return false
      })

    const matchesJobType =
      params.selectedJobTypes.length === 0 || params.selectedJobTypes.includes(mapped.employmentType)
    const matchesSalaryMax = normalizedMax === null || salaryRange.min === null || salaryRange.min <= normalizedMax

    return matchesLanguage && matchesExperience && matchesWorkType && matchesJobType && matchesSalaryMax
  })
}

type CachedResult = {
  data: BrowseJobsResponse
  timestamp: number
  isFull: boolean
}

const CACHE_TTL_MS = 2 * 60 * 1000 // 2 minutes
const browseJobsCache = new Map<string, CachedResult>()

export const clearBrowseJobsCache = () => {
  browseJobsCache.clear()
}

const getCacheKey = (params: BrowseJobsQueryParams) => {
  return JSON.stringify({
    q: params.searchQuery || '',
    loc: params.selectedLocation || '',
    lang: [...(params.selectedLanguages || [])].sort(),
    exp: [...(params.selectedExperience || [])].sort(),
    wt: [...(params.selectedWorkTypes || [])].sort(),
    jt: [...(params.selectedJobTypes || [])].sort(),
    pw: [...(params.selectedPostedWithin || [])].sort(),
    min: params.salaryMin || '',
    max: params.salaryMax || '',
    tab: params.activeTab || 'bestMatch',
    sort: params.sortBy || 'newest',
    page: params.currentPage,
    size: params.pageSize
  })
}

const fetchSearchJobsApi = async (
  params: BrowseJobsQueryParams,
  signal?: AbortSignal,
  excludeApplied?: boolean,
  limit: number = 20,
  page: number = 1
) => {
  const response = await axiosInstance.get<SearchJobsApiResponse>('/jobs/search', {
    params: {
      q: params.searchQuery || undefined,
      location: params.selectedLocation || undefined,
      salaryMin: params.salaryMin || undefined,
      salaryMax: params.salaryMax || undefined,
      excludeApplied: excludeApplied ? true : undefined,
      page,
      limit
    },
    signal,
    skipErrorLog: excludeApplied === true
  })

  return response.data
}

const shouldUseExcludeApplied = () => {
  const { isAuthenticated, user } = useAuthStore.getState()
  return isAuthenticated && user?.role === 'SEEKER'
}

const fetchSearchJobsWithFallback = async (
  params: BrowseJobsQueryParams,
  signal?: AbortSignal,
  limit: number = 20,
  page: number = 1
): Promise<SearchJobsApiResponse> => {
  const useExcludeApplied = shouldUseExcludeApplied()

  try {
    return await fetchSearchJobsApi(params, signal, useExcludeApplied, limit, page)
  } catch (error) {
    const axiosError = error as AxiosError

    if (!useExcludeApplied || !axios.isAxiosError(axiosError) || axiosError.response?.status !== 400) {
      throw error
    }

    const responseData = await fetchSearchJobsApi(params, signal, false, limit, page)

    try {
      const applied = await getMyApplicationsApi({ page: 1, limit: 100 })
      const appliedJobIds = new Set(applied.applications.map((application) => application.job.id))
      return {
        ...responseData,
        jobs: responseData.jobs.filter((job) => !appliedJobIds.has(job.id))
      }
    } catch {
      return responseData
    }
  }
}

const buildBrowseJobsResponse = (
  raw: SearchJobsApiResponse,
  params: BrowseJobsQueryParams,
  isPartial: boolean,
  savedJobIds?: Set<number> | null
): BrowseJobsResponse => {
  const filtered = applyClientFilters(raw.jobs, params, savedJobIds)

  // Sort jobs based on sortBy or activeTab
  if (params.activeTab === 'latest' || params.sortBy === 'newest') {
    filtered.sort((a, b) => {
      const da = a.createdDate ? new Date(a.createdDate).getTime() : 0
      const db = b.createdDate ? new Date(b.createdDate).getTime() : 0
      return db - da
    })
  } else if (params.sortBy === 'salaryHigh') {
    filtered.sort((a, b) => {
      const sa = parseSalaryRange(a).max ?? 0
      const sb = parseSalaryRange(b).max ?? 0
      return sb - sa
    })
  } else if (params.sortBy === 'salaryLow') {
    filtered.sort((a, b) => {
      const sa = parseSalaryRange(a).min ?? 999999999
      const sb = parseSalaryRange(b).min ?? 999999999
      return sa - sb
    })
  }

  const filteredJobs = filtered.map(toBrowseJob)
  const totalItems = isPartial ? Math.max(raw.total, filteredJobs.length) : filteredJobs.length
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
      to: totalItems === 0 ? 0 : Math.min(startIndex + jobs.length, totalItems)
    },
    filters: mapFilterOptions(raw.filters)
  }
}

export type FetchBrowseJobsOptions = {
  onInitialBatch?: (data: BrowseJobsResponse) => void
}

export const fetchBrowseJobs = async (
  params: BrowseJobsQueryParams,
  signal?: AbortSignal,
  options?: FetchBrowseJobsOptions
): Promise<BrowseJobsResponse> => {
  const cacheKey = getCacheKey(params)
  const cached = browseJobsCache.get(cacheKey)
  const now = Date.now()

  // 1. Instant Cache Hit (0ms)
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    if (cached.isFull) {
      options?.onInitialBatch?.(cached.data)
      return cached.data
    }
    options?.onInitialBatch?.(cached.data)
  }

  // If saved jobs tab selected, load bookmarks
  let savedJobIds: Set<number> | null = null
  if (params.activeTab === 'savedJobs') {
    try {
      const res = await getBookmarks(undefined, signal)
      savedJobIds = new Set((res.bookmarks || []).map((b) => b.job.id))
    } catch {
      savedJobIds = new Set()
    }
  }

  // 2. Phase 1: Fast Initial Batch (20 jobs, < 1s)
  const initialPage = params.currentPage > 2 ? Math.ceil((params.currentPage * params.pageSize) / 20) : 1
  const initialLimit = 20

  const initialRaw = await fetchSearchJobsWithFallback(params, signal, initialLimit, initialPage)
  const initialResponse = buildBrowseJobsResponse(initialRaw, params, true, savedJobIds)

  // Notify UI immediately to render Phase 1 and drop skeleton loaders
  options?.onInitialBatch?.(initialResponse)

  // Cache initial response
  browseJobsCache.set(cacheKey, {
    data: initialResponse,
    timestamp: Date.now(),
    isFull: initialRaw.total <= initialLimit
  })

  // If all jobs fit within the initial batch, no second phase needed
  if (initialRaw.total <= initialLimit) {
    return initialResponse
  }

  // 3. Phase 2: Background Full Hydration (silently fetch complete list for pagination and filter options)
  try {
    const fullRaw = await fetchSearchJobsWithFallback(params, signal, 100, 1)
    if (signal?.aborted) {
      return initialResponse
    }

    const fullResponse = buildBrowseJobsResponse(fullRaw, params, false, savedJobIds)

    browseJobsCache.set(cacheKey, {
      data: fullResponse,
      timestamp: Date.now(),
      isFull: true
    })

    return fullResponse
  } catch {
    // If background hydration fails, gracefully return the initial batch
    return initialResponse
  }
}
