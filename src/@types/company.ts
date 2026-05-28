export interface CompanyBase {
  company_id: number
  company_name: string
  company_image?: string
  cover_image?: string
  company_industry?: string
  company_size?: string
  country?: string
  city?: string
  key_skills?: string
  company_type?: string
  company_website_url?: string
  is_active: boolean
  created_date: string
}

export type Company = CompanyBase

export interface CompanyDetail extends CompanyBase {
  profile_description?: string
  why_love_working_here?: string
  establishment_date?: string
  working_days?: string
  working_time?: string
  overtime_policy?: string
  company_email?: string
}

export interface GetCompaniesRequest {
  page?: number
  limit?: number
  keyword?: string
  industry?: string
  city?: string
  size?: string
}

export interface GetCompaniesResponse {
  data: Company[]
  total: number
  page: number
  limit: number
}

export interface GetCompanyDetailResponse {
  company: CompanyDetail
  employees: unknown[]
  jobs: unknown[]
}

export type UpdateCompanyRequest = Partial<{
  company_name: string
  profile_description: string | null
  company_type: string | null
  company_industry: string | null
  company_size: string | null
  country: string | null
  city: string | null
  working_days: string | null
  working_time: string | null
  overtime_policy: string | null
  company_website_url: string | null
  company_email: string | null
  company_image: string | null
  cover_image: string | null
  key_skills: string | null
  why_love_working_here: string | null
}>
