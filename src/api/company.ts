import axiosInstance from './axiosInstance'
import type {
  GetCompaniesRequest,
  GetCompaniesResponse,
  GetCompanyDetailResponse,
  UpdateCompanyRequest
} from '@/@types/company'

// get list companies
export const getCompaniesApi = async (params: GetCompaniesRequest): Promise<GetCompaniesResponse> => {
  const response = await axiosInstance.get('/companies', {
    params: {
      industry: params.industry || undefined,
      q: params.keyword || undefined,
      page: params.page || 1
    }
  })

  const raw = response.data

  const visibleCompanies = (raw.companies ?? []).filter(
    (company: { is_active?: boolean }) => company.is_active !== false
  )

  return {
    data: visibleCompanies,
    total: visibleCompanies.length === raw.companies?.length ? raw.total : visibleCompanies.length,
    page: params.page || 1,
    limit: params.limit || 10
  }
}

export type TopCompanyApiItem = {
  id: string
  name: string
  jobsCount: number
  logoText: string
  logoTone: string
  logoUrl?: string | null
}

const TOP_COMPANY_TONES = [
  'from-amber-400 to-orange-500 text-white',
  'from-emerald-700 to-teal-900 text-white',
  'from-blue-600 to-indigo-800 text-white',
  'from-violet-600 to-purple-800 text-white',
  'from-rose-500 to-pink-700 text-white'
]

export const getTopCompaniesApi = async (limit = 5): Promise<TopCompanyApiItem[]> => {
  try {
    const response = await axiosInstance.get<
      Array<{
        id: number
        company_name: string
        logo?: string | null
        industry?: string | null
        _count?: { JobPost: number }
      }>
    >('/companies/top', {
      params: { limit }
    })

    if (!Array.isArray(response.data) || response.data.length === 0) {
      return []
    }

    return response.data.map((c, index) => {
      const initials =
        c.company_name
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0]?.toUpperCase() ?? '')
          .join('') || 'TC'

      return {
        id: String(c.id),
        name: c.company_name,
        jobsCount: c._count?.JobPost ?? 0,
        logoText: initials,
        logoTone: TOP_COMPANY_TONES[index % TOP_COMPANY_TONES.length],
        logoUrl: c.logo || null
      }
    })
  } catch (error) {
    console.error('Failed to fetch top companies:', error)
    return []
  }
}

// get company detail
export const getCompanyByIdApi = async (id: number): Promise<GetCompanyDetailResponse> => {
  const res = await axiosInstance.get(`/companies/${id}`)
  return res.data
}

export const updateCompanyApi = async (id: number, data: UpdateCompanyRequest) => {
  const res = await axiosInstance.patch(`/companies/${id}`, data)
  return res.data
}

export const uploadCompanyLogoApi = async (id: number, file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  const res = await axiosInstance.put<{ field: 'company_image'; imageUrl: string }>(`/companies/${id}/logo`, formData)
  return res.data
}

export const uploadCompanyCoverApi = async (id: number, file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  const res = await axiosInstance.put<{ field: 'cover_image'; imageUrl: string }>(`/companies/${id}/cover`, formData)
  return res.data
}
