import axiosInstance from '@/api/axiosInstance'
import type {
  CompanyLikesResponse,
  CreateCompanySeekerLikeRequest,
  CreateCompanySeekerLikeResponse,
  UnlikeResponse
} from '@/@types/like'

export const getCompanyLikesApi = async (companyId: number, page = 1, limit = 100) => {
  const response = await axiosInstance.get<CompanyLikesResponse>(`/likes/company/${companyId}`, {
    params: { page, limit }
  })

  return response.data
}

export const createCompanySeekerLikeApi = async (data: CreateCompanySeekerLikeRequest) => {
  const response = await axiosInstance.post<CreateCompanySeekerLikeResponse>('/likes', data)

  return response.data
}

export const deleteCompanySeekerLikeApi = async (likeId: string) => {
  const response = await axiosInstance.delete<UnlikeResponse>(`/likes/${likeId}`)

  return response.data
}
