import type { BrowseJob } from '@/types/browse-jobs'
import type { CompanyJobSummary, JobDetailApiResponse } from '@/types/job-detail'

const LIST_SEPARATOR = /[\n\r|;]+/

const KNOWN_TECH = [
  'React',
  'TypeScript',
  'JavaScript',
  'Node.js',
  'Next.js',
  'NestJS',
  'Vue',
  'Angular',
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'Redis',
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'GCP',
  'Tailwind CSS',
  'GraphQL',
  'REST API',
  'Python',
  'Java',
  'Go',
  'C#',
  'Flutter',
  'React Native',
  'Figma'
]

const cleanListValue = (value: string) =>
  value
    .replace(/^[\s\-*•\u2022]+/, '')
    .replace(/\s+/g, ' ')
    .trim()

export const normalizeTextList = (input: unknown): string[] => {
  if (!input) {
    return []
  }

  if (Array.isArray(input)) {
    return input
      .flatMap((item) => normalizeTextList(item))
      .filter((value, index, values) => values.indexOf(value) === index)
  }

  if (typeof input !== 'string') {
    return []
  }

  const trimmed = input.trim()

  if (!trimmed) {
    return []
  }

  if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
    try {
      const parsed = JSON.parse(trimmed)
      return normalizeTextList(parsed)
    } catch {
      return [cleanListValue(trimmed)]
    }
  }

  const items = trimmed
    .split(LIST_SEPARATOR)
    .map(cleanListValue)
    .filter(Boolean)

  return items.length > 1 ? items : [cleanListValue(trimmed)]
}

export const splitDescriptionContent = (
  description?: string | null
): {
  paragraphs: string[]
  bulletPoints: string[]
} => {
  if (!description?.trim()) {
    return {
      paragraphs: [] as string[],
      bulletPoints: [] as string[]
    }
  }

  const lines = description
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  const bulletPoints = lines
    .filter((line) => /^[-*•\u2022]/.test(line))
    .map((line) => cleanListValue(line))

  const paragraphs = description
    .split(/\n\s*\n/)
    .map((block) => block.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .filter((block) => !/^[-*•\u2022]/.test(block))

  if (paragraphs.length === 0 && bulletPoints.length === 0) {
    return {
      paragraphs: [description.trim()],
      bulletPoints: []
    }
  }

  return {
    paragraphs,
    bulletPoints
  }
}

export const extractTechStack = (job: JobDetailApiResponse | null, browseJob?: BrowseJob): string[] => {
  const source = [
    job?.title,
    job?.description,
    ...normalizeTextList(job?.requirements),
    ...normalizeTextList(job?.benefits),
    ...(browseJob?.skills ?? [])
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  const techStack = KNOWN_TECH.filter((item) => source.includes(item.toLowerCase()))

  return techStack.filter((value, index, values) => values.indexOf(value) === index).slice(0, 8)
}

export const getCompanyInitials = (companyName?: string | null): string => {
  if (!companyName) {
    return 'JB'
  }

  const initials = companyName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

  return initials || 'JB'
}

export const formatSalary = (job: JobDetailApiResponse | null, browseJob?: BrowseJob): string => {
  if (browseJob?.salary) {
    return browseJob.salary
  }

  if (job?.salary?.trim()) {
    return job.salary
  }

  const min = job?.salaryRange?.min
  const max = job?.salaryRange?.max

  if (typeof min !== 'number' && typeof max !== 'number') {
    return 'Salary negotiable'
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  })

  if (typeof min === 'number' && typeof max === 'number') {
    return `${formatter.format(min)} - ${formatter.format(max)}`
  }

  if (typeof min === 'number') {
    return `From ${formatter.format(min)}`
  }

  return `Up to ${formatter.format(max as number)}`
}

export const formatDate = (value?: string | null): string | null => {
  if (!value) {
    return null
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

export const formatRelativeDate = (value?: string | null): string | null => {
  if (!value) {
    return null
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  const diffMs = date.getTime() - Date.now()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
  const formatter = new Intl.RelativeTimeFormat('en', {
    numeric: 'auto'
  })

  if (Math.abs(diffDays) >= 1) {
    return formatter.format(diffDays, 'day')
  }

  const diffHours = Math.round(diffMs / (1000 * 60 * 60))

  if (Math.abs(diffHours) >= 1) {
    return formatter.format(diffHours, 'hour')
  }

  const diffMinutes = Math.round(diffMs / (1000 * 60))

  return formatter.format(diffMinutes, 'minute')
}

export const getJobLocation = (job: JobDetailApiResponse | null, browseJob?: BrowseJob): string => {
  if (job?.workLocation?.trim()) {
    return job.workLocation
  }

  if (browseJob?.location) {
    return browseJob.location
  }

  return [job?.company?.city, job?.company?.country].filter(Boolean).join(', ') || 'Location flexible'
}

export const buildFallbackSimilarJobs = (jobId: string, browseJobs: BrowseJob[]): CompanyJobSummary[] =>
  browseJobs
    .filter((item) => item.id !== jobId)
    .slice(0, 4)
    .map((item) => ({
      id: Number(item.id),
      title: item.title,
      salary: item.salary,
      createdDate: null,
      company: {
        company_id: 0,
        company_name: item.company
      },
      category: null,
      jobType: {
        job_type_id: 0,
        job_type: item.employmentType
      }
    }))
