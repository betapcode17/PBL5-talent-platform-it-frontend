import axiosInstance from './axiosInstance'
import type { GetCompaniesRequest, GetCompaniesResponse, GetCompanyDetailResponse, UpdateCompanyRequest } from '@/@types/company'

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

  const visibleCompanies = (raw.companies ?? []).filter((company: { is_active?: boolean }) => company.is_active !== false)

  return {
    data: visibleCompanies,
    total: visibleCompanies.length === raw.companies?.length ? raw.total : visibleCompanies.length,
    page: params.page || 1,
    limit: params.limit || 10
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
