import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getCompaniesApi, getCompanyByIdApi } from '@/api/company'
import { useCompanyFilterStore } from '@/store/companyFilterStore'

export const useCompany = () => {
  const keyword = useCompanyFilterStore((state) => state.keyword)
  const industry = useCompanyFilterStore((state) => state.industry)
  const city = useCompanyFilterStore((state) => state.city)
  const size = useCompanyFilterStore((state) => state.size)
  const page = useCompanyFilterStore((state) => state.page)
  const limit = useCompanyFilterStore((state) => state.limit)
  const setFilter = useCompanyFilterStore((state) => state.setFilter)

  const filters = useMemo(
    () => ({
      keyword,
      industry,
      city,
      size,
      page,
      limit
    }),
    [city, industry, keyword, limit, page, size]
  )

  const query = useQuery({
    queryKey: ['companies', filters],
    queryFn: () => getCompaniesApi(filters)
  })

  return {
    companies: query.data?.data || [],
    total: query.data?.total || 0,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    filters: {
      ...filters,
      setFilter
    }
  }
}

export const useCompanyDetail = (id: number) => {
  return useQuery({
    queryKey: ['company', id],
    queryFn: () => getCompanyByIdApi(id),
    enabled: !!id
  })
}
