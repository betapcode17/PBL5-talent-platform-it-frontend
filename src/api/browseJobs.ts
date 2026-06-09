import axiosInstance from '@/api/axiosInstance'
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

const applyClientFilters = (jobs: SearchJobsApiItem[], params: BrowseJobsQueryParams) => {
  const rawMax = params.salaryMax ? Number(params.salaryMax) : null
  const normalizedMax = rawMax !== null && Number.isFinite(rawMax) ? rawMax : null

  return jobs.filter((job) => {
    const isVisible = job.isActive !== false && job.company?.is_active !== false
    if (!isVisible) {
      return false
    }

    const mapped = toBrowseJob(job, 0)
    const salaryRange = parseSalaryRange(job)
    const matchesLanguage =
      params.selectedLanguages.length === 0 ||
      params.selectedLanguages.some((language) => mapped.skills.includes(language))
    const matchesExperience =
      params.selectedExperience.length === 0 || params.selectedExperience.includes(mapped.experience)
    const matchesWorkType = params.selectedWorkTypes.length === 0 || params.selectedWorkTypes.includes(mapped.workType)
    const matchesJobType =
      params.selectedJobTypes.length === 0 || params.selectedJobTypes.includes(mapped.employmentType)
    const matchesSalaryMax = normalizedMax === null || salaryRange.min === null || salaryRange.min <= normalizedMax

    return matchesLanguage && matchesExperience && matchesWorkType && matchesJobType && matchesSalaryMax
  })
}

export const fetchBrowseJobs = async (
  params: BrowseJobsQueryParams,
  signal?: AbortSignal
): Promise<BrowseJobsResponse> => {
  const response = await axiosInstance.get<SearchJobsApiResponse>('/jobs/search', {
    params: {
      q: params.searchQuery || undefined,
      location: params.selectedLocation || undefined,
      salaryMin: params.salaryMin || undefined,
      excludeApplied: true,
      page: 1,
      limit: 100
    },
    signal
  })

  const filteredJobs = applyClientFilters(response.data.jobs, params).map(toBrowseJob)
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
    },
    filters: mapFilterOptions(response.data.filters)
  }
}
