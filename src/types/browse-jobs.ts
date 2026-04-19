export type BrowseJob = {
  id: string
  title: string
  company: string
  location: string
  salary: string
  postedAt: string
  skills: string[]
  extraSkillsCount?: number
  logoText: string
  logoTone: string
  language: string
  experience: string
  employmentType: 'Full-time' | 'Contract' | 'Part-time'
  workType: 'Remote' | 'Hybrid' | 'On-site'
  isBookmarked?: boolean
}

export type TopCompany = {
  id: string
  name: string
  jobsCount: number
  logoText: string
  logoTone: string
}

export type FilterOption = {
  label: string
  value: string
  count?: string
}

export type BrowseJobsFilters = {
  searchQuery: string
  selectedLanguages: string[]
  selectedExperience: string[]
  selectedWorkTypes: string[]
  selectedJobTypes: string[]
  selectedPostedWithin: string[]
  salaryMin: string
  salaryMax: string
  currentPage: number
  pageSize: number
}

export type BrowseJobsQueryParams = BrowseJobsFilters

export type BrowseJobsPagination = {
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
  from: number
  to: number
}

export type BrowseJobsResponse = {
  jobs: BrowseJob[]
  pagination: BrowseJobsPagination
}
