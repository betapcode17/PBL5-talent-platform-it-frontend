export type JobDetailApiResponse = {
  id: number
  title: string
  name?: string | null
  description?: string | null
  requirements?: string[] | string | null
  benefits?: string[] | string | null
  workLocation?: string | null
  workTime?: string | null
  workType?: string | null
  level?: string | null
  experience?: string | null
  education?: string | null
  salary?: string | null
  salaryRange?: {
    min: number | null
    max: number | null
  } | null
  numberOfHires?: number | null
  deadline?: string | null
  isActive?: boolean
  createdDate?: string | null
  updatedDate?: string | null
  company?: {
    company_id: number
    company_name: string
    company_image?: string | null
    city?: string | null
    country?: string | null
    company_type?: string | null
    company_industry?: string | null
    company_website_url?: string | null
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
  employee?: {
    employee_id: number
    role?: string | null
  } | null
}

export type CompanyJobSummary = {
  id: number
  title: string
  salary?: string | null
  isActive?: boolean
  createdDate?: string | null
  updatedDate?: string | null
  company?: {
    company_id: number
    company_name: string
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

export type CompanyJobsResponse = {
  jobs: CompanyJobSummary[]
  total: number
}

export type BookmarkSummary = {
  id: number
  date: string
  job: {
    id: number
    title: string
    name?: string | null
    description?: string | null
    salary?: string | null
    workLocation?: string | null
    isActive?: boolean
    createdDate?: string | null
    updatedDate?: string | null
    company?: {
      company_id: number
      company_name: string
      company_image?: string | null
      city?: string | null
      country?: string | null
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
}

export type BookmarksResponse = {
  bookmarks: BookmarkSummary[]
  total: number
}

export type JobDetailSectionId = 'description' | 'requirements' | 'tech-stack' | 'benefits' | 'additional-info'
